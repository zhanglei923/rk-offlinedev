let scan_SeajsRequires = require('./scan_SeajsRequires')

module.exports = {
    scan:(fpath, jscontent)=>{
        scan_SeajsRequires.scan(fpath, jscontent);
    }
}