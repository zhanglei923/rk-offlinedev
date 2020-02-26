let fs = require('fs')
let eachcontentjs = require('eachcontent-js')
let fileDepsLoader = require('../../utils/seajs/seajsUtil')

let fpath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/page/js/frame/pageMainCtrl.js`;
let content = require('fs').readFileSync(fpath, 'utf8')

    let t0=new Date()*1
    eachcontentjs.eachContent(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`, /\.js$/, (content, fpath)=>{
       
        let deps = fileDepsLoader.getFileDeps(fpath, content);
    });
    console.log((new Date()*1)-t0)