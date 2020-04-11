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

let last_hit_root_of_urlrealpath = {}
let find_realpath_for_url = (req_path)=>{
    let last_hit_webapp = last_hit_root_of_urlrealpath[req_path];
    let realfpathinfo;
    let webappArr = [];
    if(last_hit_webapp) webappArr.push(last_hit_webapp);
    for(let prjname in myPathInfo.All_Projects_Info){
        let prjinfo = myPathInfo.All_Projects_Info[prjname];
        let prjwebappbase = prjinfo.projectwebappbased;
        if(last_hit_webapp !== prjwebappbase){
            webappArr.push({
                prjname,
                prjwebappbase
            });
        }
    }
    for(let i=0;i<webappArr.length;i++){
        let prjname = webappArr[i].prjname;
        let prjwebappbase = webappArr[i].prjwebappbase;
        //console.log('rlsl', prjwebappbase, '.'+req_path)
        let fpath = pathutil.resolve(prjwebappbase, '.'+req_path);
        if(fs.existsSync(fpath)) {
            last_hit_root_of_urlrealpath[req_path] = {
                prjname,
                prjwebappbase
            };
            realfpathinfo = {
                fpath,
                prjname,
                prjwebappbase
            }
            break;
        }
    }
    return realfpathinfo;
};

let last_hit_root_of_realpath = {}
let changeto_realfpath = (fpath0)=>{//和virtual相反，给出web的虚拟路径，换算成真正的文件路径
    if(fs.existsSync(fpath0)) return fpath0;
    fpath0 = global.rk_formatPath(fpath0);
    let fpath = fpath0;
    let last_hit_webapp = last_hit_root_of_realpath[fpath0];
    fpath = global.rk_formatPath(fpath);

    let relativepath_towebapp;//相对于每个工程的webapp跟目录，这样能兼容所有目录，比如embeded等
    for(let prjname in myPathInfo.All_Projects_Info){
        let prjinfo = myPathInfo.All_Projects_Info[prjname];
        let prjwebappbase = prjinfo.projectwebappbased;
        //console.log('is_path_inside:', fpath0, prjwebappbase)
        if(is_path_inside(fpath0, prjwebappbase)){
            //console.log('yes')
            relativepath_towebapp = pathutil.relative(prjwebappbase, fpath0);
        }
    }
    if(!relativepath_towebapp) return fpath0;//没有在任何一个工程里
    //console.log('relativepath_towebapp=', relativepath_towebapp)

    let realfpath;
    let webappArr = [];
    if(last_hit_webapp) webappArr.push(last_hit_webapp);
    for(let prjname in myPathInfo.All_Projects_Info){
        let prjinfo = myPathInfo.All_Projects_Info[prjname];
        let prjwebappbase = prjinfo.projectwebappbased;
        if(last_hit_webapp !== prjwebappbase){
            webappArr.push(prjwebappbase);
        }
    }
    for(let i=0;i<webappArr.length;i++){
        let prjwebappbase = webappArr[i];
        let fpath = pathutil.resolve(prjwebappbase, relativepath_towebapp);
        if(fs.existsSync(fpath)) {
            last_hit_root_of_realpath[fpath0] = prjwebappbase;
            realfpath = fpath;
            break;
        }else{
            fpath = fpath + '.js';
            if(fs.existsSync(fpath)) {
                last_hit_root_of_realpath[fpath0] = prjwebappbase;
                realfpath = fpath;
                break;
            }
        }
    }
    return realfpath ? realfpath : fpath0;
};
let changeto_virtualfpath = (fpath)=>{//就是基于web工程的路径，其实可能并不存在于web，而是在子工程里
    fpath = global.rk_formatPath(fpath);
    let webparent = myPathInfo.webparent;
    let webroot = myPathInfo.All_Projects_Info['apps-ingage-web'].projectpath;

    if(is_path_inside(fpath, webroot)){
        return fpath;
    }else{
        let pathid = rk_getPathId(fpath);
        let virtualfpath;
        //console.log('pathid',pathid,global.rk_masterWebappFolder)
        if(pathid.match(/^\/static/)){//可能是require了/static/gcss这种绝对路径
            virtualfpath = pathutil.resolve(global.rk_masterWebappFolder, '.'+pathid);
        }else{
            virtualfpath = pathutil.resolve(global.rk_masterSourceFolder, pathid);
        }
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
    return global.rk_getPathId(realfpath)
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
    let static_web_base = pathutil.resolve(static_project_root, '../');
    //console.log(pfolder, webroot, dependencies)
    myPathInfo.All_Projects_Info['apps-ingage-web'] = {
        project: 'apps-ingage-web',
        projectpath: webroot,
        projectwebappbased:static_web_base,
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
        dep.projectwebappbased = projectpath;
        dep.projectstaticpath = pathutil.resolve(projectpath, './static');
        dep.projectsourcepath = pathutil.resolve(dep.projectstaticpath, './source');
        global.rk_sourceFolderList.push(dep.projectsourcepath)
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
        //console.log(name, info[name])
    }
    myPathInfo.masterWebappFolder = info.webappFolder;
    let masterSourceFolder = pathutil.resolve(myPathInfo.static_project_root, './source')
    let masterDeployFolder = pathutil.resolve(myPathInfo.static_project_root, './deploy')

    global.rk_static_project_root = myPathInfo.static_project_root;
    global.rk_masterStaticFolder = pathutil.resolve(masterSourceFolder, '../')
    global.rk_masterWebappFolder = pathutil.resolve(rk_masterStaticFolder, '../')
    global.rk_masterSourceFolder = masterSourceFolder;
    global.rk_masterDeployFolder = masterDeployFolder;
    global.rk_sourceFolderList = [global.rk_masterSourceFolder];

    myPathInfo.staticConfigFilePath = pathutil.resolve(myPathInfo.masterWebappFolder, './static-config.json');
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
    find_realpath_for_url,
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