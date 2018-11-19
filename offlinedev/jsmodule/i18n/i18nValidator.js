var fs = require('fs');
var pathutil = require('path');
var i18nUtil = require('../../../../apps-ingage-web/.cicd/i18n/i18nUtil')

module.exports = {
    getReports: function(){
        let untranslatedList = i18nUtil.loadUntranslateds();
        let allcn = i18nUtil.loadLanguageOfAll('all_zh-cn');

    }
}