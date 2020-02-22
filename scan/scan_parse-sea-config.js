let fs = require('fs')
const readline = require('readline');
let pathutil = require('path')
let _ = require('lodash')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/sea-config.js`
let t0=new Date()*1;

let parseSeajsConfig = (sourcepath)=>{
    let content = fs.readFileSync(sourcepath,'utf8');
    let arr = content.split('\n');
    let keyvalue = []
    let isIn = false;
    arr.forEach((line)=>{
        if(isIn && /\}/.test(line)) isIn = false;
        if(isIn){
            keyvalue.push(line)
        }
        if(/\balias\b\s{0,}\:/g.test(line)) isIn = true;

    })
    let jsonstr = `{${keyvalue.join('')}}`;
    //console.log(jsonstr)
    let json;
    eval(`json = ${jsonstr}`)
    console.log(json)
}
parseSeajsConfig(sourcepath)
console.log(new Date()*1-t0)