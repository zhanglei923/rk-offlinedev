let fs = require('fs-extra');
global.FileMemoCache = {};

let fs_readFile = (fpath, opt, cb)=>{
    if(typeof cb === 'undefined') cb = ()=>{};
    if(!fs.existsSync(fpath)){
        cb({
            error: 'file not found'
        }, null);
        return null;
    }
    let fstate = fs.lstatSync(fpath);
    let ctime = fstate.ctimeMs;
    let ctime36 = ctime.toString(36);
    let mtime = fstate.mtimeMs;
    let mtime36 = mtime.toString(36);
    let cachekey = fpath;
    //console.log(cachekey)
    if(global.FileMemoCache[cachekey]){
        let memo = global.FileMemoCache[cachekey];
        if(memo.mtime36 === mtime36 && memo.ctime36 === ctime36){
            //console.log('cc', global.FileMemoCache[cachekey])
            cb(null, global.FileMemoCache[cachekey].content);
            return global.FileMemoCache[cachekey].content;
        }
    }
    let content;
    let err;
    try{
        content = fs.readFileSync(fpath, opt);
    }catch(e){
        err = e;
    }
    global.FileMemoCache[cachekey] = {
        ctime36,
        mtime36,
        content
    };
    cb(err, content);
    return content;
}
let fs_readFileSync = fs_readFile;

module.exports = {
    fs_readFile,
    fs_readFileSync
}