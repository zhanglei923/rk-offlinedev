var fs = require('fs');
var pathutil = require('path');
var babel = require("babel-core");
var getConfig = require('../getConfig')

var cache = {}

module.exports = {
    loadLangFromAll: function (langId){
        getConfig.getWebAppFolder()
    },
    loadLangFromUntranslated: function (){

    }
}