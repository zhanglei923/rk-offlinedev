var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('../config/configUtil')
let projectFileSearch = require('./projectFileSearch')
let staticFileLoader_es6 = require('./staticFileLoader_es6')

let userConfig = getConfig.getUserConfig();

var cache = {}

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
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, content) => {
            if (err) {
                console.log(err)
                content=null;    
            }            
            if(typeof content === 'undefined' || content === null){ 
                callback('');
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
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent) => {
            if (err) jsContent=null;                
            if(jsContent === ''){
                callback('');
            }else if(jsContent){            
                if(/\.es6\.js$/.test(path)){
                    var script = jsContent.toString();
                    try{
                    var result = babel.transform(script, {
                            sourceMap: true,
                            presets: ["env"],
                            //presets: ['./node_modules/babel-preset-es2015'],
                            //plugins: ["transform-runtime", ],
                            code:true
                    })
                    console.log('map', result.map)
                    jsContent = `
                            define(function(require, exports, module) {
                                ${result.code}
                            });
                            //# sourceMappingURL=sourcemap.js.map
                    `
                    fs.writeFileSync(fullfilepath + '.map', JSON.stringify(result.map));
                    }catch(e){
                    console.log('  Warn: failed at transform es6:', e)
                    }
                }
                //cache[path] = jsContent;
                //console.log(fs.existsSync(fullfilepath), fullfilepath)
                let injectScript = `;//Source: ${rootFolder},, Injected by rk-offlinedev: https://github.com/zhanglei923/rk-offlinedev';\n`
                //jsContent =   injectScript + jsContent
                callback(jsContent, {fromSubPrj, fullfilepath});
            }else{
                callback(null);
            }
          });
    }
}