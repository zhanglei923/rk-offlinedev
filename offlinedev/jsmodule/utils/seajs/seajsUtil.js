let fs = require('fs')
let _ = require('lodash')
let pathutil = require('path')
let util = require('util')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../utils/rk')
let fs_readFile = require('../fs_readFile')
let regParserMini = require('./regParserMini');
let jsonFileLoader = require('./sub-api/jsonFileLoader')
let concatRules = require('./concatRules')
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
    realpath = rk_formatPath(realpath);
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
let isCommonRequirePath = rk.isCommonRequirePath;
global.rkCacheOf_seajsFileDeps = {};//缓存
let getAllDeps = ()=>{
    return global.rkCacheOf_seajsFileDeps;
};
let cleanAll404 = (sourcefolder, alldeps)=>{
    for(let fullfilepath in alldeps){
        let deps = alldeps[fullfilepath];
        let cleaned = cleanDeps(sourcefolder, fullfilepath, deps);
        alldeps[fullfilepath] = cleaned.deps_good;
        //if(cleaned.deps_bad.length>0) console.log(fullfilepath, cleaned.deps_bad)
    }
    return alldeps;
}
let findAll404 = (sourcefolder, alldeps)=>{
    for(let fullfilepath in alldeps){
        let deps = alldeps[fullfilepath];
        let cleaned = cleanDeps(sourcefolder, fullfilepath, deps);
        alldeps[fullfilepath] = cleaned.deps_bad;
        //if(cleaned.deps_bad.length>0) console.log(fullfilepath, cleaned.deps_bad)
    }
    return alldeps;
}
let refreshAllDeps = (sourcefolder)=>{
    if(typeof sourcefolder === 'undefined') throw "error: need sourcefolder!"
    // (sourcefolder, fullfilepath, content)
    // fs_readFile
    let keep = {}
    eachcontentjs.eachPath(sourcefolder, /\.js$/, (fullfilepath)=>{
        fullfilepath = rk_formatPath(fullfilepath)
        keep[fullfilepath] = 1;
        fs_readFile.fs_readFile(fullfilepath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {   
            getFileDeps(sourcefolder, fullfilepath, content);
        });
    })    
    for(let fpath in global.rkCacheOf_seajsFileDeps){
        if(!keep[fpath]) delete global.rkCacheOf_seajsFileDeps[fpath];//有些文件可能被删除，因此也要做清除
    }
};
let getAllDepsAsMap = ()=>{
    let map = {};
    let alldeps = getAllDeps();
    for(let fullfilepath in alldeps){
        let info = alldeps[fullfilepath]
        let pathid = info.pathid;
        let deps = info.deps;
        let depsarr = []
        deps.forEach((dep)=>{
            depsarr.push(dep.pathid);
        })
        depsarr = _.uniq(depsarr);
        map[pathid] = depsarr;
    }
    return map;
}
let cleanNoOneRequired = (alldeps)=>{//去掉没有人require的废文件
    let required = {}
    for(let pathid in alldeps){
        alldeps[pathid].forEach((subpathid)=>{
            required[subpathid]=true;
        })
    }
    let badlist = []
    for(let pathid in alldeps){
        if(!required[pathid]) badlist.push(pathid);
    }
    console.log(badlist)
    return badlist;
};
let getFileDepsAsArray = (sourcefolder, fullfilepath, content)=>{
    let depsinfo = getFileDeps(sourcefolder, fullfilepath, content)
    let array = [];
    depsinfo.deps.forEach((info)=>{
        array.push(info.rawPath);
    })
    return array;
};
let getFileDeps = (sourcefolder, fullfilepath, content)=>{
    let mc36 = global.getFileMC36(fullfilepath);
    
    let pathid = pathutil.relative(sourcefolder, fullfilepath)
    pathid = rk_formatPath(pathid);
    //console.log(pathid)
    let deps = [];
    let cache = global.rkCacheOf_seajsFileDeps[fullfilepath];
    if(rk.isCookedJsPath(fullfilepath)){
        global.rkCacheOf_seajsFileDeps[fullfilepath] = {
            pathid,
            isCmd: false,
            mightBeCmd: false,
            mc36,
            deps: []
        }
    }else{
        if(cache && cache.mc36 === mc36){
            deps = cache.deps;
        }else{
            content = rk.cleanCommentsFast(content);
            deps = regParserMini.getRequires(content); 
            let deps2 = deps;//cleanDeps(sourcefolder, fullfilepath, deps);   
            for(let i=0;i<deps2.length;i++){
                let rawPath = deps2[i].rawPath;
                let fullpath = resolveRequirePath(sourcefolder, fullfilepath, rawPath, false);
                let thispathid = pathutil.relative(sourcefolder, fullpath);
                thispathid = rk_formatPath(thispathid)
                deps2[i].fullpath = fullpath;
                deps2[i].pathid = thispathid;
            }
            let isCmd = rk.isCmdFile(content);    
            let mightBeCmd = rk.mightBeCmdFile(content)
            global.rkCacheOf_seajsFileDeps[fullfilepath] = {
                pathid,
                isCmd,
                mightBeCmd,
                mc36,
                deps: deps2
            }
        }       
    }
    return global.rkCacheOf_seajsFileDeps[fullfilepath];
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
let loadAndCacheDeps = (sourcefolder, fpath, content)=>{
    if(typeof fpath !== 'undefined' && typeof content !== 'undefined'){
        getFileDeps(sourcefolder, fpath, content);
    }
}
let changeTplToDeploy = (sourcepath, fullfilepath, content)=>{
    let fdir = pathutil.parse(fullfilepath).dir;
    let pathid = pathutil.relative(sourcepath, fullfilepath);
    pathid = rk_formatPath(pathid)
    let content2 = content;
    content2 = content2.trim().replace(/\s*\r?\n\s*/g, ' ').replace(/\"/g, '\\\"')
    content2 = util.format('define("%s",[],"%s")', pathid, content2)

    return content2;
}
let changeJsToDeploy = (sourcepath, fullfilepath, sea_alias, content, info)=>{
    if(rk.isCookedJsPath(fullfilepath)) return content;
    if(!content.match(definetype1)) return content;
    if(typeof info==='undefined') info = {}

    let fdir = pathutil.parse(fullfilepath).dir;
    let pathid = pathutil.relative(sourcepath, fullfilepath);
    pathid = rk_formatPath(pathid);
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
        req_pathid = rk_formatPath(req_pathid)
        depspathid.push(req_pathid)

        let depsFolder = pathutil.parse(req_pathid).dir;
    });
    depspathid = _.uniq(depspathid)
    //if(!info.no_hot_url)depspathid = concatRules.updateToHotUrls(depspathid, sourcepath, fullfilepath, sea_alias, content);//切换到hot url模式
    let arr = content.split('\n');
    for(let i=0;i<arr.length;i++){
        let line = arr[i];
        if(line.match(definetype1)){
            if(info.depsPathIdUpdate) {
                depspathid = info.depsPathIdUpdate(depspathid);//可能要更新为hot url
            }
            line = line.replace(definetype1, `define("${pathid}",${JSON.stringify(depspathid)},function (require,exports,module)`)
            arr[i] = line;
            break;
        }
    }
    content = arr.join('\n')
    return content;
}
//【注意】，这里的依赖关系，必须汇总在一个根结点，而且这个根结点的孩子必须是所有节点，这样才能确保不会有遗漏
let reduceAllDepsIntoArray = (alldeps, initId)=>{
    //私有函数
    let _push = (array, pathid)=>{
        if(!global.seajs_parser_reduceAllDepsIntoArray_hitedId[pathid]){
            global.seajs_parser_reduceAllDepsIntoArray_hitedId[pathid] = true;
            array.push(pathid)
        }
        return array;
    }
    //私有函数
    let do_reduceAllDepsIntoArray = (deps, fulldeps,pathid)=>{
        //console.log(pid, pathid)
        let arr = deps[pathid];
        if(arr){
            arr.forEach((fpath)=>{
                if(!global.seajs_parser_reduceAllDepsIntoArray_hitedId[pathid])do_reduceAllDepsIntoArray(deps, fulldeps, fpath);
                fulldeps = _push(fulldeps, fpath)
                //fulldeps.push(fpath)
            })
            fulldeps = _push(fulldeps, pathid)
        }
    }
    //正文
    global.seajs_parser_reduceAllDepsIntoArray_hitedId = {}
    let fulldeps = []
    do_reduceAllDepsIntoArray(alldeps, fulldeps, initId)
    // for(let pathid in alldeps){
    //     //fulldeps.push(pathid)
    //     fulldeps = _push(fulldeps, pathid)
    // }
    global.seajs_parser_reduceAllDepsIntoArray_hitedId = {}
    fulldeps = _.uniq(fulldeps)
    return fulldeps;
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
    loadAndCacheDeps,
    cleanDeps,
    changeJsToDeploy,
    changeTplToDeploy,
    reduceAllDepsIntoArray,
    cleanAll404,
    findAll404,
    refreshAllDeps,
    getAllDeps,
    getAllDepsAsMap,
    cleanNoOneRequired
}
module.exports = me;