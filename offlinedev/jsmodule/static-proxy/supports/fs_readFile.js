var fs = require('fs-extra');

let fs_readFile = (fpath, opt, cb)=>{
    let content;
    let err;
    try{
        content = fs.readFileSync(fpath, opt);
    }catch(e){
        err = e;
    }
    cb(err, content);
}

module.exports = {
    fs_readFile
}