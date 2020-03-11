let fs = require('fs')
var _ = require('lodash')
var pathutil = require('path');
let moment = require('moment')
let eachcontentjs = require('eachcontent-js')
let rk = require('./offlinedev/jsmodule/utils/rk')
let es6 = require('./offlinedev/jsmodule/utils/es6')
var fs_readFile = require('./offlinedev/jsmodule/static-proxy/supports/fs_readFile')
var seajsUtil = require('./offlinedev/jsmodule/utils/seajs/seajsUtil')
var webprojectUtil = require('./offlinedev/jsmodule/config/webprojectUtil')
var updateStaticsUrl = require('./offlinedev/jsmodule/static-proxy/updators/updateStaticsUrl')
var configUtil = require('./offlinedev/jsmodule/config/configUtil')
let hot_concat = require('./offlinedev/jsmodule/static-proxy/updators/concat/hot_concat')

let thisfolder = pathutil.parse(__filename).dir;
let logfolder = pathutil.resolve(thisfolder, './logs')

let sea_alias = global.rkGlobalConfig.runtime.seajsConfig.alias;

var format = function(bytes, tail) { 
    return (bytes/1024/1024).toFixed(tail); 
};
let preloadStaticFiles = (callback)=>{
    let webapproot = configUtil.getWebAppFolder();
    let staticfolder = configUtil.getStaticFolder();
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
                seajsUtil.loadAndCacheDeps(sourcefolder, fpath, content)
            }
        });
    }
    if(shouldParseDeps){
        let t0 = new Date()*1;
        hot_concat.loadHotFileConcatPlan(sourcefolder);
        hot_concat.excuteConcatPlan(sourcefolder);
        console.log(new Date()*1 - t0)
        //hot_concat.loadHotFileConcats(sourcefolder)
    }
    console.log('>', `100% loaded, ${format(filesize, 1)}MB.` );
    callback()
}


module.exports = {
    preloadStaticFiles
}