//说明，这是离线开发的server
var express = require('express');
let spdy = require('spdy');
let compression = require('compression')
var app = express();
var fs = require('fs');
var https = require('https');
var http = require('http');
var URL = require('url');
var bodyParser = require('body-parser')
var _ = require('lodash')
var pathutil = require('path');
var Handlebars = require('handlebars');
let makeDir = require('make-dir');
let redirect_config = require('./offlinedev/jsmodule/static-proxy/redirects/redirect-config.js');
var updateStaticsUrl = require('./offlinedev/jsmodule/static-proxy/updators/updateStaticsUrl');
var privateKey = fs.readFileSync('./offlinedev/sslKey/v2/private.pem','utf8');
var certificate = fs.readFileSync('./offlinedev/sslKey/v2/file.crt','utf8');
var getConfig = require('./offlinedev/jsmodule/config/configUtil')
var localStatus = require('./offlinedev/jsmodule/config/statusUtil')
var fpowerUtil = require('./offlinedev/jsmodule/utils/fpowerUtil')
let vpp = require('./offlinedev/jsmodule/utils/fs-vpp')
let multiProjectsMgr = require('./offlinedev/multi_projects/multiProjectsMgr')
let mysupport = require('./support');
var credentials = {key: privateKey, cert: certificate};

let userConfig = getConfig.getUserConfig();
var webPath = getConfig.getWebRoot();
var webappPath = getConfig.getWebAppFolder();
redirect_config.init();
if(!fs.existsSync(webappPath)){
    console.error('致命错误！web工程目录不存在，请检查user-config文件！:', webappPath)
    console.error('FATAL ERROR! Can not find webproject:', webappPath)
    console.error('How to fix: mondify "user-config.json" to assign your web project path')
    process.exit(0);
}
multiProjectsMgr.loadConfig(webPath);
//
let masterFolder = pathutil.resolve(__dirname, './');
makeDir.sync(pathutil.resolve(masterFolder, './logs'))
let httpConsoleFolder = pathutil.resolve(masterFolder, './http-console/website');

let mockingPath = [];
mockingPath = mockingPath.concat([
    pathutil.resolve(__dirname,'./offlinedev/mocking/actions-local/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/actions/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/files/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/files-refinfo/'),     
]);
mockingPath.forEach((folderpath)=>{
    if (!fs.existsSync(folderpath)){fs.mkdirSync(folderpath)}
})
if(getConfig.getValue('httpConfig.http2')) https = spdy;
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var PORT = userConfig.http.port;
var SSLPORT = userConfig.https.port;

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
if(getConfig.getValue('httpConfig.gzip'))app.use(compression())//gzip
//console.log('http.gzip', getConfig.getValue('httpConfig.gzip'))

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var loadMockingData = require('./offlinedev/jsmodule/mocking/loadMockingData')

//全局拦截器
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache');
    if(req.originalUrl === '/'){
        res.redirect('/offlinedev-http-console');
        return;
    }
    if(/^\/offlinedev\//.test(req.path) && /\.js$|\.css$|\.html/.test(req.path)){
        next();
        return;
    }
    const static_proxy = require('./offlinedev/jsmodule/static-proxy/static-proxy');
    let fileinfo = static_proxy.isAcceptedFileType(req, res, next);
    if(fileinfo){
        static_proxy.linkToStaticFile(fileinfo, req, res, next);
    }else{
        let realfpathinfo = vpp.find_realpath_for_url(req.path);
        if(realfpathinfo){
            let prjname = realfpathinfo.prjname;
            if(prjname === 'apps-ingage-web'){
                next();
            }else{
                    // console.log('f!', 
                    //     req.path,    
                    //     realfpathinfo.fpath,
                    //     ,
                    //     realfpathinfo.prjwebappbase
                    // )
                    let url = `https://localhost:44301/${realfpathinfo.prjname}/static/source/core/1.png`;
                    res.redirect(301, `${url}`);
            }
        }else{
            next();
        }
    }
});
//静态资源转接到web
app.use('/', express.static(webappPath));//注意：必须在全局拦截器之后，否则拦截器无法运行
app.use('/offlinedev-http-console', express.static(httpConsoleFolder));
app.use('/offlinedev-inject-script', express.static(pathutil.resolve(masterFolder, './offlinedev/injectScript')));
app.use('/static/gcss', express.static(pathutil.resolve(userConfig.deployStaticPath_val, './gcss')));
app.use('/static/deploy', express.static(pathutil.resolve(userConfig.deployStaticPath_val, './deploy')));

