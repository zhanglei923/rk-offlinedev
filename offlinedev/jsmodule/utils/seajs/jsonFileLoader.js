let fs = require('fs')


let load = (fullfilepath)=>{
    let returnJson;

    let define = (arg)=>{
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
    if(fs.existsSync(fullfilepath)){
        console.log(fullfilepath)
        let content = fs.readFileSync(fullfilepath, 'utf8');
        eval(content);
        console.log(returnJson)
    }
    
};
module.exports = {
    load
}