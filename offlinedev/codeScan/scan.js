let rk = require('../jsmodule/utils/rk')
let scan_SeajsRequires = require('./scan_SeajsRequires')

module.exports = {
    scan:(staticFolder, fpath, jscontent)=>{
        if(fpath.match(/\.min\.js/) || 
            fpath.match(/\.bundle\.js/) || 
            fpath.match(/\.sdk\.js/) 
        ){
            return null;
        }
        jscontent = rk.cleanComments(jscontent)
        return scan_SeajsRequires.scan(staticFolder, fpath, jscontent); 
    }
}