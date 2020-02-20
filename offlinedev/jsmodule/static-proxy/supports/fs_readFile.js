let fs = require('fs-extra');
let pathutil = require('path')
let configUtil = require('../../config/configUtil')

global.FileMemoCache = {};

let me = {}
let getKey = (fullpath)=>{
    return pathutil.normalize(fullpath).replace(/\/{1,}/g,',,,').replace(/\\{1,}/g,',,,');
}
let loadAllFiles = (rootpath)=>{

}
me.loadAllFiles = loadAllFiles;
let canCache = (fullpath)=>{
    //if(fullpath.match(/\.css$/)) return false;
    return true;
}
me.canCache = canCache;
let fs_readFile = (fpath, opt, cb)=>{
    if(typeof cb === 'undefined') cb = ()=>{};
    if(!fs.existsSync(fpath)){
        cb({error: 'file not found'}, null);
        return null;
    }
    fs.lstat(fpath, (err, fstate)=>{
        if(err){ 
            cb({error: 'file stat error'}, null);
            return;
        }
        let ctime36 = fstate.ctimeMs.toString(36);
        let mtime36 = fstate.mtimeMs.toString(36);
        let mc36 = mtime36+'-'+ctime36;
        let cachekey = getKey(fpath);
        //console.log(cachekey)
        if(global.FileMemoCache[cachekey] && configUtil.getValue('debug.cacheStaticRequests')){
            let memo = global.FileMemoCache[cachekey];
            if(memo.mc36 === mc36){
                //console.log('cc', global.FileMemoCache[cachekey])
                cb(null, global.FileMemoCache[cachekey].content, {
                    isCached: true,
                    mc36: memo.mc36
                });
                return;
            }
        }
        // let content;
        // let read_err;
        fs.readFile(fpath, opt, (read_err, content)=>{
            if(canCache(fpath))
            if(!read_err && configUtil.getValue('debug.cacheStaticRequests')){
                global.FileMemoCache[cachekey] = {
                    mc36,
                    content
                };
            }
            cb(read_err, content, {
                isCached: false,
                mc36
            });
        });
    });
}
me.fs_readFile = fs_readFile;
module.exports = me;