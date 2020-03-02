let fs_readFile = require('../supports/fs_readFile')

let fpath = `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/i18n/untranslated.js`
//默认走异步读取
fs_readFile.fs_readFile(fpath, {encoding:'utf8'}, (err, content, fileinfo) => {
    console.log(content)
    console.log(`done1.1`)
});
console.log(`done1.2`)

//走同步模式读取
let content2;
fs_readFile.fs_readFile(fpath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {
    content2 = content;
    console.log(`done2.1`)
});
console.log(content2, '\n',`done2.2`)