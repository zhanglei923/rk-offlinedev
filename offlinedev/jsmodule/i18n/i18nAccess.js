var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('../getConfig')

var cache = {}
let my_define = (json)=>{
    return json;
}

module.exports = {
    getI18nFolder: function(){
        return getConfig.getSourceFolder() + '/core/i18n'
    },
    loadLanguagesFromAll: function (){
        let allLangList = ['all_zh-cn', 'all_en', 'all_zh-tw']
        let i18nFolder = this.getI18nFolder();
        let all = {}
        allLangList.forEach((langCode)=>{            
            let content = fs.readFileSync(i18nFolder+`/${langCode}.js`, 'utf8');
            content = content.replace(/^\s?define/, 'my_define')
            let json = {}
            eval(`json = ${content}`)
            all[langCode] = json;
        })
        return all;
    },
    loadLanguagesFromUntranslated: function (){
        let i18nFolder = this.getI18nFolder();
        let all = {}
        var list = fs.readdirSync(i18nFolder)
        list.forEach(function(file) {
            file = i18nFolder + '/' + file
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory()){
                var subfolder = file;
                var sublist = fs.readdirSync(subfolder)
                //console.log(subfolder)
                sublist.forEach(function(subfile) {
                    //console.log(subfile)
                    subfile = subfolder + '/' + subfile
                    var substat = fs.statSync(subfile)
                    if (substat && !substat.isDirectory() && /\.js$/.test(subfile)){
                        //console.log(subfile)
                        let content = fs.readFileSync(subfile, 'utf8');
                        let define = function(o){
                            let mod = {exports}
                            o({},{},mod)
                            let json = mod.exports;
                            all[subfile] = {
                                json
                            }           
                        }
                        eval(content)             
                    }
                })

            }
        })
        return all;
    }
}