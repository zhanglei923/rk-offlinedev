var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')

module.exports = {
    isMyHotUrl:(url)=>{
        return /\_hotresponse\_\.js$/.test(url);
    },
    load:(webappFolder, url, callback)=>{
        // https://crm-dev61rs.ingageapp.com/static/source/products/bi/common/service/_hotresponse_.js
        let dir = pathutil.parse(url).dir;
        dir = dir.replace(/^\/{1,}/, './')
        dir = pathutil.resolve(webappFolder, dir);
        //console.log('dir=', dir)
        if(!fs.existsSync(dir)){
            console.log(`[rk error]not found: ${dir}`)
            callback(null)
            return;
        }
        let files = []
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file
            //console.log(file)
            var stat = fs.statSync(file)
            if (stat && !stat.isDirectory()) {
                files.push(file)
            }
        })
        let jsfiles = [];
        files.forEach((fullfilepath)=>{
            if(fullfilepath.match(/\.js$/)) jsfiles.push(fullfilepath)
        });
        let len = jsfiles.length;
        let fullcontent = ''
        let onall = (fullcontent)=>{
            fullcontent = `define(function (require, exports, module) {;\n${fullcontent};\n});`;
            callback(fullcontent);
        }
        jsfiles.forEach((fullfilepath)=>{
            fs_readFile.fs_readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent, fileinfo) => {  
                len--;
                if(err){}else{
                    let fromSubPrj = {};
                    let cmdinfo = {};
                    let info = {fromSubPrj, fullfilepath, fileinfo, sourceFolder, cmdinfo}
                    jsContent = updateScriptForCmdConcat.updateJs(info, jsContent, false)
                    fullcontent += `;\n//${fullfilepath}\n;${jsContent}`
                }
                if(len === 0){
                    onall(fullcontent)
                }
            });
        })
    }
};