let fs = require('fs')

//获取define定义的json文件
let loadJsonFromFile = (fullfilepath)=>{
    let returnJson;
    let define = (arg)=>{//假函数，用来替换js文本里的define执行
        if(typeof arg === 'function'){
            let r=()=>{
                throw `[RK 源代码异常]json文件里不允许有require，文件路径：${fullfilepath}`
            },e={},m={};
            let json = arg(r,e,m);
            if(json) returnJson = json;
            if(m.exports) returnJson = m.exports;
        }
        if(typeof arg === 'object'){
            returnJson = arg;
        }
    }
    let rk_offlinedev_debug_define = (fun)=>{
        if(typeof fun === 'function'){
            return fun()
        }else{
            return fun;
        }
    }
    let rk_offlinedev_update_require = (_require)=>{
        return _require;
    }
    let rk_offlinedev = {};
    if(!fs.existsSync(fullfilepath)) fullfilepath += '.js';
    if(fs.existsSync(fullfilepath)){
        //console.log(fullfilepath)
        let content = fs.readFileSync(fullfilepath, 'utf8');
        try{
            eval(content);
        }catch(e){
            console.log(e);
        }
        //console.log(returnJson)
    }
    return returnJson;
};
module.exports = {
    loadJsonFromFile
}