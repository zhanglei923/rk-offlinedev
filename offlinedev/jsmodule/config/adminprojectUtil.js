var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
var execSh = require("exec-sh");
let statusUtil = require('./statusUtil')
let gitUtil = require('../utils/gitUtil')
var rootpath = pathutil.resolve(__dirname, '../../../');
var config = {};
var configpath;

let currentSeaConfig;
module.exports = {
    getInfo:(adminpath)=>{
        //console.log('[load sea-config]' + adminpath)
        if(!fs.existsSync(adminpath)) return null;
        let info = {
            adminFolder: adminpath,
            branch: gitUtil.getBranchName(adminpath)
        };
        return info;
    }   
}