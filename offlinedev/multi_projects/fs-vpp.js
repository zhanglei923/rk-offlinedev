//VPP = Virtual Path Protocal
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