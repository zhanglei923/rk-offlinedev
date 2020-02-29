var fs = require('fs');
var pathutil = require('path');
let projectFileSearch = require('./projectFileSearch')
let deploydebug = require('../../../../offlinedev/deployDebug/deployDebug')
let configUtil = require('../../config/configUtil')
let prettifyFilePath = (fpath)=>{
    fpath = fpath.replace(/\/{1,}/g, '/');
    fpath = fpath.replace(/\\{1,}/g, '/');
    return fpath;
};
module.exports = {
    findPath:(rootFolder, path)=>{
        //console.log(path)
        let fromSubPrj = null;
        var fullfilepath = rootFolder + '/' + path;
        
        //可能是线上含hash的路径，如果是，自动转接到不含hash的路径上去
        let hashReg = /\.[a-z0-9]{7}\.(tpl|js|css)$/;
        if(!fs.existsSync(fullfilepath) && path.match(hashReg)){
            let path2 = path.replace(hashReg, (str)=>{
                let str2 = str;
                if(str.match(/\.tpl$/)) {str2 = str2.replace(/\.[a-z0-9]{7}\.tpl$/, '.tpl')}
                if(str.match(/\.js$/)) {str2 = str2.replace(/\.[a-z0-9]{7}\.js$/, '.js')}
                if(str.match(/\.css$/)) {str2 = str2.replace(/\.[a-z0-9]{7}\.css$/, '.css')}
                return str2;
            })
            fullfilepath = rootFolder + '/' + path2;
        }
        //支持admin工程
        if(path.match(/^\/admin\//)){
            let admin_webappFolder = configUtil.getAllPathInfo().admin_webappFolder;
            let fullfilepath = admin_webappFolder + '/' + path.replace(/^\/admin\//, '/');
            //console.log(fullfilepath)
            if(!fs.existsSync(fullfilepath)) return;
            fullfilepath = prettifyFilePath(fullfilepath);
            return {
                fullfilepath,
                fromSubPrj
            }
        }
        //去子工程里找
        if(!fs.existsSync(fullfilepath)){
            let o = projectFileSearch.searchFile(path)
            if(o) {
                fromSubPrj = o.project;
                fullfilepath = o.fpath;
            }
        }
        //去外面的deploy目录下找
        if(!fs.existsSync(fullfilepath)){
            let o = deploydebug.searchFile(path)
            if(o) {
                fromSubPrj = o.project;
                fullfilepath = o.fpath;
            }
        }
        if(!fs.existsSync(fullfilepath)){
            //console.log('no-file:', fullfilepath)
            return;
        }
        fullfilepath = prettifyFilePath(fullfilepath);
        //如果有些想被转接到rk-offlinedev本地的js文件，在这里变一下路径
        if(fullfilepath.match(/\/seajs\-text\.js$/)){
            fullfilepath = pathutil.resolve(__filename, '../../../static-injects/interceptFile/seajs/seajs-text.js');
        }else 
        if(fullfilepath.match(/seajs\/sea\.js$/)){
            fullfilepath = pathutil.resolve(__filename, '../../../static-injects/interceptFile/seajs/sea.js');
        }
        fullfilepath = rk_formatPath(fullfilepath)
        return {
            fullfilepath,
            fromSubPrj
        }
    }
}