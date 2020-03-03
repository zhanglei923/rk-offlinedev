let fs = require('fs')
let pathutil = require('path')
let util = require('util')
let _ = require('lodash')
let makeDir = require('make-dir')
let execSh = require('exec-sh')
let is_path_inside = require('is-path-inside')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../../utils/rk')
var fs_readFile = require('../../../static-proxy/supports/fs_readFile')
let parser = require('../../../utils/seajs/regParserMini')
var seajsUtil = require('../../../utils/seajs/seajsUtil')
var updateStaticsUrl = require('../../../static-proxy/updators/updateStaticsUrl')
var configUtil = require('../../../config/configUtil')

let prepareMergeStrategy = function (sourcepath, seaconfig){
    let js_list = []
    let tpl_list1 = []
    eachcontentjs.eachPath(sourcepath, /(\.js|\.tpl)$/,(fpath)=>{
        if(!rk.isCookedJsPath(fpath)){
            if(fpath.match(/\.js$/)) js_list.push(fpath)
            if(fpath.match(/\.tpl$/)) tpl_list1.push(fpath)
        }
    })
    let bad_requires = {}
    let tpl_list2 = []
    js_list.forEach((fpath)=>{
        fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
            if(err) {
                console.log(err, fpath)
                return;
            }
            if(rk.mightBeCmdFile(content) && !rk.isCookedJsPath(fpath)){
                let fdir = pathutil.parse(fpath).dir;
                let pathid = pathutil.relative(sourcepath, fpath);
                let deps = parser.getRequiresAsArray(content);
                let result = seajsUtil.cleanDeps(sourcepath, fpath, deps)
                deps = result.deps_good;
                if(result.deps_bad.length > 0)bad_requires[pathid] = result.deps_bad;
                let depspathid = [];
                let hotlist = [];
                deps.forEach((raw_req)=>{
                    let req_pathid;
                    if(seaconfig[raw_req]) {
                        req_pathid = seaconfig[raw_req];
                    }else{
                        let req_fullpath = seajsUtil.resolveRequirePath(sourcepath, fpath, raw_req, false)   
                        req_pathid = pathutil.relative(sourcepath, req_fullpath);
                    } 
                    req_pathid = seajsUtil.addJsExt(req_pathid)
                    depspathid.push(req_pathid)
                    if(raw_req.match(/\.tpl$/)) tpl_list2.push(req_pathid)
    
                    let depsFolder = pathutil.parse(req_pathid).dir;
                    let depsFolderHot = depsFolder + '/concat_HOT.js'
                    //hotlist.push(depsFolderHot)
                    //console.log(depsFolder, depsFolderHot)
                })
            }
        });
    })

    console.log(tpl_list1.length, tpl_list2.length)
}
let getMergeStrategy = function (sourcepath){
    //
}
module.exports = {
    prepareMergeStrategy,
    getMergeStrategy
}