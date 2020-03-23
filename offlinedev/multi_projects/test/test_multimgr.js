let fs = require('fs')
let multiProjectsMgr = require('../multiProjectsMgr');

let webproject = `E:/workspaceGerrit/_sub_separation_test/apps-ingage-web`;
multiProjectsMgr.loadConfig(webproject)
let info = multiProjectsMgr.reportStatus(webproject);

fs.writeFileSync('./rpt.json', JSON.stringify(info));