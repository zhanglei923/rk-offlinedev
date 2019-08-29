let configUtil = require('../configUtil')
let webprojectUtil = require('../webprojectUtil')
configUtil.reloadConfig()
let seaconfig = webprojectUtil.getSeaConfig()

webprojectUtil.isGitDirty('E:/workspaceGerrit/_sub_separation_test/xsy-static-breeze', (result)=>{
    console.log(result)
})

console.log(seaconfig)
console.log('-------')