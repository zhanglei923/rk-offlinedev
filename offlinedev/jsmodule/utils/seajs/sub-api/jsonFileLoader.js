let fs = require('fs')

//获取define定义的json文件
let loadJsonFromFile = (fullfilepath)=>{
    let returnJson;
    let define = (arg)=>{//假函数，用来替换js文本里的define执行
        if(typeof arg === 'function'){
            let r={},e={},m={};
            let json = arg(r,e,m);
            if(json) returnJson = json;
            if(m.exports) returnJson = m.exports;
        }
        if(typeof arg === 'object'){
            returnJson = arg;
        }
    }
    if(!fs.existsSync(fullfilepath)) fullfilepath += '.js';
    if(fs.existsSync(fullfilepath)){
        //console.log(fullfilepath)
        let content = fs.readFileSync(fullfilepath, 'utf8');
        eval(content);
        //console.log(returnJson)
    }
    return returnJson;
};
module.exports = {
    loadJsonFromFile
}