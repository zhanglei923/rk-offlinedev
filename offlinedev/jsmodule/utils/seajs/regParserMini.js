let _ = require('lodash')
let reg = require('./reg')

var getPath = function(requreResults){
    var pathReg = reg.PATH_REGEX;
    for(var x = 0, lenx = requreResults.length; x < lenx; x++) {
        var item = requreResults[x];
        item = _.trim(item);
        item = item.replace(/"/ig, "'");//疑似nodejs的bug，如果字符串中含有双引号"，那么执行concat会失败，用for循环也会失败，因此只得转换为单引号先
        if((item.match(/\"/ig) && item.match(/\"/ig).length > 2) || (item.match(/\'/ig) && item.match(/\'/ig).length > 2)) {
            item = null;//含有多个双引号或单引号，有字符串拼接，不合法
        }else{
            var rest = item.replace(pathReg, '')
            if(rest.indexOf('+')>=0){//字符串拼接不允许
                item=null;      
            }else{
                item = item.match(pathReg)[0];//提取require路径
                item = item.replace(/'/ig, '');//删掉单引号     
            }    
        }
        requreResults[x] = item;
    };
    requreResults = _.compact(requreResults);
    requreResults = _.uniq(requreResults);
    return requreResults;
};
let reduceContent = (raw_jscontent)=>{
    let arr = raw_jscontent.split('\n')
    let requiretxt = ''
    arr.forEach((linetxt)=>{
        linetxt = _.trim(linetxt);
        if(linetxt.match(/require/)) requiretxt += '\n'+linetxt;
    })
    //console.log('>>', requiretxt)
    return requiretxt;
}
let getRequires = (jscontent)=>{
    let mincontent = reduceContent(jscontent)
    if(!mincontent) return [];
    let requires = mincontent.match(reg.REQUIRE_REGEX);
    if(!requires) requires = []
    return getPath(requires)
}

module.exports = {
    getRequires
};