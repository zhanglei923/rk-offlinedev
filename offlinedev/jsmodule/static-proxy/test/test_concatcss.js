let fs = require('fs')
let eachcontentjs = require('eachcontent-js')
let concatcss = require('../supports/concat_css')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`

eachcontentjs.eachContent(sourcepath, /\.css$/, (content, fpath)=>{
    let output = concatcss.parseUrls(
        `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/`, 
        fpath, 
        content
    );
    fs.writeFileSync(fpath, JSON.stringify(output))
});