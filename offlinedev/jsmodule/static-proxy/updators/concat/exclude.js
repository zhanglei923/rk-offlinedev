let configUtil = require('../../../config/configUtil')
const isPathInside = require('is-path-inside');
const micromatch = require('micromatch');

// isPathInside('a/b/c', 'a/b');//=> true 
// isPathInside('a/b/c', 'x/y');//=> false 
// isPathInside('a/b/c', 'a/b/c');//=> false 
// isPathInside('/Users/sindresorhus/dev/unicorn', '/Users/sindresorhus');//=> true

// console.log(micromatch(['a/b/c.js', 'a/c.md'], 'a/**/*.*', { basename: true }));
// console.log(micromatch(['a/b/c.js', 'a/c.md'], 'a/**', { basename: true }));
// console.log(micromatch('a/b/c.js', 'a/**', { basename: true }));
let localSettings;
let setSettings = (json)=>{
    localSettings = json;
};
let isExcludePathid = (pathid)=>{
    let excludePathList = localSettings ? localSettings.filesToExclude : configUtil.getValue('debug.concat.filesToExclude');
    excludePathList = excludePathList?excludePathList:[];
    if(excludePathList.length === 0) return false;
    let is = false;
    for(let i=0;i<excludePathList.length;i++){
        let excludepath = excludePathList[i]
        if(false && isPathInside(pathid, excludepath)) {
            //console.log(pathid, excludepath)
            is=true;
            break;
        }
        let match = micromatch(pathid, excludepath, { basename: true })
        if(match && match.length > 0){
            is=true;
            break;
        }
    }
    return is;
}
module.exports = {
    isExcludePathid,
    setSettings
};