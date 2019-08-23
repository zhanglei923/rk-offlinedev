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
let findDupFiles = (root1, root2)=>{
    let files = eachcontent.getAllFiles(root1)
    let dupfiles = [];
    files.forEach((fpath)=>{
        if(fpath.indexOf('node_modules')<0 && fpath.indexOf('.git')<0){
            let relativepath = pathutil.relative(root1, fpath)
            let  fpath2 = pathutil.resolve(root2, relativepath)
            if(fs.existsSync(fpath2)){
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

    staticFilter.loadFilterDef(webroot, webpathinfo.staticConfigFilePath, webpathinfo.staticDebugConfigFilePath);

    let projects = staticFilter.getProjectsDef()
    let filters = staticFilter.getFilterDef()

    let webappLists = [webpathinfo.webappFolder];
    projects.forEach((p)=>{
        webappLists.push(p.projectPath)
    })
    console.log(webappLists)
    webappLists.forEach((webapp1, i)=>{
        webappLists.forEach((webapp2, j)=>{
            if(i < j){
                console.log('A', webapp1, i,j)
                console.log('B', webapp2)
                let dups = findDupFiles(webapp1, webapp2)
                console.log(dups)
            }
            
        })
    })

    // console.log(relativefiles)
    // console.log(relativefiles.length)

    return {
        webpathinfo,
        projects,
        filters
    }
}
//http://localhost:666/static/source/core/a.js
module.exports = {
    searchFile,
    loadAllVPPStaticFiles
};