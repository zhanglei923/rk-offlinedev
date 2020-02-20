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

/**
 * 原理说明：
 *  - seajs有个硬伤，就是一个js函数只允许有一个define，如果有多个，也只会有一个有效。
 *  - 这就非常不利于聚合。
 *  - 因此，思路是将源代码里的define重命名，将多个js文件合并后，包裹一个新的define函数。
 *  - 而且，
 *  - seajs的define函数不利于聚合js，因为它会有return语句，导致聚合后的代码执行中断。
 *  - 因此解决思路是，拦截并重写了define函数，源代码里不允许return了，return的obj被基于pathid缓存了下来。
 *  - 这样以来，在require时，基于pathid返回给变量，比如var a = require('../a')，这个返回是从缓存里取的。
 * 
 * 
 * 
 */


let funprefix = 'rk_offlinedev_debug';
let updateRouterJs = (content)=>{
    content = content.replace(/function\s{1,}goError/g, 
`
;delete window.rk_offlinedev_do_original_return;//需要在web的router.js的seajs.use(里，设成false，这样后面define函数就不走seajs的return了，便于聚合js代码

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
            let pathidVarName = `${funprefix}_pathid${(Math.random()+'').replace(/\./g,'')}`
            let returnVarName = `${funprefix}_return${(Math.random()+'').replace(/\./g,'')}`
            let info = {
                pathid
            }
            let infostr = encodeURIComponent(JSON.stringify(info))
            newcontent = 
`define(function (require, exports, module) {
    let ${pathidVarName}="${pathid}";
    ;"rk-^^^^^^^^^^";"${infostr}";"rk-$$$$$$$$$$";//这里供外界用function.toString获取到pathid
    rk_offlinedev.this_path_id = ${pathidVarName};
    require = rk_offlinedev_update_require(require, ${pathidVarName});
    let ${returnVarName} = ${funprefix}_${newcontent}
    if(typeof ${returnVarName} !== "undefined") rk_offlinedev_pathid_cache[${pathidVarName}] = ${returnVarName}; 
    if(window.rk_offlinedev_do_original_return)return rk_offlinedev_pathid_cache[${pathidVarName}];
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