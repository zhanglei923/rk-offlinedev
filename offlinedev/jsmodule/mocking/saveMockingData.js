var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var rootpath = pathutil.resolve(__dirname, '../../');
var saveutil = require('../utils/url')
let dataFolder = '../../mocking/';

var thisUtil = {
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
    	var savepath = rootpath + '/mocking/files-refinfo/'
        if(!fs.existsSync(savepath)){
            fs.mkdirSync(savepath);
        }
        console.log(savepath + '/' + saveName)
    	fs.writeFileSync(savepath + '/' + saveName, JSON.stringify(flist));
    },
    getAllFileLinks:()=>{
        var fullfilepath = pathutil.resolve(rootpath, './mocking/files/');
        var list = fs.readdirSync(fullfilepath)
        let results = []
        list.forEach(function(file) {
            var shortpath = file;
            file = fullfilepath + '/' + file
            var stat = fs.statSync(file)
            if (stat && !stat.isDirectory()) results.push(shortpath)
        })
        return results;
    },
    getFileLinkAction:(url)=>{
		var saveName = saveutil.getSaveName(url);
    	var savepath = rootpath + '/mocking/files-refinfo/'
        if(fs.existsSync(savepath + '/' + saveName)){
            var data = fs.readFileSync(savepath + '/' + saveName, 'utf8');
            if(data){
                return JSON.parse(data);
            }else{
                return []
            }
        }
        return [];
    },
    getCurrentFileLink: (nickname)=>{
        var result = thisUtil.getFileLinkAction(nickname)
        var final;
        console.log('getCurrentFileLink', nickname, result)
        result.forEach((re)=>{
            if(re.selected==='true' || re.selected===true) final = re.filepath;
        });
        return final;
    },
    getCurrentFileLinkContent: (nickname)=>{
        let filelinkPath = thisUtil.getCurrentFileLink(nickname)
        return thisUtil.getFileLinkContent(filelinkPath)
    },
    getFileLinkContent:(fpath)=>{
        //console.log('fpath', fpath,)
        var abspath = pathutil.resolve(rootpath, './mocking/files/'+fpath);
        if(fs.existsSync(abspath)){
            //console.log('existsSync', abspath,)
            var data = fs.readFileSync(abspath, 'utf8');
            //console.log('data', data)
            if(data){
                return data;
            }
        }
    },
}
module.exports = thisUtil;