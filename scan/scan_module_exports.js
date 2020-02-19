let fs = require('fs')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;
let totalarr = []
let matcharr = []
eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
    if(fpath.indexOf('/lib/')<0){
        if(content.match(/module\.exports/g)){
            matcharr.push(fpath)
        }
        totalarr.push(fpath)

    }
})


console.log(matcharr.length / totalarr.length)

console.log(new Date()*1-t0)