var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
var makeDir = require('make-dir');
var execSh = require("exec-sh");
let eachcontentjs = require('eachcontent-js')
let configUtil = require('./configUtil')
let statusUtil = require('./statusUtil')

let do_cloneProject = (folder, project, branch)=>{

}
module.exports = {
    do_cloneProject,
    reDownloadProject:(project, branch)=>{
        let webparent = configUtil.getWebParentRoot()
        console.log(webparent)
        let commands = [
            `cd ${webparent}`,
            `rm -rf ${project}`,
            ``
        ];
        commands = command.join(' && ')
        execSh(`${commands}`, true, function(err, stdout, stderr){
            let result = ''
            if (err) {
                result = stderr;
            }else{
                result = stdout;
            }
            callback(result)
          });

    }
}