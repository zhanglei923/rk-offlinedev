let fs = require('fs')
let pathutil = require('path')
let util = require('util')
let _ = require('lodash')
let makeDir = require('make-dir')
let configUtil = require('../offlinedev/jsmodule/config/configUtil');
configUtil.reloadConfig();
let alias = global.rkGlobalConfig

let rk = require('../offlinedev/jsmodule/utils/rk')
let parser = require('../offlinedev/jsmodule/utils/seajs/regParserMini')
let seajsUtil = require('../offlinedev/jsmodule/utils/seajs/seajsUtil')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let deploypath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/deploy`

let seaconfig = seajsUtil.parseSeaConfig(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static`)
console.log(seaconfig)

let t0=new Date()*1;

makeDir.sync(deploypath)
var seaHeaderReg = /^\s*define\s*\([\s\S]*function\s*\(\s*r[\w]+\s*\,\s*e[\w]+\s*\,\s*m[\w]+\s*\)/ig;
eachcontentjs.eachContent(sourcepath, /\.css$/, (content, fpath)=>{
    let fdir = pathutil.parse(fpath).dir;
    let pathid = pathutil.relative(sourcepath, fpath);
    let newpath = pathutil.resolve(deploypath, pathid);
    let newdir = pathutil.parse(newpath).dir;
    makeDir.sync(newdir)

    fs.writeFileSync(newpath, content) 
});
eachcontentjs.eachContent(sourcepath, /\.tpl$/, (content, fpath)=>{
    let fdir = pathutil.parse(fpath).dir;
    let pathid = pathutil.relative(sourcepath, fpath);
    let newpath = pathutil.resolve(deploypath, pathid);
    let newdir = pathutil.parse(newpath).dir;
    makeDir.sync(newdir)

    let content2 = util.format('define("%s",%s,%s)', pathid, '[]', content)
    fs.writeFileSync(newpath, content2) 
    fs.writeFileSync(newpath+'.js', content2) 
});
eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
    let fdir = pathutil.parse(fpath).dir;
    let pathid = pathutil.relative(sourcepath, fpath);
    let newpath = pathutil.resolve(deploypath, pathid);
    let newdir = pathutil.parse(newpath).dir;
    makeDir.sync(newdir)

    if(rk.mightBeCmdFile(content) && !rk.isCookedJsPath(fpath) && !rk.isLibJsPath(fpath)){
        content = content.replace(/http(s){0,1}\:\/\//g, 'http--')//【重点查这个问题！！】
        content = rk.cleanComments(content);
        let deps = parser.getRequiresAsArray(content);
        let depspathid = [];
        deps.forEach((raw_req)=>{
            let req_pathid;
            if(seaconfig[raw_req]) {
                req_pathid = seaconfig[raw_req];
            }else{
                //let req_fullpath = pathutil.resolve(fdir, raw_req);      
                let req_fullpath = seajsUtil.resolveRequirePath(fpath, raw_req)     
                // if(fpath.indexOf('pageMainCtrl.js')>=0 && raw_req.indexOf('fileUploaderCtrl')>=0){
                //     console.log(fdir)
                //     console.log(raw_req)
                //     console.log(req_fullpath)
                // }
                req_pathid = pathutil.relative(sourcepath, req_fullpath);
            } 
            req_pathid = seajsUtil.addJsExt(req_pathid)
            depspathid.push(req_pathid)
        })
        // if(fpath.indexOf('pageMainCtrl.js')>=0){
        //     //console.log(deps)
        // }
        //console.log(depspathid)
        if(	seaHeaderReg.test(content) 
        ){
            //content = content.trim().replace(/>\s*\r?\n\s*</g, '><').replace(/\s*\r?\n\s*/g, ' ').replace(/\"/g, '\\\"')
            content = content.replace(seaHeaderReg, 'function(require,exports,module)')
            content = content.replace(/\)\s*\;?$/g, '');
            content = util.format('define("%s",%s,%s)', pathid, JSON.stringify(depspathid), content)

            content = content.replace(/\;{1,}\s{0,}\)\s{0,}$/g, '');//【重点查这个问题！！】
            //console.log(deps)
        }
    }

    //console.log(newpath)
    fs.writeFileSync(newpath, content)
});
console.log(new Date()*1-t0)