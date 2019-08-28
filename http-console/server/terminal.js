const fs = require('fs');
var execSh = require("exec-sh");
var moment = require('moment');
let makeDir = require('make-dir')

let handle = (req,res,callback)=>{
    var inputline = req.body.inputline
    console.log(req.url, inputline)
    execSh(`${inputline}`, true, function(err, stdout, stderr){
        let result = ''
        if (err) {
          console.log("rmbbbflunExit-code: ", err.code);
        }else{
            //console.log(stdout)
            result = stdout;
        }
        console.log(err, stdout, stderr)
        console.log('cd')
        callback(result)
      });
}
module.exports = {
    handle
}