let fs = require('fs');
let moment = require('moment')
let _ = require('lodash')
let pathutil = require('path')
let os = require('os');
let vpp = require('../../../utils/fs-vpp')
let watch = require('../../../utils/watch')
//let watcher = require('chokidar')
let makeDir = require("make-dir")

let platform = os.platform();

let es6 = require('../../../utils/es6');
let rk = require('../../../utils/rk')
let fs_readFile = require('../../../utils/fs_readFile')
let configUtil = require('../../../config/configUtil')
let webprojectUtil = require('../../../config/webprojectUtil')
let seajsUtil = require('../../../utils/seajs/seajsUtil')
let exclude = require('./exclude')

let updateScript_CssUrl = require('../updateScript_CssUrl')

let backupfiles = configUtil.getValue('debug.concat.backupConcatFiles')


/**
 *  注意！不要缓存合并后的大文本，低配机内存扛不住，也没必要。
 *       只需缓存每个文件的文本即可，搭配mc36
 * 
 */
let getBundlePathid = (i)=>{
    return `_hot/output_${i}.bundle.js`;
};
let allpathid;
let timetxt;
global.rkCacheOf_autoConcatPlan = {};
global.rkCacheOf_DeployfilesData = {};

global.rkStatOf_concatPlanNeedsUpdate = true;

let canWatch = platform.toLowerCase() !== 'linux';
let isWatched = false;
let watchId = 'watch_hot_concat';
let doWatch = ()=>{
    console.log('[RK]Watching source folder...')
    let sourceDir = configUtil.getSourceFolder();
    let sourceDirs = vpp.getAllSourceFolders()
    watch.watchFiles({watchId, 
                      folder: sourceDirs, 
                      filereg: /\.(js|tpl|json)$/, 
                      ignored: [/node\_modules/g, /\_hot/g]
                    });
    return;
}
doWatch();

