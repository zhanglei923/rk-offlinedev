let fs = require('fs');
let _ = require('lodash')
let pathutil = require('path')

let filterDefine = [];
let loadFilterDef = (configfile)=>{
    let arr = [{
        // http://localhost:666/static/source/separation/demo/ya.js
        // http://localhost:666/static/source/separation/demo/ya.css
        // http://localhost:666/static/source/separation/demo/ya.tpl
        // http://localhost:666/aaa/a.js
        // http://localhost:666/bbb/222/b.js
        urlpath: '/static/source/separation',
        localpath: 'E:/workspaceGerrit/_sub_separation_test/xsy-static-product_separation/static/source/separation'
    }]
    console.log('[static-config]', configfile)
    if(fs.existsSync(configfile)){
        let config = fs.readFileSync(configfile, 'utf8');
        config = JSON.parse(config);
        let isok = true;
        if(_.isArray(config['static-proxy'])){
            config['static-proxy'].forEach((item)=>{
                item.urlpath = item.urlpath.replace(/\/{1,}/g, '/');
                item.localpath = item.localpath.replace(/\\{1,}/g, '/');
                item.localpath = item.localpath.replace(/\/$/, '');
                console.log(item)
            })
        }
        if(isok)arr = arr.concat(config['static-proxy'])
    }
    filterDefine = arr;
    //print
    filterDefine.forEach((item)=>{
        console.log('[a]', item.urlpath)
        console.log('[b]', item.localpath)
    })
}
let getFilterDef = (req_path)=>{    
    let def;
    for(let i = 0;i<filterDefine.length;i++){
        let o = filterDefine[i];
        let urlpath = o.urlpath;
        if(!urlpath.match(/^\^/)) urlpath = '^' + urlpath;
        let regex = new RegExp(urlpath);
        if(req_path.match(regex)){
            let req_path2 = req_path;
            let reg = new RegExp('^'+o.urlpath);
            req_path2 = pathutil.relative(o.urlpath, req_path);//req_path2.replace(reg, '')
            def = {
                urlpath: o.urlpath,
                localpath: o.localpath,
                req_path: req_path2
            }
            break;
        }
    }
    return def;
}
module.exports = {
    loadFilterDef,
    getFilterDef
};