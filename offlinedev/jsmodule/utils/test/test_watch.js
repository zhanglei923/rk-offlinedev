let watch = require('../watch')

let watchId = 'mytest';
let folder = `E:/workspaceGerrit/_sub_separation_test/apps-ingage-web/src/main/webapp/static/source`;
let filereg =  /\.(tpl|js)$/;
let ignored = /node\_modules/g

watch.watchFiles({watchId, folder, filereg, ignored})

let test = ()=>{
    watch.watchFiles({watchId, folder, filereg, ignored})
    let changed = watch.getChangedFiles(watchId)
    console.log(changed)
    setTimeout(()=>{
        test();
    }, 300)
};
test();