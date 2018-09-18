var fs = require('fs');
var pathutil = require('path');
var requester = require('sync-request');
var http = require('http');
//var unzip = require("unzip");
var _ = require('lodash')
var getConfig = require('./getConfig')

var configJson = require('./getConfig').get()

module.exports = {
    processPost: function (req, res, callback){
        if(/^\/offlinedev\/getWebProjectInfo/.test(req.url)){
            var webpath = pathutil.resolve(__dirname, "../../../apps-ingage-web/")
            var branchName = getBranchName(webpath)
            console.log(webpath, branchName)
            callback({
                branchName: branchName,
                webpath: webpath
            })
        }
        if(/^\/offlinedev\/saveUserConfig/.test(req.url)){
            var caseName = req.body.caseName
            console.log(caseName)
            return 'done'

        }
        if(/^\/offlinedev\/action\/list\//.test(req.originalUrl)){
            var list = require('./getMockingData').listActions()
            callback(list)
            return 'done'
        }
        if(/^\/offlinedev\/action\/content\//.test(req.originalUrl)){
            var list = require('./getMockingData').getActionContent(req.body.url, req.body.prettify)
            callback(list)
            return 'done'
        }
        if(/^\/offlinedev\/action\/save\//.test(req.originalUrl)){
            var result = require('./saveMockingData').saveAction(req.body.url, req.body.content)
            callback({
                result: result
            })
            return 'done'
        }
        if(/^\/offlinedev\/action\/savefilelink\//.test(req.originalUrl)){
            var result = require('./saveMockingData').saveFileLinkAction(req.body.url, req.body.flist)
            callback({
                result: result
            })
            return 'done'
        }
        if(/^\/offlinedev\/syncCases/.test(req.url)){
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