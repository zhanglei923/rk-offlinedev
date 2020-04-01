require('../global')
let configUtil = require('../../config/configUtil')
configUtil.reloadConfig()
let vpp = require('../fs-vpp');

console.log('r:', c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/src/main/webapp/static/router.js`))
console.log('r:', c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))
console.log('v:', c2virtual(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('v:', c2virtual(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))
console.log('r2v2r:', c2real(c2virtual(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`)))
return;
console.log('src:', rk_getSourceDir(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('src:', rk_getSourceDir(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))

console.log('pid:', rk_getPathId(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('pid:', rk_getPathId(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))
console.log('pid:', rk_getPathId(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core//sth//static/source//rk.crm.js`))

console.log('pid2:', vpp.changeRealPathToPathId(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
console.log('pid2:', vpp.changeRealPathToPathId(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))
console.log('pid2:', vpp.changeRealPathToPathId(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core//sth//static/source//rk.crm.js`))

vpp.eachSourceFolders((f)=>{
    console.log(f);
})

console.log(vpp.changePathIdToRealPath('core/rk.crm.js'))
console.log(vpp.changePathIdToRealPath('designer/common/designer'))
console.log(vpp.changePathIdToRealPath('xxx/yyy'))