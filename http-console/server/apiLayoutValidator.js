const fs = require('fs');
let _ = require('lodash')
var execSh = require("exec-sh");
var moment = require('moment');
let makeDir = require('make-dir')
let validator = require('../../modules/paas/layoutValidator/validator')
let isMine = (req)=>{
    return !!/^\/offlinedev\/api\/layoutJson\//.test(req.url)
}
let handle = (req,res,callback)=>{
    var content = req.body.content;
    let errors = validator.validate(content);
    callback(errors)
    return;
}
module.exports = {
    isMine,
    handle
}