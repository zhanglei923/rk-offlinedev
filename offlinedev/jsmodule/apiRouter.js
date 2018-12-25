var fs = require('fs');
var pathutil = require('path');
var requester = require('sync-request');
var http = require('http');
//var unzip = require("unzip");
var _ = require('lodash')
var getConfig = require('./config/configUtil')
var webprojectUtil = require('./webprojectUtil')
var i18nAccess = require('./i18n/i18nAccess')
var i18nValidator = require('./i18n/i18nValidator')
var loadMockingData = require('./mocking/loadMockingData')
var saveMockingData = require('./mocking/saveMockingData')
module.exports = {
    processPost: function (req, res, callback){
        console.log('req.originalUrl:', req.originalUrl)
        if(/^\/offlinedev\/api\/webpath\/updateWebProjectPath/.test(req.url)){
            var prjpath = req.body.prjpath
            let ok = webprojectUtil.updateWebProjectPath(prjpath)
            callback({
                ok
            })
        }
        else if(/^\/offlinedev\/api\/getWebProjectInfo/.test(req.url)){
            var webpath = getConfig.getWebRoot()
            var branchName = getBranchName(webpath)
            console.log(webpath, branchName)
            callback({
                branchName: branchName,
                webpath: webpath,
                isCustomizedWebRoot: getConfig.isCustomizedWebRoot()
            })
        }
        else if(/^\/offlinedev\/api\/saveUserConfig/.test(req.url)){
            var caseName = req.body.caseName
            console.log(caseName)
            return 'done'

        }
        else if(/^\/offlinedev\/api\/action\/list\//.test(req.originalUrl)){
            var list = loadMockingData.listActions()
            callback(list)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/content\//.test(req.originalUrl)){
            var list = loadMockingData.getActionContent(req.body.url, req.body.prettify)
            callback(list)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/save\//.test(req.originalUrl)){
            var result = saveMockingData.saveAction(req.body.url, req.body.content)
            callback({
                result: result
            })
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/savefilelink\//.test(req.originalUrl)){
            var result = saveMockingData.saveFileLinkAction(req.body.url, req.body.flist)
            callback({
                result: result
            })
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/getfilelink\//.test(req.originalUrl)){
            var allfiles = saveMockingData.getAllFileLinks()
            var result = saveMockingData.getFileLinkAction(req.body.url, req.body.flist)
            var final = [];
            allfiles.forEach((file)=>{
                let found = false;
                result.forEach((re)=>{
                    if(re.filepath===file && (re.selected==='true' || re.selected===true)) found = true;
                });
                final.push({
                    selected: found,
                    filepath: file
                })
            })
            console.log('result',result,'\n','final', final);
            callback(final)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/loadfilelinkContent\//.test(req.originalUrl)){
            var filepath = decodeURIComponent(req.body.filepath)
            var result = saveMockingData.getFileLinkContent(filepath)
            callback(result)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/syncCases/.test(req.url)){
            var caseName = req.body.caseName
            console.log(caseName)
            var url = 'http://10.10.0.115:3004/offlinedev/allfiles?casename=' + caseName
            console.log(url)
            var content = getUrlContent(url);
            content = JSON.parse(content)
            //console.log
            content.forEach(function(fpath){
                console.log(fpath)
            })
            getConfig.initFiles()

            var filename = caseName+".zip";
            var filepath = pathutil.resolve(__dirname, "../mocking/"+filename)
            var file = fs.createWriteStream(filepath);
            var request = http.get("http://10.10.0.115/public/offlinedev/mocking/"+ filename, function(response) {
                response.pipe(file);
                setTimeout(function(){
                     console.log('unzip', filepath)
                    //fs.createReadStream(filepath).pipe(unzip.Extract({ path: pathutil.resolve(__dirname, "../mocking/") }));
                    callback()
                }, 4000)
            });
        }
        else if(/^\/offlinedev\/api\/action\/loadLangFromAll/.test(req.originalUrl)){
            var result = i18nAccess.loadLanguagesFromAll()
            callback(result)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/loadLanguagesFromUntranslated/.test(req.originalUrl)){
            var result = i18nAccess.loadLanguagesFromUntranslated()
            callback(result)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/saveAllLanguages/.test(req.originalUrl)){
            let all = req.body.all;
            //fs.writeFileSync('./o.json', all)
            let allJson = JSON.parse(all);
            var result = i18nAccess.saveAllLanguages(allJson)
            callback(result)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/i18nReports/.test(req.originalUrl)){
            var reports = i18nValidator.getReports()
            callback(reports)
            return 'done'
        }
        else if(/^\/offlinedev\/api\/action\/i18nSaveAsUntrans/.test(req.originalUrl)){
            let all = req.body.all;
            //fs.writeFileSync('./o.json', all)
            let allJson = JSON.parse(all);
            var result = i18nAccess.saveAsUntranslated(allJson)
            callback(result)
            return 'done'
        }
    }
}
var getUrlContent = function(url){    
        var furl = url
        var data = requester('GET', furl, {timeout: 2000});   
        console.log(furl) 
        var webresultText = data.statusCode === 200 ? data.getBody().toString() : null;
        return webresultText;
};
var getBranchName = function(prjPath){
        var gitPath = prjPath + '/.git/'
        if(!fs.existsSync(prjPath)) return '';
        if(!fs.existsSync(gitPath)) return '';
        var HEAD = fs.readFileSync(gitPath + 'HEAD','utf8');
        HEAD = _.trim(HEAD)
        var branchName = HEAD.replace('ref: refs/heads/', '');
        return branchName;
};