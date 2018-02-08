var fs = require('fs');
var pathutil = require('path');
var getConfig = require('./getConfig')

var cache = {}

module.exports = {
    update: function (path, callback){
        //if(cache[path]) return cache[path];
        var rootFolder = getConfig.getWebProjectFolder()
        var fullfilepath = rootFolder + '/' + path
        if(!fs.existsSync(fullfilepath)){
            console.log('nofile:', fullfilepath)
            callback(null);
            return;
        }
        fs.readFile(fullfilepath,'utf-8', function(err, jsContent){ 
            if(err) throw err;
            if(jsContent){
                cache[path] = jsContent;
                //console.log(fs.existsSync(fullfilepath), fullfilepath)
                callback(jsContent+'\n//mocked-js');            
            }else{
                callback(null);
            }
        })    
        
    }
}