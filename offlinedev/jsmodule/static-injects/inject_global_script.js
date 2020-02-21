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
window.rk_offlinedev_do_original_return=true;//需要在web的router.js的seajs.use(里，设成false，这样后面define函数就不走seajs的return了，便于聚合js代码
window.rk_offlinedev_pathid_cache = {}
window.rk_offlinedev_update_require = function(_require, pathid){
    let mypathid = pathid;
    let new_require = function(reqpath){
        let req_pathid;
        let alias;
        if(seajs.data.alias[reqpath]) {
            alias = reqpath;
            reqpath = seajs.data.alias[reqpath];
        }
        if(reqpath.match(/^\./)) {
            req_pathid = seajs.resolve(reqpath, mypathid)
        }else{
            req_pathid = reqpath;
        }
        if(!/\.tpl$|\.js$|\.css$|\.json$/ig.test(req_pathid)){
            req_pathid = req_pathid + '.js';
        }
        let url = seajs.resolve(req_pathid)
        let hehe = _require.apply(seajs, arguments)
        let returnObj = rk_offlinedev_pathid_cache[req_pathid];        
        return returnObj?returnObj:hehe;
    }
    for(let k in _require) new_require[k] = _require[k];
    return new_require;
};
let rk_offlinedev_OriginalDefine = define;
define = function(fun){
    let fun_str = fun.toString();
    let pathid;
    if(fun_str.indexOf("rk-$$$$$$$$$$")>=0){
        let header = fun_str.split("rk-$$$$$$$$$$")[0]
        let content = header.split("rk-^^^^^^^^^^")[1]
        let infostr = content.replace(/\"/g,'').replace(/\;/g,'')
        let info = JSON.parse(decodeURIComponent(infostr))
        pathid = info.pathid;
    }
    rk_offlinedev_OriginalDefine.apply(seajs, arguments);
    //console.log(pathid)
    if(rk_offlinedev_pathid_cache[pathid]) return rk_offlinedev_pathid_cache[pathid]
}
let rk_offlinedev_Original_seause = seajs.use;
seajs.use = function(srcs, callback, a0,a1,a2,a3,a4,a5,a6,a7){
    console.warn('[rk-offlinedev]已拦截seajs.use方法')
    let fun2 = function(){
        let args = arguments;
        callback.apply(seajs, args)
    }
    return rk_offlinedev_Original_seause.call(seajs, srcs, fun2, a0,a1,a2,a3,a4,a5,a6,a7)
}