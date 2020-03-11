let fs = require('fs-extra');
let pathutil = require('path')
const urlParser = require('url');


//用到的地方太多，直接注册到global了
global.rk_formatPath = (fpath)=>{
    fpath = fpath.replace(/\\{1,}/g, '/').replace(/\/{1,}/g, '/')
    return fpath;
}
global.rk_formatLineBreaker = (content)=>{
    if(!content) return content;
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}
global.rk_formatMB = function(bytes, tail) {
    if(typeof tail === 'undefined') tail = 1;
    return (bytes/1024/1024).toFixed(tail); 
};
let getFileMC36 = (fullpath)=>{
    fstate = fs.lstatSync(fullpath);
    let mc36 = getStatMC36(fstate);
    return mc36;
};
let getStatMC36 = (fstate)=>{
    let ctime36 = fstate.ctimeMs.toString(36);
    let mtime36 = fstate.mtimeMs.toString(36);
    let mc36 = mtime36+'-'+ctime36;
    return mc36;
};
global.getFileMC36 = getFileMC36;
global.getStatMC36 = getStatMC36;
module.exports = {};