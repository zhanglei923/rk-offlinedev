let fileDepsLoader = require('../../utils/seajs/seajsUtil')

let fpath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/page/js/frame/pageMainCtrl.js`;
let content = require('fs').readFileSync(fpath, 'utf8')

for(let i=0;i<10;i++){
    let t0=new Date()*1
    let deps = fileDepsLoader.getFileDeps(fpath, content);
    console.log((new Date()*1)-t0)
}
//console.log(deps)