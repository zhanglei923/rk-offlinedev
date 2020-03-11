var fs = require('fs');
var pathutil = require('path');
var getConfig = require('../../config/configUtil')
let hot_concat = require('../updators/concat/hot_concat')

module.exports = {
    isMyHotUrl:(url)=>{
        return url.match(/\_hot\//g);
    },
    load:(config, url, callback)=>{
        // https://crm-devapplicationrs.ingageapp.com/static/source/_hot/output_tpl.bundle.js
        // https://crm-devapplicationrs.ingageapp.com/static/source/_hot/output_1.bundle.js
        let webappFolder = config.webappFolder;
        let dir = pathutil.parse(url).dir;
        dir = dir.replace(/^\/{1,}/, './')
        dir = pathutil.resolve(webappFolder, dir);
        let hotpathid = '_hot/'+url.split('_hot/')[1]
        //console.log('dir=', dir)
        // for(let p in  global.rkCacheOf_autoConcatPlan){
        //     console.log(p)
        // }
        let cachedata = global.rkCacheOf_autoConcatPlan[hotpathid]
        if(!cachedata){
            console.log(`[rk error]not found: ${dir}`)
            callback(null)
            return;
        }
        let files = cachedata.files;
        let content = hot_concat.getConcatContent(hotpathid, files).currentContent;
        callback(content);
    }
};