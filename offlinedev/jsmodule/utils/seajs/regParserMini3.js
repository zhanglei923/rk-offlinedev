let _ = require('lodash')
let stripcomments = require('strip-comments')
let eachcontentjs = require('eachcontent-js')

var rk_path = require('./util/rk_path');
let regParser = require('./regParser')

var dependencyMap = {};
var asyncDependencyMap = {};

let reg = require('./reg')

let getRequires = (jscontent, jsPath)=>{
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
        content2 = stripcomments(content2)
        //require('fs').writeFileSync(jsPath, content2)
        arr = content2.split('\n');
        arr.forEach((line)=>{
            let deps = line.match(reg.REQUIRE_REGEX);
            deps = deps?deps:[];
            reqlist = reqlist.concat(deps);
        })
        if(reqlist) reqlist = regParser.getPath(reqlist);
        if(reqlist) reqlist = _.uniq(reqlist);
        //if(reqlist&&reqlist.length>0)console.log(reqlist)
    }
    return reqlist;
}

var parser = {
	seaConfig: {}, 
	setSeaConfig: function(seaConfig){
		this.seaConfig = seaConfig;
    },
    parse: function(srcPath){
        dependencyMap = {};
        asyncDependencyMap = {};        
        eachcontentjs.eachContent(srcPath, [/\.js$/], (content, jsPath, states)=>{
            let arr = []
            if(content){
                arr = getRequires(content, jsPath);
            }
            var jsRequirePath = rk_path.getRequirePath(srcPath, jsPath);
            dependencyMap[jsRequirePath] = arr;
        })
        return dependencyMap;
    }
}
module.exports = parser;