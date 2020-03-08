/******************************************************************** 
  以下是从rk-offlinedev注入的代码逻辑
*********************************************************************/
;
let sea_cfg = seajs.config();
sea_cfg.debug = false;
//sea_cfg.base = SESSION.resDomain + '/frontend/static/deploy/';
sea_cfg.base = SESSION.resDomain + '/static/source/';
var vMap = /*map start*/ {} /*map end*/ ;
var release_timestamp;
if(window.jsHashMap) {
    vMap = window.jsHashMap;
    cacheForAdmin(window.jsHashMap)
    release_timestamp = window.jsHashMap.release_timestamp;
}
sea_cfg.map = [function(uri) {
    var id = uri.split('/static/source/')[1];
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