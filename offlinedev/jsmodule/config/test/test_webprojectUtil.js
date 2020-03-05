let st
let configUtil = require('../configUtil')
let webprojectUtil = require('../webprojectUtil')
configUtil.reloadConfig()
let seaconfig = webprojectUtil.getSeaConfig()

webprojectUtil.isGitDirty('E:/workspaceGerrit/_sub_separation_test/xsy-static-breeze', (result)=>{
    console.log(result)
})

console.log(seaconfig)
console.log('-------')

let routers = webprojectUtil.loadRouter(`/Users/zhanglei/workspaces/apps-ingage-web`);
console.log(routers)