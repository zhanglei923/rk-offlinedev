var getConfig = require('../../config/configUtil')
let updateScript_1st = require('./updateScript_1st')
let updateMyScript_1st = require('./concat/updateScript_1st')
let updateScript_Tpl = require('./updateScript_Tpl')
let updateScript_i18n = require('./updateScript_i18n')
let updateScript_CssUrl = require('./updateScript_CssUrl')
let injectSeaConfig = require('../../static-injects/injectContents/injectSeaConfig')
let enableLevel2Cache = getConfig.getValue('debug.autoCacheStaticLevel2');
let level2JsCache = {}//这里缓存处理过的js文本，如果内存消耗过高，建议关闭

let updateSource = function (req_path, info, jscontent){
    jscontent = updateScript_1st.updateJs(info, jscontent)
    jscontent = updateMyScript_1st.updateJs(info, jscontent)
    jscontent = injectSeaConfig.updateJs(info, jscontent);
    jscontent = updateScript_CssUrl.updateJs(info, jscontent)
    jscontent = updateScript_i18n.updateJs(info, jscontent)
    return jscontent;
}
module.exports = {
    updateSource
}