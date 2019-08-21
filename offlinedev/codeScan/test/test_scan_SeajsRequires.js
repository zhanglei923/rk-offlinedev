let fs = require('fs')
let scan_SeajsRequires = require('../scan_SeajsRequires')

let fpath = 'E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static/source/page/js/privatemsg/privateMsgDetailCtrl.js'
let jscontent = fs.readFileSync(fpath, 'utf8')
scan_SeajsRequires.scan(fpath, jscontent)