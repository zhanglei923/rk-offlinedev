const fs = require('fs');
let _ = require('lodash')
var execSh = require("exec-sh");

let targetFolder = `/Users/zhanglei/workspaces/subprojects/`;
let command = [
    `cd ${targetFolder}`,
    `ls`
];
execSh(`${command.join(' && ')}`, true, function(err, stdout, stderr){
    let result = ''
    if (err) {
        result = stderr;
    }else{
        result = stdout;
    }
    //callback(encodeURIComponent(result))
});