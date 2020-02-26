var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('./supports/fs_readFile')
var getConfig = require('../config/configUtil')
let updateScriptForCmdConcat = require('./updators/updateScriptForCmdConcat')
let load_hot_bundle_js = require('./staticMemo/load_hot_bundle_js')
let load_all_xsy_widgets_css = require('./staticMemo/load_all_xsy_widgets_css')
let load_all_bi_widgets_css = require('./staticMemo/load_all_bi_widgets_css')
let load_all_products_userdefinedmeasure_css = require('./staticMemo/load_all_products_userdefinedmeasure_css')
let load_all_lib_css = require('./staticMemo/load_all_lib_css')


let webFolder = getConfig.getWebRoot()
let staticFolder = getConfig.getStaticFolder()
let sourceFolder = getConfig.getSourceFolder()
var webappFolder = getConfig.getWebAppFolder()

let isHotUrl = (url)=>{
    if(load_hot_bundle_js.isMyHotUrl(url)) {return true;}
    else if(load_all_xsy_widgets_css.isMyHotUrl(url)){return true;}
    else if(load_all_bi_widgets_css.isMyHotUrl(url)){return true;}
    else if(load_all_products_userdefinedmeasure_css.isMyHotUrl(url)){return true;}    
    //else if(load_all_lib_css.isMyHotUrl(url)){return true;}    
    return false;
}
let loadHotCss = (res, url)=>{
    if(load_all_xsy_widgets_css.isMyHotUrl(url)){
        load_all_xsy_widgets_css.load(webappFolder, (content)=>{
            res.send(content)
        })
        return;
    }else if(load_all_bi_widgets_css.isMyHotUrl(url)){
        load_all_bi_widgets_css.load(webappFolder, (content)=>{
            res.send(content)
        })
        return;
    }else if(load_all_products_userdefinedmeasure_css.isMyHotUrl(url)){
        load_all_products_userdefinedmeasure_css.load(webappFolder, (content)=>{
            res.send(content)
        })
        return;
    }
    // else if(load_all_lib_css.isMyHotUrl(url)){
    //     load_all_lib_css.load(webappFolder, (content)=>{
    //         res.send(content)
    //     })
    //     return;
    // }
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