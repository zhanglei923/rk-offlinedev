var jsContentLoader = require('./offlinedev/jsmodule/jsContentLoader')

let linkToStaticFile = (req, res, next) => {
    res.set('About-rk-offlinedev', 'This Is Mocking Data!');
    if(/\.js$/.test(req.path) || /\.css$/.test(req.path)) {
        if(/\.js$/.test(req.path)){
            res.set('Content-Type', 'text/javascript');
            jsContentLoader.loadJs(req.path, (jscontent)=>{
                jscontent!==null ? res.send(jscontent) : res.sendStatus(404);
            })
            return;           
        }else{
            next()
        }
        //next();
        return;
        //res.send();
    }else if(/\.tpl$/.test(req.path)) {
        res.set('Content-Type', 'text/html');
        jsContentLoader.loadTpl(req.path, (jscontent)=>{
            jscontent!==null ? res.send(jscontent) : res.sendStatus(404);
        })
        return;   
    }
    next();
}
module.exports = {
    linkToStaticFile
};