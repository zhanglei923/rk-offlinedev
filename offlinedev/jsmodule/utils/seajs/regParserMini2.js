let _ = require('lodash')
let stripcomments = require('strip-comments')
let reg = require('./reg')


let getRequires = (jscontent)=>{
    let reqlist = []
    //eachcontentjs.eachContent(sourcepath, [/\.js$/], (jscontent, path, states)=>{
    if(jscontent){
        let arr = jscontent.split('\n');
        let linearr= []
        arr.forEach((line)=>{
            line=_.trim(line);
            if(line && !line.match(/^\/{2,}/g))
            if(line.length < 300){
                linearr.push(line)
            }
            else if(line.length<10*1000 && line.indexOf('require')>=0){
                linearr.push(line)
            }
        })
        let content2 = linearr.join('\n')
        //console.log(jscontent.length, content2.length)
        stripcomments(content2)
        arr = content2.split('\n');
        arr.forEach((line)=>{
            reqlist = line.match(reg.REQUIRE_REGEX);
        })
    }
    return reqlist;
}
module.exports = {
    getRequires
};



