let eachcontentjs = require('eachcontent-js')
var stripcomments = require('strip-comments')
let rk = require('./offlinedev/jsmodule/utils/rk')
var getConfig = require('./offlinedev/jsmodule/config/configUtil')
 
let uconfig = getConfig.getUserConfig()
let webapppath = getConfig.getWebAppFolder();
let sourcepath = getConfig.getSourceFolder();

let gaienttxt = []

let t0 = new Date()*1;
eachcontentjs.eachContent(sourcepath, /\.(js|tpl|css)$/, (content)=>{
    gaienttxt.push(content);
})
let t1 = new Date()*1;
console.log('io:', t1 - t0 + 'ms')
gaienttxt.forEach((txt)=>{
    txt = txt.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
    //stripcomments(txt)
})
let t2 = new Date()*1;
console.log('cpu:', t2 - t1 + 'ms')