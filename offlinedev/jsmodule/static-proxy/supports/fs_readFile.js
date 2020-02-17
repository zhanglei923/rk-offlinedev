let fs = require('fs-extra');
let MemoCache = {};

let fs_readFile = (fpath, opt, cb)=>{
    if(typeof cb === 'undefined') cb = ()=>{};
    if(!fs.existsSync(fpath)){
        cb(null);
        return null;
    }
    let content;
    let err;
    try{
        content = fs.readFileSync(fpath, opt);
    }catch(e){
        err = e;
    }
    cb(err, content);
    return content;
}
let fs_readFileSync = fs_readFile;

module.exports = {
    fs_readFile,
    fs_readFileSync
}