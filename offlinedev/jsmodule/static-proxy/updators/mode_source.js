var getConfig = require('../../config/configUtil')
let updateScript_1st = require('./updateScript_1st')
let updateScript_Tpl = require('./updateScript_Tpl')
let updateScript_i18n = require('./updateScript_i18n')
let updateScript_CmdConcat = require('./updateScript_CmdConcat')
let updateScript_CssUrl = require('./updateScript_CssUrl')
let enableLevel2Cache = getConfig.getValue('debug.autoCacheStaticLevel2');
let level2JsCache = {}//这里缓存处理过的js文本，如果内存消耗过高，建议关闭

let updateSource = function (req_path, info, jscontent){
    jscontent = updateScript_1st.updateJs(info, jscontent)
    let newMC36 = info.fileinfo.mc36;
    let level2needsupdate = (!level2JsCache[req_path] || (level2JsCache[req_path].mc36 !== newMC36))
    if(!enableLevel2Cache || level2needsupdate){
        //jscontent = updateScript_CmdConcat.updateJs(info, jscontent)
        jscontent = updateScript_CssUrl.updateJs(info, jscontent)

        level2JsCache[req_path] = {
            mc36: newMC36,
            jscontent
        }
        //console.log('level2')
    }else{
        jscontent = level2JsCache[req_path].jscontent;
    }
    //无论如何都要处理的
    jscontent = updateScript_Tpl.updateJs(info, jscontent)
    jscontent = updateScript_i18n.updateJs(info, jscontent)
    return jscontent;
}
module.exports = {
    updateSource
}