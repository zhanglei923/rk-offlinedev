let rk = require('../jsmodule/utils/rk')
let scan_SeajsRequires = require('./scan_SeajsRequires')

module.exports = {
    scan:(staticFolder, fpath, jscontent)=>{
        if(rk.isCookedJsPath(fpath)){
            return null;
        }
        jscontent = rk.cleanComments(jscontent)
        return scan_SeajsRequires.scan(staticFolder, fpath, jscontent); 
    }
}