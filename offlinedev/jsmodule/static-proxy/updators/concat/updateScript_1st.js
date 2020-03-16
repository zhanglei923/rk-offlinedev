//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
let hot_concat = require('./hot_concat')
var getConfig = require('../../../config/configUtil')

let isFirstJs = (fpath)=>{
    if(fpath.match(/seajs\/sea\.js$/)){
        return true;
    }
    return false;
}
let updateJs = (info, content)=>{        
    let fullfilepath = info.fullfilepath;
    if(isFirstJs(fullfilepath)){
        //在第一个请求这里，更新聚合计划
        //
        let sourcefolder = info.sourceFolder;
        let t0 = new Date()*1;
        hot_concat.loadHotFileConcatPlan(sourcefolder);
        hot_concat.excuteConcatPlan(sourcefolder);
        console.log('plan cost:')
        console.log(new Date()*1 - t0)
        //hot_concat.loadHotFileConcats(sourcefolder)

        if(global.rkCacheOf_autoConcatPlan){//如果是concat聚合模式，那么生成聚合js的文件列表
            let hot_concat_bundle_files = [];
            for(let pathid in global.rkCacheOf_autoConcatPlan){
                hot_concat_bundle_files.push(pathid)
            }
            content = content +';\n'+ `window.rk_offlinedev.hot_concat_bundle_files=${JSON.stringify(hot_concat_bundle_files)}`;
        }
    }
    return content;
}
module.exports = {
    updateJs
};