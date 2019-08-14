var staticFileLoader = require('./staticFileLoader')

let linkToStaticFile = (req, res, next) => {
    res.set('About-rk-offlinedev', 'This Is Mocking Data!');
    let req_path = req.path;
    //console.log(req.path)
    if(req_path.match(/^\/http\-console/)){
        next();
        return;
    }
    if(/\.js$/.test(req_path) || /\.css$/.test(req_path)) {
        if(/\.js$/.test(req_path)){
            res.set('Content-Type', 'text/javascript');
            staticFileLoader.loadJs(req_path, (jscontent)=>{
                jscontent!==null ? res.send(jscontent) : res.sendStatus(404);
            })
            return;           
        }else{
            next();//css
        }
        //next();
        return;
        //res.send();
    }else if(/\.tpl$/.test(req_path)) {
        res.set('Content-Type', 'text/html');
        staticFileLoader.loadTpl(req_path, (jscontent)=>{
            jscontent!==null ? res.send(jscontent) : res.sendStatus(404);
        })
        return;   
    }
    next();
}
module.exports = {
    linkToStaticFile
};