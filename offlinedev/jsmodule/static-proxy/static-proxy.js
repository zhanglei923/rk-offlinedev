let staticFilter = require('../static-filter/filter')
var getConfig = require('../config/configUtil')
var staticFileLoader = require('./staticFileLoader')
let scanner = require('../../codeScan/scan')

let linkToStaticFile = (req, res, next) => {
    res.set('.rk', 'This is by rk-offlinedev!');
    let req_path = req.path;
    //console.log(req.path)
    if(req_path.match(/^\/offlinedev-/)){ //内部请求
        next();
        return;
    }
    let webFolder = getConfig.getWebRoot()
    let staticFolder = getConfig.getStaticFolder()
    var webappFolder = getConfig.getWebAppFolder()
    let root = webappFolder;
    let filterDef = staticFilter.getFilterResult(req_path);
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
                let debugComments = ''
                res.set('.rk-local-file-project', info.fromSubPrj ? info.fromSubPrj : 'apps-ingage-web');
                let seaScanResults = scanner.scan(staticFolder, info.fullfilepath, jscontent);
                if(seaScanResults && seaScanResults.missingFiles.length > 0){
                    let missingfiles = seaScanResults.missingFiles;
                    res.set('.rk-ERROR-bad-url', JSON.stringify(missingfiles));
                    missingfiles.forEach((miss)=>{
                        //debugComments += `//[rk][ERROR]：Can not find "${miss.url}"\n`
                        debugComments += `;console.error('Can not find file "${miss.url}"');\n`
                    })
                }
                if(!info.fromSubPrj)res.set('.rk-web-path', `${filterDef?'[proxy]':''}${root}`);
                if(info.fullfilepath)res.set('.rk-local-file', info.fullfilepath);
                if(root) jscontent = `//[rk][local-file]${info.fullfilepath}\n`+
                                     debugComments+
                                     //`//[sub-project]${info.fromSubPrj}\n` + 
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
                res.set('.rk-local-file-project', info.fromSubPrj ? info.fromSubPrj : 'apps-ingage-web');
                if(!info.fromSubPrj)res.set('.rk-web-path', `${filterDef?'[proxy]':''}${root}`);
                if(info.fullfilepath)res.set('.rk-local-file', info.fullfilepath);
                if(root) jscontent = `/** [rk][local-file]${info.fullfilepath} **/\n`+
                                     //`/** [sub-project]${info.fromSubPrj} **/\n` + 
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
                res.set('.rk-local-file-project', info.fromSubPrj ? info.fromSubPrj : 'apps-ingage-web');
                if(!info.fromSubPrj)res.set('.rk-web-path', `${filterDef?'[proxy]':''}${root}`);
                if(info.fullfilepath)res.set('.rk-local-file', info.fullfilepath);
                if(root) jscontent = `<!-- [rk][local-file]${info.fullfilepath} -->\n` +
                                     //`<!-- [sub-project]${info.fromSubPrj} -->` +
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