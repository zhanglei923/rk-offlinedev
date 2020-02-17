let configUtil = require('../configUtil')

let bool = configUtil.isTrue('es6.autoTransformJs')
console.log(bool)

bool = configUtil.isTrue('debug.console_log')
console.log(bool)

let val = configUtil.getValue('jira.username')
console.log('val=', val)

let t0 = new Date()*1;
for(let i=0;i<30000;i++){
    configUtil.getValue('debug.detect404RequireUrls.a.b.ccc')
}
console.log('cost:', (new Date()*1)-t0);