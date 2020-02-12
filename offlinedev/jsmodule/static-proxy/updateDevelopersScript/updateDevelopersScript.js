//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
var getConfig = require('../../config/configUtil')
let regParserMini = require('../../utils/seajs/regParserMini');

let isFirstJs = (fpath)=>{
    if(fpath.match(/seajs\/sea\.js$/)){
        return true;
    }
    return false;
}
let updateFirstJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticRequests')
    if(!enable) return content;

    let fullfilepath = info.fullfilepath;
    let userconfig = getConfig.getUserConfig()
    
    if(isFirstJs(fullfilepath)){
        let dir = pathutil.parse(__filename).dir;
        let srcpath = pathutil.resolve(dir, './code/default_script.js');
        let defaultjs = fs.readFileSync(srcpath, 'utf8')

        defaultjs += `window.rk_offlinedev.userConfig=`+JSON.stringify(userconfig)
        defaultjs += `\n//****** END *******//\n`

        content = defaultjs + content;
    }
    return content;
}
let updateJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticRequests')
    if(!enable) return content;

    let fullfilepath = info.fullfilepath;

    if(!isFirstJs(fullfilepath)){
        let staticDir = getConfig.getStaticFolder();
        let sourceDir = getConfig.getSourceFolder();
    
        let fdir = pathutil.parse(fullfilepath).dir;
        let deps = regParserMini.getRequires(content);
        deps.forEach((req_path)=>{
            if(req_path.match(/\.tpl$/)){
                let req_realpath;
                if(req_path.match(/^\./)) {
                    req_realpath = pathutil.resolve(fdir, req_path)
                }else{
                    req_realpath = pathutil.resolve(staticDir, req_path)
                }
                if(fs.existsSync(req_realpath)){
                    let replacereg = new RegExp(`[\"|\']${req_path}[\"|\']`);
                    let pathid = pathutil.relative(sourceDir, req_realpath);                
                    content = content.replace(replacereg, `"${req_path}(${pathid})"`)
    
                    console.log(req_path, staticDir)
                    console.log(fdir)
                    console.log(req_realpath)
                    console.log('pathid',pathid)
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