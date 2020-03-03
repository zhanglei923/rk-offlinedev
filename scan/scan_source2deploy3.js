let fs = require('fs')
let pathutil = require('path')
let util = require('util')
let _ = require('lodash')
let makeDir = require('make-dir')
let execSh = require('exec-sh')
let is_path_inside = require('is-path-inside')
let configUtil = require('../offlinedev/jsmodule/config/configUtil');
configUtil.reloadConfig();
let alias = global.rkGlobalConfig

let rk = require('../offlinedev/jsmodule/utils/rk')
let parser = require('../offlinedev/jsmodule/utils/seajs/regParserMini')
let seajsUtil = require('../offlinedev/jsmodule/utils/seajs/seajsUtil')
let eachcontentjs = require('eachcontent-js')

let sea_alias = {
    'rk': 'core/rkloader',
    'fancymap': 'lib/fancymap.js',
    'commonjs': 'core/widgets/common.js',
    'globaljs': 'core/widgets/global.js',
    'userService': 'core/services/2.0/rk_userService',
    'workreportService': 'core/services/2.0/rk_workreportService',
    'noticeService': 'core/services/biz/noticeService',
    'xsy': 'platform/core/xsyloader',
    'scheduleService': 'core/services/biz/scheduleService'
}

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let deploypath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/deploy`

eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fullfilepath, states)=>{
    if(!rk.isCookedJsPath(fullfilepath)){
        let content2 = seajsUtil.changeJsToDeploy(sourcepath, fullfilepath, sea_alias, content)
        let deploypath = fullfilepath.replace(/\/\bsource\b\//g, '/deploy/');
        //console.log(deploypath)
        // fs.writeFileSync(deploypath, content2)
        fs.writeFileSync(fullfilepath, content2)
    }
})