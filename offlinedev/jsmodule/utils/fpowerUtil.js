var fs = require('fs');
var _ = require('lodash')
var blueimp_md5 = require("blueimp-md5")
let is_path_inside = require('is-path-inside')
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
 * 
 * 启动加载时，只加载当前web目录下的文件！
 */


if(!global.PowerCache) global.PowerCache = {}
const CACHE_NAME = 'requested_file_power'
let plusFilePower = (fullfilepath)=>{
    if(typeof global.PowerCache[fullfilepath] === 'undefined') global.PowerCache[fullfilepath] = 0;
    global.PowerCache[fullfilepath]++;
}
let isInside = (rootList, fullfilepath)=>{
    let isin = false;
    for(let i=0;i<rootList.length;i++){
        if(is_path_inside(fullfilepath, rootList[i])){
            isin = true;
            break;
        }
    }
    return isin;
}
let loadPower = (rootList)=>{
    let cacheidlist = cacheUtil.listCacheId(CACHE_NAME)
    if(!cacheidlist) return;
    global.PowerCache = {}
    cacheidlist.forEach((cacheid)=>{
        let content = cacheUtil.getCache(CACHE_NAME, cacheid)
        let data = JSON.parse(content);
        let fullfilepath = data.fpath;
        if(fs.existsSync(fullfilepath)){
            if(isInside(rootList, fullfilepath)){
                let power = data.power;
                global.PowerCache[fullfilepath] = power*1;
            }
        }else{
            cacheUtil.removeCache(cacheid);
        }
    })
}
let getPowerData = ()=>{
    return global.PowerCache
}
let savePower = ()=>{
    for(let fpath in global.PowerCache){
        let power = global.PowerCache[fpath];
        let hashid = blueimp_md5(fpath)
        //setTimeout(()=>{
            cacheUtil.setCache(CACHE_NAME, hashid, JSON.stringify({
                fpath,
                power
            }));
        //},0)
    }    
    //console.log('saved')
}
let mytimer;
let startTimer = ()=>{
    clearTimeout(mytimer);
    mytimer = setTimeout(()=>{
        savePower();
        startTimer();
    }, 60*1000)
}
module.exports = {
    startTimer,
    plusFilePower,
    loadPower,
    savePower,
    getPowerData
}