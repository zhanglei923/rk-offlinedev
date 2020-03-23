const fs = require('fs');
let _ = require('lodash')
var execSh = require("exec-sh");

let cloneProject = (targetFolder, projectName, branchName, opt, callback)=>{
    // let targetFolder = `/Users/zhanglei/workspaces/subprojects/`;
    // let projectName = `xsy-static-creekflow`;
    // let branchName = `test/master`
    let command = [
        `cd ${targetFolder}`,
        `rm -rf ${projectName}`,
        `git clone http://gerrit.in${'gagea'}pp.com/${projectName}`,
        `cd ${projectName}`,
        `git checkout ${branchName}`,
        `echo "done"`
    ];
    execSh(`${command.join(' && ')}`, true, function(err, stdout, stderr){
        let result = '';
        let succ = true;
        if (err) {
            succ = false;
            console.log(projectName, 'clone failed.')
            result = stderr;
        }else{
            console.log(projectName, 'cloned.')
            result = stdout;
        }
        callback(succ, stdout)
    });
};

module.exports = {
    cloneProject
};