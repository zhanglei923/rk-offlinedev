let fs = require('fs')
let pathutil = require('path')
let jsonFileLoader = require('./sub-api/jsonFileLoader')
let parseSeaConfig = (seaPath)=>{
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
let resolveRequirePath = (sourcePath, ownerFilePath, requirePath)=>{
    let realpath;
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
    getRequireRegForReplacement
}
module.exports = me;