//生成合并计划，这里不用理会缓存，只是将合并计划生成
let loadHotFileConcatPlan = (sourcefolder)=>{
    let changedfiles = watch.getChangedFiles(watchId);
    global.rkStatOf_concatPlanNeedsUpdate = changedfiles.length > 0;
    if(!global.rkStatOf_concatPlanNeedsUpdate){
        console.log('no change')
        return;
    }
    let hotfolder = makeDir.sync(pathutil.resolve(sourcefolder, './_hot'))
    let webroot = configUtil.getWebRoot();
    let allrouters = webprojectUtil.loadRouter(webroot)
    let allPageEntrancePathId = [];
    for(let url in allrouters){
        allPageEntrancePathId = allPageEntrancePathId.concat(allrouters[url].scripts)
    }

    timetxt = moment().format('YYYY-MM-DD HH:mm');
    seajsUtil.refreshAllDeps(sourcefolder)
    let alldepsmap = seajsUtil.getAllDepsAsMap()
    alldepsmap = seajsUtil.cleanAll404(sourcefolder, alldepsmap);
    //fs.writeFileSync('./d.json', JSON.stringify(alldepsmap))
    //seajsUtil.cleanNoOneRequired(alldepsmap)
    if(backupfiles)fs.writeFile(hotfolder+'/dependencyMap.json', `//${timetxt}\n`+JSON.stringify(alldepsmap), ()=>{});
    // alldepsmap['root'] = ["core/rkloader.js",
    //                       'page/js/frame/pageMainCtrl.js',
    //                       'oldcrm/js/core/common-crm.js',
    //                       "platform/page/index/widget.js"
    //                     ];
    let root = [
                // "core/rkloader.js",
                // 'page/js/frame/pageMainCtrl.js',
                // 'oldcrm/js/core/common-crm.js',
                // "platform/page/index/widget.js"
    ];
    //root = root.concat(allPageEntrancePathId)
    for(let pathid in alldepsmap) root.push(pathid);
    alldepsmap['root'] = root;

    //        for(let i=0;i<7;i++) srcs.push(`_hot/output_${i}.bundle`)

    allpathid = seajsUtil.reduceAllDepsIntoArray(alldepsmap, "root");
    let tmparr = []
    allpathid.forEach((pathid)=>{
        let isok = false;
        if(rk.isCommonRequirePath(pathid) && pathid.match(/\.(js|tpl)$/)) isok = true;
        if(exclude.isExcludePathid(pathid)) isok = false;
        if(isok) tmparr.push(pathid);
        // let fullpath = pathutil.resolve(sourcefolder, pathid);
        // let exist = fs.existsSync(fullpath)
        // if(!exist) {
        //     console.log(`404:`, pathid)
        // }
        // if(exist && rk.isCommonRequirePath(pathid) && pathid.match(/\.(js|tpl)$/)) tmparr.push(pathid);
    })
    allpathid = tmparr;
    if(backupfiles)fs.writeFile(hotfolder+'/dependency.powerlist.txt', `//${timetxt}\n`+allpathid.join('\n'), ()=>{});

    let maxMB = configUtil.getValue('debug.concat.maxConcatFileSizeMB');
    maxMB = maxMB ? maxMB : 6;//default
    console.log('each concat file <=', maxMB+'MB')
    let maxBundleSize = maxMB * 1024 * 1024;
    let currentFileNum = 0;
    let currentSize = 0;
    let totalContentSize = 0;
    let fcount=0;
    let len = allpathid.length;
    for(let k in global.rkCacheOf_autoConcatPlan) delete global.rkCacheOf_autoConcatPlan[k];//清除内存
    global.rkCacheOf_autoConcatPlan = {}

    currentFileNum++;
    let tplbundleid = getBundlePathid('tpl')
    global.rkCacheOf_autoConcatPlan[tplbundleid]={
        idx: currentFileNum,
        files:{}
    };
    //tpl
    for(let i=0;i<allpathid.length;i++){
        let pathid = allpathid[i];
        let isTpl = pathid.match(/\.tpl$/);
        if(isTpl){
            global.rkCacheOf_autoConcatPlan[tplbundleid].files[pathid] = 1;
        }
    }
    //js
    for(let i=0;i<allpathid.length;i++){
        let pathid = allpathid[i];
        let fullfilepath = pathutil.resolve(sourcefolder, pathid)
        fullfilepath = rk_formatPath(fullfilepath)
        let isJs = pathid.match(/\.js$/);
        fcount++;
        let fpath = fullfilepath;
        fpath = rk_formatPath(fpath);
        //if(currentFileNum >= 3)break;

        let ok = true;
        let fstats;
        fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {
            if(content===null || typeof content === 'undefined'){
                console.log('404:',fpath)
                ok = false;
            }
            fstats = fileinfo.fstate;
            if(isJs && !rk.mightBeCmdFile(content)) ok=false;
            if(rk.isLibJsPath(fullfilepath)) ok=false;
            if(rk.isCookedJsPath(fullfilepath)) ok=false;
        });
        if(isJs && ok){
            let fsize = fstats.size;
            currentSize += fsize;
            totalContentSize += fsize;
            if(currentSize > maxBundleSize){
                currentFileNum++;
                currentSize=0;
            }
            //currentContent += `;\n//${pathid}\n;`+deployContent;
            let bundlePathid = getBundlePathid(currentFileNum)
            if(!global.rkCacheOf_autoConcatPlan[bundlePathid])global.rkCacheOf_autoConcatPlan[bundlePathid]={
                idx: currentFileNum,
                files:{}
            };
            //currentPathids += '\n'+pathid
            global.rkCacheOf_autoConcatPlan[bundlePathid].files[pathid] = 1;
        }        
    }
    console.log('concat files=',currentFileNum)
    console.log('concat totalContentSize=', rk_formatMB(totalContentSize)+'MB')
    console.log('concat plan generated.');
    if(backupfiles)fs.writeFile(`${sourcefolder}/_hot/concat_plan.json`, `//${timetxt}\n`+JSON.stringify(global.rkCacheOf_autoConcatPlan), ()=>{});
};
//执行合并计划，加入缓存层
let excuteConcatPlan = ()=>{
    let sourcefolder = global.rk_masterSourceFolder;
    if(!global.rkStatOf_concatPlanNeedsUpdate){
        console.log('no change2')
        return;
    }
    //tpl文件
    let tplbundleid = getBundlePathid('tpl')
    for(let pathid in global.rkCacheOf_autoConcatPlan[tplbundleid].files){
        let fpath = pathutil.resolve(sourcefolder, pathid);
        fpath = rk_formatPath(fpath)
        let shouldread = true;
        if(global.rkCacheOf_DeployfilesData[pathid]){
            let old_mc36 = global.rkCacheOf_DeployfilesData[pathid].mc36;
            let new_mc36 = fs_readFile.getFileMC36(fpath);
            if(old_mc36 === new_mc36) shouldread = false;
        }
        if(shouldread)
        fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
            if(content===null || typeof content === 'undefined'){
                console.log('404:',fpath)
            }
            let deployContent = '';
            deployContent = seajsUtil.changeTplToDeploy(fpath, content)
            global.rkCacheOf_autoConcatPlan[tplbundleid].files[pathid] = 1;
            global.rkCacheOf_DeployfilesData[pathid] = {
                deployContent,
                pathid,
                fpath,
                mc36: fileinfo.mc36,
                mightBeCmd: fileinfo.mightBeCmd,
                isCmd: fileinfo.isCmd
            };
        });
    }
    global.rkCacheOf_autoConcatPlan[tplbundleid];//丢弃tpl plan
    //javascript文件
    for(let bundlePathid in global.rkCacheOf_autoConcatPlan){
        if(bundlePathid !== tplbundleid){
            let files = global.rkCacheOf_autoConcatPlan[bundlePathid].files;
            for(let pathid in files){
                let fpath = pathutil.resolve(sourcefolder, pathid);
                fpath = rk_formatPath(fpath)
                let fullfilepath = fpath;
                let shouldread = true;
                if(global.rkCacheOf_DeployfilesData[pathid]){
                    let old_mc36 = global.rkCacheOf_DeployfilesData[pathid].mc36;
                    let new_mc36 = fs_readFile.getFileMC36(fpath);
                    if(old_mc36 === new_mc36) shouldread = false;
                }
                if(shouldread)
                fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
                    if(content===null || typeof content === 'undefined'){
                        console.log('404:',fpath)
                    }
                    fs_readFile.removeCache(fpath);//因为已经被转译过，因此没必要保留原始的文本了，节约内存                    
                    let sea_alias = global.rkGlobalConfig.runtime.seajsConfig.alias;
                    let deployContent = '';
                    deployContent = seajsUtil.changeJsToDeploy(fullfilepath, sea_alias, content, 
                                                            {
                                                                no_hot_url:true,
                                                                depsPathIdUpdate:(depspathid)=>{//更新css的hot url，打包状态下，只需跟新define函数的就行。
                                                                    if(!configUtil.getValue('debug.concatStaticCssRequests')) return depspathid;
                                                                    depspathid.forEach((pid, idx)=>{
                                                                        if(!exclude.isExcludePathid(pid)){
                                                                            let hotid = updateScript_CssUrl.changeToHotPath(fullfilepath, pid)
                                                                            depspathid[idx] = hotid ? hotid : pid;
                                                                        }
                                                                    })
                                                                    depspathid = _.uniq(depspathid);
                                                                    return depspathid;
                                                                }
                                                            });
                    if(configUtil.getValue('es6.autoTransformJs')){
                        deployContent = `//[rk]Babel transformed es6->es5\n` + es6.transform(deployContent)
                    }
                    global.rkCacheOf_DeployfilesData[pathid] = {
                        deployContent,
                        pathid,
                        fpath,
                        mc36: fileinfo.mc36,
                        mightBeCmd: fileinfo.mightBeCmd,
                        isCmd: fileinfo.isCmd
                    };
                });
            }
        }
    }
    global.rkStatOf_concatPlanNeedsUpdate = false;//配合watch
}
let getConcatContent = (hotpathid, files)=>{
    let currentContent = [];
    let currentPathids = [];
    //console.log(i, 'pathid=',files)
    for(let pathid in files){
        let finfo = global.rkCacheOf_DeployfilesData[pathid]; 
        currentContent.push(finfo.deployContent);
        currentPathids.push(pathid);
    }
    currentContent = currentContent.join('\n;');
    currentPathids = currentPathids.join('\n;');

    currentContent = `//${timetxt}, hot-concat\n`+currentContent;
    currentPathids = `//${timetxt}, hot-concat\n`+currentPathids;

    if(backupfiles){
        let sourcefolder = configUtil.getSourceFolder();
        fs.writeFile(`${sourcefolder}/${hotpathid}`, currentContent, ()=>{});
        fs.writeFile(`${sourcefolder}/${hotpathid}.txt`, currentPathids, ()=>{});
    }
    return {
        currentContent,
        currentPathids
    }
}
let loadHotFileConcats = (sourcefolder)=>{
    for(let bundleid in global.rkCacheOf_autoConcatPlan){
        let files = global.rkCacheOf_autoConcatPlan[bundleid].files;
        let info = getConcatContent(bundleid, files);
        //global.rkNameOf_HotConcatBundle[bundleid]=true;
    }
    if(backupfiles)fs.writeFile(`${sourcefolder}/_hot/${'allpathid'}.txt`, `//${timetxt}\n`+allpathid.join('\n'), ()=>{});
    // console.log(fcount)
    // console.log(currentSize)

}
module.exports = {
    loadHotFileConcatPlan,
    excuteConcatPlan,
    loadHotFileConcats,
    getConcatContent
};