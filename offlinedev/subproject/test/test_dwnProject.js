let dwnProject = require('../dwnProject');

let targetFolder = `/Users/zhanglei/workspaces/subprojects/`;
let projectName = `xsy-static-creekflow`;
let branchName = `test/master`;

dwnProject.cloneProject(targetFolder, projectName, branchName, {}, ()=>{

})

projectName = `xsy-static-breeze`;
branchName = `test/master`;
dwnProject.cloneProject(targetFolder, projectName, branchName, {}, ()=>{

})
