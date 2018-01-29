var fs = require('fs');
var pathutil = require('path');

var configJson;

var rootFolder = pathutil.resolve(__dirname, '../');
var fpath = rootFolder + '/config.json'
if(fs.existsSync(fpath)){
    var data = fs.readFileSync(fpath, 'utf8');
    if(data){
        configJson = JSON.parse(data);
    }
}else{
    console.log('Can not find:', fpath)
}

module.exports = {
    get: function (){
        return configJson;
    }
}