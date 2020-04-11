require('./offlinedev/jsmodule/utils/global')
var getConfig = require('./offlinedev/jsmodule/config/configUtil')
var localStatus = require('./offlinedev/jsmodule/config/statusUtil')
getConfig.initFiles();//初始化配置
localStatus.init();

const ServerMain = require('./ServerMain')
ServerMain.startHttp();
ServerMain.startHttps();

require('./ServerRs').startHttps(()=>{    
    //console.log('[SUCCESS] Visit: http://localhost:666 to Use.')
});
//启动workspace的静态服务，用于直接跳转到子工程的资源
require('./ServerWs').startHttps(()=>{
    
});