let fs = require('fs')
let _ = require('lodash')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;
let totalarr = []
let matcharr = []
eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
    if(!rk.isCookedJsPath(fpath) && !rk.isLibJsPath(fpath) && rk.mightBeCmdFile(content)){
        let arr = content.split('define');
            let header = _.trim(arr[0]);
            if(header) {
                header = _.trim(rk.cleanComments(header));
                if(header) console.log('h:', header)
            }

    }
})


console.log(new Date()*1-t0)