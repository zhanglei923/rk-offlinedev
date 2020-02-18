let fs = require('fs')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;
let arr = []
eachcontentjs.eachFolder(sourcepath, (dir)=>{
    var list = fs.readdirSync(dir)
    let childrenfiles = []
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && !stat.isDirectory()) childrenfiles.push(file)
    })
    let len = childrenfiles.length
    arr.push(len);
    if(len>10) console.log(dir)
})


//console.log(arr.sort((a,b)=>{return a>b;}).join(','))
