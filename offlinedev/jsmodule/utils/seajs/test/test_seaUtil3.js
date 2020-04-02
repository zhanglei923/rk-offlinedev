let eachcontentjs = require('eachcontent-js')
let fs = require('fs')
let seajsUtil = require('../seajsUtil')
let rk = require('../../rk')

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
global.rk_masterSourceFolder = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`
let fullfilepath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/products/creekflow/creekflow/index.js`

let content = fs.readFileSync(fullfilepath, 'utf8')
let deploycontent = seajsUtil.changeJsToDeploy(fullfilepath, sea_alias, content)
fs.writeFileSync(fullfilepath, deploycontent)

fullfilepath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/products/creekflow/creekflow/index.tpl`
content = fs.readFileSync(fullfilepath, 'utf8')
deploycontent = seajsUtil.changeTplToDeploy(fullfilepath, content)
fs.writeFileSync(fullfilepath, deploycontent)