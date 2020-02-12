//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');

let injectJs = (fpath, content)=>{
    if(fpath.match(/seajs\/sea\.js$/)){
        let dir = pathutil.parse(__filename).dir;
        let srcpath = pathutil.resolve(dir, './code/default_script.js');
        let defaultjs = fs.readFileSync(srcpath, 'utf8')
        console.log(fpath)
        content = defaultjs+`\n`+content;
    }
    return content;
}
module.exports = {
    injectJs
};