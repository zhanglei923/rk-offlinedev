let fs = require('fs')
let pathutil = require('path')
const readline = require('readline');

let _ = require('lodash')
var decomment = require('decomment');
var stripcomments = require('strip-comments')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let CleanCSS = require("clean-css")
let parseCssUrls = require("css-url-parser")

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;

let updateScript_CmdConcat = require('../offlinedev/jsmodule/static-proxy/updators/updateScript_CmdConcat')
var options = { /* options */ };
let newcleaner =  new CleanCSS(options)

let rpt = []
eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{

    let horizontal_len=0;
    let vertical_len=0;
    let content2 = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let lines = content2.split('\n');
    if(fpath.indexOf('baseEchartsDataAdapterUtil')>=0){
        //console.log(lines)
    }
    //vertical_len = lines.length;
    lines.forEach((line)=>{
        vertical_len +=1;
        horizontal_len += line.length;
    })
    rpt.push({
        vertical_len,
        horizontal_len,
        val: horizontal_len / vertical_len,
        fpath
    })
    //console.log(fpath, vertical_len / horizontal_len);
    
});

rpt = _.sortBy(rpt, [function(o) { return o.val; }]).reverse();
fs.writeFileSync('./rpt.json', JSON.stringify(rpt))

rpt.forEach((o)=>{
    if(o.val > 300){

    }else{
        //console.log(o.fpath)
        stripcomments(fs.readFileSync(o.fpath, 'utf8'))
    }
})


console.log('done:', new Date()*1-t0)


console.log(new Date()*1-t0)