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

var webappFolder = pathutil.resolve(__dirname, '../../../apps-ingage-web/src/main/webapp/');
module.exports = {
    get: function (){
        return configJson;
    },
    getWebAppFolder: function(){
        return webappFolder;
    },
    getStaticFolder: function(){
        return this.getWebAppFolder() + '/static';
    },
    getSourceFolder: function(){
        return this.getStaticFolder() + '/source';
    },
    initFiles: function(){
        var webpath = webappFolder;
        var rootpath = pathutil.resolve(__dirname, '../');
        if(!fs.existsSync(rootpath + '/.config')){
            
        }
        var path = rootpath + '/mocking/'
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        } 
        path = rootpath + '/mocking/actions'
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        } 
        path = rootpath + '/mocking/pages'
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        } 
        path = pathutil.resolve(__dirname, '../../.config')
        if(!fs.existsSync(path)){
            fs.writeFileSync(path, JSON.stringify({
                config:1
            }));
        }
    }
}