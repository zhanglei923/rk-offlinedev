let fs = require('fs');
let pathutil = require('path')
let _ = require('lodash')
let md5util = require('blueimp-md5')

let eachcontentjs = require('eachcontent-js')
var execSh = require("exec-sh");
let statusUtil = require('../config/statusUtil')


let run = ()=>{
    let sourcepath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`
    let t0=new Date()*1
    let allTpl = {}
    let allmtime = '';
    eachcontentjs.eachStatus(sourcepath, [/\.js$/,/\.tpl$/], (states, path)=>{
        let mtime = states.ctimeMs;
        let mtime36 = mtime.toString(36)
        allmtime += mtime36;
        //console.log(path)
    })
    let mtimeHash = md5util(allmtime)

    let changed = false;
    let STATUS_KEY = 'CONCATURLS_All_Js-Tpl-Files_Mtime-Hash'

    let oldmtimeHash = statusUtil.getData(STATUS_KEY)
    if(oldmtimeHash !== mtimeHash) changed = true;

    statusUtil.setData(STATUS_KEY, mtimeHash)
    console.log((new Date()*1)-t0, allmtime.length, oldmtimeHash, mtimeHash, changed)
}
module.exports = {
    run
};