//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
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
        let userconfig = getConfig.getUserConfig()
        let dir = pathutil.parse(__filename).dir;
        let srcpath = pathutil.resolve(dir, '../../static-injects/inject_global_script.js');
        let defaultjs = fs.readFileSync(srcpath, 'utf8')

        defaultjs += `\n;window.rk_offlinedev.userConfig=`+JSON.stringify(userconfig);
        defaultjs += `\n//****** END *******//\n`

        content = content +';\n'+ defaultjs;
    }
    return content;
}
module.exports = {
    updateFirstJs
};