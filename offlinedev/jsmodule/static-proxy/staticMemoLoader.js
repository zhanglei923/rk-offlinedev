var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('./supports/fs_readFile')
var getConfig = require('../config/configUtil')
let updateScript_CmdConcat = require('./updators/updateScript_CmdConcat')
let load_hot_bundle_js = require('./staticMemo/load_hot_bundle_js')
let load_all_xsy_widgets_css = require('./staticMemo/load_all_xsy_widgets_css')
let load_all_bi_widgets_css = require('./staticMemo/load_all_bi_widgets_css')
let load_all_userdefinedmeasure_css = require('./staticMemo/load_all_userdefinedmeasure_css')
let load_all_lib_css = require('./staticMemo/load_all_lib_css')

let css_loaders = [
    load_all_xsy_widgets_css,
    load_all_bi_widgets_css,
    load_all_userdefinedmeasure_css
]

let webFolder = getConfig.getWebRoot()
let staticFolder = getConfig.getStaticFolder()
let sourceFolder = getConfig.getSourceFolder()
var webappFolder = getConfig.getWebAppFolder()

let isHotUrl = (url)=>{
    if(load_hot_bundle_js.isMyHotUrl(url)) {return true;}
    else if(load_all_xsy_widgets_css.isMyHotUrl(url)){return true;}
    else if(load_all_bi_widgets_css.isMyHotUrl(url)){return true;}
    else if(load_all_userdefinedmeasure_css.isMyHotUrl(url)){return true;}    
    //else if(load_all_lib_css.isMyHotUrl(url)){return true;}    
    return false;
}
let loadHotCss = (res, url)=>{
    for(let i=0;i<css_loaders.length;i++){
        let loader = css_loaders[i];
        if(loader.isMyHotUrl(url)){
            loader.load(webappFolder, (content)=>{
                res.send(content)
            })
            break;
        }
    }
}
let loadHotJs = (res, url)=>{
    if(load_hot_bundle_js.isMyHotUrl(url)){
        load_hot_bundle_js.load(webappFolder, url, (content)=>{
            if(content === null) {
                res.sendStatus(404).send(`Not Found: ${dir}`)
            }else{
                res.send(content)
            }
        })
        return;
    }
}
let me = {
    isHotUrl,
    loadHotCss,
    loadHotJs
}
module.exports = me;