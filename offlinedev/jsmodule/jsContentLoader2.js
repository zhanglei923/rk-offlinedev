var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('./config/configUtil')

var cache = {}

module.exports = {
    loadTpl: function(path, callback){
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebAppFolder()
        var fullfilepath = rootFolder + '/' + path
        if(!fs.existsSync(fullfilepath)){
            console.log('nofile:', fullfilepath)
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
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebAppFolder()
        var fullfilepath = rootFolder + '/' + path
        if(!fs.existsSync(fullfilepath)){
            console.log('nofile:', fullfilepath)
            callback(null);
            return;
        }
        //var jsContent = fs.readFileSync(fullfilepath, 'utf8'); 
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent) => {
            if (err) jsContent=null;                
            if(jsContent){            
                if(!fullfilepath.match(/sea\.js/g)&&!fullfilepath.match(/\/lib\//g)){
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
                    jsContent = result.code;
                    jsContent = jsContent.replace(/\"use\sstrict\"\;/,'')
                    jsContent = jsContent.replace(/^\s{1,}/,'')
                    //fs.writeFileSync(fullfilepath + '.map', JSON.stringify(result.map));
                    }catch(e){
                        jsContent = script;
                    console.log('  Warn: failed at transform es6:', e)
                    }
                }
                //cache[path] = jsContent;
                //console.log(fs.existsSync(fullfilepath), fullfilepath)
                let injectScript = `;//Source: ${rootFolder},, Injected by rk-offlinedev: https://github.com/zhanglei923/rk-offlinedev';\n`
                jsContent = jsContent
                callback(jsContent);
            }else{
                callback(null);
            }
          });
    }
}