let fs=require('fs')
let eachcontentjs = require('eachcontent-js')

let parser1 = require('../regParserMini')
let parser2 = require('../regParserMini2')

let t0=(new Date()*1);
let content = fs.readFileSync(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/products/bi/common/config/viewset/echartsbaseset/biviewwaterfall/adaptconfig/adaptSizeConfig.js`,'utf8')
let deps = parser1.getRequiresAsArray(content)

content = fs.readFileSync(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/i18n/untranslated.js`,'utf8')
deps = parser1.getRequiresAsArray(content)


console.log(deps)