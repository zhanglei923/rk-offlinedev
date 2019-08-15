let fs = require('fs');
let _ = require('lodash')
let pathutil = require('path')

let filterDefine = [];
// http://localhost:666/static/source/separation/demo/ya.js
// http://localhost:666/static/source/separation/demo/ya.css
// http://localhost:666/static/source/separation/demo/ya.tpl
// http://localhost:666/aaa/a.js
// http://localhost:666/bbb/222/b.js
let loadFilterDef = (webroot, configfilePath, debugConfigFilePath)=>{
    let webparent = pathutil.resolve(webroot, '../');
    let arr = [];
    //console.log('[static-config]', configfilePath, debugConfigFilePath)
    if(fs.existsSync(debugConfigFilePath)){
        let config = fs.readFileSync(debugConfigFilePath, 'utf8');
        config = JSON.parse(config);
        let isok = true;
        let url_proxy = config['url_proxy']
        if(_.isArray(url_proxy)){
            url_proxy.forEach((item)=>{
                //兼容手写问题
                item.url_pattern = item.url_pattern.replace(/\/{1,}/g, '/');
                item.localpath = item.localpath.replace(/\\{1,}/g, '/');
                item.localpath = item.localpath.replace(/\/$/, '');
            })
        }
        if(isok)arr = arr.concat(url_proxy)
    }
    if(fs.existsSync(configfilePath)){
        let config = fs.readFileSync(configfilePath, 'utf8');
        config = JSON.parse(config);
        let isok = true;
        let dependencies = config['dependencies']
        if(_.isArray(dependencies)){
            dependencies.forEach((item)=>{
                //兼容手写问题
                item.url_pattern = item.url_pattern.replace(/\/{1,}/g, '/');
                let project = item.project;
                let branch = item.branch;
                let projectPath = pathutil.resolve(webparent, project);
                let projectStaticPath = pathutil.resolve(projectPath, './static/source');
                let item2 = {
                    url_pattern: item.url_pattern,
                    localpath: projectStaticPath
                }
                if(isok)arr.push(item2);
            })
        }
    }
    filterDefine = arr;
    //console.log(filterDefine)
    //print
    filterDefine.forEach((item)=>{
        console.log('[a]', item.url_pattern)
        console.log('[b]', item.localpath)
    })
}
let getFilterDef = (req_path)=>{    
    let def;
    for(let i = 0;i<filterDefine.length;i++){
        let o = filterDefine[i];
        let url_pattern = o.url_pattern;
        if(!url_pattern.match(/^\^/)) url_pattern = '^' + url_pattern;
        let regex = new RegExp(url_pattern);
        if(req_path.match(regex)){
            let req_path2 = req_path;
            let reg = new RegExp('^'+o.url_pattern);
            req_path2 = pathutil.relative(o.url_pattern, req_path);//req_path2.replace(reg, '')
            def = {
                url_pattern: o.url_pattern,
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