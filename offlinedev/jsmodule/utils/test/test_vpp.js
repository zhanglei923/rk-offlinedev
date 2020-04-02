let fs = require('fs')
require('../global')
let configUtil = require('../../config/configUtil')
configUtil.reloadConfig()
let vpp = require('../fs-vpp');

let result;
console.log('dbg', c2real(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/i18n/all_zh-cn`));
console.log('r1:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/i18n/all_zh-cn`)))
console.log('r2:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/rkloader`)))
console.log('r3:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/page/tmpl/privatemsg/groupSet.tpl`)))

console.log('r11:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/source/core/i18n/all_zh-cn`)))
console.log('r21:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/source/core/rkloader`)))
console.log('r31:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/source/page/tmpl/privatemsg/groupSet.tpl`)))
console.log('r81:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/embeded/isv.js`)))

console.log('r4:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/src/main/webapp/static/router.js`)))
console.log('r5:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm`)))
console.log('r6:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`)))
console.log('r7:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/router.js`)))
console.log('r8:', fs.existsSync(c2real(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/embeded/isv.js`)))


// console.log('v:', c2virtual(`/Users/zhanglei/workspaces/subprojects/apps-ingage-web/src/main/webapp/static/router.js`))
// console.log('v:', c2virtual(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`))
// console.log('r2v2r:', c2real(c2virtual(`/Users/zhanglei/workspaces/subprojects/xsy-static-creekflow/static/source/core/rk.crm.js`)))



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