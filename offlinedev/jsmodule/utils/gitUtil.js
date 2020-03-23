var fs = require('fs');
var _ = require('lodash')
var pathutil = require('path');
var git = require('git-state')

var getBranchName = function(prjPath){
    var gitPath = prjPath + '/.git/'
    if(!fs.existsSync(prjPath)) return '';
    if(!fs.existsSync(gitPath)) return '';
    var HEAD = fs.readFileSync(gitPath + 'HEAD','utf8');
    HEAD = _.trim(HEAD)
    var branchName = HEAD.replace('ref: refs/heads/', '');
    return branchName;
};
let getBranchStatus = (prjPath)=>{
    let isGit = git.isGitSync(prjPath)
    if(!isGit) return null;
    let result = git.checkSync(prjPath);
    let isSSHClone = fs.existsSync(pathutil.resolve(prjPath, './.git/hooks/commit-msg'))
    result.isSSHClone = isSSHClone;
    return result;
}
module.exports = {
    getBranchName,
    getBranchStatus
}