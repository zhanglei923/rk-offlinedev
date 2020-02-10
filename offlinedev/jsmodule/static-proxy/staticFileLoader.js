var fs = require('fs-extra');
var pathutil = require('path');
var getConfig = require('../config/configUtil')
let projectFileSearch = require('./supports/projectFileSearch')
let staticFileLoader_es6 = require('./staticFileLoader_es6')
let pathfinder = require('./supports/pathfinder')

let userConfig = getConfig.getUserConfig();
var cache = {}

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
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, content) => {
            if (err) {
                console.log(err)
                content=null;    
            }            
            if(typeof content === 'undefined' || content === null){ 
                callback(null);
            }else{
                callback(content, {fromSubPrj, fullfilepath});
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
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, content) => {
            if (err) {
                console.log(err)
                content=null;    
            }            
            if(typeof content === 'undefined' || content === null){ 
                callback('', {fromSubPrj, fullfilepath});
            }else{
                callback(content, {fromSubPrj, fullfilepath});
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
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent) => {
            if (err) jsContent=null;                
            if(jsContent === ''){
                callback('', {fromSubPrj, fullfilepath});
            }else if(jsContent){
                //let injectScript = `;//Source: ${rootFolder},, Injected by rk-offlinedev: https://github.com/zhanglei923/rk-offlinedev';\n`
                //jsContent =   injectScript + jsContent
                callback(jsContent, {fromSubPrj, fullfilepath});
            }else{
                callback(null);
            }
          });
    }
}