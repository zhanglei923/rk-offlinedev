let fs = require('fs');
let _ = require('lodash')
let pathutil = require('path')

let eachcontentjs = require('eachcontent-js')
var execSh = require("exec-sh");
let statusUtil = require('../config/statusUtil')

let run = ()=>{
    let sourcepath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`
    let t0=new Date()*1
    let allTpl = {}
    eachcontentjs.eachPath(sourcepath, [/\.js$/,/\.tpl$/], (content, path, states)=>{
        //console.log(path)
    })
    console.log((new Date()*1)-t0)
}
module.exports = {
    run
};