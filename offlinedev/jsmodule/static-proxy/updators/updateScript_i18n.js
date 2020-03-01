//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let watcher = require('chokidar')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../utils/rk')
let fs_readFile = require('../supports/fs_readFile')
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
let CacheOfI18n;
let canWatch = platform.toLowerCase() !== 'linux';
let isWatched = false;
let doWatch = ()=>{
    if(!canWatch) {//无法watch，只好每次都加载
        CacheOfI18n = null;
    }
    if(canWatch && !isWatched){
        console.log('[RK]Watching i18n files...')
        let sourceDir = getConfig.getSourceFolder();
        let i18nFolder = pathutil.resolve(sourceDir, './core/i18n')
        watcher.watch(i18nFolder,{//linux is not avaliable, see https://nodejs.org/api/fs.html#fs_caveats
            persistent:true,
            recursive:true,
            ignored:/node\_modules/g
        }).on('all',(e, filename)=>{
            if(!/Dir$/.test(e)){//不关注文件夹
                if(filename.match(/core\/i18n\//g)){
                    //console.log('watch:', e, filename)
                    CacheOfI18n = null;//置空，重新加载
                }
            }
        })
        isWatched = true;
    }
}
let updateJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticTplRequests')
    if(!enable) return content;
    doWatch();
    let fullfilepath = info.fullfilepath;
    if(rk.isCookedJsPath(fullfilepath)){
        return content;
    }
    let staticDir = getConfig.getStaticFolder();
    let sourceDir = getConfig.getSourceFolder();

    let deps = seajsUtil.getFileDeps(sourceDir, fullfilepath, content).deps;
    if(fullfilepath.match(/i18n/g) && fullfilepath.match(/untranslated\.js$/)){
        //let t0=new Date()*1;
        let c = CacheOfI18n ? CacheOfI18n : updateI18nJs(sourceDir, fullfilepath, content, deps);
        CacheOfI18n = c;
        //console.log(new Date()*1 - t0)
        return c;
    }
    return content;
}
let updateI18nJs = (sourceDir, fullfilepath, content, deps)=>{
    deps.forEach((info)=>{
        //console.log('raw:', info.rawPath)
        let req_path = info.rawPath;
        var replacereg = seajsUtil.getRequireRegForReplacement(req_path, true);
        let req_realpath = seajsUtil.resolveRequirePath(sourceDir, fullfilepath, req_path)
        if(fs.existsSync(req_realpath)){
            let json = seajsUtil.loadJsonFromFile(req_realpath);
            if(json){
                let jsonstr = JSON.stringify(json);
                content = content.replace(replacereg, jsonstr)
            }
        }
    });
    return content;
};
module.exports = {
    updateJs
};