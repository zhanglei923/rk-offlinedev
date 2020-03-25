let watch = require('../watch')

let watchId = 'mytest';
let folder = `E:/workspaceGerrit/_sub_separation_test/apps-ingage-web/src/main/webapp/static/source`;
let filereg =  /\.(tpl|js)$/;

watch.watchFiles({watchId, folder, filereg})

let test = ()=>{
    watch.watchFiles({watchId, folder, filereg})
    let changed = watch.getChangedFiles(watchId)
    console.log(changed)
    setTimeout(()=>{
        test();
    }, 300)
};
test();