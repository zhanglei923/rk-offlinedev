var fs = require('fs');
var pathutil = require('path');
let projectFileSearch = require('../projectFileSearch')
let prettifyFilePath = (fpath)=>{
    fpath = fpath.replace(/\/{1,}/g, '/');
    fpath = fpath.replace(/\\{1,}/g, '/');
    return fpath;
};
module.exports = {
    findPath:(rootFolder, path)=>{
        let fromSubPrj = null;
        var fullfilepath = rootFolder + '/' + path;
        if(!fs.existsSync(fullfilepath)){
            let o = projectFileSearch.searchFile(path)
            if(o) {
                fromSubPrj = o.project;
                fullfilepath = o.fpath;
            }
        }
        if(!fs.existsSync(fullfilepath)){
            console.log('no-file:', fullfilepath)
            return;
        }
        fullfilepath = prettifyFilePath(fullfilepath);
        return {
            fullfilepath,
            fromSubPrj
        }
    },
    loadGlobalStaticFiles: ()=>{

    }
}