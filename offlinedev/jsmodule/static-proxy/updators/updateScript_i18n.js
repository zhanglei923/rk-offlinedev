//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let vpp = require('../../utils/fs-vpp')
let watch = require('../../utils/watch')
//let watcher = require('chokidar')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../utils/rk')
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
// let doWatch = ()=>{
//     if(!canWatch) {//无法watch，只好每次都加载
//         CacheOfI18n = null;
//     }
//     if(canWatch && !isWatched){
//         console.log('[RK]Watching i18n files...')
//         let sourceDir = getConfig.getSourceFolder();
//         let i18nFolder = pathutil.resolve(sourceDir, './core/i18n')
//         watcher.watch(i18nFolder,{//linux is not avaliable, see https://nodejs.org/api/fs.html#fs_caveats
//             persistent:true,
//             recursive:true,
//             ignored:/node\_modules/g
//         }).on('all',(e, filename)=>{
//             if(!/Dir$/.test(e)){//不关注文件夹
//                 if(filename.match(/core\/i18n\//g)){
//                     //console.log('watch:', e, filename)
//                     CacheOfI18n = null;//置空，重新加载
//                 }
//             }
//         })
//         isWatched = true;
//     }
// }
let updateJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticTplRequests')
    if(!enable) return content;
    //doWatch();
    let fullfilepath = info.fullfilepath;
    if(rk.isCookedJsPath(fullfilepath)){
        return content;
    }
    let sourceDir = global.rk_masterSourceFolder;//getConfig.getSourceFolder();

    let i18nFolder = pathutil.resolve(sourceDir, './core/i18n');
    let watchId = 'watch_i18n';
    watch.watchFiles({watchId, folder: i18nFolder, filereg: /\.js$/, ignored: /node\_modules/g});
    let changed = watch.getChangedFiles(watchId);
    if(changed.length > 0) CacheOfI18n = null;

    let deps = seajsUtil.getFileDeps(sourceDir, fullfilepath, content).deps;
    if(fullfilepath.match(/i18n/g) && fullfilepath.match(/untranslated\.js$/)){
        //let t0=new Date()*1;
        let c = CacheOfI18n ? CacheOfI18n : updateI18nJs(fullfilepath, content, deps);
        //CacheOfI18n = c;
        //console.log(new Date()*1 - t0)
        return c;
    }
    return content;
}
let updateI18nJs = (fullfilepath, content, deps)=>{
    //将untranslate.js里require的json文件的内容，替换进untranslate.js的require语句里，变成一个文件    
    content = rk.onlyCleanLineComment(content);
    let arr = content.split('\n');
    deps.forEach((info)=>{
        //console.log('raw:', info.rawPath)
        let req_path = info.rawPath;
        //var replacereg = seajsUtil.getRequireRegForReplacement(req_path, true);
        let req_realpath = seajsUtil.resolveRequirePath(fullfilepath, req_path)
        if(fs.existsSync(req_realpath)){
            let json = seajsUtil.loadJsonFromFile(req_realpath);
            if(json){
                let jsonstr = JSON.stringify(json);
                arr.forEach((line, i)=>{
                    if(line.indexOf(req_path)>=0 && line.indexOf('require')>=0 && line.indexOf('{')<0){
                        let leftside = line.split('require')[0];
                        line = leftside + jsonstr + ')';//警告：不能直接replace正则，会发生不明原因的$1,$2丢失问题
                    }
                    arr[i] = line;
                });
            }
        }
    });
    content = arr.join('\n');
    return content;
};
module.exports = {
    updateJs
};