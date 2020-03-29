let fs = require('fs-extra');
let pathutil = require('path')
const urlParser = require('url');


//用到的地方太多，直接注册到global了
global.rk_formatPath = (fpath)=>{
    fpath = fpath.replace(/\\{1,}/g, '/').replace(/\/{1,}/g, '/')
    return fpath;
}
global.rk_getPathId = (fullfilepath)=>{
    fullfilepath = global.rk_formatPath(fullfilepath);
    // let pathid = fullfilepath.split('/static/source/')[1];
    // return pathid;
    fullfilepath = global.rk_formatPath(fullfilepath);
    let arr = fullfilepath.split('/static/source/');
    arr.shift();
    let pathid = arr.join('/static/source/');
    return pathid;
};
global.rk_getSourceDir = (fpath)=>{
    fpath = rk_formatPath(fpath);
    if(fpath.indexOf('/static/')<0)return null;
    let arr = fpath.split('/static/');
    let base = arr[0];
    return base + '/static/source';
};
global.rk_formatLineBreaker = (content)=>{
    if(!content) return content;
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};
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
    let fsize36 = fstate.size.toString(36);
    let mc36 = mtime36+'-'+ctime36+'-'+fsize36;
    return mc36;
};
global.getFileMC36 = getFileMC36;
global.getStatMC36 = getStatMC36;
module.exports = {};