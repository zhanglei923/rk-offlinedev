//VPP = 虚拟路径协议，Virtual Path Protocal
//用来切换实体文件在子工程和seajs pathid虚拟地址
let fs = require('fs-extra');
let pathutil = require('path')

let vpp_sourcefolder;
global.vpp_setSourceFolder = (sourcedir)=>{
    vpp_sourcefolder = sourcedir;
}

// vpp_toreal();
// vpp_tovirtual();

// setWebProjectPath();
// getSourceList();//返回所有主子工程的source目录地址
// eachSourceList();//返回所有主子工程的source目录地址
// existSync(fullfilepath);
// getRealFilePath(fullfilepath);//返回真正地址
let pathinfo = {}
var _thisUtil = {
    setPathInfo:(info)=>{
        for(let name in info){
            pathinfo[name] = info[name];
        }
        console.log('[VPP] path set.')
    }
};
module.exports = _thisUtil;