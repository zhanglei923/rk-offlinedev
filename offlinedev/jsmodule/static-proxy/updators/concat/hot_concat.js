let fs = require('fs');
let moment = require('moment')
let _ = require('lodash')
let pathutil = require('path')

let rk = require('../../../utils/rk')
let fs_readFile = require('../../supports/fs_readFile')
let configUtil = require('../../../config/configUtil')
let webprojectUtil = require('../../../config/webprojectUtil')
let seajsUtil = require('../../../utils/seajs/seajsUtil')

let thisfolder = pathutil.parse(__filename).dir;
let logfolder = pathutil.resolve(thisfolder, '../../../../../logs')

let sea_alias = global.rkGlobalConfig.runtime.seajsConfig.alias;

/**
 *  注意！不要缓存合并后的大文本，低配机内存扛不住，也没必要。
 *       只需缓存每个文件的文本即可，搭配mc36
 * 
 */

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
    let root = [
                // "core/rkloader.js",
                // 'page/js/frame/pageMainCtrl.js',
                // 'oldcrm/js/core/common-crm.js',
                // "platform/page/index/widget.js"
    ];
    //root = root.concat(allPageEntrancePathId)
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
    global.rkNameOf_HotConcatBundle = [];

    let maxBundleSize = 5*1024*1024;
    let currentFileNum = 0;
    let currentSize = 0;
    let totalContentSize = 0;
    let fcount=0;
    let len = allpathid.length;
    let concatPlan = {}
    for(let i=0;i<allpathid.length;i++){
        let pathid = allpathid[i];
        let fullfilepath = pathutil.resolve(sourcefolder, pathid)
        let isJs = pathid.match(/\.js$/);
        let isTpl = pathid.match(/\.tpl$/);
        fcount++;
        let fpath = pathutil.resolve(sourcefolder, pathid)
        fpath = rk_formatPath(fpath);

        fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
            if(content===null || typeof content === 'undefined'){
                console.log('404:',fpath)
            }
            let ok = true;
            if(isJs && !rk.mightBeCmdFile(content)) ok=false;
            if(rk.isLibJsPath(fullfilepath)) ok=false;
            if(ok){
                let deployContent = '';
                if(isJs) deployContent = seajsUtil.changeJsToDeploy(sourcefolder, fullfilepath, sea_alias, content, {no_hot_url:true})
                if(isTpl)deployContent = seajsUtil.changeTplToDeploy(sourcefolder, fullfilepath, content)
                //混淆实验
                if(0 && !rk.isCookedJsPath(fullfilepath))
                deployContent = es6.minify(deployContent, {        
                    uglifyConfig:{
                        mangle:{
                            reserved:['require' ,'exports' ,'module' ,'$']
                        }
                    }
                });
                currentSize += content.length;
                totalContentSize += content.length;
                if(currentSize > maxBundleSize){
                    currentFileNum++;
                    currentSize=0;
                }
                //currentContent += `;\n//${pathid}\n;`+deployContent;
                if(!concatPlan[currentFileNum+''])concatPlan[currentFileNum+'']={};
                //currentPathids += '\n'+pathid
                concatPlan[currentFileNum+''][pathid] = {
                    deployContent,
                    pathid,
                    fpath,
                    mc36: fileinfo.mc36,
                    mightBeCmd: fileinfo.mightBeCmd,
                    isCmd: fileinfo.isCmd
                };
                if(fcount===len){
                    //last
                }
            }
        });
    }
    console.log('concat files=',currentFileNum)
    console.log('concat totalContentSize=', rk_formatMB(totalContentSize)+'MB')
    for(let i=0;i<(currentFileNum+1);i++){
        let files = concatPlan[i+''];
        let currentContent = ''
        let currentPathids = '';
        //console.log(i, 'pathid=',files)
        for(let pathid in files){
            let finfo = files[pathid]; 
            currentContent += `;\n//${pathid}\n;`+finfo.deployContent;
            currentPathids += '\n'+pathid;
        }
        global.rkNameOf_HotConcatBundle[`hot/output_${i}.bundle.js`]=true;
        fs.writeFileSync(`${sourcefolder}/hot/output_${i}.bundle.js`, `//${timetxt}\n`+currentContent);
        fs.writeFileSync(`${sourcefolder}/hot/output_${i}.id.txt`, `//${timetxt}\n`+currentPathids);
    }
    // console.log(fcount)
    // console.log(currentSize)

}
module.exports = {
    generateHotFiles
};