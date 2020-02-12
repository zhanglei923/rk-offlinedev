let fs = require('fs');
let pathutil = require('path')
let _ = require('lodash')
let md5util = require('blueimp-md5')

let eachcontentjs = require('eachcontent-js')
var execSh = require("exec-sh");
let regParserMini = require('../utils/seajs/regParserMini')
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
    console.log((new Date()*1)-t0, oldmtimeHash, mtimeHash, changed)

    let requireReport = {}
    t0=(new Date()*1)
    eachcontentjs.eachContent(sourcepath, [/\.js$/,/\.tpl$/], (c, path, states)=>{
        //md5util(c)
        let requires = regParserMini.getRequires(c)
        requireReport[path] = requires;
    })
    console.log((new Date()*1)-t0)

    let requireReport2 = {}
    t0=(new Date()*1)
    eachcontentjs.eachContent(sourcepath, [/\.js$/,/\.tpl$/], (c, path, states)=>{
        //md5util(c)
        let requires = regParserMini.getRequires2(c)
        requireReport2[path] = requires;
    })
    console.log((new Date()*1)-t0)


    // fs.writeFileSync('./rpt.json', JSON.stringify(requireReport))
    // fs.writeFileSync('./rpt2.json', JSON.stringify(requireReport2))


}
module.exports = {
    run
};