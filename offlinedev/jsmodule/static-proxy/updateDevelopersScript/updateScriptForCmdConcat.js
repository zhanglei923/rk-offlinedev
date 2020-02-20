//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let os = require('os');
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../utils/rk')
let fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')
let regParserMini = require('../../utils/seajs/regParserMini');
let seajsUtil = require('../../utils/seajs/seajsUtil');

let funprefix = 'rk_offlinedev_debug';
let updateRouterJs = (content)=>{
    content = content.replace(/function\s{1,}goError/g, 
`
;delete window.rk_offlinedev_do_original_return;//这句话是rk-offlinedev注入的

function goError`
)
    return content;
}
let updateJs = (info, content)=>{
    let enable = getConfig.getValue('debug.concatStaticJsRequests')
    if(!enable) return content;

    if(info.fullfilepath.indexOf('static/router.js')>=0) {
        return updateRouterJs(content);//加一句话
    }
    if(info.fullfilepath.indexOf('source')<=0) return content;//不是source目录里的
    let fullfilepath = info.fullfilepath;

    let sourcepath = info.sourceFolder;

    let pathid = pathutil.relative(sourcepath,  fullfilepath)
    //console.log('pathid=', pathid)
    if(content.indexOf(funprefix)<=0)
    if(!rk.isCookedJsPath(fullfilepath) && !rk.isLibJsPath(fullfilepath) && rk.mightBeCmdFile(content)){
        content = _.trim(content);
        let arr = content.split('define');
        let header = arr[0];
        if(header) header = _.trim(rk.cleanComments(header));            
        if(header) {
            //头部有问题
            console.log('[RK 源代码异常]这个文件不是cmd格式，也没放到/lib目录下', pathid)
            // console.log('header:', header)
            // console.log('fullfilepath:', fullfilepath)
            // console.log('pathid:', pathid)
        }else{
            arr[0]='';
            for(let i=0;i<3;i++){//节约时间                
                if(arr[i])
                arr[i] = arr[i].replace(/\(\s?require\s?\,\s?exports\s?\,\s?module\s?\)/g, '(/** replaced by rk-offlinedev **/)')
            }
            let newcontent = arr.join('define');
            let returnVarName = `${funprefix}_${(Math.random()+'').replace(/\./g,'')}`
            newcontent = 
`define(function (require, exports, module) {
    let rk_offlinedev_this_path_id="${pathid}";
    ;"rk-^^^^^^^^^^";"${pathid}";"rk-$$$$$$$$$$";//这里供外界用function.toString获取到pathid
    rk_offlinedev.this_path_id = rk_offlinedev_this_path_id;
    require = rk_offlinedev_update_require(require, rk_offlinedev_this_path_id);
    let ${returnVarName} = ${funprefix}_${newcontent}
    if(typeof ${returnVarName} !== "undefined") rk_offlinedev_pathid_cache[rk_offlinedev_this_path_id] = ${returnVarName}; 
    if(window.rk_offlinedev_do_original_return)return rk_offlinedev_pathid_cache[rk_offlinedev_this_path_id];
});`
            //fs.writeFileSync(fullfilepath, newcontent)
            return newcontent;
        }

    }


    return content;
}
module.exports = {
    updateJs
};