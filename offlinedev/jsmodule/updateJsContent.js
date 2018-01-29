var fs = require('fs');
var pathutil = require('path');

var cache = {}

module.exports = {
    update: function (path){
        //if(cache[path]) return cache[path];
        var rootFolder = pathutil.resolve(__dirname, '../../../apps-ingage-web/src/main/webapp/');
        var fullfilepath = rootFolder + '/' + path
        var jsContent = fs.readFileSync(fullfilepath, 'utf8'); 
        cache[path] = jsContent;
        //console.log(fs.existsSync(fullfilepath), fullfilepath)
        return jsContent+'\n//mocked-js';
    }
}