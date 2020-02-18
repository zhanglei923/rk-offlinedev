//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let watcher = require('chokidar')
let eachcontentjs = require('eachcontent-js')
var getConfig = require('../../config/configUtil')
let regParserMini = require('../../utils/seajs/regParserMini');

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
    if(!canWatch) CacheOfAllTpl = null;//无法watch，只好每次都加载
    if(!CacheOfAllTpl){
        CacheOfAllTpl = {}
        //console.log('[RK]Load all tpl')
        eachcontentjs.eachContent(sourceDir, [/\.tpl$/], (content, path, states)=>{
            let pathid = pathutil.relative(sourceDir, path);
            //console.log(pathid)
            CacheOfAllTpl[pathid] = content;
        })
    }
    if(canWatch && !tplWatched){
        console.log('[RK]Watching tpl files...')
        watcher.watch(sourceDir,{//linux is not avaliable, see https://nodejs.org/api/fs.html#fs_caveats
            persistent:true,
            recursive:true
        }).on('all',(e, filename)=>{
            if(filename.match(/\.tpl$/)){
                let pathid = pathutil.relative(sourceDir, filename);
                //console.log('changed', filename, pathid)
                let fulltplpath = filename;//pathutil.resolve(sourceDir, filename);
                if(fs.existsSync(fulltplpath)){
                    CacheOfAllTpl[pathid] = fs.readFileSync(fulltplpath, 'utf8')
                }else{
                    delete CacheOfAllTpl[pathid]
                }
            }
        })
        tplWatched = true;
    }
}
let updateFirstJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticRequests')
    if(!enable) return content;

    let fullfilepath = info.fullfilepath;
    let userconfig = getConfig.getUserConfig()
    
    if(isFirstJs(fullfilepath)){
        updateAllTplJson()
        let dir = pathutil.parse(__filename).dir;
        let srcpath = pathutil.resolve(dir, './code/default_script.js');
        let defaultjs = fs.readFileSync(srcpath, 'utf8')

        let alltpljson = `${JSON.stringify(CacheOfAllTpl)}`

        defaultjs += `;window.rk_offlinedev.userConfig=`+JSON.stringify(userconfig);
        defaultjs += `;window.rk_offlinedev.ALL_TPL_JSON=`+alltpljson;
        defaultjs += `\n//****** END *******//\n`

        content = defaultjs + content;
    }
    return content;
}
let depsCache = {};//缓存
let updateJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticRequests')
    if(!enable) return content;
    let fullfilepath = info.fullfilepath;
    if(fullfilepath.match(/\.min\.js/) || 
       fullfilepath.match(/\.bundle\.js/) || 
       fullfilepath.match(/\.sdk\.js/) 
      ){
        return content;
    }
    if(!isFirstJs(fullfilepath)){
        let fstate = fs.lstatSync(fullfilepath);
        let ctime36 = fstate.ctimeMs.toString(36);
        let mtime36 = fstate.mtimeMs.toString(36);
        let mc36 = mtime36+'-'+ctime36;

        let staticDir = getConfig.getStaticFolder();
        let sourceDir = getConfig.getSourceFolder();
    
        let fdir = pathutil.parse(fullfilepath).dir;
        let deps = [];
        let cache = depsCache[fullfilepath];
        if(cache && cache.mc36 === mc36){
            deps = cache.deps;
        }else{
            deps = regParserMini.getRequires(content);
            depsCache[fullfilepath] = {
                mc36,
                deps
            }
        }
        deps.forEach((info)=>{
            let req_path = info.rawPath;
            let req_realpath;
            if(req_path.match(/^\./)) {
                req_realpath = pathutil.resolve(fdir, req_path);
            }else{
                req_realpath = pathutil.resolve(sourceDir, req_path);
            }
            var replacereg = new RegExp('require[\\s]?[\(][\\s]{0,}(\'|")'+req_path+'(\'|")', 'g');
            if(req_path.match(/\.tpl$/)){
                if(fs.existsSync(req_realpath)){
                    let split = `,,,`
                    let pathid = pathutil.relative(sourceDir, req_realpath);
                    content = content.replace(replacereg, `require("${req_path}${split}${pathid}"`)    
                    // console.log(req_path, staticDir)
                    // console.log(fdir)
                    // console.log(req_realpath)
                    // console.log('pathid',pathid)
                }
            }else if(0){
                if(!fs.existsSync(req_realpath)) req_realpath = req_realpath + '.js';
                if(fs.existsSync(req_realpath)){
                    let pathid = pathutil.relative(sourceDir, req_realpath);
                    let hotpath = pathutil.parse(pathid).dir + '/__hot_folder.js'
                    content = content.replace(replacereg, `require("${hotpath}"`);
                }
            }
        });
    }

    return content;
}
let updateRouterJs = ()=>{
    
};
let updateI18nJs = ()=>{

};
module.exports = {
    isFirstJs,
    updateFirstJs,
    updateJs
};