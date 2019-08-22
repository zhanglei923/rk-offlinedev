var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('../config/configUtil')
let projectFileSearch = require('./projectFileSearch')
let staticFileLoader_es6 = require('./staticFileLoader_es6')

let userConfig = getConfig.getUserConfig();

var cache = {}

let prettifyFilePath = (fpath)=>{
    fpath = fpath.replace(/\/{1,}/g, '/');
    fpath = fpath.replace(/\\{1,}/g, '/');
    return fpath;
};
module.exports = {
    loadCss: function(rootFolder, path, callback){
        //if(cache[path]) return cache[path];
        let fromSubPrj = null;
        var fullfilepath = rootFolder + '/' + path;
        if(!fs.existsSync(fullfilepath)){
            let o = projectFileSearch.searchFile(path)
            if(o) {
                fromSubPrj = o.project;
                fullfilepath = o.fpath;
            }
        }
        if(!fs.existsSync(fullfilepath)){
            console.log('no-css-file:', fullfilepath)
            callback(null);
            return;
        }
        fullfilepath = prettifyFilePath(fullfilepath);
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
        let fromSubPrj = null;
        var fullfilepath = rootFolder + '/' + path;
        if(!fs.existsSync(fullfilepath)){
            let o = projectFileSearch.searchFile(path)
            if(o) {
                fromSubPrj = o.project;
                fullfilepath = o.fpath;
            }
        }
        if(!fs.existsSync(fullfilepath)){
            console.log('no-tpl-file:', fullfilepath)
            callback(null);
            return;
        }
        fullfilepath = prettifyFilePath(fullfilepath);
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
        let fromSubPrj = null;
        var fullfilepath = rootFolder + '/' + path;
        if(!fs.existsSync(fullfilepath)){
            let o = projectFileSearch.searchFile(path)
            if(o) {
                fromSubPrj = o.project;
                fullfilepath = o.fpath;
            }
        }
        if(!fs.existsSync(fullfilepath)){
            console.log('no-js-file1:', fullfilepath)
            callback(null);
            return;
        }
        //var jsContent = fs.readFileSync(fullfilepath, 'utf8'); 
        fullfilepath = prettifyFilePath(fullfilepath);
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