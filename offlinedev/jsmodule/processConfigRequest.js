var fs = require('fs');
var pathutil = require('path');
var requester = require('sync-request');
var http = require('http');
//var unzip = require("unzip");
var _ = require('lodash')
var getConfig = require('./getConfig')

var i18nAccess = require('./i18n/i18nAccess')
var getMockingData = require('./getMockingData')
var saveMockingData = require('./saveMockingData')
module.exports = {
    processPost: function (req, res, callback){
        console.log('req.originalUrl:', req.originalUrl)
        if(/^\/offlinedev\/getWebProjectInfo/.test(req.url)){
            var webpath = pathutil.resolve(__dirname, "../../../apps-ingage-web/")
            var branchName = getBranchName(webpath)
            console.log(webpath, branchName)
            callback({
                branchName: branchName,
                webpath: webpath
            })
        }
        else if(/^\/offlinedev\/saveUserConfig/.test(req.url)){
            var caseName = req.body.caseName
            console.log(caseName)
            return 'done'

        }
        else if(/^\/offlinedev\/action\/list\//.test(req.originalUrl)){
            var list = getMockingData.listActions()
            callback(list)
            return 'done'
        }
        else if(/^\/offlinedev\/action\/content\//.test(req.originalUrl)){
            var list = getMockingData.getActionContent(req.body.url, req.body.prettify)
            callback(list)
            return 'done'
        }
        else if(/^\/offlinedev\/action\/save\//.test(req.originalUrl)){
            var result = saveMockingData.saveAction(req.body.url, req.body.content)
            callback({
                result: result
            })
            return 'done'
        }
        else if(/^\/offlinedev\/action\/savefilelink\//.test(req.originalUrl)){
            var result = saveMockingData.saveFileLinkAction(req.body.url, req.body.flist)
            callback({
                result: result
            })
            return 'done'
        }
        else if(/^\/offlinedev\/action\/getfilelink\//.test(req.originalUrl)){
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
        else if(/^\/offlinedev\/action\/loadfilelinkContent\//.test(req.originalUrl)){
            var filepath = decodeURIComponent(req.body.filepath)
            var result = saveMockingData.getFileLinkContent(filepath)
            callback(result)
            return 'done'
        }
        else if(/^\/offlinedev\/syncCases/.test(req.url)){
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
        else if(/^\/offlinedev\/action\/loadLangFromAll/.test(req.originalUrl)){
            var result = i18nAccess.loadLanguagesFromAll()
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