let fs = require('fs')
var _ = require('lodash')
var pathutil = require('path');
let moment = require('moment')
let eachcontentjs = require('eachcontent-js')
let rk = require('./offlinedev/jsmodule/utils/rk')
var fs_readFile = require('./offlinedev/jsmodule/static-proxy/supports/fs_readFile')
var seajsUtil = require('./offlinedev/jsmodule/utils/seajs/seajsUtil')
var webprojectUtil = require('./offlinedev/jsmodule/config/webprojectUtil')
var updateStaticsUrl = require('./offlinedev/jsmodule/static-proxy/updators/updateStaticsUrl')
var configUtil = require('./offlinedev/jsmodule/config/configUtil')

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
                seajsUtil.preLoadDeps(sourcefolder, fpath, content)
            }
        });
    }
    if(shouldParseDeps){
        generateHotFiles(staticfolder, sourcefolder)
    }
    console.log('>', `100% loaded, ${format(filesize, 1)}MB.` );
    callback()
}
let generateHotFiles = (staticfolder, sourcefolder)=>{
    let webroot = configUtil.getWebRoot();
    let allrouters = webprojectUtil.loadRouter(webroot)
    let allPageEntrancePathId = [];
    for(let url in allrouters){
        allPageEntrancePathId = allPageEntrancePathId.concat(allrouters[url].scripts)
    }

    let timetxt = moment().format('YYYY-MM-DD HH:mm')
    let alldepsmap = seajsUtil.getAllDepsAsMap()
    //seajsUtil.cleanNoOneRequired(alldepsmap)
    fs.writeFileSync(logfolder+'/dependencyMap.json', JSON.stringify(alldepsmap))
    // alldepsmap['root'] = ["core/rkloader.js",
    //                       'page/js/frame/pageMainCtrl.js',
    //                       'oldcrm/js/core/common-crm.js',
    //                       "platform/page/index/widget.js"
    //                     ];
    let root = [];
    for(let pathid in alldepsmap) root.push(pathid);
    alldepsmap['root'] = root;

    //        for(let i=0;i<7;i++) srcs.push(`hot/output_${i}.bundle`)


    let allpathid = seajsUtil.reduceAllDepsIntoArray(alldepsmap, "root")
    let tmparr = []
    allpathid.forEach((pathid)=>{
        if(rk.isCommonRequirePath(pathid) && pathid.match(/\.(js|tpl)$/)) tmparr.push(pathid);
    })
    allpathid = tmparr;
    fs.writeFileSync(logfolder+'/dependency.powerlist.txt', allpathid.join('\n'))

    let maxSize = 5*1024*1024;
    let currentFileNum = 0;
    let currentSize = 0;
    let currentContent = ''
    let currentPathids = ''
    let count=0;
    global.FileHotConcatBundlesCache = [];
    let len = allpathid.length;
    for(let i=0;i<allpathid.length;i++){
        let pathid = allpathid[i];
        let fullfilepath = pathutil.resolve(sourcefolder, pathid)
        let isJs = pathid.match(/\.js$/);
        let isTpl = pathid.match(/\.tpl$/);
        count++;
        let fpath = pathutil.resolve(sourcefolder, pathid)
        fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
            if(content===null || typeof content === 'undefined'){
                console.log('404:',fpath)
            }
            let ok = true;
            if(!rk.mightBeCmdFile(content)) ok=false;
            if(rk.isLibJsPath(fullfilepath)) ok=false;
            if(ok){
                let deployContent = '';
                if(isJs) deployContent = seajsUtil.changeJsToDeploy(sourcefolder, fullfilepath, sea_alias, content, {no_hot_url:true})
                if(isTpl)deployContent = seajsUtil.changeTplToDeploy(sourcefolder, fullfilepath, content)
                currentSize += content.length;
                currentContent += `;\n//${pathid}\n;`+deployContent;
                currentPathids += '\n'+pathid
                if(currentSize > maxSize){
                    global.FileHotConcatBundlesCache[`hot/output_${currentFileNum}.bundle.js`] = currentContent;
                    fs.writeFileSync(`${sourcefolder}/hot/output_${currentFileNum}.bundle.js`, `//${timetxt}\n`+currentContent);
                    fs.writeFileSync(`${sourcefolder}/hot/output_${currentFileNum}.id.txt`, `//${timetxt}\n`+currentPathids);
                    currentFileNum++;
                    currentSize=0;
                    currentContent='';
                    currentPathids='';
                }
                if(count===len){
                    global.FileHotConcatBundlesCache[`hot/output_${currentFileNum}.bundle.js`] = currentContent;
                    fs.writeFileSync(`${sourcefolder}/hot/output_${currentFileNum}.bundle.js`, `//${timetxt}\n`+currentContent);
                    fs.writeFileSync(`${sourcefolder}/hot/output_${currentFileNum}.id.txt`, `//${timetxt}\n`+currentPathids);
                }
            }
        });
    }
    // console.log(count)
    // console.log(currentSize)

}

module.exports = {
    preloadStaticFiles
}