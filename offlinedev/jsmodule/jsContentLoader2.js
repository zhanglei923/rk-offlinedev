var fs = require('fs');
var pathutil = require('path');
var blueimp_md5 = require("blueimp-md5")
var babel = require("babel-core");
var makeDir = require('make-dir');
var getConfig = require('./config/configUtil')

let tmp_folder = getConfig.getMasterTmpFolder();
let my_tmp_folder = pathutil.resolve(tmp_folder, './jsContentLoader')
makeDir.sync(my_tmp_folder);
var cache = {}

let thisUtil = {
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
    md5Map:{},
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
            let fullfilepathname = fullfilepath.replace(/[\\]{1,}/g,'~').replace(/\/{1,}/g,'~').replace(/\:{1,}/g,'~')
            if (err) jsContent=null;                
            if(jsContent){            
                if(!fullfilepath.match(/sea\.js/g)&&!fullfilepath.match(/\/lib\//g)){
                    let md5 = blueimp_md5(jsContent)
                    let isDirty = thisUtil.md5Map[fullfilepath] !== md5;
                    //console.log(isDirty, fullfilepathname)
                    let tmp_filepath = pathutil.resolve(my_tmp_folder, fullfilepathname);
                    if(!fs.existsSync(tmp_filepath)) isDirty = true;//防止意外删除或丢失了
                    if(isDirty){
                        var script = jsContent.toString();
                        try{
                        var result = babel.transform(script, {
                                sourceMap: true,
                                presets: ["env"],
                                //presets: ['./node_modules/babel-preset-es2015'],
                                //plugins: ["transform-runtime", ],
                                code:true
                        })
                        //console.log('map', result.map)
                        jsContent = result.code;
                        jsContent = jsContent.replace(/\"use\sstrict\"\;/,'')
                        jsContent = jsContent.replace(/^\s{1,}/,'')
                        //fs.writeFileSync(fullfilepath + '.map', JSON.stringify(result.map));
                        }catch(e){
                            jsContent = script;
                            console.log(`  Warn: ${fullfilepath} failed at transform es6:`, e)
                        }
                        fs.writeFileSync(tmp_filepath, jsContent);
                    }else{
                        jsContent = fs.readFileSync(tmp_filepath, 'utf8')
                    }
                    thisUtil.md5Map[fullfilepath] = md5;
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
module.exports = thisUtil;