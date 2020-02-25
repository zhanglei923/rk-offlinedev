//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../utils/rk')
let fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')
let regParserMini = require('../../utils/seajs/regParserMini');
let seajsUtil = require('../../utils/seajs/seajsUtil');

let updateJs = (info, content, widthDefineHeader)=>{
    if(typeof widthDefineHeader === 'undefined') widthDefineHeader = true;
    let enable = getConfig.getValue('debug.concatStaticCssRequests')
    if(!enable) return content;

    if(info.fullfilepath.indexOf('source')<=0) return content;//不是source目录里的
    let fullfilepath = info.fullfilepath;

    let sourcepath = info.sourceFolder;

    let pathid = info.pathid;
    if(!rk.isCookedJsPath(fullfilepath) && !rk.isLibJsPath(fullfilepath) && rk.mightBeCmdFile(content)){
    
        //fs.writeFileSync(fullfilepath, newcontent)
        let thisfileinfo = global.rkFileDepsCache[fullfilepath]
        let deps = thisfileinfo.deps;
        let sourceDir = getConfig.getSourceFolder();
        deps.forEach((info)=>{
            let req_path = info.rawPath;
            let req_realpath = seajsUtil.resolveRequirePath(sourceDir, fullfilepath, req_path);
            var replacereg = seajsUtil.getRequireRegForReplacement(req_path);
            if(req_realpath.match(/\.js$/)){

            }
        });
        return newcontent;
    }


    return content;
}
module.exports = {
    updateJs
};