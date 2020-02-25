let fs = require('fs')
let eachcontentjs = require('eachcontent-js')
let concatcss = require('../supports/concat_css')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`

eachcontentjs.eachContent(sourcepath, /\.css$/, (content, fpath)=>{
    let output = concatcss.getNewCssContent(fpath, content, `/Users/zhanglei/ddd`);
    fs.writeFileSync(fpath, output)
});