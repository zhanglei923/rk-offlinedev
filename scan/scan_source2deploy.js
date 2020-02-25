let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let makeDir = require('make-dir')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let deploypath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/deploy2`
let t0=new Date()*1;

makeDir.sync(deploypath)

eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
    let pathid = pathutil.relative(sourcepath, fpath);
    let newpath = pathutil.resolve(deploypath, pathid);
    let newdir = pathutil.parse(newpath).dir;
    makeDir.sync(newdir)
    //console.log(newpath)
    fs.writeFileSync(newpath, content)
});
console.log(new Date()*1-t0)