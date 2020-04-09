//自动拆分web工程的工具
const fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
var execSh = require("exec-sh");
let moment = require('moment');
let makeDir = require('make-dir');
let eachcontentjs = require('eachcontent-js');

let static_path = `E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static`;
let new_workspace = `E:/workspaceGerrit/new_home`;
let plan = [
'source/products/creekflow,xsy-static-creekflow,test/2006',
'source/products/bi,xsy-static-bi',
'source/breeze,xsy-static-breeze',
'source/core,xsy-static-core',
'source/cpq,xsy-static-cpq',
'source/crm,xsy-static-crm',
'source/core/i18n,xsy-static-i18n',
'source/lib,xsy-static-lib',
'source/oldcrm,xsy-static-oldcrm'
]

plan.forEach((msg)=>{
    let arr = msg.split(',');
    let folder = arr[0];
    let projectname = arr[1];
    let projectbranch = arr[2]?arr[2]:'master';

    let fullfolder = pathutil.resolve(static_path, folder);

    console.log(fs.existsSync(fullfolder), fullfolder)
})