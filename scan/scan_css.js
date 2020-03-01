let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let CleanCSS = require("clean-css")
let parseCssUrls = require("css-url-parser")

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;

let updateScript_CmdConcat = require('../offlinedev/jsmodule/static-proxy/updators/updateScript_CmdConcat')
var options = { /* options */ };
let newcleaner =  new CleanCSS(options)

if(0)
eachcontentjs.eachContent(sourcepath, /\.css$/, (content, fpath)=>{
    let output = newcleaner.minify(content);
    fs.writeFileSync(fpath, output.styles)
});

if(1)
eachcontentjs.eachContent(sourcepath, /\.css$/, (content, fpath)=>{
    let fpathinfo = pathutil.parse(fpath);
    let dir = fpathinfo.dir;
    var cssUrls = parseCssUrls(content);
    cssUrls = _.uniq(cssUrls)
    let badurls = []
    cssUrls.forEach((raw_url)=>{
        let fullurl;
        let ishttp = false;
        if(raw_url.match(/^http\s{0,1}\:/)){
            fullurl = raw_url;
            ishttp = true;
        }else if(raw_url.match(/^\//)){
            fullurl = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp` + raw_url;
        }else{
            fullurl = pathutil.resolve(dir, raw_url);
        }
        if(ishttp) console.log(fullurl)
        fullurl = fullurl.split('?')[0]
        if(!ishttp && !fs.existsSync(fullurl)){
            badurls.push(fullurl)
        }
    })
    if(badurls.length > 0)fs.writeFileSync(fpath, badurls.join('\n')+'\n'+content);
});

console.log(new Date()*1-t0)