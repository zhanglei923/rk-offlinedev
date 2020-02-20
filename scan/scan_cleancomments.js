let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;

let funprefix = 'rk_offlinedev_debug';
let has=0,nothas=0;
eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
    if(!rk.isCookedJsPath(fpath) ){
        let clean = rk.cleanCommentsFast(content);
        let hasexport = /module\.exports/.test(content);
        if(hasexport) console.log(fpath)
        //fs.writeFileSync(fpath, clean);
    }
});
console.log(new Date()*1-t0)