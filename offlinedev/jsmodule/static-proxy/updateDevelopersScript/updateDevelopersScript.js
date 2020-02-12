//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let regParserMini = require('../../utils/seajs/regParserMini');

let isFirstJs = (fpath)=>{
    if(fpath.match(/seajs\/sea\.js$/)){
        return true;
    }
    return false;
}
let updateJs = (fpath, content)=>{
    return content;
}
let updateFirstJs = (fpath, content)=>{
    if(isFirstJs(fpath)){
        let dir = pathutil.parse(__filename).dir;
        let srcpath = pathutil.resolve(dir, './code/default_script.js');
        let defaultjs = fs.readFileSync(srcpath, 'utf8')
        content = defaultjs+`\n`+content;
    }
    return content;
}
module.exports = {
    isFirstJs,
    updateFirstJs,
    updateJs
};