let fs = require('fs')
let scan_SeajsRequires = require('../scan_SeajsRequires')

let configUtil = require('../../jsmodule/config/configUtil');
let webprojectUtil = require('../../jsmodule/config/webprojectUtil');
configUtil.reloadConfig();
let seaconfig = webprojectUtil.getSeaConfig()

let staticroot = `E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static`
let fpath = `${staticroot}/source/page/js/privatemsg/privateMsgDetailCtrl.js`
let jscontent = fs.readFileSync(fpath, 'utf8')
let result = scan_SeajsRequires.scan(staticroot, fpath, jscontent)

//console.log(result)