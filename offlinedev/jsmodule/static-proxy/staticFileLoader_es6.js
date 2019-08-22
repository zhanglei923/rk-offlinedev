var fs = require('fs');
var pathutil = require('path');
var blueimp_md5 = require("blueimp-md5")
var babel = require("babel-core");
var makeDir = require('make-dir');
let projectFileSearch = require('./projectFileSearch')
var getConfig = require('../config/configUtil')
let pathfinder = require('./pathfinder')

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
                    let fullfilepathname2 = md5;
                    //console.log(isDirty, fullfilepathname)
                    let tmp_filepath = pathutil.resolve(my_tmp_folder, fullfilepathname2);
                    let isDirty = !fs.existsSync(tmp_filepath);
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
                        jsContent = `//[offlinedev]Babel transformed es6->es5\n` + jsContent;
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
                callback(jsContent, {fromSubPrj, fullfilepath});
            }else{
                callback(null);
            }
          });
    }
}
module.exports = thisUtil;