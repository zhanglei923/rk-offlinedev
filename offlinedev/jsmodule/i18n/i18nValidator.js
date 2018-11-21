var fs = require('fs');
var pathutil = require('path');
var i18nUtil;
if(fs.existsSync(pathutil.resolve(__dirname, '../../../../apps-ingage-web/.cicd/i18n/i18nUtil.js'))){
    i18nUtil = require('../../../../apps-ingage-web/.cicd/i18n/i18nUtil')
}
module.exports = {
    getReports: function(){
        if(!i18nUtil)return;
        let untranslatedList = i18nUtil.loadUntranslateds();
        let allcn = i18nUtil.loadLanguageOfAll('all_zh-cn');

    }
}