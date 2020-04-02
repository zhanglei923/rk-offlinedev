const fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
var execSh = require("exec-sh");
let moment = require('moment')
let eachcontentjs = require('eachcontent-js')
require('../../offlinedev/jsmodule/utils/global')
let vpp = require('../../offlinedev/jsmodule/utils/fs-vpp')

global.rk_configOfStatic;
let loadConfig = (webprojectPath)=>{
    webprojectPath = rk_formatPath(webprojectPath);
    //src\main\webapp\static-config.json
    let parentpath = pathutil.resolve(webprojectPath, '../')
    let configpath = pathutil.resolve(webprojectPath, './src/main/webapp/static-config.json');
    if(fs.existsSync(configpath)){
        let configtxt = fs.readFileSync(configpath);
        let config = JSON.parse(configtxt);
        let dependencies = config.dependencies;
        let rpt = ``;
        dependencies.forEach((dep, i)=>{
            rpt += `\n   ${dep.project} (${dep.branch})`;
            dep.fullprjpath = rk_formatPath(pathutil.resolve(parentpath, dep.project));
            dep.sourcepath = rk_formatPath(pathutil.resolve(dep.fullprjpath, `./static/source`));
            dep.projectExist = fs.existsSync(dep.fullprjpath);
            dep.sourceExist = fs.existsSync(dep.sourcepath);
            dependencies[i] = dep;//update
        })
        config.dependencies = dependencies;
        config.mainProject = {//缓存主工程地址
            projectpath: webprojectPath,
            webapppath: rk_formatPath(pathutil.resolve(webprojectPath, './src/main/webapp/'))
        };
        global.rk_configOfStatic = config;
        console.log(`[Multi-Prj]: ${rpt}`);
    }else{
        console.log('[Multi-Prj]: no.');
    }
};
let searchFile =(path)=>{
    let projects = vpp.getProjectsDef();
    //console.log(projects)
    let fpath;
    let project;
    for(let prjname in projects){
        let prj = projects[prjname];
        let projectpath = prj.projectpath;
        let fpath0 = projectpath + '/' +path;
        //console.log(fpath)
        if(fs.existsSync(fpath0)){
            project = prjname;
            fpath = fpath0;
        }
    }
    //console.log(path)
    return fpath?{
        fpath,
        project
    }:null;
}
let findRealFilePath = (fullfilepath)=>{
    return ;
};
let findDupFiles = (webprojectPath)=>{
    if(!global.rk_configOfStatic) return {
        has: false,
        dupFilesInfo: []
    };
    let mainSource = pathutil.resolve(webprojectPath, './src/main/webapp/static/source');
    let allsourcefolders = eachSubSourceFolder(mainSource);
    let loaded_pathid = {};
    let loadpathlist = [];
    let has = false;
    let dupFilesInfo = {};
    //console.log(allsourcefolders)
    allsourcefolders.forEach((sourcefd)=>{
        loadpathlist = []
        eachcontentjs.eachPath(sourcefd, /./,(fpath)=>{
            let fname = pathutil.parse(fpath).name;
            if(!fname.match(/^\./)){
                let pathid = rk_formatPath(pathutil.relative(sourcefd, fpath));
                if(loaded_pathid[pathid]){
                    has=true;
                    if(!dupFilesInfo[pathid]) dupFilesInfo[pathid] = [loaded_pathid[pathid].sourcefd];
                    dupFilesInfo[pathid].push(sourcefd);
                }
                loaded_pathid[pathid] = {
                    sourcefd
                };
                loadpathlist.push(fpath);
            }
        })
    })
    return {
        has,
        dupFilesInfo
    };
};
let _getwebapp = (webprojectPath)=>{
    return rk_formatPath(pathutil.resolve(webprojectPath, './src/main/webapp'));
};
let reportStatus = (webprojectPath)=>{
    console.log(webprojectPath)
    let dupReport = findDupFiles(webprojectPath);
    let projects = [{
        webapp: _getwebapp(webprojectPath)
    }];
    if(global.rk_configOfStatic){
        global.rk_configOfStatic.dependencies.forEach((dep)=>{
            projects.push({webapp: dep.fullprjpath})
        })
    };
    return {
        dupReport,
        projects,
        // webpathinfo,
        // filters,
        // dupfiles,
        // allfilesLength: allfiles.length
    }
}
let eachSubSourceFolder = (mainPrjSource)=>{//所有子工程和主工程
    if(!global.rk_configOfStatic) return [mainPrjSource];
    let dependencies = global.rk_configOfStatic.dependencies;
    let folders = [];
    dependencies.forEach((dep)=>{
        folders.push(dep.sourcepath)
    })
    if(typeof mainPrjSource !== 'undefined') folders.push(mainPrjSource)
    return folders;
};

module.exports = {
    loadConfig,
    searchFile,
    eachSubSourceFolder,
    findDupFiles,
    reportStatus
};