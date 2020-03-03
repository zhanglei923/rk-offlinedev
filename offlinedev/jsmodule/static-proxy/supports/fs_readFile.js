let fs = require('fs-extra');
let pathutil = require('path')
let rk = require('../../utils/rk')
let fpowerUtil = require('../../utils/fpowerUtil')
let configUtil = require('../../config/configUtil')

global.FileMemoCache = {};

let me = {}
let getKey = (fullpath)=>{
    return pathutil.normalize(fullpath);//.replace(/\/{1,}/g,',,,').replace(/\\{1,}/g,',,,');
}
let loadAllFiles = (rootpath)=>{

}
me.loadAllFiles = loadAllFiles;
let canCache = (fullpath)=>{
    //if(fullpath.match(/\.css$/)) return false;
    return true;
}
me.canCache = canCache;
let getMC36 = (fstate)=>{
    let ctime36 = fstate.ctimeMs.toString(36);
    let mtime36 = fstate.mtimeMs.toString(36);
    let mc36 = mtime36+'-'+ctime36;
    return mc36;
};
let removeCache = (fpath)=>{
    let cachekey = getKey(fpath);
    delete global.FileMemoCache[cachekey]
};
let my_lstat = (fpath, callback)=>{//屏蔽同步和异步
    return fs.lstat(fpath, callback);
};
let my_lstatSync = (fpath, callback)=>{//屏蔽同步和异步
    let fstate;
    let isok = true;
    try{
        fstate = fs.lstatSync(fpath);
        callback(null, fstate)
    }catch(e){
        isok = false;
        callback(e, null);
    }
};
let my_readFile = (fpath, opt, callback)=>{//屏蔽同步和异步
    return fs.readFile(fpath, opt, callback);
};
let my_readFileSync = (fpath, opt, callback)=>{//屏蔽同步和异步
    let content;
    let isok = true;
    try{
        content = fs.readFileSync(fpath, opt);
        callback(null, content)
    }catch(e){
        isok = false;
        callback(e, null);
    }
};
let fs_readFile = (fpath, opt, cb)=>{
    if(typeof cb === 'undefined') cb = ()=>{};
    if(!fs.existsSync(fpath)){
        cb({error: 'file not found'}, null);
        return null;
    }
    if(typeof opt.be_sync === 'undefined') opt.be_sync = false;
    (opt.be_sync?my_lstatSync:my_lstat)(fpath, (err, fstate)=>{
        if(err){ 
            cb({error: 'file stat error'}, null);
            return;
        }
        let mc36 = getMC36(fstate);
        let cachekey = getKey(fpath);
        //console.log(cachekey)
        if(global.FileMemoCache[cachekey] && configUtil.getValue('debug.autoCacheStatic')){
            let memo = global.FileMemoCache[cachekey];
            if(memo.mc36 === mc36){
                //console.log('cc', global.FileMemoCache[cachekey])
                fpowerUtil.plusFilePower(fpath)
                cb(null, global.FileMemoCache[cachekey].content, {
                    isCached: true,
                    mc36: memo.mc36,
                    mightBeCmd: memo.mightBeCmd,
                    isCmd: memo.isCmd
                });
                return;
            }
        }
        // let content;
        // let read_err;
        (opt.be_sync?my_readFileSync:my_readFile)(fpath, opt, (read_err, content)=>{
            let isCmd = rk.isCmdFile(content)
            let mightBeCmd = rk.mightBeCmdFile(content)
            if(canCache(fpath))
            if(!read_err && configUtil.getValue('debug.autoCacheStatic')){
                fpowerUtil.plusFilePower(fpath)
                global.FileMemoCache[cachekey] = {
                    mc36,
                    content,
                    mightBeCmd,
                    isCmd
                };
            }
            cb(read_err, content, {
                isCached: false,
                mc36,
                mightBeCmd,
                isCmd
            });
        });
    });
}
me.fs_readFile = fs_readFile;
me.removeCache = removeCache;
me.getAllCache = ()=>{ return global.FileMemoCache; }
module.exports = me;