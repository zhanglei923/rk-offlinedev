//VPP = 虚拟路径协议，Virtual Path Protocal
//用来切换实体文件在子工程和seajs pathid虚拟地址
let fs = require('fs-extra');
let pathutil = require('path');
let gitUtil = require('./gitUtil')

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
let searchSubProjects = (pfolder, webroot, dependencies)=>{
    console.log(pfolder, webroot, dependencies)
    pathinfo.all_project_path['apps-ingage-web'] = {
        project: 'apps-ingage-web',
        projectpath: webroot,
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
        dep.projectexist = fs.existsSync(projectpath);
        dep.real_branch = gitUtil.getBranchName(projectpath);
        dep.def_branch = def_branch;
        dep.branchIsMatch = (dep.real_branch === def_branch);
        pathinfo.all_project_path[project] = dep;
    })

    console.log('all_project_path', pathinfo.all_project_path)
}
let vpp_on = false;
let pathinfo = {
    all_project_path:{}
}
var _thisUtil = {
    setPathInfo:(info)=>{
        for(let name in info){
            pathinfo[name] = info[name];
            console.log(name, info[name])
        }
        pathinfo.main_source_folder = pathutil.resolve(pathinfo.static_project_root, './source')
        pathinfo.main_deploy_folder = pathutil.resolve(pathinfo.static_project_root, './deploy')
        pathinfo.staticConfigFilePath = pathutil.resolve(pathinfo.webappFolder, './static-config.json');
        if(!fs.existsSync(pathinfo.staticConfigFilePath)){
            console.log('[VPP] off.')
        }else{
            vpp_on = true;
            let staticConfig = fs.readFileSync(pathinfo.staticConfigFilePath, 'utf8')
            eval(`staticConfig = ${staticConfig}`);
            searchSubProjects(info.webparent, info.webroot, staticConfig.dependencies);
            console.log('[VPP] path set.')
            //process.exit(0)
        }
    }
};
module.exports = _thisUtil;