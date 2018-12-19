var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
let configUtil = require('./configUtil')
let statusUtil = require('./statusUtil')
var rootpath = pathutil.resolve(__dirname, '../');
var config = {};
var configpath;
module.exports = {
    updateWebProjectPath: (newpath)=>{
        console.log('new:', newpath)
        statusUtil.setData('webProjectPath', newpath)
    },
    getWebProjectPath: (newpath)=>{
        return statusUtil.setData('webProjectPath')
    },
    listAll: function(){
        let list = [];
        let myroot = configUtil.getMyRoot()
        eachcontentjs.eachFolder(myroot, (folder)=>{
            let depth = folder.split('/').length;
            let gitpath = pathutil.resolve(myroot, folder);
            gitpath = pathutil.resolve(gitpath, '.git')
            //if(!fs.existsSync(gitpath)) return false;//stop
            if(/node\_modules/g.test(folder)) return false;
            if(depth> 4) return false;
            console.log(folder)
        })
        return list;
    }
}