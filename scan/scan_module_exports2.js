let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;

let updateScriptForCmdConcat = require('../offlinedev/jsmodule/static-proxy/updateDevelopersScript/updateScriptForCmdConcat')
eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
    let info = {
        fullfilepath:fpath,
        sourceFolder:sourcepath
    }
    content = updateScriptForCmdConcat.updateJs(info, content)
    fs.writeFileSync(fpath, content)
});

console.log(new Date()*1-t0)