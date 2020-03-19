let cloneProject = require('../cloneProject');

let targetFolder = `/Users/zhanglei/workspaces/subprojects/`;
let projectName = `xsy-static-creekflow`;
let branchName = `test/master`;

cloneProject.cloneProject(targetFolder, projectName, branchName, {}, ()=>{

})

projectName = `xsy-static-breeze`;
branchName = `test/master`;
cloneProject.cloneProject(targetFolder, projectName, branchName, {}, ()=>{

})
