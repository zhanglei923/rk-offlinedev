var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('../config/configUtil')
let staticFileLoader_es6 = require('./staticFileLoader_es6')

let userConfig = getConfig.getUserConfig();

var cache = {}

module.exports = {
    loadTpl: function(path, callback){
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebAppFolder()
        var fullfilepath = rootFolder + '/' + path
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
                callback(content);
            }
        });
    },
    loadJs: function (path, callback){
        if(userConfig.es6.autoTransformJs) return staticFileLoader_es6.loadJs(path, callback);
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebAppFolder()
        var fullfilepath = rootFolder + '/' + path
        if(!fs.existsSync(fullfilepath)){
            console.log('no-js-file:', fullfilepath)
            callback(null);
            return;
        }
        //var jsContent = fs.readFileSync(fullfilepath, 'utf8'); 
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent) => {
            if (err) jsContent=null;                
            if(jsContent){            
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
                jsContent =   injectScript + jsContent
                callback(jsContent);
            }else{
                callback(null);
            }
          });
    }
}