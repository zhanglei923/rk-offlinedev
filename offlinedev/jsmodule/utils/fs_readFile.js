let fs = require('fs-extra');
let pathutil = require('path')
let rk = require('./rk')
let fpowerUtil = require('./fpowerUtil')
//let configUtil = require('../../config/configUtil')

global.rkCacheOf_File = {};

let me = {}
let getKey = (fullpath)=>{
    return rk_formatPath(fullpath);//.replace(/\/{1,}/g,',,,').replace(/\\{1,}/g,',,,');
}
let loadAllFiles = (rootpath)=>{

}
me.loadAllFiles = loadAllFiles;
let canCache = (fullpath)=>{
    //if(fullpath.match(/\.css$/)) return false;
    return true;
}
me.canCache = canCache;
let getFileMC36 = (fullpath)=>{
    return global.getFileMC36(fullpath);
};
let getStatMC36 = (fstate)=>{
    return global.getStatMC36(fstate);
};
let removeCache = (fpath)=>{
    fpath = rk_formatPath(fpath);
    let cachekey = getKey(fpath);
    delete global.rkCacheOf_File[cachekey]
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
    fpath = rk_formatPath(fpath);
    if(typeof opt.be_sync === 'undefined') opt.be_sync = false;
    (opt.be_sync?my_lstatSync:my_lstat)(fpath, (err, fstate)=>{
        if(err){ 
            cb({error: err}, null);
            return;
        }
        let mc36 = getStatMC36(fstate);
        let cachekey = getKey(fpath);
        //console.log(cachekey)
        if(global.rkCacheOf_File[cachekey] && 1){
            let memo = global.rkCacheOf_File[cachekey];
            if(memo.mc36 === mc36){
                //console.log('cc', global.rkCacheOf_File[cachekey])
                fpowerUtil.plusFilePower(fpath)
                cb(null, global.rkCacheOf_File[cachekey].content, {
                    fstate,
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
            if(!read_err && 1){
                fpowerUtil.plusFilePower(fpath)
                global.rkCacheOf_File[cachekey] = {
                    mc36,
                    content,
                    mightBeCmd,
                    isCmd
                };
            }
            cb(read_err, content, {
                fstate,
                isCached: false,
                mc36,
                mightBeCmd,
                isCmd
            });
        });
    });
}
me.getFileMC36 = getFileMC36;
me.getStatMC36 = getStatMC36;
me.fs_readFile = fs_readFile;
me.removeCache = removeCache;
me.getAllCache = ()=>{ return global.rkCacheOf_File; }
module.exports = me;