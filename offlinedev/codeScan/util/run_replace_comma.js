let fs = require('fs')
let replacecomma = require('./replace_comma')

let fpath = 'E:/workspaceGerrit/_sub_branches/apps-ingage-web/src/main/webapp/static/source/crm/js/apps/standard/401/duplicateAndTransfer.js';
let content = fs.readFileSync(fpath, 'utf8')


let content2 = replacecomma.do_replace(content)

fs.writeFileSync(fpath, content2)