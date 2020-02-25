//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
let is_path_inside = require('is-path-inside')
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
            if(req_realpath.match(/\.css$/)){
                let bi_path = pathutil.resolve(sourceDir, './products/bi')
                if(is_path_inside(req_realpath, bi_path)){
                    var replacereg = seajsUtil.getRequireRegForReplacement(req_path);
                    content = content.replace(replacereg, `require("platform/core/css/all-bi-widgets_HOT.css"`)    
                    //console.log()
                }
                //console.log(req_realpath)
            }
        });
        if(content.indexOf('all-xsy-widgets.css')>=0) content = content.replace(/all-xsy-widgets\.css/g, 'all-xsy-widgets_HOT.css')
    }


    return content;
}
module.exports = {
    updateJs
};