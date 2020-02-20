let rk = require('../../utils/rk');

let me = {
    loadCmdInfo: (fullfilefpath, content)=>{
        let info;
        content = rk.cleanCommentsFast(content);
        let hasModuleExport = false;
        if(/\.js$/.test(fullfilefpath) && !rk.isCookedJsPath(fullfilefpath)){
            let cleancontent = rk.cleanCommentsFast(content);
            let hasModuleExport = /\bexports\b\s{0,}\=/g.test(cleancontent);
            info = {
                hasModuleExport
            }
        }
        return info;
    }
}
module.exports = me;