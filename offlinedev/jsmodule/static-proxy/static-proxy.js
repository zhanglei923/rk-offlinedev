let staticFilter = require('../static-filter/filter')
var getConfig = require('../config/configUtil')
var staticFileLoader = require('./staticFileLoader')

let linkToStaticFile = (req, res, next) => {
    res.set('About-rk-offlinedev', 'This Is Mocking Data!');
    let req_path = req.path;
    //console.log(req.path)
    if(req_path.match(/^\/http\-console/)){
        next();
        return;
    }
    var webappFolder = getConfig.getWebAppFolder()
    let root = webappFolder;
    let localfolder = staticFilter.getLocalPath(req_path);
    if(localfolder) {
        root = localfolder;
    }
    if(/\.js$/.test(req_path)){
        res.set('Content-Type', 'text/javascript');
        staticFileLoader.loadJs(root, req_path, (jscontent)=>{
            if(jscontent === null){
                res.sendStatus(404);
                return;
            }else{
                if(localfolder) jscontent = `//[static-filter]${localfolder}\n` + jscontent;
                res.send(jscontent);
            }
        })
        return;           
    }else if(/\.css$/.test(req_path)){
        res.set('Content-Type', 'text/css');
        staticFileLoader.loadCss(root, req_path, (jscontent)=>{
            if(jscontent === null){
                res.sendStatus(404);
                return;
            }else{
                if(localfolder) jscontent = `/** [static-filter]${localfolder} **/\n` + jscontent;
                res.send(jscontent);
            }
        })
        return;
    }else if(/\.tpl$/.test(req_path)) {
        res.set('Content-Type', 'text/html');
        staticFileLoader.loadTpl(root, req_path, (jscontent)=>{
            if(jscontent === null){
                res.sendStatus(404);
                return;
            }else{
                if(localfolder) jscontent = `<!-- [static-filter]${localfolder} -->\n` + jscontent;
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