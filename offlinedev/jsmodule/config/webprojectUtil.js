var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash')
let stripcomments = require('strip-comments')
let eachcontentjs = require('eachcontent-js')
var execSh = require("exec-sh");
let statusUtil = require('./statusUtil')
let seajsUtil = require('../utils/seajs/seajsUtil')
var rootpath = pathutil.resolve(__dirname, '../../../');
var config = {};
var configpath;

let currentSeaConfig;
module.exports = {
    loadRouter:(webpath)=>{
        let routerjs = pathutil.resolve(webpath, './src/main/webapp/static/router.js')
        let routerjsondir = pathutil.parse(routerjs).dir;
        let routertxt = fs.readFileSync(routerjs, 'utf8')
        routertxt = stripcomments(routertxt)
        routertxt = rk_formatLineBreaker(routertxt)
        let lines = routertxt.split('\n');

        let jsonpathlist = []
        let isPrm = false;
        let fetchRouter = (jsonpath)=>{
            console.log('[loaded router]', jsonpath)
            jsonpathlist.push(jsonpath);
        }
        lines.forEach((line)=>{
            if(line.match(/fetchRouter/g) && line.indexOf('function')<0){
                eval(line)
            }
        })
        let allRouter={};
        jsonpathlist.forEach((jsonpath)=>{
            let jsonfullpath = pathutil.resolve(routerjsondir, jsonpath)
            let jsontxt = fs.readFileSync(jsonfullpath, 'utf8');
            let lines = rk_formatLineBreaker(jsontxt).split('\n');
            // let tmp = []
            // lines.forEach((ln)=>{
            //     if()
            // })
            let kwd={}, newVersion=true;
            let subjson;
            eval(`subjson = ${jsontxt}`);
            for(let url in subjson) allRouter[url] = subjson[url];
        })
        return allRouter;
    },
    loadSeaConfig:(webpath)=>{
        console.log('[load sea-config]' + webpath)
        let seapath = pathutil.resolve(webpath, './src/main/webapp/static')
        let seaconfig = seajsUtil.parseSeaConfig(seapath);
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