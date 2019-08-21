let _ = require('lodash')
let fs = require('fs')
let pathutil = require('path')
let webprojectUtil = require('../jsmodule/config/webprojectUtil')
let regexp = require('../jsmodule/utils/seajs/reg')

let urlist = []
let _require = (url)=>{
    urlist.push(url)
}
let scan = (staticroot, fpath, jscontent)=>{
    if(regexp.shouldIgnore(fpath)) return;
    let finfo = pathutil.parse(fpath);
    if(finfo.base === 'static' && finfo.dir.match(/webapp$/)) return;
    let seaconfig = webprojectUtil.getSeaConfig();
    let requires = jscontent.match(regexp.REQUIRE_REGEX);
    let results;
    if(_.isArray(requires)){
        //console.log(JSON.stringify(requires))
        let evalstr = '';
        requires.forEach((str)=>{
            evalstr = evalstr + ';' + str.replace(/^require/g, '_require') + ';'
        })
        urlist = [];
        //console.log(evalstr)
        eval(evalstr)
        let urlist2 = []
        for(let i = 0; i < urlist.length; i++){
            let val = urlist[i];
            if(!val || val.indexOf('{')>=0) continue;
            if(seaconfig[val]) val = seaconfig[val];
            urlist2.push(val);
        }
        //console.log(urlist)
        results = parseEachRequireUrls(staticroot, fpath, finfo, urlist2)
    }
    return results;
}
let parseEachRequireUrls = (staticroot, fpath, finfo, urlist)=>{
    let sourceroot = pathutil.resolve(staticroot, './source')
    let fdir = finfo.dir;
    let results = []
    let missingFiles = []
    for(let i = 0; i < urlist.length; i++){
        let info = {}
        let url = urlist[i];
        let is_abs = !url.match(/^\./);
        let root = is_abs ? sourceroot : fdir;
        let url2 = url;
        if(is_abs) url2 = './' + url2;
        //if(!url2.match(/(\.css|\.tpl)$/)) url2 = url2 + '.js';
        let fullfilepath = pathutil.resolve(root, url)
        let exist = fs.existsSync(fullfilepath)
        if(!exist) {
            fullfilepath = fullfilepath + '.js';
            exist = fs.existsSync(fullfilepath);
            if(!exist) {
                console.log('[not-found]' + fullfilepath)
                missingFiles.push({fullfilepath, url, fpath})
            }
        }
        info = {
            fullfilepath,
            sourceroot,
            url2: url2,
            url,
            exist
        }
        results.push(info)
    }
    return {
        missingFiles,
        results
    };
}
module.exports = {
    scan
}