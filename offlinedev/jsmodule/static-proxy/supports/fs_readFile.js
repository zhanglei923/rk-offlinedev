let fs = require('fs-extra');
global.FileMemoCache = {};

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
                return;
            }
        }
        // let content;
        // let read_err;
        fs.readFile(fpath, opt, (read_err, content)=>{
            if(!read_err){
                global.FileMemoCache[cachekey] = {
                    ctime36,
                    mtime36,
                    content
                };
            }
            cb(read_err, content);
        });
    });
}

module.exports = {
    fs_readFile
}