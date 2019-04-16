let fs = require('fs')
let pathUtil = require('path')
let stripcomments = require('strip-comments')
let getConfig = require('../config/configUtil')

let webProjectPath = getConfig.getWebRoot()
let webappPath = pathUtil.resolve(webProjectPath, './src/main/webapp')
let sourcePath = pathUtil.resolve(webappPath, './static/source')
let i18nPath = pathUtil.resolve(sourcePath, './core/i18n')
let i18nPath_CN = pathUtil.resolve(i18nPath, './all_zh-cn')

let $ = {extend:()=>{}}

module.exports = {
    setWebappPath: function(webappPath){
        this.webappPath = webappPath;
        this.sourcePath = pathUtil.resolve(this.webappPath, './static/source')
        this.i18nPath = pathUtil.resolve(this.sourcePath, './core/i18n')
        webappPath = this.webappPath;
        sourcePath = this.sourcePath;
        i18nPath = this.i18nPath;
    },
    webappPath,
    sourcePath,
    i18nPath,
    loadLanguagePathOfAll: (langId)=>{
        let fpath = pathUtil.resolve(i18nPath, `${langId}.js`);
        return fpath;
    },
    loadLanguageOfAll: (langId)=>{
        let fpath = pathUtil.resolve(i18nPath, `${langId}.js`);
        let fcontent = fs.readFileSync(fpath, 'utf8');
        fcontent = fcontent.replace(/\bdefine\b/g, 'my_define');
        let alljson;
        let my_define = (json)=>{
            alljson = json;
        }
        eval(fcontent);
        return alljson;
    },
    loadUntranslateds: ()=>{
        let untranslatedContent = fs.readFileSync(pathUtil.resolve(i18nPath_CN, './loader.js'), 'utf8');
        untranslatedContent = stripcomments(untranslatedContent);
        untranslatedContent = untranslatedContent.replace(/\bdefine\b/g, 'my_define');
        //console.log(untranslatedContent)
        //fs.writeFileSync('./aha.js', untranslatedContent)
        
        let fpathList = []
        let my_define = (fun)=>{
            let my_require = (path)=>{
                fpathList.push(path);
            };
            let my_exports = {};
            let my_module ={
                exports:{}
            }        
            fun.call(this, my_require, my_exports, my_module)
        }
        eval(untranslatedContent)
        //Convert to reliable filepath
        let usefulPathList = [];
        for(var i=0;i<fpathList.length;i++){
            let fpath = fpathList[i];
            if(/\{/g.test(fpath)) continue;//ignore
            //if(/default\_/g.test(fpath)) continue;//ignore
            if(/\/base\//g.test(fpath)) continue;//ignore
            if(!/\.js$/.test(fpath)) fpath = fpath + '.js';
            fpath = pathUtil.resolve(i18nPath_CN, fpath)
            let exist = fs.existsSync(fpath);
            if(!exist) console.log('[ERROR]File not exist: ', fpath)
            usefulPathList.push(fpath)
        }
        let jsonList = []
        let jsonpathHead;
        let sub_define = (fun)=>{
            let sub_require = (json)=>{};
            let sub_exports = {};
            let sub_module ={
                exports:{}
            }
            let result;
            if(typeof fun === 'object'){
                result = fun;
            }else{
                fun.call(this, sub_require, sub_exports, sub_module)
                result = sub_module.exports;
            }
            jsonList.push({
                path: jsonpathHead,
                json: result
            });
        }
        usefulPathList.forEach((fpath)=>{
            jsonpathHead=fpath;
            let fcontent = fs.readFileSync(fpath, 'utf8');
            fcontent = fcontent.replace(/\bdefine\b/g, 'sub_define');
            eval(fcontent)
        })
        return jsonList;
    }
}