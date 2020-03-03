var fs = require('fs');
var _ = require('lodash');
let pathutil = require('path')
var blueimp_md5 = require("blueimp-md5")//https://github.com/blueimp/JavaScript-MD5
let is_path_inside = require('is-path-inside')
let eachcontentjs = require('eachcontent-js')

let masterFolders;

module.exports = {
    updateToHotUrls: (pathidList, sourcepath, fullfilepath, sea_alias, content)=>{
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
            console.log(masterFolders)
            //fs.writeFileSync('./masters.json', masterFolders.join('\n'))    
        }
        for(let i=0;i<pathidList.length;i++){
            let pathid = pathidList[i];
            let realfullpath = pathutil.resolve(sourcepath, pathid);
            for(let j=0;j<masterFolders.length;j++){
                let masterfolder = masterFolders[j];
                if(is_path_inside(realfullpath, masterfolder)){
                    console.log(realfullpath, masterfolder)
                    break;
                }
            }
        }

        return pathidList;
    }
}