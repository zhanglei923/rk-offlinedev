let configUtil = require('../../../config/configUtil')
const isPathInside = require('is-path-inside');

// isPathInside('a/b/c', 'a/b');//=> true 
// isPathInside('a/b/c', 'x/y');//=> false 
// isPathInside('a/b/c', 'a/b/c');//=> false 
// isPathInside('/Users/sindresorhus/dev/unicorn', '/Users/sindresorhus');//=> true

let isExcludePathid = (pathid)=>{
    let excludePathList = configUtil.getValue('debug.concat.filesToExclude');
    excludePathList = excludePathList?excludePathList:[];
    if(excludePathList.length === 0) return false;
    let is = false;
    for(let i=0;i<excludePathList.length;i++){
        let excludepath = excludePathList[i]
        if(isPathInside(pathid, excludepath)) {
            //console.log(pathid, excludepath)
            is=true;
            break;
        }
    }
    return is;
}
module.exports = {
    isExcludePathid
};