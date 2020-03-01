//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
var getConfig = require('../../config/configUtil')

let isFirstJs = (fpath)=>{
    if(fpath.match(/seajs\/sea\.js$/)){
        return true;
    }
    return false;
}
let updateFirstJs = (info, content)=>{        
    let fullfilepath = info.fullfilepath;
    if(isFirstJs(fullfilepath)){
        let sourceFolder = getConfig.getSourceFolder()
        let userconfig = getConfig.getUserConfig()
        let dir = pathutil.parse(__filename).dir;
        let srcpath = pathutil.resolve(dir, '../../static-injects/injectFiles/inject_global_script.js');
        let defaultjs = fs.readFileSync(srcpath, 'utf8')

        defaultjs += `\n;${getConfig.getValue('debug.mode')!=='source'?'SESSION.isDev = false;console.warn("[rk-offlinedev]切换到非dev状态")':''};`;
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
    }
    return content;
}
module.exports = {
    updateFirstJs
};