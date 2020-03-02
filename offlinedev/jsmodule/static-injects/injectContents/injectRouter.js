//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
var getConfig = require('../../config/configUtil')

let isRouter = (fpath)=>{ //src/main/webapp/static/router.js
    if(fpath.match(/static\/router\.js$/)){
        return true;
    }
    return false;
}
let inject_global_script;
let updateJs = (info, content)=>{        
    let fullfilepath = info.fullfilepath;
    if(!isRouter(fullfilepath)) return content;

    let sourceFolder = getConfig.getSourceFolder()
    let userconfig = getConfig.getUserConfig()
    let dir = pathutil.parse(__filename).dir;
    let srcpath = pathutil.resolve(dir, '../../static-injects/injectFiles/inject_global_script.js');
    if(!inject_global_script) inject_global_script = fs.readFileSync(srcpath, 'utf8')
    let defaultjs = inject_global_script;

    defaultjs += `\n;${getConfig.getValue('debug.mode')!=='source'?'SESSION.isDev = false;console.warn("[rk-offlinedev]切换到非dev状态：SESSION.isDev = false")':''};`;
    defaultjs += `\n;window.rk_offlinedev.userConfig=`+JSON.stringify(userconfig);
    defaultjs += `\n//****** END *******//\n`

    content = content +';\n'+ defaultjs;

    if(0){
        let jsHashMap = {}
        eachcontentjs.eachPath(sourceFolder,/\.(js|tpl|css)$/,(fpath)=>{
            let pathid = pathutil.relative(sourceFolder, fpath)
            //console.log(pathid)
            jsHashMap[pathid] = '666'
        })
        content = content +';\n'+ `window.jsHashMap=${JSON.stringify(jsHashMap)}`;
    }
    return content;
}
module.exports = {
    updateJs
};