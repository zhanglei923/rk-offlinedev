let fs = require('fs')
let eachcontentjs = require('eachcontent-js')
let seajsUtil = require('../seajs/seajsUtil')
let rk = require('../rk')
// define(function(require, exports, module) {
let sourcepath=`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`

let content = `
//a
require('https://xxx.com')
b;
`
content = rk.cleanCommentsFast(content);
console.log(content)
return;

let t0 = new Date()*1;    
eachcontentjs.eachContent(sourcepath, /\.js$/,(content, fpath, states)=>{
    if(!rk.isCookedJsPath(fpath)){
        content = rk.cleanCommentsFast(content);
        fs.writeFileSync(fpath, content)
    }
})
console.log(`[Pre-Load] cost:`, ((new Date()*1)-t0)+'ms');    