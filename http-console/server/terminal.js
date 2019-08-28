const fs = require('fs');
var execSh = require("exec-sh");
var moment = require('moment');
let makeDir = require('make-dir')

let handle = (req,res,callback)=>{
    var inputline = req.body.inputline
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