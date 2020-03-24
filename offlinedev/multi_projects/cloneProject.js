const fs = require('fs');
let _ = require('lodash')
var execSh = require("exec-sh");
let configUtil = require('../jsmodule/config/configUtil')

let cloneProject = (targetFolder, projectName, branchName, opt, callback)=>{
    // let targetFolder = `/Users/zhanglei/workspaces/subprojects/`;
    // let projectName = `xsy-static-creekflow`;
    // let branchName = `test/master`
    let accounts = configUtil.getUserConfig().$userAccounts;
    //console.log(accounts)
    let username = accounts['gerrit.username'];
    let cloneCmd;
    if(!username){
        cloneCmd = `git clone http://gerrit.in${'gagea'}pp.com/${projectName}`
    }else{
        cloneCmd = `git clone ssh://${username}@192.168.${'0.250'}:29${'418'}/${projectName} && scp -p -P 29${'418'} ${username}@192.168.${'0.250'}:hooks/commit-msg ${projectName}/.git/hooks/`
    }
    //console.log(cloneCmd)
    let command = [
        `cd ${targetFolder}`,
        `rm -rf ${projectName}`,
        `${cloneCmd}`,
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