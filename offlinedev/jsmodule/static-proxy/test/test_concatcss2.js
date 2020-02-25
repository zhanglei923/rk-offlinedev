let fs = require('fs')
let eachcontentjs = require('eachcontent-js')
let concatcss = require('../supports/concat_css')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`

let superdir = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`
let supercss = ''
eachcontentjs.eachContent(sourcepath, /\.css$/, (content, fpath)=>{
    supercss += concatcss.getNewCssContent(fpath, content, superdir);
});
fs.writeFileSync(`${superdir}/su.css`, supercss)