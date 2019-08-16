var fs = require('fs');
var pathutil = require('path');
let filters = require('../static-filter/filter')
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
        console.log(fpath)
        if(fs.existsSync(fpath)){
            break;
        }
    }
    console.log(path)
    return fpath?{
        fpath,
        project
    }:null;
}
//http://localhost:666/static/source/core/a.js
module.exports = {
    searchFile
};