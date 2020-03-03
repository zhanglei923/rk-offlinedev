var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../supports/fs_readFile')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../utils/rk')
let seajsUtil = require('../../utils/seajs/seajsUtil')
var getConfig = require('../../config/configUtil')

let updateScript_cmd_HOT = require('../updators/updateScript_cmd_HOT')

module.exports = {
    isMyHotUrl:(url)=>{
        return /autoconcat\_HOT\.js$/.test(url);
    },
    load:(config, url, callback)=>{
        // https://crm-dev61rs.ingageapp.com/static/source/products/bi/common/service/_hotresponse_.js
        let sourceFolder = config.sourceFolder;
        let webappFolder = config.webappFolder;
        let thispathid = pathutil.relative('/static/source', url)
        let dir = pathutil.parse(url).dir;
        dir = dir.replace(/^\/{1,}/, './')
        dir = pathutil.resolve(webappFolder, dir);
        //console.log('dir=', dir)
        if(!fs.existsSync(dir)){
            console.log(`[rk error]not found: ${dir}`)
            callback(null)
            return;
        }
        let jslist = []
        eachcontentjs.eachPath(dir, /\.js$/, (fpath)=>{
            if(!rk.isCookedJsPath(fpath)){
                jslist.push(fpath)
            }
        })
        let tpllist = []
        eachcontentjs.eachPath(dir, /\.tpl$/, (fpath)=>{
            tpllist.push(fpath)
        })
        //callback(jslist.join('<br>'))
        let len = jslist.length;
        len += tpllist.length;

        if(len===0) callback('')

        let fullcontent = ''
        let onall = (fullcontent)=>{
            callback(fullcontent);
        }
        jslist.forEach((fullfilepath)=>{
            fs_readFile.fs_readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent, fileinfo) => {  
                len--;
                if(err){}else{
                    let fromSubPrj = {};
                    let cmdinfo = {};
                    let info = {fromSubPrj, fullfilepath, fileinfo, sourceFolder, cmdinfo}
                    if(jsContent.match(seajsUtil.definetype1)){
                        info.thispathid = thispathid;
                        jsContent = updateScript_cmd_HOT.updateJs(info, jsContent)
                        fullcontent += `;\n//${fullfilepath}\n;${jsContent}`
                    }
                }
                if(len === 0){
                    onall(fullcontent)
                }
            });
        })
        tpllist.forEach((fullfilepath)=>{
            fs_readFile.fs_readFile(fullfilepath, {encoding:'utf8'}, (err, tplContent, fileinfo) => {  
                len--;
                if(err){}else{
                    let fromSubPrj = {};
                    let cmdinfo = {};
                    let info = {fromSubPrj, fullfilepath, fileinfo, sourceFolder, cmdinfo}
                    tplContent = updateScript_cmd_HOT.updateTpl(info, tplContent)
                    fullcontent += `;\n//${fullfilepath}\n;${tplContent}`
                }
                if(len === 0){
                    onall(fullcontent)
                }
            });
        })
    }
};