let fs = require('fs')
let pathutil = require('path')
let util = require('util')
let _ = require('lodash')
let makeDir = require('make-dir')
let execSh = require('exec-sh')
let is_path_inside = require('is-path-inside')
let configUtil = require('../offlinedev/jsmodule/config/configUtil');
configUtil.reloadConfig();
let alias = global.rkGlobalConfig

let rk = require('../offlinedev/jsmodule/utils/rk')
let parser = require('../offlinedev/jsmodule/utils/seajs/regParserMini')
let seajsUtil = require('../offlinedev/jsmodule/utils/seajs/seajsUtil')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let deploypath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/deploy`
let autoConcatPath = pathutil.resolve(deploypath, '_autoconcat_')//自动聚合的都放在这里

let seaconfig = seajsUtil.parseSeaConfig(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static`)
console.log(seaconfig)

makeDir.sync(deploypath)
var seaHeaderReg2 = /^\s*define\s*\([\s\S]*function\s*\(/ig;
var seaHeaderReg = /^\s*define\s*\([\s\S]*function\s*\(\s*r[\w]+\s*\,\s*e[\w]+\s*\,\s*m[\w]+\s*\)/ig;

let definetype1 = /\bdefine\b\s{0,}\(\s{0,}function\s{0,}\(\s{0,}require\s{0,}\,\s{0,}exports\s{0,}\,\s{0,}module\s{0,}\)/g

let command = [
    `rm -rf ${deploypath}`,
    `mkdir ${deploypath}`,
    `cp -R ${sourcepath}/* ${deploypath}/`
]
console.log(command.join(' && '))
execSh(`${command.join(' && ')}`, true, function(err, stdout, stderr){
    let result = ''
    if (err) {
        result = stderr;
    }else{
        result = stdout;
    }
    console.log('deploy copy done.')
    run()
  });

let tplMergeConfig = {
    doNotConcatPathid:[
        'products/bi',
        'designer'
    ]
};
let okToConcatTpl = (pathid)=>{
    let ok = true;
    for(let i=0;i<tplMergeConfig.doNotConcatPathid.length;i++){
        let defpath = tplMergeConfig.doNotConcatPathid[i];
        if(is_path_inside(pathid, defpath)){
            ok = false;
            break;
        }
    }
    return ok;
};


let run = function (){
    makeDir.sync(autoConcatPath);
    let All_Tpl_Content = '//这是由rk-offlinedev自动聚合'
    eachcontentjs.eachContent(sourcepath, /\.tpl$/, (content, fpath)=>{
        let fdir = pathutil.parse(fpath).dir;
        let pathid = pathutil.relative(sourcepath, fpath);
        let newpath = pathutil.resolve(deploypath, pathid);
        let newdir = pathutil.parse(newpath).dir;

        if(okToConcatTpl(pathid)){
            makeDir.sync(newdir)

            var isVue = /vue.tpl$/ig.test(fpath);//vue的话，需要预留个空格，否则报错
            let content2 = content;
            content2 = content2.trim().replace(/\s*\r?\n\s*/g, ' ').replace(/\"/g, '\\\"')
            content2 = util.format('define("%s",[],"%s")', pathid, content2)
            //contentMap[fpath] = content;
    
            //let content2 = util.format('define("%s",%s,"%s")', pathid, '[]', content)
            fs.writeFileSync(newpath, content) 
            fs.writeFileSync(newpath+'.js', `//${new Date()}\n`+content2) 
            All_Tpl_Content += '\n;' + content2
        }
    });
    fs.writeFileSync(pathutil.resolve(autoConcatPath, './all_tpl_HOT.js'), All_Tpl_Content);
    console.log('tpl update done.')

    let t0=new Date()*1;
    let bad_requires = {}
    eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
        let fdir = pathutil.parse(fpath).dir;
        let pathid = pathutil.relative(sourcepath, fpath);
        let newpath = pathutil.resolve(deploypath, pathid);
        let newdir = pathutil.parse(newpath).dir;
        makeDir.sync(newdir)

        if(rk.mightBeCmdFile(content) && !rk.isCookedJsPath(fpath)){
            let deps = parser.getRequiresAsArray(content);
            let result = seajsUtil.cleanDeps(sourcepath, fpath, deps)
            deps = result.deps_good;
            if(result.deps_bad.length > 0)bad_requires[pathid] = result.deps_bad;
            let depspathid = [];
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
            })
            //console.log(depspathid)
            if(content.match(definetype1) 
            ){
                depspathid.unshift('_autoconcat_/all_tpl_HOT')//所有js都追加对tpl的依赖
                let arr = content.split('\n');
                for(let i=0;i<arr.length;i++){
                    let line = arr[i];
                    if(line.match(definetype1)){
                        line = line.replace(definetype1, `define("${pathid}",${JSON.stringify(depspathid)},function (require,exports,module)`)
                        arr[i] = line;
                        break;
                    }
                }
                content = arr.join('\n')
            }
        }
        //console.log(newpath)
        fs.writeFileSync(newpath, `//${new Date()}\n`+content)
        //fs.writeFileSync(fpath, `//${new Date()}\n`+content)
    });
    console.log('js update done.')
    console.log(new Date()*1-t0)
    fs.writeFileSync('404.json', JSON.stringify(bad_requires))
}