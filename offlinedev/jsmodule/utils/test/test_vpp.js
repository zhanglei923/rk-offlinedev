require('../global')
let configUtil = require('../../config/configUtil')
configUtil.reloadConfig()
let vpp = require('../fs-vpp');

console.log('r:', c2real(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('r:', c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))
console.log('v:', c2virtual(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('v:', c2virtual(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))

console.log('src:', vpp.getSourceDir(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('src:', vpp.getSourceDir(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))

console.log('pid:', vpp.getPathId(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('pid:', vpp.getPathId(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))

vpp.eachSourceFolders((f)=>{
    console.log(f);
})
