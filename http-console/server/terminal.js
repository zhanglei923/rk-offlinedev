const fs = require('fs');
var execSh = require("exec-sh");
var moment = require('moment');
let makeDir = require('make-dir')

let handle = (req,res,callback)=>{
    console.log(req.url)
    execSh(`rm -f ${beforelaunchfullfilepath}`, {}, function(err, stdout, stderr){
        if (err) {
          console.log("rmbbbflunExit-code: ", err.code);
        }
      });
}
module.exports = {
    handle
}