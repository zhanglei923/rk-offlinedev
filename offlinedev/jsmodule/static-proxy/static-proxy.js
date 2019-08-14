var getConfig = require('../config/configUtil')
var staticFileLoader = require('./staticFileLoader')
var webappFolder = getConfig.getWebAppFolder()

let linkToStaticFile = (req, res, next) => {
    res.set('About-rk-offlinedev', 'This Is Mocking Data!');
    let req_path = req.path;
    //console.log(req.path)
    if(req_path.match(/^\/http\-console/)){
        next();
        return;
    }
    if(/\.js$/.test(req_path)){
        res.set('Content-Type', 'text/javascript');
        let root = webappFolder;
        if(req_path.match(/^\/static\/source\/products\/creekflow\//)) {
            console.log('req_path=',req_path)
            root = 'E:/workspaceGerrit/_sub_sepration_test/xsy-static-product_creekflow'
        }
        staticFileLoader.loadJs(root, req_path, (jscontent)=>{
            jscontent!==null ? res.send(jscontent) : res.sendStatus(404);
        })
        return;           
    }else if(/\.css$/.test(req_path)){
        next();//css
        return;
    }else if(/\.tpl$/.test(req_path)) {
        res.set('Content-Type', 'text/html');
        let root = webappFolder;
        staticFileLoader.loadTpl(root, req_path, (jscontent)=>{
            jscontent!==null ? res.send(jscontent) : res.sendStatus(404);
        })
        return;   
    }
    next();
}
module.exports = {
    linkToStaticFile
};