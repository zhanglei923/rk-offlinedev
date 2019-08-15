let fs = require('fs');
let _ = require('lodash')

let filterDefine = [];
let loadFilterDef = (configfile)=>{
    let arr = [{
        // http://localhost:666/static/source/separation/demo/ya.js
        // http://localhost:666/static/source/separation/demo/ya.css
        // http://localhost:666/static/source/separation/demo/ya.tpl
        url: '/static/source/separation',
        localpath: 'E:/workspaceGerrit/_sub_separation_test/xsy-static-product_separation'
    }]
    console.log('[static-config]', configfile)
    if(fs.existsSync(configfile)){
        let config = fs.readFileSync(configfile, 'utf8');
        config = JSON.parse(config);
        let isok = true;
        if(_.isArray(config['static-proxy'])){
            config['static-proxy'].forEach((item)=>{
                console.log(item)
            })

        }
        if(isok)arr = arr.concat(config['static-proxy'])
    }
    filterDefine = arr;
    //print
    filterDefine.forEach((item)=>{
        console.log(' [reg static-proxy]', item.url, '=>', item.localpath)
    })
}
let getFilterDef = (req_path)=>{    
    let localpath;
    for(let i = 0;i<filterDefine.length;i++){
        let o = filterDefine[i];
        let url = o.url;
        if(!url.match(/^\^/)) url = '^' + url;
        let regex = new RegExp(url);
        if(req_path.match(regex)){
            localpath = o.localpath;
            break;
        }
    }
    return localpath;
}
module.exports = {
    loadFilterDef,
    getFilterDef
};