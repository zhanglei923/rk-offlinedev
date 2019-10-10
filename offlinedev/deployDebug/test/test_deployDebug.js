let deployDebug = require('../deployDebug')
//deployDebug.findHashFile('C:/Users/zhanglei/Downloads/nginx-static_develop_latest/apps-ingage-web/src/main/webapp/static')
//deployDebug.updateDeployFolderAsDebug000()


// let statusUtil = require('../../jsmodule/config/statusUtil')
// statusUtil.setData('xx', '11')
// console.log(statusUtil.getData('xx'))
deployDebug.syncTarFile('v1910/test/nginx-autopack')
//deployDebug.syncTarFile('develop')

//deployDebug.downloadTarFile('v1910/test/nginx-autopack', 'C:/Users/zhanglei/Downloads/nginx-static_develop_latest')
//deployDebug.deployTarFile('C:/Users/zhanglei/Downloads/nginx-static_develop_latest', 'nginx-static_v1910~~test~~nginx-autopack_latest.tar.gz')