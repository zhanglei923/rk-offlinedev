let eachcontentjs = require('eachcontent-js')
let seajsUtil = require('../seajsUtil')
let rk = require('../../rk')
// define(function(require, exports, module) {
let sourcepath=`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`
//看看definetype1是否准确
eachcontentjs.eachContent(sourcepath, /\.js$/,(content, fpath, states)=>{
    if(!rk.isCookedJsPath(fpath)){
        let match = content.match(seajsUtil.definetype1);
        if(!match && 
            content.indexOf('define')>=0 &&
            content.indexOf('require')>=0 &&
            content.indexOf('exports')>=0 &&
            content.indexOf('module')>=0
        ){
            console.log(fpath)
        }
    }
})