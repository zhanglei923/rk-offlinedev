var fs = require('fs');
var _ = require('lodash');
let pathutil = require('path')
var blueimp_md5 = require("blueimp-md5")//https://github.com/blueimp/JavaScript-MD5
let makeDir = require('make-dir')
let eachcontentjs = require('eachcontent-js')
let auxiliary = require('../../jsmodule/config/auxiliary')

let cache_folder = auxiliary.tmpFolder;
console.log(`[TMP]${cache_folder}`)

let getFolder = (cacheType)=>{
    if(!fs.existsSync(cache_folder)){
        console.log(`cache_folder ${cache_folder} not exist.`);
        return;
    }
    let folder = `${cache_folder}/${cacheType}`;
    if(!fs.existsSync(folder)) fs.mkdirSync(folder);
    return folder;
}
let listCacheFiles = (cacheType)=>{
    let folder = getFolder(cacheType)
    if(!folder) return;
    if(!fs.existsSync(folder)) return;
    let pathlist = []
    eachcontentjs.eachPath(folder, /\.cache$/, (fpath)=>{
        pathlist.push(fpath);
    })
    return pathlist;
}
let setCache = (cacheType, id, content)=>{
    let folder = getFolder(cacheType)
    if(!folder) return;
    let fpath = `${folder}/${id}.cache`;
    fs.writeFileSync(fpath, content);
}
let getCache = (cacheType, id)=>{
    let folder = getFolder(cacheType, id)
    if(!folder) return;
    let fpath = `${folder}/${id}.cache`;
    if(!fs.existsSync(fpath)) return null;
    let content = fs.readFileSync(fpath, 'utf8')
    return content;
}
let removeCache = (cacheType, id)=>{
    let folder = getFolder(cacheType, id)
    if(!folder) return;
    let fpath = `${folder}/${id}.cache`;
    fs.unlinkSync(fpath, ()=>{

    });
}

let reportStatus = ()=>{
    let totalsize = 0;
    eachcontentjs.eachStatus(cache_folder, /./, (status, path)=>{
        totalsize += status.size;
    })
    return {
        cache_folder,
        totalCacheSize: totalsize,
        totalCacheSizeMB: (totalsize/1024/1024).toFixed(2),
    }
}

module.exports = {
    md5:(str)=>{
        str = str ? str : '';
        return blueimp_md5(str);
    },
    cache_folder,
    setCache,
    getCache,
    listCacheFiles,
    removeCache,
    reportStatus
}