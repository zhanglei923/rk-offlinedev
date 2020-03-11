var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../../utils/fs_readFile')
let eachcontentjs = require('eachcontent-js')
let makeDir = require('make-dir')
let rk = require('../../utils/rk')
let seajsUtil = require('../../utils/seajs/seajsUtil')
var getConfig = require('../../config/configUtil')

let updateScript_cmd_HOT = require('../updators/updateScript_cmd_HOT')

module.exports = {
    isMyHotUrl:(url)=>{
        return url.match(/autoconcat\_HOT\.js$/);
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
            if(!rk.isCookedJsPath(fpath) && !rk.isLibJsPath(fpath)){
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

        if(len===0) {
            callback('')
            return;
        }

        let fullcontent = ''

        let myfolder = pathutil.parse(__filename).dir
        let debugFolder = pathutil.resolve(myfolder, './debug_hot_urls');
        let debugFilePath = rk_formatPath(debugFolder+'/'+url);
        let debugFileFolder = rk_formatPath(pathutil.parse(debugFilePath).dir);

        let onall = (fullcontent)=>{
            if(fs.existsSync(pathutil.resolve(myfolder, './.dodebug'))){//新建一个debug的文件，启动debug模式
                console.log('debug模式，写入debug目录备查')
                // console.log('debugFilePath=',debugFilePath)
                // console.log('debugFileFolder=', debugFileFolder)
                makeDir.sync(debugFileFolder)
                try{
                    fs.writeFileSync(debugFilePath, fullcontent)
                }catch(e){

                }
            }
            callback(fullcontent);
        }
        if(fs.existsSync(debugFilePath)){
            console.log('从debug目录读取的', debugFilePath)
            let txt = fs.readFileSync(debugFilePath, 'utf8')
            txt = `//这是从debug目录读取的文件，并非内存里的hot\n//这是从debug目录读取的文件，并非内存里的hot\n//这是从debug目录读取的文件，并非内存里的hot\n`+txt;
            //console.log(txt)
            callback(txt)
            return;
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
                        info.no_hot_url = true;
                        let sourcepath = info.sourceFolder;
                        let alias = global.rkGlobalConfig.runtime.seajsConfig.alias;
                        let deploycontent = seajsUtil.changeJsToDeploy(sourcepath, fullfilepath, alias, jsContent, info)
                        //jsContent = updateScript_cmd_HOT.updateJs(info, jsContent)
                        fullcontent += `;\n//${fullfilepath}\n;${deploycontent}`
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
                    let sourcepath = info.sourceFolder;                
                    let deploycontent = seajsUtil.changeTplToDeploy(sourcepath, fullfilepath, tplContent)
                    //tplContent = updateScript_cmd_HOT.updateTpl(info, tplContent)
                    fullcontent += `;\n//${fullfilepath}\n;${deploycontent}`
                }
                if(len === 0){
                    onall(fullcontent)
                }
            });
        })
    }
};