var fs = require('fs');
var _ = require('lodash')
var pathutil = require('path');
let eachcontentjs = require('eachcontent-js')

let configUtil = require('../jsmodule/config/configUtil')


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

var updateDeployFolderAsDebug000 = function(){
    let deployStaticPath_val = configUtil.getUserConfig().deployStaticPath_val;
    let deployStaticPath_val_exist = configUtil.getUserConfig().deployStaticPath_val_exist;
    if(!deployStaticPath_val_exist) return false;
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
module.exports = {
    updateDeployFolderAsDebug000,
    findHashFile
}