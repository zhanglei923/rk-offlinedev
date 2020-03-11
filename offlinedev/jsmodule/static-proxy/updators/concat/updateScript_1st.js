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
        console.log(new Date()*1 - t0)
        //hot_concat.loadHotFileConcats(sourcefolder)
    }
    return content;
}
module.exports = {
    updateJs
};