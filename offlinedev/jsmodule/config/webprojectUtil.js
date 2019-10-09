var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
var execSh = require("exec-sh");
let statusUtil = require('./statusUtil')
let readSeaConfig = require('../utils/seajs/readSeaConfig')
var rootpath = pathutil.resolve(__dirname, '../../../');
var config = {};
var configpath;

let currentSeaConfig;
module.exports = {
    loadSeaConfig:(webpath)=>{
        console.log('[load sea-config]' + webpath)
        let seapath = pathutil.resolve(webpath, './src/main/webapp/static')
        let seaconfig = readSeaConfig.parseSeaConfig(seapath);
        currentSeaConfig = seaconfig;
        return seaconfig;
    },
    getSeaConfig:()=>{
        return currentSeaConfig;
    },
    updateWebProjectPath: (newpath)=>{
        console.log('new:', newpath)
        statusUtil.setData('webProjectPath', newpath)
    },
    getWebProjectPath: (newpath)=>{
        return statusUtil.getData('webProjectPath')
    },
    listAll: function(myroot){
        let list = [];
        eachcontentjs.eachFolder(myroot, (folder)=>{
            let depth = folder.split('/').length;
            let gitpath = pathutil.resolve(myroot, folder);
            gitpath = pathutil.resolve(gitpath, '.git')
            //if(!fs.existsSync(gitpath)) return false;//stop
            if(/node\_modules/g.test(folder)) return false;
            if(depth> 4) return false;
            //console.log(folder)
        })
        return list;
    },
    isGitDirty: (prjpath, callback)=>{
        if(!fs.existsSync(prjpath)) {
            callback(null)
            return null;
        }
        let commands = [
            `cd ${prjpath}`,
            `git status`
        ]
        commands = commands.join(' && ')
        execSh(`${commands}`, true, function(err, stdout, stderr){
            let result = ''
            if (err) {
            }else{
                result = stdout;
            }
            let dirty = true;
            if(result && result.match(/nothing\sto\scommit/g)) dirty = false;
            callback(dirty)
          });
    }
}