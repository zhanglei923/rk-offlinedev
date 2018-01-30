var fs = require('fs');
var pathutil = require('path');

var configJson = require('./getConfig').get()

module.exports = {
    processPost: function (req, res){

        if(/^\/offlinedev\/saveUserConfig/.test(req.url)){
            var caseName = req.body.caseName
            console.log(caseName)
            return 'done'

        }

        
    }
}