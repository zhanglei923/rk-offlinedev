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
    let fullfilepath = info.fullfilepath;
    let sourcepath = info.sourceFolder;

    return deploycontent;
}
let updateTpl = (info, content)=>{
    let fullfilepath = info.fullfilepath;
    let sourcepath = info.sourceFolder;

    return deploycontent;
}
module.exports = {
    updateJs,
    updateTpl
};