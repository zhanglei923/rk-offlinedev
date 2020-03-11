var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')
let hot_concat = require('../updators/concat/hot_concat')

module.exports = {
    isMyHotUrl:(url)=>{
        return url.match(/\_hot\//g);
    },
    load:(config, url, callback)=>{
        // https://crm-dev61rs.ingageapp.com/static/source/products/bi/common/service/_hotresponse_.js
        let webappFolder = config.webappFolder;
        let dir = pathutil.parse(url).dir;
        dir = dir.replace(/^\/{1,}/, './')
        dir = pathutil.resolve(webappFolder, dir);
        let pathid = '_hot/'+url.split('_hot/')[1]
        //console.log('dir=', dir)
        // for(let p in  global.rkCacheOf_autoConcatPlan){
        //     console.log(p)
        // }
        let cachedata = global.rkCacheOf_autoConcatPlan[pathid]
        if(!cachedata){
            console.log(`[rk error]not found: ${dir}`)
            callback(null)
            return;
        }
        let files = cachedata.files;
        let content = hot_concat.getConcatContent(files).currentContent;
        callback(content);
    }
};