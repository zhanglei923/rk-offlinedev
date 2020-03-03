let eachcontentjs = require('eachcontent-js')
let rk = require('./offlinedev/jsmodule/utils/rk')
var fs_readFile = require('./offlinedev/jsmodule/static-proxy/supports/fs_readFile')
var seajsUtil = require('./offlinedev/jsmodule/utils/seajs/seajsUtil')
var updateStaticsUrl = require('./offlinedev/jsmodule/static-proxy/updators/updateStaticsUrl')
var configUtil = require('./offlinedev/jsmodule/config/configUtil')
var mergeMaster = require('./offlinedev/jsmodule/static-proxy/updators/concat/mergeMaster') 

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
    let p = Math.round(len / 7);
    for(let i=0;i<loadpathlist.length;i++){
        let fpath = loadpathlist[i];
        if(i % p === 0) console.log('>', ((i/len)*100).toFixed(1) + `% loaded, ${format(filesize, 1)}MB` );
        fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
            filesize += content.length; 
            seajsUtil.preLoadDeps(sourcefolder, fpath, content)
        });
    }
    mergeMaster.prepareMergeStrategy(sourcefolder)
    console.log('>', `100% loaded, ${format(filesize, 1)}MB.` );
    callback()
}

module.exports = {
    preloadStaticFiles
}