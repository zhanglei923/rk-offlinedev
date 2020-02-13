let eachcontentjs = require('eachcontent-js')

let parser1 = require('../regParserMini')
let parser2 = require('../regParserMini2')

let t0=(new Date()*1);

let sourcepath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`
eachcontentjs.eachContent(sourcepath, [/\.js$/], (content, path, states)=>{
    if(content){
        parser2.getRequires(content)
    }
})

console.log((new Date()*1)-t0)