let fs = require('fs')
let _ = require('lodash')
let pathutil = require('path')
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
let resolveRequirePath = (sourcePath, ownerFilePath, requirePath)=>{
    let realpath;
    let alias = global.rkGlobalConfig.runtime.seajsConfig.alias;
    if(alias && alias[requirePath]){
        requirePath = alias[requirePath];
    }
    requirePath = setPathVars(requirePath);
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
    return isnormal;
};
global.rkFileDepsCache = {};//缓存
let getFileDeps = (sourcefolder, fullfilepath, content)=>{
    let fstate = fs.lstatSync(fullfilepath);
    let ctime36 = fstate.ctimeMs.toString(36);
    let mtime36 = fstate.mtimeMs.toString(36);
    let mc36 = mtime36+'-'+ctime36;
    
    let deps = [];
    let cache = global.rkFileDepsCache[fullfilepath];
    if(rk.isCookedJsPath(fullfilepath)){
        global.rkFileDepsCache[fullfilepath] = {
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
            let mightBeCmd = rk.mightBeCmdFile(content)
            global.rkFileDepsCache[fullfilepath] = {
                mightBeCmd,
                mc36,
                deps: deps2
            }
        }       
    }
    return global.rkFileDepsCache[fullfilepath];
}
let cleanDeps = (sourcefolder, fullfilepath, deps)=>{
    let deps2 = [];
    deps.forEach((info)=>{
        let readpath = resolveRequirePath(sourcefolder, fullfilepath, info.rawPath)
        if(!isCommonRequirePath(info.rawPath) || fs.existsSync(readpath)){
            deps2.push(info);
        }else{
            console.log('[404]', info.rawPath, readpath,isCommonRequirePath(info.rawPath))
        }
    })
    return deps2;
}
let preLoadDeps = (sourcefolder, fpath, content)=>{
    if(typeof fpath !== 'undefined' && typeof content !== 'undefined'){
        getFileDeps(sourcefolder, fpath, content);
    }
}
let me = {
    addJsExt,
    parseSeaConfig,
    loadJsonFromFile: jsonFileLoader.loadJsonFromFile,
    resolveRequirePath,
    getRequireRegForReplacement,
    setPathVars,
    getFileDeps,
    preLoadDeps
}
module.exports = me;