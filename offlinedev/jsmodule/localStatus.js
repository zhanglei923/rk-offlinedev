var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var rootpath = pathutil.resolve(__dirname, '../');
var config = {};
var configpath;
module.exports = {
    init: function(){
        var rootpath = pathutil.resolve(__dirname, '../');
        var path = rootpath + '/' + '.localstatus'
        configpath = path;
        if(!fs.existsSync(path)){
            fs.writeFileSync(path, JSON.stringify(config));
        }else{
            config = fs.readFileSync(configpath, 'utf8');
            config = JSON.parse(config)
        } 
    },
    set: function(name, value){
        config[name] = value;
        //console.log(name, value)
        fs.writeFileSync(configpath, JSON.stringify(config));
    },
    get: function(name){
        return config[name];
    }
}