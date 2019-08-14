var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var rootpath = pathutil.resolve(__dirname, '../../../tmp');
var config = {};
var configpath;
module.exports = {
    init: function(){
        var path = pathutil.resolve(rootpath, './localStatus.data') //rootpath + '/' + '.localStatus'
        configpath = path;
        console.log('load: localStatus')
        if(!fs.existsSync(path)){
            fs.writeFileSync(path, JSON.stringify(config));
        }else{
            config = fs.readFileSync(configpath, 'utf8');
            config = JSON.parse(config)
        } 
    },
    setData: function(name, value){
        config[name] = value;
        //console.log(name, value)
        fs.writeFileSync(configpath, JSON.stringify(config));
    },
    getData: function(name){
        return config[name];
    }
}