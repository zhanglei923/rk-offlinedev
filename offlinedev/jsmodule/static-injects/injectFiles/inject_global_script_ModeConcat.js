/************
   这个文件是由rk-offlinedev动态注入的片段【开始】
*************/
//这个是为了篡改define
window.rk_offlinedev_debug_define = (fun)=>{
    if(typeof fun === 'function'){
        return fun()
    }else{
        return fun;
    }
 }
 window.rk_offlinedev_pathid_cache = {}
 window.rk_offlinedev_pathid_cache2 = {}
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
         if(rk_offlinedev_pathid_cache[req_pathid]) return rk_offlinedev_pathid_cache[req_pathid];
         if(rk_offlinedev_pathid_cache2[req_pathid]) return rk_offlinedev_pathid_cache2[req_pathid];
         let url = seajs.resolve(req_pathid)
         let hehe = _require.apply(seajs, arguments)
         rk_offlinedev_pathid_cache2[req_pathid] = hehe;
         let returnObj = rk_offlinedev_pathid_cache[req_pathid];        
         return returnObj?returnObj:hehe;
     }
     for(let k in _require) new_require[k] = _require[k];
     return new_require;
 };
 let rk_offlinedev_OriginalDefine = define;
 define = function(fun){
     //console.log(arguments[2])
     let arg2 = arguments[2];
     if(typeof arg2 === 'function') {
         let pathid = arguments[0];
         let old = arg2;
         //console.log(old);
         arg2 = function (_require, _exports, _module){
             let oldreq = _require;
             _require = function(a,b,c,d,e,f,g){
                 if(a.match(/\.tpl$/)) {
                     let tplid = seajs.resolve(a,pathid)
                     tplid = tplid.replace(/\.tpl\.js$/, '.tpl')
                     console.log(tplid);
                 }
                 return oldreq(a,b,c,d,e,f,g)
             }
             for(let fun in oldreq) _require[fun] = oldreq[fun].bind(oldreq)
             return old(_require, _exports, _module)
         }
         arguments[2] = arg2;
     }
 
     rk_offlinedev_OriginalDefine.apply(seajs, arguments);
     //console.log(pathid)
     //if(rk_offlinedev_pathid_cache[pathid]) return rk_offlinedev_pathid_cache[pathid]
 }
 //这几个pathid是被seajs.use用的，因此必须执行seajs默认的return模式，不能被拦截，否则seajs。use获取不到返回对象
 window.rk_offlinedev_shouldDoOriginalSeajsReturn = (pathid)=>{
     let used_pathid = [
         "core/rkloader.js", 
         "page/js/frame/pageMainCtrl.js", 
         "oldcrm/js/core/common-crm.js", 
         "platform/page/index/widget.js",
         "core/utils/i18n/process_data.js"
     ];
     return _.includes(used_pathid, pathid)
 }
 let rk_offlinedev_Original_seause = seajs.use;
 seajs.use = function(srcs, callback, a0,a1,a2,a3,a4,a5,a6,a7){
     let fun2 = function(){
         let args = arguments;
         callback.apply(seajs, args)
     }
     return rk_offlinedev_Original_seause.call(seajs, srcs, fun2, a0,a1,a2,a3,a4,a5,a6,a7)
 }
 console.warn('[rk-offlinedev]已拦截seajs.use方法');
 
 
 //*********************************************************************************/
 //   rk-offlinedev 注入一些辅助性代码
 //*********************************************************************************/
 (function(){
     var initRkOfflineDev = function(){
         var div = document.createElement('div');
         document.body.appendChild(div)
         div.setAttribute('id','rk-offlinediv')
         div.style.position='fixed';
         div.style['background-color']='#002520';
         div.style.color='#2fff56'
         div.style['font-size']= '11px';
         div.style.left='0px';
         div.style.bottom='0px';
         div.style.padding='0';
         div.style['z-index']='999998765';
   
         let webbranch = rk_offlinedev.userConfig.webProjectInfo.branch;
         let debugmode = rk_offlinedev.userConfig.debug.mode;
         debugmode = debugmode?debugmode:'?'
         div.innerHTML='<a style="color:#2fff56 !important;" href="http://localhost:666/offlinedev-http-console/" target="_blank">rk-offlinedev</a>,&nbsp;"'+debugmode+'",&nbsp;('+webbranch+')'
         console.warn('[rk-offlinedev]seajs-text注入成功')
     };
     initRkOfflineDev()
     // if(document.all) {   
     //   window.attachEvent('onload', initRkOfflineDev);   
     // }else{   
     //   window.addEventListener('load', initRkOfflineDev, false);   
     // }
   })()