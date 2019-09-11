var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash');
var decomment = require('decomment');
var stripcomments = require('strip-comments')
let cacheUtil = require('./cacheUtil')

var rk = {
    fetchChinese: function(src){
        var arr = []
        if(/[\s?\u4e00-\u9fa5\，\。\：\,]+/ig.test(src)){
            var words0 = src.match(/[\s?\u4e00-\u9fa5\，\。\：\,]+/ig);
            var words = [];
            for(var j =0; j<words0.length;j++){
                var w = _.trim(words0[j]);
                if(w){
                    w = _.trim(w)
                    if(w && w !== '?' && w !== ',' && w !== '.' && w !== ':' && w.replace('?')) {
                        arr.push(w);
                    }
                }
            }
        }
        return arr;
    },
    htmlEscape: function (s) {
        var type = typeof s;
        if (!s || type != 'string') return s;
        return (s + '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#039;')
            .replace(/"/g, '&quot;')
            .replace(/\n/g, '<br />');
    },
    cleanComments: function(str){
        let cachekey = 'rk_cleanComments';
        let md5 = cacheUtil.md5(str);
        let cached = cacheUtil.getCache(cachekey, md5)
        if(cached) return cached;
        let code = str;
        try{
            code = stripcomments(str);
        }catch(e){
            console.log('[stripcomments]: bad javascript!')
        }
        cacheUtil.setCache(cachekey, md5, code)
        return code;
    },
    isJsonString: function(str){
            var yesitis = true;
            try{
                JSON.parse(str);
                return true;
            }catch(e){
                //console.log(e, str)
                return false;
            }
    },    
    getAllFolders: function(dir) {
        var me= this;
        var results = []
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory()) results.push(file);
        })
        return results;
    },
    getAllFiles: function(dir) {
    	var me= this;
        var results = []
        if(!fs.existsSync(dir)) return results;
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory()) results = results.concat(me.getAllFiles(file))
            else results.push(file)
        })
        return results;
    },
    eachPath: function(dir, regs, fn){
    	var me = this;
        var allFileList = me.getAllFiles(dir);
        for(var j = 0, lenj = regs.length; j < lenj; j++){
            var reg = regs[j];
            for(var i = 0, len = allFileList.length; i < len; i++){
                var path = allFileList[i];
                if(reg.test(path)){
                    (fn)(path);
                }else{
                    if(reg.test(path)){//无语，第一次正则校验虽然是true，但if分支没有进入，因此只得做第二次，疑似是nodejs的bug
                        (fn)(path);
                    }
                }
            }
        }
    },
    eachContent: function(dir, regs, fn){
    	var me = this;
        me.eachPath(dir, regs, function(path){
            var content = fs.readFileSync(path,'utf8');
            var states = fs.statSync(path);
            (fn)(content, path, states);
        });            
    }
}
module.exports = rk;