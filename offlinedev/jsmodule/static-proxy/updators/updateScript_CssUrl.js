//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
let is_path_inside = require('is-path-inside')
let rk = require('../../utils/rk')
let fs_readFile = require('../../utils/fs_readFile')
var getConfig = require('../../config/configUtil')
let regParserMini = require('../../utils/seajs/regParserMini');
let seajsUtil = require('../../utils/seajs/seajsUtil');
let load_all_bi_widgets_css = require('../staticHot/load_all_bi_widgets_css')
let load_all_productscommon_css = require('../staticHot/load_all_productscommon_css')
let load_all_xsy_widgets_css = require('../staticHot/load_all_xsy_widgets_css')
let load_all_userdefinedmeasure_css = require('../staticHot/load_all_userdefinedmeasure_css')
let load_all_lib_css = require('../staticHot/load_all_lib_css')

let css_loaders = [
    load_all_xsy_widgets_css,
    load_all_bi_widgets_css,
    load_all_productscommon_css,
    load_all_userdefinedmeasure_css
]
let changeToHotPath = (fullfilepath, req_path)=>{
    //let sourceDir = getConfig.getSourceFolder();
    let req_realpath = seajsUtil.resolveRequirePath(fullfilepath, req_path);
    //let req_pathid = pathutil.relative(sourceDir, req_realpath)
    let hotpathid;
    
    for(let i = 0; i < css_loaders.length; i++){
        let loader = css_loaders[i];
        hotpathid = loader.shouldReplacedWithThis(req_realpath);
        if(hotpathid){
            break;
        }
    }
    return hotpathid;
};
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
        let thisfileinfo = seajsUtil.getFileDeps(sourcepath, fullfilepath, content)//global.rkCacheOf_seajsFileDeps[fullfilepath]
        let deps = thisfileinfo.deps;
        //let sourceDir = getConfig.getSourceFolder();
        deps.forEach((info)=>{
            let req_path = info.rawPath;
            let req_realpath = seajsUtil.resolveRequirePath(fullfilepath, req_path);
            let req_pathid = global.rk_getPathId(req_realpath);//pathutil.relative(sourceDir, req_realpath)
            let hotpathid = changeToHotPath(fullfilepath, req_path);
            
            if(hotpathid){
                let replacereg = seajsUtil.getRequireRegForReplacement(req_path);
                content = content.replace(replacereg, `require("${hotpathid}"`);
                if(getConfig.getValue('debug.mode') === 'concat'){
                    replacereg = new RegExp('"'+req_pathid+'"', 'g');
                    content = content.replace(replacereg, `"${hotpathid}"`);
                }
            }

        });
        //if(content.indexOf('all-xsy-widgets.css')>=0) content = content.replace(/all-xsy-widgets\.css/g, 'all-xsy-widgets_HOT.css')
    }


    return content;
}
module.exports = {
    updateJs,
    changeToHotPath
};