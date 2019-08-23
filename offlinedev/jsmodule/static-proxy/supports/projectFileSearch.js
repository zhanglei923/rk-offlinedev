var fs = require('fs');
var pathutil = require('path');
let eachcontent = require('eachcontent-js')
let configUtil = require('../../config/configUtil');
let staticFilter = require('../../static-filter/filter');
let filters = require('../../static-filter/filter')
let searchFile =(path)=>{
    let projects = filters.getProjectsDef();
    //console.log(projects)
    let fpath;
    let project;
    for(let i=0;i<projects.length;i++){
        let prj = projects[i];
        let projectPath = prj.projectPath;
        fpath = projectPath + '/' +path;
        project = prj.project;
        //console.log(fpath)
        if(fs.existsSync(fpath)){
            break;
        }
    }
    //console.log(path)
    return fpath?{
        fpath,
        project
    }:null;
}
let findDupFiles = (root1, root2, allfiles)=>{
    let files = eachcontent.getAllFiles(root1)
    let dupfiles = [];
    files.forEach((fpath1)=>{
        if(fpath1.indexOf('node_modules')<0 && fpath1.indexOf('.git')<0){
            let relativepath = pathutil.relative(root1, fpath1)
            allfiles.push({
                root1, relativepath
            })
            let  fpath2 = pathutil.resolve(root2, relativepath)
            if(fs.existsSync(fpath2)){
                allfiles.push({
                    root2, relativepath
                })
                dupfiles.push({
                    root1,
                    root2,
                    relativepath
                })
            }
        }
    })
    return dupfiles;
};
let loadAllVPPStaticFiles = (webroot)=>{
    let webpathinfo = configUtil.getAllPathInfo(webroot);

    staticFilter.loadFilterDef(webpathinfo.webroot, webpathinfo.staticConfigFilePath, webpathinfo.staticDebugConfigFilePath);

    let projects = staticFilter.getProjectsDef()
    let filters = staticFilter.getFilterDef()

    let webappLists = [{webapp: webpathinfo.webappFolder}];
    projects.forEach((p)=>{
        webappLists.push({
            webapp: p.projectPath
        })
    })
    //console.log(webappLists)
    let allfiles = []
    let dupfiles = []
    webappLists.forEach((p1, i)=>{
        let webapp1 = p1.webapp;
        webappLists.forEach((p2, j)=>{
            let webapp2 = p2.webapp;
            if(i < j){
                // console.log('A', webapp1, i,j)
                // console.log('B', webapp2)
                let dups = findDupFiles(webapp1, webapp2, allfiles)//对比所有工程，是否有重复文件
                dupfiles = dupfiles.concat(dups);
            }            
        })
    })
    // console.log(dupfiles)
    // console.log(allfiles.length)

    // console.log(relativefiles)
    // console.log(relativefiles.length)

    return {
        webpathinfo,
        projects,
        filters,
        dupfiles,
        allfilesLength: allfiles.length
        //allfiles
    }
}
//http://localhost:666/static/source/core/a.js
module.exports = {
    searchFile,
    loadAllVPPStaticFiles
};