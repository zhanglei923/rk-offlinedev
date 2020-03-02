//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
var getConfig = require('../../config/configUtil')

let isMe = (fpath)=>{ //src/main/webapp/static/router.js
    if(fpath.match(/static\/sea\-config\.js$/)){
        return true;
    }
    return false;
}
let updateJs = (info, content)=>{        
    let fullfilepath = info.fullfilepath;
    if(!isMe(fullfilepath)) return content;
    if(getConfig.getValue('debug.concat') !== 'concat') return content;

    let script = `;
            let sea_cfg = seajs.config();
            sea_cfg.debug = false;
            //sea_cfg.base = SESSION.resDomain + '/frontend/static/deploy/';
            sea_cfg.base = SESSION.resDomain + '/static/deploy/';
            var vMap = /*map start*/ {} /*map end*/ ;
            var release_timestamp;
            if(window.jsHashMap) {
                vMap = window.jsHashMap;
                cacheForAdmin(window.jsHashMap)
                release_timestamp = window.jsHashMap.release_timestamp;
            }
            sea_cfg.map = [function(uri) {
                var id = uri.split('/static/deploy/')[1];
                var hashid = vMap[id];
                if(true){
                    var olduri = uri;
                    uri = uri.replace(/\.\w+$/, function(a){
                        return '.' + hashid + a
                    })
                    return vMap[id] ? 
                        uri : 
                        release_timestamp ? 
                            olduri + '?' + release_timestamp : 
                            olduri ;
                }else{
                    return vMap[id] ? [uri, vMap[id]].join('?') : uri;
                }
            }];
            seajs.config(sea_cfg)
            console.warn('[rk-offlinedev]更新了sea-config的逻辑');
    `;
    //console.log('[rk-offlinedev]更新了sea-config的逻辑')
    content += script;
    return content;
}
module.exports = {
    updateJs
};