var fs = require('fs');
var pathutil = require('path');
var requester = require('sync-request');

var configJson = require('./getConfig').get()

module.exports = {
    processPost: function (req, res){

        if(/^\/offlinedev\/saveUserConfig/.test(req.url)){
            var caseName = req.body.caseName
            console.log(caseName)
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
            return content;

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