const fs = require('fs');
let _ = require('lodash')
var execSh = require("exec-sh");
var moment = require('moment');
let makeDir = require('make-dir')

let securityCheck = (inputline)=>{
    let isSafe = true;
    if(inputline.match(/\brm\b\s{1,}\-rf/g)) isSafe = false;
    return isSafe;
}
let handle = (req,res,callback)=>{
    var inputline = req.body.inputline;
    inputline = _.trim(inputline)
    if(!inputline){
        callback('')
        return;
    }
    if(!securityCheck(inputline)){
        callback('not safe, stop run.')
        return;
    }
    console.log(req.url, inputline)
    let command = [
        `cd ~/workspaces/`,
        `${inputline}`
    ]
    execSh(`${command.join(' && ')}`, true, function(err, stdout, stderr){
        let result = ''
        if (err) {
            result = stderr;
        }else{
            result = stdout;
        }
        callback(result)
      });
}
module.exports = {
    handle
}