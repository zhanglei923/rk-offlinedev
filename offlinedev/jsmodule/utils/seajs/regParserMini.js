let _ = require('lodash')
let reg = require('./reg')
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
    return (requires)
}

module.exports = {
    getRequires
};