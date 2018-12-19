var fs = require('fs');
var pathutil = require('path');
var i18nUtil;

i18nUtil = require('./i18nUtil')
module.exports = {
    getReports: function(){
        if(!i18nUtil)return;
        let untranslatedList = i18nUtil.loadUntranslateds();
        let allcn = i18nUtil.loadLanguageOfAll('all_zh-cn');

    }
}