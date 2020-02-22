var fs = require('fs');
var _ = require('lodash')
var pathutil = require('path');
var cacheUtil = require('./cacheUtil')

/**
 * 这里记录read文件的次数（也就是权重，power），权重越高，可以预先读取进内存
 * 1, 初始化时，默认把power值最小的一批清理掉，末位淘汰
 * 2，如果文件不再存在，则也清理掉
 * 
 * 【方案2】
 * 1，并不末尾淘汰，而是只缓存power值前80%的文件
 * 2，每次初始化时，清理掉不存在的文件
 * 
 */


if(!global.PowerCache) global.PowerCache = {}
const CACHE_NAME = 'requested_file_power'
let plusFilePower = (fullfilepath)=>{
    if(typeof global.PowerCache[fullfilepath] === 'undefined') global.PowerCache[fullfilepath] = 0;
    global.PowerCache[fullfilepath]++;
}
let loadPower = ()=>{

}
let getPowerData = ()=>{
    return global.PowerCache
}
let savePower = ()=>{
    for(let fpath in global.PowerCache){
        let pw = global.PowerCache[fpath];
        let fpathnickname = fpath.replace(/\/{1,}/g, '/');
        fpathnickname = fpathnickname.replace(/\/{1,}/g,'~~');
        cacheUtil.setCache(CACHE_NAME, fpathnickname, pw);
    }
    
}

let mytimer;
module.exports = {
    start:()=>{
        clearInterval(mytimer);
        console.log('[HEART BEAT] File Power')
        mytimer = setInterval(()=>{
            //console.log(new Date())
        }, 20*1000)        
    },
    plusFilePower,
    loadPower,
    savePower,
    getPowerData
}