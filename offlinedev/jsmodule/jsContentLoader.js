var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('./config/configUtil')

var cache = {}

module.exports = {
    update: function (path){
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebAppFolder()
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
            cache[path] = jsContent;
            //console.log(fs.existsSync(fullfilepath), fullfilepath)
            jsContent =   ''
                        +   jsContent
                        // + '\n/****'
                        // + '\n Powered by rk-offlinedev:'
                        // + '\n   https://github.com/zhanglei923/rk-offlinedev'
                        // + '\n****/'
            return jsContent;
        }else{
            return null;
        }
    }
}