var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var rootpath = pathutil.resolve(__dirname, '../');
var saveutil = require('./utils/url')

module.exports = {
    saveAction: function(url, content){
		var saveName = saveutil.getSaveName(url);

    	var savepath = rootpath + '/mocking/actions-local/'
        if(!fs.existsSync(savepath)){
            fs.mkdirSync(savepath);
        }
        console.log(savepath + '/' + saveName)
    	fs.writeFileSync(savepath + '/' + saveName, content);
    },
    saveFileLinkAction:(url, flist)=>{
		var saveName = saveutil.getSaveName(url);
    	var savepath = rootpath + '/mocking/fileslink-local/'
        if(!fs.existsSync(savepath)){
            fs.mkdirSync(savepath);
        }
        console.log(savepath + '/' + saveName)
    	fs.writeFileSync(savepath + '/' + saveName, JSON.stringify(flist));
    },
    getFileLinkAction:(url, flist)=>{
		var saveName = saveutil.getSaveName(url);
    	var savepath = rootpath + '/mocking/fileslink-local/'
        if(fs.existsSync(savepath + '/' + saveName)){
            var data = fs.readFileSync(savepath + '/' + saveName, 'utf8');
            if(data){
                return JSON.parse(data);
            }else{
                return []
            }
        }
    }
}