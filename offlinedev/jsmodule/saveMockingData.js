var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var rootpath = pathutil.resolve(__dirname, '../');
module.exports = {
    saveAction: function(url, content){
    	var saveUrl = url + ''
    	saveUrl = saveUrl.replace(/\/{1,}/ig, '/')
    	saveUrl = saveUrl.replace(/\//ig, '~~')
    	console.log(saveUrl, content)

    	var savepath = rootpath + '/mocking/action-mine/'
        if(!fs.existsSync(savepath)){
            fs.mkdirSync(savepath);
        }
    	fs.writeFileSync(savepath + '/' + saveUrl, JSON.stringify(content));

    }
}