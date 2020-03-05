let fs = require('fs')
var _ = require('lodash')
var pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
let rk = require('./offlinedev/jsmodule/utils/rk')
var fs_readFile = require('./offlinedev/jsmodule/static-proxy/supports/fs_readFile')
var seajsUtil = require('./offlinedev/jsmodule/utils/seajs/seajsUtil')
var updateStaticsUrl = require('./offlinedev/jsmodule/static-proxy/updators/updateStaticsUrl')
var configUtil = require('./offlinedev/jsmodule/config/configUtil')

var format = function(bytes, tail) { 
    return (bytes/1024/1024).toFixed(tail); 
};
let preloadStaticFiles = (callback)=>{
    let webapproot = configUtil.getWebAppFolder()
    let sourcefolder = configUtil.getSourceFolder();
    let roots = [webapproot]
    // fpowerUtil.loadPower(roots);
    // let powers = fpowerUtil.getPowerData();
    ///console.log(powers)
    let loadpathlist = []
    eachcontentjs.eachPath(sourcefolder, /(\.js|\.tpl)$/,(fpath)=>{
        if(!rk.isCookedJsPath(fpath)){
            loadpathlist.push(fpath);
        }
    })
    let filesize = 0;
    let len = loadpathlist.length;
    let p = Math.round(len / 4);
    let mode = configUtil.getValue('debug.mode');
    let shouldParseDeps = mode!=='source';
    if(shouldParseDeps) console.log(`[Parsing Dependencies] for "${mode}" mode.`)
    for(let i=0;i<loadpathlist.length;i++){
        let fpath = loadpathlist[i];
        if(i % p === 0) console.log('>', ((i/len)*100).toFixed(1) + `% loaded, ${format(filesize, 1)}MB` );
        fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
            filesize += content.length; 
            if(shouldParseDeps){
                seajsUtil.preLoadDeps(sourcefolder, fpath, content)
            }
        });
    }
    let alldepsmap = seajsUtil.getAllDepsAsMap()
    //fs.writeFileSync(pathutil.parse(__filename).dir+'/alldepsmap.json', JSON.stringify(alldepsmap))
    alldepsmap['root'] = ["core/rkloader.js",'page/js/frame/pageMainCtrl.js','oldcrm/js/core/common-crm.js']

    let arr1 = seajsUtil.reduceAllDepsIntoArray(alldepsmap, "root")
    arr1 = _.uniq(arr1)

    fullarr = [];
    fullarr = _.uniq(fullarr.concat(arr1))

    //fs.writeFileSync(pathutil.parse(__filename).dir+'/allpathidlist.txt', fullarr.join('\n'))


    console.log('>', `100% loaded, ${format(filesize, 1)}MB.` );
    callback()
}

module.exports = {
    preloadStaticFiles
}