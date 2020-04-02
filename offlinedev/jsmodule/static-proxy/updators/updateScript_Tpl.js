//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let watch = require('../../utils/watch')
//let watcher = require('chokidar')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../utils/rk')
let vpp = require('../../utils/fs-vpp')
let fs_readFile = require('../../utils/fs_readFile')
var getConfig = require('../../config/configUtil')
let regParserMini = require('../../utils/seajs/regParserMini');
let seajsUtil = require('../../utils/seajs/seajsUtil');

let platform = os.platform();

let isFirstJs = (fpath)=>{
    if(fpath.match(/seajs\/sea\.js$/)){
        return true;
    }
    return false;
}
global.rkCacheOfAllTpl;
let canWatch = platform.toLowerCase() !== 'linux';
let tplWatched = false;
let updateAllTplJson = ()=>{
    let sourceDir = getConfig.getSourceFolder();
    let sourceDirList = vpp.getAllSourceFolders();
    if(!global.rkCacheOfAllTpl){
        global.rkCacheOfAllTpl = {}
        // //console.log('[RK]Load all tpl')
        // //let t0=new Date()*1
        // eachcontentjs.eachPath(sourceDir, [/\.tpl$/], (path)=>{
        //     let content;
        //     fs_readFile.fs_readFile(path, {encoding:'utf8', be_sync: true}, (err, content2, fileinfo) => {   
        //         content = content2;
        //     });
        //     let pathid = pathutil.relative(sourceDir, path);
        //     pathid = rk_formatPath(pathid)
        //     //console.log(pathid)
        //     //if(content)content = content.replace(/\n/g,'').replace(/\s{1,}/g,' ')//.replace(/\>\s{1,}\</g,'')
        //     global.rkCacheOfAllTpl[pathid] = content;
        // });
        // //console.log(new Date()*1 - t0)
        // // eachcontentjs.eachContent(sourceDir, [/\.tpl$/], (content, path, states)=>{
        // //     let pathid = pathutil.relative(sourceDir, path);
        // //     //console.log(pathid)
        // //     global.rkCacheOfAllTpl[pathid] = content;
        // // })
        console.log('[RK]Watching tpl files...')
    }
    let watchId = 'watch_tpl';
    watch.watchFiles({watchId, folder: sourceDirList, filereg: /\.tpl$/, ignored: /node\_modules/g});
    let changedfiles = watch.getChangedFiles(watchId);
    changedfiles.forEach((info)=>{
        let filename = info.fpath;
        let act = info.act;
        let pathid = rk_getPathId(filename);//pathutil.relative(sourceDir, filename);
        pathid = rk_formatPath(pathid)
        let fulltplpath = filename;//pathutil.resolve(sourceDir, filename);
        if(fs.existsSync(fulltplpath)){
            fs_readFile.fs_readFile(fulltplpath, {encoding:'utf8', be_sync: true}, (err, content) => {
                //console.log('changed', fulltplpath)
                global.rkCacheOfAllTpl[pathid] = content;
            });
        }else{
            delete global.rkCacheOfAllTpl[pathid]
        }
    })
}
let updateFirstJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticTplRequests')
    if(!enable) return content;
        
    let fullfilepath = info.fullfilepath;
    if(isFirstJs(fullfilepath)){
        updateAllTplJson();
        let defaultjs = '\n;\n'
        let alltpljson = `${JSON.stringify(global.rkCacheOfAllTpl)}`
        defaultjs += `;window.rk_offlinedev.ALL_TPL_JSON=`+alltpljson;
        defaultjs += `\n//****** END *******//\n`

        content = content +';\n'+ defaultjs;
    }
    return content;
}
let updateJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticTplRequests')
    if(!enable) return content;
    let fullfilepath = info.fullfilepath;
    if(rk.isCookedJsPath(fullfilepath)){
        return content;
    }
    if(isFirstJs(fullfilepath)){
        return updateFirstJs(info, content);
    }
    let staticDir = getConfig.getStaticFolder();
    let sourceDir = getConfig.getSourceFolder();//rk_getSourceDir(fullfilepath)

    let deps = seajsUtil.getFileDeps(fullfilepath, content).deps;
    if(fullfilepath.match(/i18n/) && fullfilepath.match(/untranslated\.js$/)){
        //ignor i18n
    }else{
        deps.forEach((info)=>{
            let req_path = info.rawPath;
            let req_realpath = seajsUtil.resolveRequirePath(fullfilepath, req_path);
            var replacereg = seajsUtil.getRequireRegForReplacement(req_path);
            if(req_path.match(/\.tpl$/)){
                if(fs.existsSync(req_realpath)){
                    let split = `,,,`
                    let pathid = rk_getPathId(req_realpath);//pathutil.relative(sourceDir, req_realpath);
                    pathid = rk_formatPath(pathid);
                    content = content.replace(replacereg, `require("${req_path}${split}${pathid}"`)    
                    // console.log(req_path, staticDir)
                    // console.log(fdir)
                    // console.log(req_realpath)
                    // console.log('pathid',pathid)
                }
            }
        });
    }

    return content;
}
module.exports = {
    isFirstJs,
    updateFirstJs,
    updateJs
};