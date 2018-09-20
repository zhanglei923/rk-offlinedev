var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var requester = require('sync-request');
var jsonformatter = require('format-json');
var localStatus = require('./localStatus')
var saveutil = require('./utils/url')
var saveMockingData = require('./saveMockingData')

let arr = [
    pathutil.resolve(__dirname,'../mocking/actions-local/'),
    pathutil.resolve(__dirname,'../mocking-default/actions/'),
    pathutil.resolve(__dirname,'../mocking/actions/'),
    pathutil.resolve(__dirname,'../mocking/fileslink-local/')
];
arr.forEach((folderpath)=>{
    if (!fs.existsSync(folderpath)){
        fs.mkdirSync(folderpath)
    }
})

var data_cache = {};
//必须与io里同名函数保持同步
var getParamAsSurfix = function(query){
    if(!query) return ''
    var arrz = []
    for(var k in query){
        arrz.push(k);
    }
    arrz = _.sortedUniq(arrz);
    return arrz.join('&');
}
var readFile = function(fpath){
    // var request = require('sync-request');
    // var data = request('GET', webUrl); 

    var data = fs.readFileSync(fpath, 'utf8');

    return data;
}
var readFileLink = function(nickname){
    let content = saveMockingData.getCurrentFileLinkContent(nickname)
    return content;
}
var readRelativeFile = function(relativepath, fpath){
    var fullfilepath = pathutil.resolve(__dirname, relativepath);
    fullfilepath = fullfilepath + '/' + fpath;
    //console.log(fullfilepath, fs.existsSync(fullfilepath))//, relativepath, fpath)
    if (!fs.existsSync(fullfilepath)) return false;
    var data = fs.readFileSync(fullfilepath, 'utf8');
    return data;
}
var canVisit115 = true;
module.exports = {
    getData: function(actionname, req){
        //console.log('actionname', actionname)
        //if(data_cache[actionname]) return data_cache[actionname]
        var oactionname = actionname;
        actionname = actionname.split('?')[0]

        if(actionname.indexOf('load-pagedata.action') >= 0 || actionname.indexOf('load-compdata.action') >= 0){
            return this.getPlatformData(req);
        }
        var tail = getParamAsSurfix(req.query)
        var actionname = actionname.replace(/\//ig, '~~').replace(/\.action$/, '');
        var fpath = '/actions/' + actionname + (!tail ? '' : '.' + tail) + '.action'     
        var f_path = '/' + actionname + (!tail ? '' : '.' + tail) + '.action'        
        // if(canVisit115){
        //     try{//test
        //         //console.log(fpath)
        //         var furl = 'http://10.10.0.115/public/offlinedev/mocking/' + fpath
        //         var data = requester('GET', furl, {timeout: 1500});   
        //         //console.log(furl) 
        //         var webresultText = data.statusCode === 200 ? data.getBody().toString() : null;
        //         //console.log('webresultText', webresultText)
        //     }catch(e){
        //         console.log('115 is unable to contact')
        //         canVisit115 = false;
        //         return null;
        //     }
        // }
        // return webresultText
        let content;
        //
        let fname = saveutil.getSaveName(oactionname)
        //
        let linkname = saveMockingData.getCurrentFileLink(fname)
        console.log('readFileLink:>>>>>', linkname, fname)
        if(linkname && linkname !== 'mock') {
            content = saveMockingData.getFileLinkContent(linkname)
            return content;
        }

        if(!content) content = readRelativeFile('../mocking/actions-local/', fname)
        if(!content) content = readRelativeFile('../mocking-default/actions/', fname)
        if(!content) content = readRelativeFile('../mocking/actions/', fname)
        //
        if(!content) content = readRelativeFile('../mocking/actions-local/', f_path)
        if(!content) content = readRelativeFile('../mocking-default/actions/', f_path)
        if(!content) content = readRelativeFile('../mocking/actions/', f_path)


        if(!content) {
            return null;
        }else{
            return content;
        }
    },
    getPlatformData: function (req){
        var result = {}
        var bodydata = req.body;
        var query = bodydata.query;
        if(!query)return result;
        var rootFolder = pathutil.resolve(__dirname, '../');
        query = JSON.parse(query)
        for(var uuid in query){
            var param = query[uuid];
            var wtype = param.__wtype;
            var fpath = rootFolder + '/mocking/actions/platform_widgets/' + wtype + '.compdata'
            if(fs.existsSync(fpath)){
                var data = readFile(fpath, 'utf8');
                if(data){
                    result[uuid] = JSON.parse(data);
                }
            }else{
                result[uuid] = 'no_mock_data:'+uuid+','+wtype
            }
        }
        result.common = {
          "belongId": -101
        }
        result = {
            data: result
        }
        return JSON.stringify(result)
    },
    listActions: function(){        
        var results = []
        //
        var fullfilepath = pathutil.resolve(__dirname, '../mocking/actions-local');
        var list = fs.readdirSync(fullfilepath)
        list.forEach(function(file) {
            var shortpath = file;
            file = fullfilepath + '/' + file
            var stat = fs.statSync(file)
            if (stat && !stat.isDirectory()) results.push(shortpath)
        })
        //
        var fullfilepath = pathutil.resolve(__dirname, '../mocking/actions');
        var list = fs.readdirSync(fullfilepath)
        list.forEach(function(file) {
            var shortpath = file;
            file = fullfilepath + '/' + file
            var stat = fs.statSync(file)
            if (stat && !stat.isDirectory()) results.push(shortpath)
        })
        //
        var fullfilepath = pathutil.resolve(__dirname, '../mocking/actions/platform_widgets');
        var resultsComp = []
        if (fs.existsSync(fullfilepath)) {
            var list = fs.readdirSync(fullfilepath)
            list.forEach(function(file) {
                var shortpath = file;
                file = fullfilepath + '/' + file
                var stat = fs.statSync(file)
                if (stat && !stat.isDirectory()) resultsComp.push(shortpath)
            })
        }
        var listof404 = localStatus.get('nofileUrls')
        listof404 = listof404 ? listof404 : [];

        return {
            files404: listof404,
            files: results,
            filesComp: resultsComp
        }
    },
    getActionContent: function(url){
        if(/\.compdata$/.test(url)) url = '/platform_widgets/' + url;
        var fullfilepath = pathutil.resolve(__dirname, '../mocking/actions/' + url);
        var fullsavepath = fullfilepath.replace(/(\/|\\)mocking(\/|\\)actions(\/|\\)/, '/mocking/actions-local/')
        var content;
        var prettifycontent;
        if(fs.existsSync(fullsavepath)) fullfilepath = fullsavepath;
        if(fs.existsSync(fullfilepath)) {
            content = fs.readFileSync(fullfilepath, 'utf8')
            prettifycontent = content;
            try{
                prettifycontent = jsonformatter.diffy(JSON.parse(content))
            }catch(e){
            }
        }
        return {
            content: content,
            prettifycontent: prettifycontent
        }
    }
}