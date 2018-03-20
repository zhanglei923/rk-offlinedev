var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('./getConfig')

var cache = {}

module.exports = {
    update: function (path){
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebProjectFolder()
        var fullfilepath = rootFolder + '/' + path
        if(!fs.existsSync(fullfilepath)){
            console.log('nofile:', fullfilepath)
            return null;
        }
        var jsContent = fs.readFileSync(fullfilepath, 'utf8'); 
        if(jsContent){            
            if(/\.es6\.js$/.test(path)){
                var script = jsContent.toString();
                try{
                  var result = babel.transform(script, {
                      presets: ["es2015"],
                      code:true
                  })
                   
                  jsContent = `
                        define(function(require, exports, module) {
                            ${result.code}
                        });
                  `
                }catch(e){
                  console.log('  Warn: failed at transform es6:', filepath)
                }
            }
            cache[path] = jsContent;
            //console.log(fs.existsSync(fullfilepath), fullfilepath)
            jsContent =   ''
                        +   jsContent
                        + '\n/****'
                        + '\n Powered by rk-offlinedev:'
                        + '\n   https://github.com/zhanglei923/rk-offlinedev'
                        + '\n****/'
            return jsContent;
        }else{
            return null;
        }
    }
}