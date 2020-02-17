let fs = require('fs')
let pathutil = require('path');
let eachcontentjs = require('eachcontent-js')

// let fstt = fs.lstatSync(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static`)
// console.log(fstt.mtimeMs.toString(36), fstt.ctimeMs.toString(36))

fs.watch(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static`,{
    persistent:true,
    recursive:true
},(e, filename)=>{
    console.log('changed', filename)
})

let t0=(new Date()*1);


eachcontentjs.eachStatus(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static`,/\.tpl$/,(fstate)=>{
    let ctime36 = fstate.ctimeMs.toString(36);
    let mtime36 = fstate.mtimeMs.toString(36);
})
console.log((new Date()*1)-t0)


t0=(new Date()*1);


eachcontentjs.eachContent(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static`,/\.tpl$/,(fpath)=>{
    //console.log(fpath)
})
console.log((new Date()*1)-t0)