let urlUtil = require('./url');
let pathutil = require('path')

let nick1 = urlUtil.getSaveName('/json/save.action?name=zhang&age=30');
let nick2 = urlUtil.getSaveName('/json/save/')
console.log(nick1)
console.log(nick2)


let cache  = require('./cacheUtil')
cache.setCache('aaa', '111', '222')
console.log(cache.getCache('aaa', '111'))




