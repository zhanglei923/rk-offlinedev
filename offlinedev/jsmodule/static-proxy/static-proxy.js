let fs = require('fs')
let pathutil = require('path')
let staticFilter = require('../static-filter/filter')
var getConfig = require('../config/configUtil')
var staticFileLoader = require('./staticFileLoader')
let staticMemoLoader = require('./staticMemoLoader');
let updateScript_1st = require('./updators/updateScript_1st')
let updateScript_I18nTpl = require('./updators/updateScript_I18nTpl')
let updateScript_CmdConcat = require('./updators/updateScript_CmdConcat')
let updateScript_CssConcat = require('./updators/updateScript_CssConcat')
let scanner = require('../../codeScan/scan')

let enableLevel2Cache = getConfig.getValue('debug.autoCacheStaticLevel2');
let level2JsCache = {}//这里缓存处理过的js文本，如果内存消耗过高，建议关闭

let linkToStaticFile = (req, res, next) => {
    let req_path = req.path;
    res.set('.rk', 'This is by rk-offlinedev!');
    if(/\.js$/.test(req_path)) res.set('Content-Type', 'text/javascript');
    if(/\.css$/.test(req_path)) res.set('Content-Type', 'text/css');
    if(/\.tpl$/.test(req_path)) res.set('Content-Type', 'text/html');

    //console.log('req_path', req_path)
    //console.log(req.path)
    let webFolder = getConfig.getWebRoot()
    let staticFolder = getConfig.getStaticFolder()
    let sourceFolder = getConfig.getSourceFolder()
    let deployFolder = getConfig.getDeployFolder()
    var webappFolder = getConfig.getWebAppFolder()
    let root = webappFolder;
    if(req_path === '/sw-offlinedev.js'){//如果是根目录/sw.js，默认是访问webapp目录下，因此在static-proxy.js里做了一个转接
        let jscontent = fs.readFileSync(pathutil.resolve(getConfig.getMasterRoot(), './http-console/website/service-worker/sw-offlinedev.js'))
        //res.set('Content-Type', 'text/javascript');
        res.send(jscontent);
        return;
    }
    if(req_path.match(/^\/offlinedev-/)){ //内部请求
        next();
        return;
    }
    if(req_path.match(/^\/static\/deploy\//)){
        let fulldeploypath = pathutil.resolve(webappFolder, '.'+req_path)
        //console.log('deploy!', webappFolder, req_path)
        //console.log('deploy!', fs.existsSync(fulldeploypath),fulldeploypath)
        if(fs.existsSync(fulldeploypath)){
            jscontent = fs.readFileSync(fulldeploypath, 'utf8')
            res.send(jscontent);
        }else{
            res.status(404).send(`Can not find:${fulldeploypath}`)
        }
        return;
    }
    let filterDef = staticFilter.getFilterResult(req_path);
    if(filterDef) {
        root = filterDef.localpath;
        req_path = filterDef.req_path;
        //console.log('root', root, filterDef.urlpath, req_path)
    }
    if(/\.js$/.test(req_path)){
        //res.set('Content-Type', 'text/javascript');
        //console.log(req_path)
        if(staticMemoLoader.isHotUrl(req_path)){
            staticMemoLoader.loadHotJs(res, req_path);
            return;
        }
        staticFileLoader.loadJs(root, req_path, (jscontent, info)=>{
            if(info){
                info.sourceFolder = sourceFolder;
                info.pathid = pathutil.relative(info.sourceFolder,  info.fullfilepath);//seajs pathid
            }
            if(jscontent === null){
                res.status(404).send(`[rk-offlinedev][404]File Not Found.\n[rk-offlinedev]web=${webappFolder}\n[filepath=]`+req_path);
                return;
            }else{
                let debugComments = ''
                res.set('.rk-local-file-project', info.fromSubPrj ? info.fromSubPrj : 'apps-ingage-web');                
                if(getConfig.getValue('debug.detect404RequireUrls')){
                    let seaScanResults = scanner.scan(staticFolder, info.fullfilepath, jscontent);
                    if(seaScanResults && seaScanResults.missingFiles.length > 0){
                        let missingfiles = seaScanResults.missingFiles;
                        res.set('.rk-ERROR-bad-url', JSON.stringify(missingfiles));
                        missingfiles.forEach((miss)=>{
                            //debugComments += `//[rk][ERROR]：Can not find "${miss.url}"\n`
                            debugComments += `;console.error('[rk-offlinedev]File not found: require("${miss.url}")');\n`
                        })
                    }
                }
                let is_rk_cached = (info.fileinfo && info.fileinfo.isCached);
                if(!info.fromSubPrj)res.set('.rk-web-path', `${filterDef?'[proxy]':''}${root}`);
                if(info.fullfilepath)res.set('.rk-local-file', info.fullfilepath);
                res.set('.rk-cached', is_rk_cached);

                let newMC36 = info.fileinfo.mc36;
                let level2needsupdate = (!level2JsCache[req_path] || (level2JsCache[req_path].mc36 !== newMC36))
                if(!enableLevel2Cache || level2needsupdate){
                    jscontent = updateScript_1st.updateJs(info, jscontent)
                    jscontent = updateScript_I18nTpl.updateJs(info, jscontent)
                    jscontent = updateScript_CmdConcat.updateJs(info, jscontent)
                    jscontent = updateScript_CssConcat.updateJs(info, jscontent)
    
                    level2JsCache[req_path] = {
                        mc36: newMC36,
                        jscontent
                    }
                    //console.log('level2')
                }else{
                    jscontent = level2JsCache[req_path].jscontent;
                }                
                if(root) jscontent =//`//[rk][main]${root}\n`+ 
                                    `//[rk][real-path]${is_rk_cached?'[cached]':'[read]'}${info.fromSubPrj?'[sub]':''}${info.fullfilepath}\n`+
                                     debugComments+
                                     //`//[sub-project]${info.fromSubPrj}\n` + 
                                     jscontent;
                res.send(jscontent);
            }
        })
        return;           
    }else if(/\.css$/.test(req_path)){
        //res.set('Content-Type', 'text/css');
        if(staticMemoLoader.isHotUrl(req_path)){
            staticMemoLoader.loadHotCss(res, req_path);
            return;
        }
        staticFileLoader.loadCss(root, req_path, (jscontent, info)=>{
            if(info)info.sourceFolder = sourceFolder;
            if(jscontent === null){
                res.status(404).send(`[rk-offlinedev][404]File Not Found.\n[rk-offlinedev]web=${webappFolder}\n[filepath=]`+req_path);
                return;
            }else{
                res.set('.rk-local-file-project', info.fromSubPrj ? info.fromSubPrj : 'apps-ingage-web');
                if(!info.fromSubPrj)res.set('.rk-web-path', `${filterDef?'[proxy]':''}${root}`);
                if(info.fullfilepath)res.set('.rk-local-file', info.fullfilepath);
                let is_rk_cached = (info.fileinfo && info.fileinfo.isCached);
                if(root) jscontent = `/** [rk][file-path]${is_rk_cached?'[cached]':'[read]'}${info.fullfilepath} **/\n`+
                                     //`/** [sub-project]${info.fromSubPrj} **/\n` + 
                                     jscontent;
                res.send(jscontent);
            }
        })
        return;
    }else if(/\.tpl$/.test(req_path)) {
        //res.set('Content-Type', 'text/html');
        staticFileLoader.loadTpl(root, req_path, (jscontent, info)=>{
            if(info)info.sourceFolder = sourceFolder;
            if(jscontent === null){
                res.status(404).send(`[rk-offlinedev][404]File Not Found.\n[rk-offlinedev]web=${webappFolder}\n[filepath=]`+req_path);
                return;
            }else{
                res.set('.rk-local-file-project', info.fromSubPrj ? info.fromSubPrj : 'apps-ingage-web');
                if(!info.fromSubPrj)res.set('.rk-web-path', `${filterDef?'[proxy]':''}${root}`);
                if(info.fullfilepath)res.set('.rk-local-file', info.fullfilepath);
                if(root) jscontent = //`<!-- [rk][file-path]${info.fullfilepath} -->\n` + //注意！不要开放，擅自插入html评论标签，会引起jsplumb等插件异常
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