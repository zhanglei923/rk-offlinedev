var fs = require('fs');
var _ = require('lodash')
var pathutil = require('path');
const download = require('download');
var makeDir = require('make-dir');
var execSh = require("exec-sh");
let tar = require('tar');
let eachcontentjs = require('eachcontent-js')

let statusUtil = require('../jsmodule/config/statusUtil')
let configUtil = require('../jsmodule/config/configUtil')

let searchFile = (path)=>{
    let fullpath = pathutil.resolve(configUtil.getUserConfig().deployWebappPath_val +'/'+ path)
    return fs.existsSync(fullpath)?{
        fpath: fullpath,
        project: 'deploy'
    }:null;
};
let renameToDebug000 = (fname)=>{
    fname = fname.replace(/\.[a-z0-9]{7}\.(js|css)/g, (str)=>{
        str = str.replace(/\.[a-z0-9]{7}\./g, '.debug000.')
        return str
    })
    return fname;
}
let findHashFile = (staticFolder)=>{
    // hash.191009123855.js
    if(!fs.existsSync(staticFolder)) return null;
    let dir = staticFolder;
    var list = fs.readdirSync(dir)
    let hashfile;
    list.forEach(function(file) {
        let fname = file;
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && !stat.isDirectory()) {
            if(/[0-9]{12}\.js/.test(fname)){
                hashfile = fname;
                //console.log('found', fname)
            }
        }
    })
    return hashfile;
}

var updateDeployFolderAsDebug000 = function(staticFolder){
    let deployStaticPath_val = configUtil.getUserConfig().deployStaticPath_val;
    if(typeof staticFolder !== 'undefined') deployStaticPath_val = staticFolder;
    let allfiles = eachcontentjs.getAllFiles(deployStaticPath_val)
    let regexp = /\.[a-z0-9]{7}\.[a-z]{1,}$/
    allfiles.forEach((fpath)=>{
        let info = pathutil.parse(fpath)
        let oldfilename = info.base;
        let newfilename;
        let dir = info.dir;
        if(regexp.test(oldfilename) && oldfilename.indexOf('.debug000.')<=0){
            newfilename = renameToDebug000(oldfilename)
            if(oldfilename !== newfilename){
                //console.log(oldfilename, newfilename)
                fs.copyFileSync(pathutil.resolve(dir, oldfilename), 
                                pathutil.resolve(dir, newfilename))
            }
        }
    })
    let hashfile = findHashFile(deployStaticPath_val);    
    let newhashfullpath = pathutil.resolve(deployStaticPath_val, 'hash.debug000.js')
    fs.copyFileSync(pathutil.resolve(deployStaticPath_val, hashfile), 
                    newhashfullpath)
    let hashcontent = fs.readFileSync(newhashfullpath, 'utf8');
    hashcontent = hashcontent.replace(/\"\:\"[a-z0-9]{7}\"/g, '":"debug000"')
    fs.writeFileSync(newhashfullpath, hashcontent)
    console.log('deployWebProjectPath=', deployStaticPath_val)
    console.log('newhashfullpath=', newhashfullpath)
};
let syncTarFile = (branchname, succ)=>{
    let nickname = configUtil.getBranchNickName(branchname);//branchname.replace(/\//g, '~~');
    let auxiliaryFolder = configUtil.getUserConfig().auxiliaryFolder;
    let myFolder = `${auxiliaryFolder}/nginx_deploy_download`
    let thisFolder = `${myFolder}/${nickname}`
    let thisStaticFolder = `${thisFolder}/apps-ingage-web/src/main/webapp/static`
    makeDir.sync(thisFolder)
    downloadTarFile(branchname, thisFolder, ()=>{
        updateDeployFolderAsDebug000(thisStaticFolder)
        statusUtil.setData('branchnameOfDeployDebug', branchname)
        console.log('Deploy Debug Branch:', branchname)
        succ();
    });

}
let downloadTarFile = (branchname, dest, callback)=>{
    makeDir.sync(dest);
    //http://10.10.0.144/autopack/nginx-static/delivery-latest/nginx-static_v1910~~test~~nginx-autopack_latest.tar.gz
    //http://10.10.0.144/autopack/nginx-static/delivery-latest/nginx-static_v1910~~test~~nginx-autopack_latest.tar.gz
    //http://10.10.0.144/autopack/nginx-static/delivery-latest/nginx-static_v1910~~test~~nginx-autopack_latest.tar.gz
    let nickname = branchname.replace(/\//g, '~~');
    let filename = `nginx-static_${nickname}_latest.tar.gz`;
    let url = `http://10.10.0.144/autopack/nginx-static/delivery-latest/${filename}`;
    console.log('dwn:', '\nbranch='+branchname, '\nurl='+url, '\ndesc='+dest)
    download(url, dest, {timeout: 1000*3600*48}).then(() => {
        console.log('done!');
        deployTarFile(dest, filename, callback)
    });
}
let deployTarFile = (dest, filename, callback)=>{

    let command = [
        `cd ${dest}`,
        `echo "remove folder"`,
        `rm -rf ${dest}/apps-ingage-web`
    ]
    command = command.join(' && ')
    console.log(command)
    execSh(`${command}`, true, function(err, stdout, stderr){
        let result = ''
        if (err) {
            result = stderr;
            console.log(stderr)
        }else{            
            console.log('unzip')
            tar.x(  // or tar.extract(
                {
                file: `${dest}/${filename}`,
                C: dest,
                unlink: true
                }
            ).then(()=> { 
                console.log('done')
                callback()
            })
        }
    });
}
module.exports = {
    updateDeployFolderAsDebug000,
    findHashFile,
    searchFile,
    syncTarFile,
    downloadTarFile,
    deployTarFile
}