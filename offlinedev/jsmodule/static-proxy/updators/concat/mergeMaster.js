let eachcontentjs = require('eachcontent-js')
let rk = require('../../../utils/rk')
var fs_readFile = require('../../../static-proxy/supports/fs_readFile')
var seajsUtil = require('../../../utils/seajs/seajsUtil')
var updateStaticsUrl = require('../../../static-proxy/updators/updateStaticsUrl')
var configUtil = require('../../../config/configUtil')

let prepareMergeStrategy = function (sourcefolder){
    let js_list = []
    let tpl_list = []
    eachcontentjs.eachPath(sourcefolder, /(\.js|\.tpl)$/,(fpath)=>{
        if(!rk.isCookedJsPath(fpath)){
            if(fpath.match(/\.js$/)) js_list.push(fpath)
            if(fpath.match(/\.tpl$/)) tpl_list.push(fpath)
        }
    })
}
let getMergeStrategy = function (sourcefolder){
    //
}
module.exports = {
    prepareMergeStrategy,
    getMergeStrategy
}