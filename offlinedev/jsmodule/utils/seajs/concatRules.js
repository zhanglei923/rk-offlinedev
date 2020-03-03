var fs = require('fs');
var _ = require('lodash');
let pathutil = require('path')
var blueimp_md5 = require("blueimp-md5")//https://github.com/blueimp/JavaScript-MD5
let is_path_inside = require('is-path-inside')
let eachcontentjs = require('eachcontent-js')
let rk = require('../rk')

let masterFolders;

module.exports = {
    updateToHotUrls: (pathidList, sourcepath, fullfilepath, sea_alias, content)=>{
        //if(!pathidList) console.log(fullfilepath)
        if(!masterFolders) {
            masterFolders = []
            let folders = eachcontentjs.getAllFolders(sourcepath)
            folders.forEach((folder)=>{
                let folders2 = eachcontentjs.getAllFolders(folder);
                if(folders2.length === 0){
                    masterFolders.push(folder);
                }else{
                    masterFolders = masterFolders.concat(folders2)
                }
            })
            masterFolders = _.uniq(masterFolders);
            //console.log(masterFolders)
            //fs.writeFileSync('./masters.json', masterFolders.join('\n'))    
        }
        //if(fullfilepath.indexOf('untranslated.js')>=0) console.log(pathidList)
        let new_pathList = []
        for(let i=0;i<pathidList.length;i++){
            let pathid = pathidList[i];
            if(rk.isCookedJsPath(pathid)) continue;
            if(rk.isLibJsPath(pathid)) continue;
            if(!rk.isCommonRequirePath(pathid)){
                new_pathList.push(pathid)
                continue;
            }
            let hotpathid;
            let realfullpath = pathutil.resolve(sourcepath, pathid);
            for(let j=0;j<masterFolders.length;j++){
                let masterfolder = masterFolders[j];
                if(is_path_inside(realfullpath, masterfolder)){
                    //console.log(realfullpath, masterfolder)
                    let hotpath = pathutil.resolve(masterfolder, './autoconcat_HOT.js')
                    hotpathid = pathutil.relative(sourcepath, hotpath)
                    break;
                }
            }
            new_pathList.push(hotpathid ? hotpathid : pathid);
        }
        new_pathList = _.uniq(new_pathList);
        return new_pathList;
    }
}