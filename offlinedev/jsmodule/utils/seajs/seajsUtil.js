let fs = require('fs')
let _ = require('lodash')
let pathutil = require('path')
let util = require('util')
let rk = require('../../utils/rk')
let regParserMini = require('./regParserMini');
let jsonFileLoader = require('./sub-api/jsonFileLoader')
let parseSeaConfig2 = (seaPath)=>{
    var HashFilePath = seaPath + '/hash.js';
    var SeaConfigPath = seaPath + '/sea-config.js';
    var SeaConfig = {};
    var Md5Map = {};
    
    (function(){
        //剥离处别名定义
        var content = fs.readFileSync(SeaConfigPath, 'utf8');
        content = content.substring(content.indexOf('alias: ')+6)
        content = content.substring(0, content.indexOf('}')) + '}';
        eval('SeaConfig = ' + content);
    })()
    return SeaConfig;
    
};
let definetype1 = /\bdefine\b\s{0,}\(\s{0,}function\s{0,}\(\s{0,}require\s{0,}\,\s{0,}exports\s{0,}\,\s{0,}module\s{0,}\)/g

let parseSeaConfig = (seaPath)=>{
    var SeaConfigPath = seaPath + '/sea-config.js';
    let content = fs.readFileSync(SeaConfigPath,'utf8');
    let arr = content.split('\n');
    let keyvalue = []
    let isIn = false;
    arr.forEach((line)=>{
        if(isIn && /\}/.test(line)) isIn = false;
        if(isIn){
            keyvalue.push(line)
        }
        if(/\balias\b\s{0,}\:/g.test(line)) isIn = true;

    })
    let jsonstr = `{${keyvalue.join('')}}`;
    //console.log(jsonstr)
    let SeaConfig;
    eval(`SeaConfig = ${jsonstr}`)
    //console.log(SeaConfig)
    return SeaConfig;
}
let setPathVars = (requirePath)=>{
    if(requirePath.indexOf('{')<=0) return requirePath;
    let vars = global.rkGlobalConfig.runtime.seajsConfig.vars;
    //console.log('bf:', requirePath)
    for(let v in vars){
        let reg = new RegExp(`{${v}}`, 'g');
        requirePath = requirePath.replace(reg, vars[v]);
    }
    //console.log('af:', requirePath)
    return requirePath;
}
let resolveRequirePath = (sourcePath, ownerFilePath, requirePath, replaceVars, alias)=>{
    if(typeof replaceVars === 'undefined') replaceVars = true;//在生成deploy时，期望保持请求路径的原生态，不然deploy状态无法工作了
    if(typeof alias === 'undefined') alias = global.rkGlobalConfig.runtime.seajsConfig.alias;
    let realpath;
    if(alias && alias[requirePath]){
        requirePath = alias[requirePath];
    }
    if(replaceVars)requirePath = setPathVars(requirePath);
    if(requirePath.match(/^\./)){
        let fdir = pathutil.parse(ownerFilePath).dir;
        realpath = pathutil.resolve(fdir, requirePath)
    }else{
        realpath = pathutil.resolve(sourcePath, requirePath)
    }
    if(!fs.existsSync(realpath) && fs.existsSync(realpath+'.js')) realpath += '.js';
    return realpath;
};
let getRequireRegForReplacement = (req_path, closeright)=>{
    if(typeof closeright === 'undefined') closeright = false;//不闭合右侧圆括号，可以简化替换风险
    return new RegExp('require[\\s]{0,}[\(][\\s]{0,}(\'|")'+req_path+'(\'|")'+(closeright?'[\\s]{0,}\\){1}':''), 'g');
}
let addJsExt = (req_pathid)=>{
    if(!/\.tpl$|\.js$|\.css$|\.json$/ig.test(req_pathid)){
        req_pathid = req_pathid + '.js';
    }
    return req_pathid;
}
let isCommonRequirePath = (raw_path)=>{
    raw_path = _.trim(raw_path);
    let isnormal = true;
    if(raw_path.indexOf('{')>=0) isnormal = false;
    if(raw_path.match(/^http/)) isnormal = false;
    if(raw_path.match(/^\//)) isnormal = false;
    return isnormal;
};
global.rkFileDepsCache = {};//缓存
let getFileDepsAsArray = (sourcefolder, fullfilepath, content)=>{
    let depsinfo = getFileDeps(sourcefolder, fullfilepath, content)
    let array = [];
    depsinfo.deps.forEach((info)=>{
        array.push(info.rawPath);
    })
    return array;
};
let getFileDeps = (sourcefolder, fullfilepath, content)=>{
    let fstate = fs.lstatSync(fullfilepath);
    let ctime36 = fstate.ctimeMs.toString(36);
    let mtime36 = fstate.mtimeMs.toString(36);
    let mc36 = mtime36+'-'+ctime36;
    
    let deps = [];
    let cache = global.rkFileDepsCache[fullfilepath];
    if(rk.isCookedJsPath(fullfilepath)){
        global.rkFileDepsCache[fullfilepath] = {
            isCmd: false,
            mightBeCmd: false,
            mc36,
            deps: []
        }
    }else{
        if(cache && cache.mc36 === mc36){
            deps = cache.deps;
        }else{
            deps = regParserMini.getRequires(content); 
            let deps2 = deps;//cleanDeps(sourcefolder, fullfilepath, deps);   
            let isCmd = rk.isCmdFile(content);    
            let mightBeCmd = rk.mightBeCmdFile(content)
            global.rkFileDepsCache[fullfilepath] = {
                isCmd,
                mightBeCmd,
                mc36,
                deps: deps2
            }
        }       
    }
    return global.rkFileDepsCache[fullfilepath];
}
let cleanDeps = (sourcefolder, fullfilepath, deps, alias)=>{
    let deps_good = [];
    let deps_bad = [];
    deps.forEach((rawPath)=>{
        let readpath = resolveRequirePath(sourcefolder, fullfilepath, rawPath, false, alias)
        if(isCommonRequirePath(rawPath) && !fs.existsSync(readpath)){
            deps_bad.push(rawPath)
            //console.log('[404]', rawPath, readpath,isCommonRequirePath(rawPath))
        }else{
            deps_good.push(rawPath);
        }
    })
    return {
        deps_good,
        deps_bad
    };
}
let preLoadDeps = (sourcefolder, fpath, content)=>{
    if(typeof fpath !== 'undefined' && typeof content !== 'undefined'){
        getFileDeps(sourcefolder, fpath, content);
    }
}
let changeTplToDeploy = (sourcepath, fullfilepath, content)=>{
    let fdir = pathutil.parse(fullfilepath).dir;
    let pathid = pathutil.relative(sourcepath, fullfilepath);

    let content2 = content;
    content2 = content2.trim().replace(/\s*\r?\n\s*/g, ' ').replace(/\"/g, '\\\"')
    content2 = util.format('define("%s",[],"%s")', pathid, content2)

    return content2;
}
let changeJsToDeploy = (sourcepath, fullfilepath, sea_alias, content)=>{
    let fdir = pathutil.parse(fullfilepath).dir;
    let pathid = pathutil.relative(sourcepath, fullfilepath);
    let deps = getFileDepsAsArray(sourcepath, fullfilepath, content);
    let bad_requires = [];
    let result = cleanDeps(sourcepath, fullfilepath, deps, sea_alias)
    deps = result.deps_good;
    if(result.deps_bad.length > 0)bad_requires[pathid] = result.deps_bad;
    let depspathid = [];
    let hotlist = [];
    deps.forEach((raw_req)=>{
        let req_pathid;
        let req_fullpath = resolveRequirePath(sourcepath, fullfilepath, raw_req, false, sea_alias)   
        req_pathid = pathutil.relative(sourcepath, req_fullpath);
        req_pathid = addJsExt(req_pathid)
        depspathid.push(req_pathid)

        let depsFolder = pathutil.parse(req_pathid).dir;
    })
    //console.log(depspathid)
    if(content.match(definetype1) 
    ){
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
    return content;
}
let me = {
    definetype1,
    addJsExt,
    parseSeaConfig,
    loadJsonFromFile: jsonFileLoader.loadJsonFromFile,
    resolveRequirePath,
    getRequireRegForReplacement,
    setPathVars,
    getFileDeps,
    getFileDepsAsArray,
    preLoadDeps,
    cleanDeps,
    changeJsToDeploy,
    changeTplToDeploy
}
module.exports = me;