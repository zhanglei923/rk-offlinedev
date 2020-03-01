let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
let updateCss = require('../supports/concat_css')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/`
let destFile = pathutil.resolve(sourcepath, './static/source/platform/core/css/all-xsy-widgets.css')
updateCss.concatCss({
    sourceDirList: [
        pathutil.resolve(sourcepath, 'platform/widgets'),
        pathutil.resolve(sourcepath, 'platform/layout')
    ],
    filterFun:()=>{
        return true;
    },
    destFile,
    success: function(newcontent){
        fs.writeFileSync(destFile, newcontent)
    }
})