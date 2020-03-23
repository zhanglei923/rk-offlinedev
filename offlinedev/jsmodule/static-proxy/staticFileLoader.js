var fs = require('fs-extra');
var pathutil = require('path');
var getConfig = require('../config/configUtil')
let loadCmdInfo = require('../static-proxy/supports/loadCmdInfo')
let staticFileLoader_es6 = require('./staticFileLoader_es6')
let pathfinder = require('./supports/pathfinder')

let userConfig = getConfig.getUserConfig();
var cache = {}
let cachedCmdInfo = {}

let fs_readFile = require('../utils/fs_readFile').fs_readFile;

module.exports = {
    loadCss: function(rootFolder, path, callback){
        //if(cache[path]) return cache[path];
        var findinfo = pathfinder.findPath(rootFolder, path, callback)//rootFolder + '/' + path;
        if(!findinfo){
            callback(null);
            return;
        }
        let fullfilepath = findinfo.fullfilepath;
        let fromSubPrj = findinfo.fromSubPrj;
        fs_readFile(fullfilepath, {encoding:'utf8'}, (err, content, fileinfo) => {
            if (err) {
                console.log(err)
                content=null;    
            }            
            if(typeof content === 'undefined' || content === null){ 
                callback(null);
            }else{
                callback(content, {fromSubPrj, fullfilepath, fileinfo});
            }
        });
    },
    loadTpl: function(rootFolder, path, callback){
        //if(cache[path]) return cache[path];
        var findinfo = pathfinder.findPath(rootFolder, path, callback)//rootFolder + '/' + path;
        if(!findinfo){
            callback(null);
            return;
        }
        let fullfilepath = findinfo.fullfilepath;
        let fromSubPrj = findinfo.fromSubPrj;
        fs_readFile(fullfilepath, {encoding:'utf8'}, (err, content, fileinfo) => {
            if (err) {
                console.log(err)
                content=null;    
            }            
            if(typeof content === 'undefined' || content === null){ 
                callback('', {fromSubPrj, fullfilepath, fileinfo});
            }else{
                callback(content, {fromSubPrj, fullfilepath, fileinfo});
            }
        });
    },
    loadJs: function (rootFolder, path, callback){
        if(userConfig.es6.autoTransformJs) return staticFileLoader_es6.loadJs(rootFolder, path, callback);
        //if(cache[path]) return cache[path];
        var findinfo = pathfinder.findPath(rootFolder, path, callback)//rootFolder + '/' + path;
        if(!findinfo){
            callback(null);
            return;
        }
        let fullfilepath = findinfo.fullfilepath;
        let fromSubPrj = findinfo.fromSubPrj;
        fs_readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent, fileinfo) => {
            if (err) jsContent=null;                
            if(jsContent === ''){
                callback('', {fromSubPrj, fullfilepath, fileinfo});
            }else if(jsContent){
                //let injectScript = `;//Source: ${rootFolder},, Injected by rk-offlinedev: https://github.com/zhanglei923/rk-offlinedev';\n`
                //jsContent =   injectScript + jsContent
                let cmdinfo;
                if(fileinfo && fileinfo.isCached){
                    cmdinfo = cachedCmdInfo[fullfilepath]
                }else{
                    cmdinfo = loadCmdInfo.loadCmdInfo(fullfilepath, jsContent)
                    cachedCmdInfo[fullfilepath] = cmdinfo;
                }
                //if(fullfilepath.indexOf('xxx')>=0)console.log(cmdinfo)
                callback(jsContent, {fromSubPrj, fullfilepath, fileinfo, cmdinfo});
            }else{
                callback(null);
            }
          });
    }
}