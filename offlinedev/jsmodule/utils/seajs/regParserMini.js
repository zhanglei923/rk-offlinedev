let _ = require('lodash')
let reg = require('./reg')

var getPath = function(requreResults){
    var pathReg = reg.PATH_REGEX;
    for(var x = 0, lenx = requreResults.length; x < lenx; x++) {
        var item = requreResults[x];
        let isobj = (typeof item === 'object');
        let rawPath = isobj ? item.rawPath : item;
        rawPath = _.trim(rawPath);
        rawPath = rawPath.replace(/"/ig, "'");//疑似nodejs的bug，如果字符串中含有双引号"，那么执行concat会失败，用for循环也会失败，因此只得转换为单引号先
        if((rawPath.match(/\"/ig) && rawPath.match(/\"/ig).length > 2) || (rawPath.match(/\'/ig) && rawPath.match(/\'/ig).length > 2)) {
            rawPath = null;//含有多个双引号或单引号，有字符串拼接，不合法
        }else{
            var rest = rawPath.replace(pathReg, '')
            if(rest.indexOf('+')>=0){//字符串拼接不允许
                rawPath=null;      
            }else{
                rawPath = rawPath.match(pathReg)[0];//提取require路径
                rawPath = rawPath.replace(/'/ig, '');//删掉单引号     
            }    
        }
        if(isobj) {
            requreResults[x].rawPath = rawPath;
        }else{
            requreResults[x] = rawPath;
        }
    };
    requreResults = _.compact(requreResults);
    requreResults = _.uniq(requreResults);
    return requreResults;
};
let reduceContentAsLines = (raw_jscontent)=>{
    let arr = raw_jscontent.split('\n')
    let lines = [];
    arr.forEach((linetxt)=>{
        linetxt = _.trim(linetxt);

        // if(!linetxt.match(/^\s?\/{2,}/))//不要注释的
        // if(linetxt.match(/require/)) lines.push(linetxt);

        if(!/^\s{0,}\/{2,}/.test(linetxt) && /require(\s|\()/.test(linetxt)) lines.push(linetxt);
    })
    return lines;
}
let reduceContent = (raw_jscontent)=>{
    let lines = reduceContentAsLines(raw_jscontent);
    return lines.join('\n');
}
let getRequiresAsArray = (jscontent)=>{
    let deps = getRequires(jscontent);
    let arr = [];
    deps.forEach((o)=>{
        arr.push(o.rawPath);
    })
    arr = _.uniq(arr);
    return arr;
}
let getRequires = (jscontent)=>{
    let lines = reduceContentAsLines(jscontent);
    if(lines.length===0) return [];
    let requires = [];
    lines.forEach((line)=>{
        // let a = require
        // fun( requre()
        // fun(a, require())
        // a= [require()]
        // a= [1, require()]
        let withExport = !!/\=[\s]{0,}require/.test(line)//!!line.match(/\=[\s]{0,}require/);
        let arr = line.match(reg.REQUIRE_REGEX);
        if(arr){
            arr.forEach((rawPath)=>{
                requires.push({
                    rawPath,
                    withExport
                })
            });
        }
    })
    return getPath(requires)
}
let getRequires2 = (jscontent)=>{
    let mincontent = reduceContent(jscontent)
    if(!mincontent) return [];
    let requires = mincontent.match(reg.REQUIRE_REGEX);
    if(!requires) requires = []
    return getPath(requires)
}

module.exports = {
    getRequiresAsArray,
    getRequires2,
    getRequires
};