var fs = require('fs');
var pathutil = require('path');
var moment = require("moment");
var jsonformatter = require('format-json');
var getConfig = require('../getConfig')
var i18nUtil = require('../../../../apps-ingage-web/.cicd/i18n/i18nUtil')

var cache = {}
let my_define = (json)=>{
    return json;
}
let allLangList = [
                {fname: 'all_zh-cn', alias:'cn'}, 
                {fname: 'all_en', alias:'en'}, 
                {fname: 'all_zh-tw', alias:'tw'}
            ]

module.exports = {
    getI18nFolder: function(){
        return getConfig.getSourceFolder() + '/core/i18n'
    },
    loadLanguagesFromAll: function (){
        let i18nFolder = this.getI18nFolder();
        let all = {}
        allLangList.forEach((o)=>{     
            var langCode = o.fname;       
            let content = fs.readFileSync(i18nFolder+`/${langCode}.js`, 'utf8');
            content = content.replace(/^\s?define/, 'my_define')
            let json = {}
            eval(`json = ${content}`)
            all[langCode] = json;
        })
        return all;
    },
    loadLanguagesFromUntranslated: function (){
        let untranslatedList = i18nUtil.loadUntranslateds();
        //fs.writeFileSync('./u.json', JSON.stringify(untranslatedList))
        let all = {}
        untranslatedList.forEach((item)=>{
            all[item.path] = item.json;
        })
        return all;
    },
    loadLanguagesFromUntranslated2: function (){
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
    },
    saveAllLanguages: function (allJson){
        let i18nFolder = this.getI18nFolder();
        let all = {}
        allLangList.forEach((o)=>{
            var alias = o.alias;
            if(allJson[alias]){
                let json = allJson[alias]
                let fullfilename = i18nFolder + '/' + o.fname + '.js';
                let content = 'define('+
                                '\n//注意！请不要再手工编辑这里的文字，中文文案请自行在untranslated.js文件中维护。\n'+
                                '\n//注意！请不要再手工编辑这里的文字，中文文案请自行在untranslated.js文件中维护。\n'+
                                '\n//注意！请不要再手工编辑这里的文字，中文文案请自行在untranslated.js文件中维护。\n'+
                                '\n//注意！请不要再手工编辑这里的文字，中文文案请自行在untranslated.js文件中维护。\n'+
                                '\n//注意！请不要再手工编辑这里的文字，中文文案请自行在untranslated.js文件中维护。\n'+
                                '\n//注意！请不要再手工编辑这里的文字，中文文案请自行在untranslated.js文件中维护。\n'+
                                jsonformatter.diffy(json) + ');'
                let localBackupFolder = pathutil.resolve(__dirname, './.save');
                fs.writeFileSync(localBackupFolder+'/'+alias+'_'+moment().format('YYYY-MM-DD_HHmmss')+'.json', JSON.stringify(json))
                fs.writeFileSync(fullfilename, content)
                console.log('saved: ',alias, fullfilename, localBackupFolder)
            }
        })
        return all;
    }
}