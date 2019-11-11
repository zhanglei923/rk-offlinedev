let configUtil = require('../configUtil')

let bool = configUtil.isTrue('es6.autoTransformJs')
console.log(bool)

bool = configUtil.isTrue('debug.console_log')
console.log(bool)

let val = configUtil.getValue('jira.username')
console.log('val=', val)