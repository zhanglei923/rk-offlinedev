var fs = require('fs');
var pathutil = require('path');
var getConfig = require('../config/configUtil')
let updateScript_CmdConcat = require('./updators/updateScript_CmdConcat')
let load_hot_bundle_js = require('./staticHot/load_hot_bundle_js')
let load_hot_concat_js = require('./staticHot/load_hot_concat_js')
let load_hot_deploybundles = require('./staticHot/load_hot_deploybundles')

let load_all_xsy_widgets_css = require('./staticHot/load_all_xsy_widgets_css')
let load_all_bi_widgets_css = require('./staticHot/load_all_bi_widgets_css')
let load_all_userdefinedmeasure_css = require('./staticHot/load_all_userdefinedmeasure_css')
let load_all_productscommon_css = require('./staticHot/load_all_productscommon_css')
let load_all_lib_css = require('./staticHot/load_all_lib_css')

let css_loaders = [
    load_all_xsy_widgets_css,
    load_all_bi_widgets_css,
    load_all_productscommon_css,
    load_all_userdefinedmeasure_css
]

let webFolder = getConfig.getWebRoot()
let staticFolder = getConfig.getStaticFolder()
let sourceFolder = getConfig.getSourceFolder()
var webappFolder = getConfig.getWebAppFolder()

let isHotUrl = (url)=>{
    if(load_hot_bundle_js.isMyHotUrl(url)) {return true;}
    if(load_hot_concat_js.isMyHotUrl(url)) {return true;}
    if(load_hot_deploybundles.isMyHotUrl(url)) {return true;}    
    let is = false;
    for(let i=0;i<css_loaders.length;i++){
        let loader = css_loaders[i];
        if(loader.isMyHotUrl(url)){
            is = true;
            break;
        }
    }
    return is;
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
    if(load_hot_deploybundles.isMyHotUrl(url)){
        load_hot_deploybundles.load({sourceFolder, webappFolder}, url, (content)=>{
            if(content === null) {
                res.sendStatus(404)//.send(`Not Found: ${url}`)
            }else{
                res.send(content)
            }
        })
        return;
    }else 
    if(load_hot_concat_js.isMyHotUrl(url)){
        load_hot_concat_js.load({sourceFolder, webappFolder}, url, (content)=>{
            if(content === null) {
                res.sendStatus(404)//.send(`Not Found: ${url}`)
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