//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
var getConfig = require('../../config/configUtil')
let regParserMini = require('../../utils/seajs/regParserMini');

let isFirstJs = (fpath)=>{
    if(fpath.match(/seajs\/sea\.js$/)){
        return true;
    }
    return false;
}
let CacheOfAllTpl = {}
let updateAllTplJson = ()=>{
    let sourceDir = getConfig.getSourceFolder();
    eachcontentjs.eachContent(sourceDir, [/\.tpl$/], (content, path, states)=>{
        let pathid = pathutil.relative(sourceDir, path);
        //console.log(pathid)
        CacheOfAllTpl[pathid] = content;
    })
}
let updateFirstJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticRequests')
    if(!enable) return content;

    let fullfilepath = info.fullfilepath;
    let userconfig = getConfig.getUserConfig()
    
    if(isFirstJs(fullfilepath)){
        updateAllTplJson()
        let dir = pathutil.parse(__filename).dir;
        let srcpath = pathutil.resolve(dir, './code/default_script.js');
        let defaultjs = fs.readFileSync(srcpath, 'utf8')

        let alltpljson = `${JSON.stringify(CacheOfAllTpl)}`

        defaultjs += `;window.rk_offlinedev.userConfig=`+JSON.stringify(userconfig);
        defaultjs += `;window.rk_offlinedev.ALL_TPL_JSON=`+alltpljson;
        defaultjs += `\n//****** END *******//\n`

        content = defaultjs + content;
    }
    return content;
}
let updateJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticRequests')
    if(!enable) return content;
    let fullfilepath = info.fullfilepath;

    if(!isFirstJs(fullfilepath)){
        let staticDir = getConfig.getStaticFolder();
        let sourceDir = getConfig.getSourceFolder();
    
        let fdir = pathutil.parse(fullfilepath).dir;
        let deps = regParserMini.getRequires(content);
        deps.forEach((info)=>{
            let req_path = info.rawPath;
            let req_realpath;
            if(req_path.match(/^\./)) {
                req_realpath = pathutil.resolve(fdir, req_path);
            }else{
                req_realpath = pathutil.resolve(sourceDir, req_path);
            }
            var replacereg = new RegExp('require[\\s]?[\(][\\s]{0,}(\'|")'+req_path+'(\'|")', 'g');
            if(req_path.match(/\.tpl$/)){
                if(fs.existsSync(req_realpath)){
                    let split = `,,,`
                    let pathid = pathutil.relative(sourceDir, req_realpath);
                    content = content.replace(replacereg, `require("${req_path}${split}${pathid}"`)    
                    // console.log(req_path, staticDir)
                    // console.log(fdir)
                    // console.log(req_realpath)
                    // console.log('pathid',pathid)
                }
            }else if(0){
                if(!fs.existsSync(req_realpath)) req_realpath = req_realpath + '.js';
                if(fs.existsSync(req_realpath)){
                    let pathid = pathutil.relative(sourceDir, req_realpath);
                    let hotpath = pathutil.parse(pathid).dir + '/__hot_folder.js'
                    content = content.replace(replacereg, `require("${hotpath}"`);
                }
            }
        });
    }

    return content;
}
module.exports = {
    isFirstJs,
    updateFirstJs,
    updateJs
};