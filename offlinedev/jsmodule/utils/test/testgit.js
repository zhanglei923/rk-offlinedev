let gitutil = require('../gitUtil');
let path = `E:/workspaceGerrit/_sub_branches/apps-ingage-web`
let status = gitutil.getBranchStatus(path)
console.log(status)