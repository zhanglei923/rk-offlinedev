let fs = require('fs')
let pathutil = require('path')
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
    return new RegExp('require[\\s]?[\(][\\s]{0,}(\'|")'+req_path+'(\'|")'+(closeright?'[\\s]{0,}\\){1}':''), 'g');
}
let me = {
    parseSeaConfig,
    loadJsonFromFile: jsonFileLoader.loadJsonFromFile,
    resolveRequirePath,
    getRequireRegForReplacement,
    setPathVars
}
module.exports = me;