var fs = require('fs-extra');
var pathutil = require('path');
var blueimp_md5 = require("blueimp-md5")
var babel = require("@babel/core");
var makeDir = require('make-dir');
let projectFileSearch = require('./supports/projectFileSearch')
var getConfig = require('../config/configUtil')
let pathfinder = require('./supports/pathfinder')

let tmp_folder = getConfig.getMasterTmpFolder();
let my_tmp_folder = pathutil.resolve(tmp_folder, './es6_downgrading')
makeDir.sync(my_tmp_folder);
var cache = {}

let thisUtil = {
    md5Map:{},
    loadJs: function (rootFolder, path, callback){
        //if(cache[path]) return cache[path];
        var findinfo = pathfinder.findPath(rootFolder, path, callback)//rootFolder + '/' + path;
        if(!findinfo){
            callback(null);
            return;
        }
        let fullfilepath = findinfo.fullfilepath;
        let fromSubPrj = findinfo.fromSubPrj;
        //var jsContent = fs.readFileSync(fullfilepath, 'utf8'); 
        fs.readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent) => {
            let fullfilepathname = fullfilepath.replace(/[\\]{1,}/g,'~').replace(/\/{1,}/g,'~').replace(/\:{1,}/g,'~')
            if (err) jsContent=null;
            if(jsContent === ''){
                callback('');
            }else if(jsContent){            
                if(!fullfilepath.match(/sea\.js/g)&&!fullfilepath.match(/\/lib\//g)){
                    let md5 = blueimp_md5(jsContent)
                    //let md5b = blueimp_md5(new Date()*1)
                    let fullfilepathname2 = md5;
                    //console.log(isDirty, fullfilepathname)
                    let tmp_filepath = pathutil.resolve(my_tmp_folder, fullfilepathname2);
                    let isDirty = !fs.existsSync(tmp_filepath);
                    //console.log('isDirty', isDirty)
                    if(isDirty){
                        var script = jsContent.toString();
                        try{
                            let script2 = script;//'//'+md5b + '\n' + script;
                            var result = babel.transform(script2, {
                                plugins: [
                                    // "@babel/plugin-proposal-object-rest-spread",
                                    // "@babel/plugin-transform-arrow-functions"
                                ],
                                "presets": [//presents 是plugins的集合，npm里有其他定制的presets可用
                                    [
                                      "@babel/preset-env",
                                      {
                                        "useBuiltIns": false//"entry"
                                      }
                                    ]
                                ]
                              });
                            //console.log(result)
                            //console.log('map', result.map)
                            jsContent = result.code;
                            //jsContent = jsContent.split(md5b)[1]
                            jsContent = `//[rk]Babel transformed es6->es5\n` + jsContent;
                            jsContent = jsContent.replace(/\"use\sstrict\"\;/,'')
                            jsContent = jsContent.replace(/^\s{1,}/,'')
                            //fs.writeFileSync(fullfilepath + '.map', JSON.stringify(result.map));
                        }catch(e){
                            jsContent = script;
                            console.log(`  Warn: ${fullfilepath} failed at transform es6:`, e)
                        }
                        try{
                            if(!fs.existsSync(my_tmp_folder))makeDir.sync(my_tmp_folder);
                            fs.writeFileSync(tmp_filepath, jsContent);
                        }catch(e){
                            console.warn('write cache file failed:', tmp_filepath)
                        }
                    }else{
                        jsContent = fs.readFileSync(tmp_filepath, 'utf8')
                    }
                    thisUtil.md5Map[fullfilepath] = md5;
                }
                //cache[path] = jsContent;
                //console.log(fs.existsSync(fullfilepath), fullfilepath)
                let injectScript = `;//Source: ${rootFolder},, Injected by rk-offlinedev: https://github.com/zhanglei923/rk-offlinedev';\n`
                jsContent = jsContent
                callback(jsContent, {fromSubPrj, fullfilepath});
            }else{
                callback(null);
            }
          });
    }
}
module.exports = thisUtil;