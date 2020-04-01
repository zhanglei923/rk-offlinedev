//VPP = 虚拟路径协议，Virtual Path Protocal
//用来切换实体文件在子工程和seajs pathid虚拟地址
let fs = require('fs-extra');
let pathutil = require('path');
let is_path_inside = require('is-path-inside')
require('./global')
let gitUtil = require('./gitUtil')

let vpp_on = false;
let myPathInfo = {
    All_Projects_Info:{}
}

// changeto_realfpath();
// changeto_virtualfpath();

// setWebProjectPath();
// getSourceList();//返回所有主子工程的source目录地址
// eachSourceList();//返回所有主子工程的source目录地址
// existSync(fullfilepath);
// getRealFilePath(fullfilepath);//返回真正地址

// global.rk_masterSourceFolder
// global.rk_sourceFolders

let cacheof_realfpath = {}
let cacheof_virtualfpath = {}
let changeto_realfpath = (fpath)=>{//和virtual相反，给出web的虚拟路径，换算成真正的文件路径
    if(fs.existsSync(fpath)) return fpath;
    fpath = global.rk_formatPath(fpath);
    if(cacheof_realfpath[fpath]) return cacheof_realfpath[fpath];

    let webparent = myPathInfo.webparent;
    let baserelatived = pathutil.relative(webparent,fpath);
    let arr = fpath.split('/static/');
    arr.shift();
    let staticrelatived = arr.join('/');
    //console.log('>>', staticrelatived)

    let realfpath;
    for(let prjname in myPathInfo.All_Projects_Info){
        let prjinfo = myPathInfo.All_Projects_Info[prjname];
        let prjstatic = prjinfo.projectstaticpath;
        let fpath = pathutil.resolve(prjstatic, staticrelatived);
        if(fs.existsSync(fpath)) realfpath = fpath;
    }
    if(realfpath)cacheof_realfpath[fpath] = realfpath;

    return realfpath;
};
let changeto_virtualfpath = (fpath)=>{//就是基于web工程的路径，其实可能并不存在于web，而是在子工程里
    fpath = global.rk_formatPath(fpath);
    let webparent = myPathInfo.webparent;
    let webroot = myPathInfo.All_Projects_Info['apps-ingage-web'].projectpath;

    if(is_path_inside(fpath, webroot)){
        return fpath;
    }else{
        let baserelatived = pathutil.relative(webparent,fpath);
        baserelatived = global.rk_formatPath(baserelatived);
        let arr = baserelatived.split('/');
        let project = arr.shift();
        let projectrelatived = arr.join('/');
        //console.log('>>', webparent, project, projectrelatived)
        let virtualfpath = pathutil.resolve(myPathInfo.webappFolder, projectrelatived);
        return virtualfpath;
    }
};
let getAllSourceFolders = ()=>{
    let folders = [];
    for(let prjname in myPathInfo.All_Projects_Info){
        let prjinfo = myPathInfo.All_Projects_Info[prjname];
        let prjstatic = prjinfo.projectstaticpath;
        folders.push(pathutil.resolve(prjstatic, './source'));
    }
    return folders;
};
let eachSourceFolders = (callback)=>{
    let folders = getAllSourceFolders();
    folders.forEach((fd)=>{
        callback(fd);
    })
};
let changeRealPathToPathId = (realfpath)=>{
    return rk_getPathId(realfpath)
};
let changePathIdToRealPath = (requirePath)=>{
    let folders = getAllSourceFolders();
    let result;
    for(let i=0;i<folders.length;i++){
        let sourcePath = folders[i];
        let realpath = pathutil.resolve(sourcePath, requirePath);
        if(fs.existsSync(realpath)){
            result = realpath;
            break;
        }else{
            realpath += '.js';
            if(fs.existsSync(realpath)){
                result = realpath;
                break;
            }
        }
    }
    return result;
};

let searchSubProjects = (info, pfolder, webroot, dependencies)=>{
    let static_project_root = info.static_project_root;
    console.log(pfolder, webroot, dependencies)
    myPathInfo.All_Projects_Info['apps-ingage-web'] = {
        project: 'apps-ingage-web',
        projectpath: webroot,
        projectstaticpath: static_project_root,
        projectexist: fs.existsSync(webroot),
        real_branch: gitUtil.getBranchName(webroot),
        def_branch: null,
        branchIsMatch: true,
        masterProject: true
    }
    dependencies.forEach((dep)=>{
        let project = dep.project;
        let def_branch = dep.branch;
        delete dep.branch;//名称不准确，容易混淆
        let projectpath = pathutil.resolve(pfolder, project);
        dep.projectpath = projectpath;
        dep.projectstaticpath = pathutil.resolve(projectpath, './static');
        dep.projectexist = fs.existsSync(projectpath);
        dep.real_branch = gitUtil.getBranchName(projectpath);
        dep.def_branch = def_branch;
        dep.branchIsMatch = (dep.real_branch === def_branch);
        myPathInfo.All_Projects_Info[project] = dep;
    })

    console.log('All_Projects_Info', myPathInfo.All_Projects_Info)
}
let setPathInfo =(info)=>{
    for(let name in info){
        myPathInfo[name] = info[name];
        console.log(name, info[name])
    }
    myPathInfo.main_source_folder = pathutil.resolve(myPathInfo.static_project_root, './source')
    myPathInfo.main_deploy_folder = pathutil.resolve(myPathInfo.static_project_root, './deploy')
    myPathInfo.staticConfigFilePath = pathutil.resolve(myPathInfo.webappFolder, './static-config.json');
    if(!fs.existsSync(myPathInfo.staticConfigFilePath)){
        searchSubProjects(info, info.webparent, info.webroot, []);
        console.log('[VPP] off.')
    }else{
        vpp_on = true;
        let staticConfig = fs.readFileSync(myPathInfo.staticConfigFilePath, 'utf8')
        eval(`staticConfig = ${staticConfig}`);
        searchSubProjects(info, info.webparent, info.webroot, staticConfig.dependencies);
        console.log('[VPP] path set.')
        //process.exit(0)
    }
};

global.c2real = changeto_realfpath;
global.c2virtual = changeto_virtualfpath;
var _thisUtil = {
    changeto_realfpath,
    changeto_virtualfpath,
    setPathInfo,
    getProjectsDef:()=>{
        return myPathInfo.All_Projects_Info;
    },
    getAllSourceFolders,
    eachSourceFolders,
    changePathIdToRealPath,
    changeRealPathToPathId
};
module.exports = _thisUtil;