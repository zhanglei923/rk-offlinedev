let urlUtil = require('./url');
let pathutil = require('path')

let nick1 = urlUtil.getSaveName('/json/save.action?name=zhang&age=30');
let nick2 = urlUtil.getSaveName('/json/save/')
console.log(nick1)
console.log(nick2)


let cache  = require('./cacheUtil')
cache.setCache('aaa', '111', '222')
console.log(cache.getCache('aaa', '111'))

let fs = require('fs')
let dir = `E:/workspaceGerrit/rk-offlinedev/offlinedev/jsmodule/static-proxy/`
let map = {}
var list = fs.readdirSync(dir)

list.forEach(function(file) {
    let fullpath = dir + '/' + file
    var stat = fs.statSync(fullpath)
    if (stat && !stat.isDirectory()) {
        map[file] = true;
    }
})
//console.log(map)

let shouldIgnore = (staticroot, fpath)=>{
    let finfo = pathutil.parse(fpath);
    let fname = finfo.base;
    let map = {}
    let dir = staticroot;
    var list = fs.readdirSync(dir)    
    list.forEach(function(file) {
        let fullpath = dir + '/' + file
        var stat = fs.statSync(fullpath)
        if (stat && !stat.isDirectory()) {
            map[file] = true;
        }
    })
    console.log(map)
    if(fname)return true;
}
console.log(shouldIgnore('E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static/','E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static/core/rk-config.js'))