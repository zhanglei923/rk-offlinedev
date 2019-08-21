let configUtil = require('../configUtil')
let webprojectUtil = require('../webprojectUtil')
configUtil.reloadConfig()
let seaconfig = webprojectUtil.getSeaConfig()

console.log(seaconfig)
console.log('-------')