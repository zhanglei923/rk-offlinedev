var fs = require('fs');
let eachcontentjs = require('eachcontent-js')

let alllen = []
eachcontentjs.eachFolder(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`, (dir)=>{
    var list = fs.readdirSync(dir)
    let files = []
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && !stat.isDirectory() && !file.match(/\.js$/)) files.push(file);
    })
    let len = files.length;
    if(len>0)alllen.push(len)
    if(len>20) console.log(len,dir)
})

alllen.sort((a,b)=>{
    return a>b;
})
//alllen.reverse()

console.log(alllen.join(','))