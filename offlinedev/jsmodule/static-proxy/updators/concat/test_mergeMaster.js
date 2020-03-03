let mm = require('./mergeMaster')
var seajsUtil = require('../../../utils/seajs/seajsUtil')

let t0 = new Date()*1;

let seaconfig = seajsUtil.parseSeaConfig(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static`)
mm.prepareMergeStrategy(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`, seaconfig)

console.log(`cost:`, ((new Date()*1)-t0)+'ms');   