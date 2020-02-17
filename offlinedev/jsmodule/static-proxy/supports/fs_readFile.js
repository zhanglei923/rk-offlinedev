var fs = require('fs-extra');

let fs_readFile = (fpath, opt, cb)=>{
    if(typeof cb === 'undefined') cb = ()=>{};
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