let rk = require('../../utils/rk')

let cacheOfCmdInfo={};

let me = {
    loadCmdInfo: (fullfilefpath, content)=>{
        content = rk.cleanCommentsFast(content);
        let hasModuleExport = false;
        if(/\.js$/.test(fullfilefpath) && !rk.isCookedJsPath(fullfilefpath)){
            let cleancontent = rk.cleanCommentsFast(content);
            let hasModuleExport = /\bexports\b\s{0,}\=/g.test(cleancontent);
            if(hasModuleExport) console.log(fullfilefpath)
            cacheOfCmdInfo[fullfilefpath] = {
                hasModuleExport
            }
        }
        
    }
}
module.exports = me;