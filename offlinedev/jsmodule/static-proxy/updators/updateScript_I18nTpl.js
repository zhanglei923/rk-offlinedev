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
let CacheOfAllTpl;
let canWatch = platform.toLowerCase() !== 'linux';
let tplWatched = false;
let updateAllTplJson = ()=>{
    let sourceDir = getConfig.getSourceFolder();
    if(!canWatch) {//无法watch，只好每次都加载
        CacheOfAllTpl = null;
    }
    if(!CacheOfAllTpl){
        CacheOfAllTpl = {}
        //console.log('[RK]Load all tpl')
        //let t0=new Date()*1
        eachcontentjs.eachPath(sourceDir, [/\.tpl$/], (path)=>{
            let content;
            if(global.FileMemoCache[path]){
                content = global.FileMemoCache[path].content;
            }else{
                content = fs.readFileSync(path, 'utf8')
            }
            let pathid = pathutil.relative(sourceDir, path);
            pathid = rk_formatPath(pathid)
            //console.log(pathid)
            //if(content)content = content.replace(/\n/g,'').replace(/\s{1,}/g,' ')//.replace(/\>\s{1,}\</g,'')
            CacheOfAllTpl[pathid] = content;
        });
        //console.log(new Date()*1 - t0)
        // eachcontentjs.eachContent(sourceDir, [/\.tpl$/], (content, path, states)=>{
        //     let pathid = pathutil.relative(sourceDir, path);
        //     //console.log(pathid)
        //     CacheOfAllTpl[pathid] = content;
        // })
    }
    if(canWatch && !tplWatched){
        console.log('[RK]Watching tpl files...')
        watcher.watch(sourceDir,{//linux is not avaliable, see https://nodejs.org/api/fs.html#fs_caveats
            persistent:true,
            recursive:true,
            ignored:/node\_modules/g
        }).on('all',(e, filename)=>{
            if(!/Dir$/.test(e)){//不关注文件夹
                if(filename.match(/\.tpl$/)){
                    let pathid = pathutil.relative(sourceDir, filename);
                    //console.log('changed', filename, pathid)
                    let fulltplpath = filename;//pathutil.resolve(sourceDir, filename);
                    if(fs.existsSync(fulltplpath)){
                        //CacheOfAllTpl[pathid] = fs.readFileSync(fulltplpath, 'utf8')
                        fs_readFile.fs_readFile(fulltplpath, {encoding:'utf8'}, (err, content) => {
                            CacheOfAllTpl[pathid] = content;
                        });
                    }else{
                        delete CacheOfAllTpl[pathid]
                    }
                }
            }
        })
        tplWatched = true;
    }
}
let updateFirstJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticTplRequests')
    if(!enable) return content;
        
    let fullfilepath = info.fullfilepath;
    if(isFirstJs(fullfilepath)){
        updateAllTplJson()
        let defaultjs = '\n;\n'
        let alltpljson = `${JSON.stringify(CacheOfAllTpl)}`
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
    let sourceDir = getConfig.getSourceFolder();

    let deps = seajsUtil.getFileDeps(sourceDir, fullfilepath, content).deps;
    if(fullfilepath.match(/i18n/) && fullfilepath.match(/untranslated\.js$/)){
        //ignor i18n
    }else{
        deps.forEach((info)=>{
            let req_path = info.rawPath;
            let req_realpath = seajsUtil.resolveRequirePath(sourceDir, fullfilepath, req_path);
            var replacereg = seajsUtil.getRequireRegForReplacement(req_path);
            if(req_path.match(/\.tpl$/)){
                if(fs.existsSync(req_realpath)){
                    let split = `,,,`
                    let pathid = pathutil.relative(sourceDir, req_realpath);
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