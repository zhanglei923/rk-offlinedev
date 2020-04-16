let fs = require('fs')
let eachcontentjs = require('eachcontent-js')
require('../global')
let configUtil = require('../../config/configUtil')
configUtil.reloadConfig()
let vpp = require('../fs-vpp');



let realpathlist = [];

vpp.eachSourceFolders((dir)=>{
    eachcontentjs.eachPath(dir, /\.(js|tpl|css)$/, (fpath)=>{
        realpathlist.push(fpath);
    })
})

let t0=new Date()*1;
for(let i=0;i<realpathlist.length;i++){
    let realpath = realpathlist[i];
    let virtualpath = vpp.changeto_virtualfpath(realpath);
    //console.log(virtualpath)
}
let t1=new Date()*1;

console.log(t1-t0)
//console.log(realpathlist)