var fs = require('fs');
var _ = require('lodash')
var pathutil = require('path');

var getBranchName = function(prjPath){
    var gitPath = prjPath + '/.git/'
    if(!fs.existsSync(prjPath)) return '';
    if(!fs.existsSync(gitPath)) return '';
    var HEAD = fs.readFileSync(gitPath + 'HEAD','utf8');
    HEAD = _.trim(HEAD)
    var branchName = HEAD.replace('ref: refs/heads/', '');
    return branchName;
};
module.exports = {
    getBranchName
}