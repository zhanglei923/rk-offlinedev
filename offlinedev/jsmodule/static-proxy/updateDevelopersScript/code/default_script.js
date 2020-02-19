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