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
        `git clone http://gerrit.ingageapp.com/${projectName}`,
        `cd ${projectName}`,
        `git checkout ${branchName}`,
        `echo "done"`
    ];
    execSh(`${command.join(' && ')}`, true, function(err, stdout, stderr){
        let result = ''
        if (err) {
            result = stderr;
        }else{
            result = stdout;
        }
        callback(stdout)
    });
};

module.exports = {
    cloneProject
};