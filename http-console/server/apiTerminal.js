const fs = require('fs');
let _ = require('lodash')
var execSh = require("exec-sh");
var moment = require('moment');
let makeDir = require('make-dir')
let isMine = (req)=>{
    return !!/^\/offlinedev\/api\/terminal\//.test(req.url)
}
let securityCheck = (inputline)=>{
    let isSafe = true;
    if(inputline.match(/\brm\b\s{1,}\-rf/g)) isSafe = false;
    return isSafe;
}
let handle = (req,res,callback)=>{
    var inputline = req.body.inputline;
    var prjpath = req.body.prjpath;
    prjpath = decodeURIComponent(prjpath)
    inputline = _.trim(inputline)
    if(!inputline){
        callback('')
        return;
    }
    if(!securityCheck(inputline)){
        callback('not safe, stop run.')
        return;
    }
    //console.log(req.url, inputline)
    let command = [
        `cd ${prjpath}`,
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
    isMine,
    handle
}