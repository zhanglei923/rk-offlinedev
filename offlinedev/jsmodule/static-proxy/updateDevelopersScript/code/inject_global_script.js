/************
   这个文件是由rk-offlinedev动态注入的片段【开始】
*************/
console.warn('[rk-offlinedev]离线开发模式')
window.rk_offlinedev = {}
//这个是为了篡改define
window.rk_offlinedev_debug_define = (fun)=>{
   if(typeof fun === 'function'){
       return fun()
   }else{
       return fun;
   }
}
window.rk_offlinedev_pathid_cache = {}
window.rk_offlinedev_update_require = function(_require, pathid){
    let mypathid = pathid;
    let new_require = function(reqpath){
        let req_pathid;
        if(seajs.data.alias[reqpath]) reqpath = seajs.data.alias[reqpath];
        if(reqpath.match(/^\./)) {
            req_pathid = seajs.resolve(reqpath, mypathid)
        }else{
            req_pathid = reqpath;
        }
        let url = seajs.resolve(req_pathid)
        let returnObj = rk_offlinedev_pathid_cache[req_pathid];
        //if(returnObj)console.log(req_pathid, returnObj)
        
        return returnObj ? returnObj : _require.apply(seajs, arguments)
    }
    for(let k in _require) new_require[k] = _require[k];
    return new_require;
};
let rk_offlinedev_TmpDefine = define;
define = function(){
    return rk_offlinedev_TmpDefine.apply(seajs, arguments);
}