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

let updateJs = (info, content)=>{
    let fullfilepath = info.fullfilepath;
    let sourcepath = info.sourceFolder;

    let alias = global.rkGlobalConfig.runtime.seajsConfig.alias;
    let deploycontent = seajsUtil.changeJsToDeploy(sourcepath, fullfilepath, alias, content)
    return deploycontent;
}
let updateTpl = (info, content)=>{
    let fullfilepath = info.fullfilepath;
    let sourcepath = info.sourceFolder;

    let deploycontent = seajsUtil.changeTplToDeploy(sourcepath, fullfilepath, content)
    return deploycontent;
}
module.exports = {
    updateJs,
    updateTpl
};