var apiRouter = require('./http-console/server/apiRouter')
app.post('*',function(req, res){
   var accept = req.headers.accept;
    var originalUrl = req.originalUrl;
    if(/^\/offlinedev\/api\//.test(req.url)){
        var result = apiRouter.processPost(req, res, function(data){
            if(data.is404){
                res.sendStatus(404)
            }else{
                res.json({
                    status: 0,
                    result: data
                }) 
            }                       
        })
        return;
    }
    var data = loadMockingData.getData(originalUrl, req)
    if(data){
        if(isJsonAccept(accept, req)){
            if(typeof data === 'string') {
                try{
                    data = JSON.parse(data)
                    res.json(data)
                }catch(e){
                    console.log('notjson:', req.url)
                    res.send(data)
                }
            }
        }else{
            res.send(data);
        }
        //(req.is('application/*') || req.is('json')) ? res.json(JSON.parse(data)) : res.send((data));
        //res.json(JSON.parse(data)) 
    }else{
        record404Actions(originalUrl)
        res.sendStatus(404)
    }
})
//action转接
app.get('*', function(req, res, next) {
    if(!req.path.match(/\.action$/)){
         next()
         return;
    }
   var html = 'unknown page.'
   var accept = req.headers.accept;
   var originalUrl = req.originalUrl;
   var url = req.url;
   var urlInfo = URL.parse(url, true);
   let pathname = urlInfo.pathname;
   var isdeploy = urlInfo.query.isdeploy;
   var isCanvas = urlInfo.query.canvas === '1';
   //console.log('pathname', pathname, isCanvas,urlInfo.query.canvas)
   //console.log(urlInfo)
   //console.log('req.path=', req.path)
    if(/^\/designer\.action/ig.test(pathname)){
        html = getPageHtml(isdeploy, 'frame30_designer.html');
    }else if(/^\/appdesigner\.action/ig.test(pathname)){
        html = getPageHtml(isdeploy, 'frame30_appdesigner.html');
    }else if(isCanvas){//预览
        if(/^\/mobilepreview\_/ig.test(pathname)){//预览
            html = getPageHtml(isdeploy, 'frame30_app_canvas.html');
        }else{
            html = getPageHtml(isdeploy, 'frame30_pc_canvas.html');
        }
    }else{
        html = getPageHtml(isdeploy, 'frame30_index.html');
    }
    if(isJsonAccept(accept, req)){
        var data = loadMockingData.getData(originalUrl, req)
        if(data) {
            try{
                data = JSON.parse(data)
                res.json(data)
            }catch(e){
                console.log('notjson:', req.url)
                res.html(data)
            }
        }else{
            record404Actions(originalUrl)
            res.status(404).send(notice404)
        }
    }else{
        var data = loadMockingData.getData(originalUrl, req)
        if(data){
            res.json(data)
        }else{
            if(/\.action$/.test(pathname)){
                res.send(html);                
            }else{
                res.status(404).send(notice404)
            }
        }
    }
});
let notice404 = `404: page not found`
let getPageHtml = function(isdeploy, filename){
    if(isdeploy) filename = 'deploy.'+filename
    var fpath = pathutil.resolve(__dirname, './offlinedev/mocking/pages/'+ filename);
    if(!fs.existsSync(fpath)){
        var page404 = fs.readFileSync(pathutil.resolve(__dirname, './http-console/website/pages/file-not-exist.tmpl'), 'utf8')
        var template = Handlebars.compile(page404);
        var html404 = template({fpath: fpath});
        return html404
    }
    var html = fs.readFileSync(fpath, 'utf8');
    html = updateStaticsUrl.updateHtml(html);
    var headMock = fs.readFileSync(__dirname +'/offlinedev/injectScript/html_head.mock', 'utf8');
    html = html.replace(/\<\/head\>/ig,''+headMock+'</head>')
    var bodyMock = fs.readFileSync(__dirname +'/offlinedev/injectScript/html_body.mock', 'utf8');
    html = html.replace(/\<\/body\>/ig,''+bodyMock+'</body>')

    if(isdeploy) {
        html = html.replace(/\.[a-z0-9]{7}\.(js|css)/g, (str)=>{
            str = str.replace(/\.[a-z0-9]{7}\./g, '.debug000.')
            return str
        })
        // hash.js
        html = html.replace(/\.[a-z0-9]{12}\.(js|css)/g, (str)=>{
            str = str.replace(/\.[a-z0-9]{12}\./g, '.debug000.')
            return str
        })
    }

    return html;
}
var isJsonAccept = function(accept, req){
    var returnJson = false;
    if(/^application/.test(accept) || req.is('application/*') || req.is('json'))returnJson = true;
    return returnJson;
}
var record404Actions = function(originalUrl){
    var nofileUrls = localStatus.getData('nofileUrls') ? localStatus.getData('nofileUrls') : [];
    nofileUrls.push(originalUrl)
    localStatus.setData('nofileUrls', _.uniq(nofileUrls))
    console.log('no-file', originalUrl)
}
let preloaded = false;
let afterStart = (callback)=>{
    if(preloaded) return;
    if(getConfig.getValue('debug.autoCacheStatic')) {
        //fpowerUtil.startTimer();
        console.log('[File-Power] On')
        setTimeout(()=>{
            let t0 = new Date()*1;
            console.log(`[Pre-Load] Loading files:`)
            mysupport.preloadStaticFiles(()=>{
                console.log(`[Pre-Load] cost:`, ((new Date()*1)-t0)+'ms');    
                callback() 
            });
        },1)
    }
    preloaded = true;
}
module.exports = {
    startHttp:()=>{
        var server = httpServer.listen(PORT, function() {
            var host = server.address().address;
            var port = server.address().port;
            console.log('[HTTP] http://localhost:%s', port);
            
            afterStart(()=>{
                console.log('[SUCCESS] Visit http://localhost:666 to Use.')
            })
        });
    }, 
    startHttps:()=>{
        httpsServer.listen(SSLPORT, function() {            
            console.log('[HTTPS] https://localhost:%s', SSLPORT);
            afterStart(()=>{
                console.log('ready...');
            })
        });
    }
}