let staticFilter = require('../static-filter/filter')
var getConfig = require('../config/configUtil')
var staticFileLoader = require('./staticFileLoader')

let linkToStaticFile = (req, res, next) => {
    res.set('rk-about', 'This is by rk-offlinedev!');
    let req_path = req.path;
    //console.log(req.path)
    if(req_path.match(/^\/offlinedev-/)){ //内部请求
        next();
        return;
    }
    var webappFolder = getConfig.getWebAppFolder()
    let root = webappFolder;
    let filterDef = staticFilter.getFilterDef(req_path);
    if(filterDef) {
        root = filterDef.localpath;
        req_path = filterDef.req_path;
        //console.log('root', root, filterDef.urlpath, req_path)
    }
    if(/\.js$/.test(req_path)){
        res.set('Content-Type', 'text/javascript');
        staticFileLoader.loadJs(root, req_path, (jscontent, info)=>{
            if(jscontent === null){
                res.sendStatus(404);
                return;
            }else{
                res.set('rk-project', info.fromSubPrj ? info.fromSubPrj : 'master');
                if(root) jscontent = `//[static-filter]${filterDef?'[proxy]':''}${root}\n`+
                                     `//[sub-project]${info.fromSubPrj}\n` + 
                                     jscontent;
                res.send(jscontent);
            }
        })
        return;           
    }else if(/\.css$/.test(req_path)){
        res.set('Content-Type', 'text/css');
        staticFileLoader.loadCss(root, req_path, (jscontent, info)=>{
            if(jscontent === null){
                res.sendStatus(404);
                return;
            }else{
                res.set('rk-project', info.fromSubPrj ? info.fromSubPrj : 'master');
                if(root) jscontent = `/** [static-filter]${filterDef?'[proxy]':''}${root} **/\n`+
                                     `/** [sub-project]${info.fromSubPrj} **/\n` + 
                                     jscontent;
                res.send(jscontent);
            }
        })
        return;
    }else if(/\.tpl$/.test(req_path)) {
        res.set('Content-Type', 'text/html');
        staticFileLoader.loadTpl(root, req_path, (jscontent, info)=>{
            if(jscontent === null){
                res.sendStatus(404);
                return;
            }else{
                res.set('rk-project', info.fromSubPrj ? info.fromSubPrj : 'master');
                if(root) jscontent = `<!-- [static-filter]${filterDef?'[proxy]':''}${root} -->\n` +
                                     `<!-- [sub-project]${info.fromSubPrj} -->` +
                                     jscontent;
                res.send(jscontent);
            }
        })
        return;   
    }
    next();//非静态文件，放行
}
module.exports = {
    linkToStaticFile
};