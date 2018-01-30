var fs = require('fs');
var pathutil = require('path');
var getConfig = require('./getConfig')

var cache = {}

module.exports = {
    update: function (path){
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebProjectFolder()
        var fullfilepath = rootFolder + '/' + path
        var jsContent = fs.readFileSync(fullfilepath, 'utf8'); 
        if(jsContent){
            cache[path] = jsContent;
            //console.log(fs.existsSync(fullfilepath), fullfilepath)
            return jsContent+'\n//mocked-js';            
        }else{
            return null;
        }
    }
}