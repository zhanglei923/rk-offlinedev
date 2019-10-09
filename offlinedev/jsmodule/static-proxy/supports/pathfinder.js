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
        //支持admin工程
        if(path.match(/^\/admin\//)){
            let admin_webappFolder = configUtil.getAllPathInfo().admin_webappFolder;
            let fullfilepath = admin_webappFolder + '/' + path.replace(/^\/admin\//, '/');
            //console.log(fullfilepath)
            if(!fs.existsSync(fullfilepath)) return;
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
            console.log('no-file:', fullfilepath)
            return;
        }
        fullfilepath = prettifyFilePath(fullfilepath);
        return {
            fullfilepath,
            fromSubPrj
        }
    }
}