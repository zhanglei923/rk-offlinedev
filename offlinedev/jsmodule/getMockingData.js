var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var requester = require('sync-request');
var jsonformatter = require('format-json');

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
var canVisit115 = true;
module.exports = {
    getData: function(actionname, req){
        //if(data_cache[actionname]) return data_cache[actionname]
        actionname = actionname.split('?')[0]

        if(actionname.indexOf('load-pagedata.action') >= 0 || actionname.indexOf('load-compdata.action') >= 0){
            return this.getPlatformData(req);
        }
        var tail = getParamAsSurfix(req.query)
        var actionname = actionname.replace(/\//ig, '~~').replace(/\.action$/, '');
        var fpath = '/actions/' + actionname + (!tail ? '' : '.' + tail) + '.action'        
        if(canVisit115){
            try{//test
                //console.log(fpath)
                var furl = 'http://10.10.0.115/public/offlinedev/mocking/' + fpath
                var data = requester('GET', furl, {timeout: 2000});   
                //console.log(furl) 
                var webresultText = data.statusCode === 200 ? data.getBody().toString() : null;
                //console.log('webresultText', webresultText)
            }catch(e){
                console.log('115 is unable to contact')
                canVisit115 = false;
                return null;
            }
        }
        //return webresultText
        var fullfilepath = pathutil.resolve(__dirname, '../mocking-default/'+fpath);
        //console.log('fullfilepath: ', fullfilepath)
        if (!fs.existsSync(fullfilepath)) {
            fullfilepath = pathutil.resolve(__dirname, '../mocking/'+fpath);
            if (!fs.existsSync(fullfilepath)) {
                fullfilepath =  pathutil.resolve(__dirname, '../mocking/actions/' + actionname + '.action')
            }
        }
        if (!fs.existsSync(fullfilepath)) {
            return null;
        } else {
            var data = readFile(fullfilepath, 'utf8');
            data_cache[actionname] = data;
            return data;
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
        var fullfilepath = pathutil.resolve(__dirname, '../mocking/actions');
        var results = []
        var list = fs.readdirSync(fullfilepath)
        list.forEach(function(file) {
            var shortpath = file;
            file = fullfilepath + '/' + file
            var stat = fs.statSync(file)
            if (stat && !stat.isDirectory()) results.push(shortpath)
        })
        var fullfilepath = pathutil.resolve(__dirname, '../mocking/actions/platform_widgets');
        var resultsComp = []
        var list = fs.readdirSync(fullfilepath)
        list.forEach(function(file) {
            var shortpath = file;
            file = fullfilepath + '/' + file
            var stat = fs.statSync(file)
            if (stat && !stat.isDirectory()) resultsComp.push(shortpath)
        })
        return {
            files: results,
            filesComp: resultsComp
        }
    },
    getActionContent: function(url, prettify){
        if(/\.compdata$/.test(url)) url = '/platform_widgets/' + url;
        var fullfilepath = pathutil.resolve(__dirname, '../mocking/actions/' + url);
        var content = fs.readFileSync(fullfilepath, 'utf8')
        //console.log(content)
        if(prettify){
            try{
                content = jsonformatter.diffy(JSON.parse(content))
            }catch(e){
            }
        }
        return {
            content: content
        }
    }
}