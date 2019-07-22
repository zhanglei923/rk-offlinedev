//说明，这是离线开发的server
var express = require('express');
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
var updateStaticsUrl = require('./offlinedev/jsmodule/updateStaticsUrl')
var privateKey = fs.readFileSync('./offlinedev/sslKey/private.pem','utf8');
var certificate = fs.readFileSync('./offlinedev/sslKey/file.crt','utf8');
var getConfig = require('./offlinedev/jsmodule/config/configUtil')
var localStatus = require('./offlinedev/jsmodule/config/statusUtil')
var credentials = {key: privateKey, cert: certificate};

getConfig.initFiles();//初始化配置
localStatus.init();

let userConfig = getConfig.getUserConfig();
var webPath = getConfig.getWebAppFolder();
if(!fs.existsSync(webPath)){
    console.error('FATAL ERROR: default web project folder not found:', webPath)
    console.error('How to fix: mondify "%rk-offlinedev%/user-config.json" to assign your web project path')
    return;
} 
//
[
    pathutil.resolve(__dirname,'./offlinedev/mocking/actions-local/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/actions/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/files/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/files-refinfo/'),     
].forEach((folderpath)=>{
    if (!fs.existsSync(folderpath)){fs.mkdirSync(folderpath)}
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var PORT = userConfig.http.port;
var SSLPORT = userConfig.https.port;

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(compression())//gzip

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
        var html = fs.readFileSync(__dirname +'/offlinedev/welcome.html', 'utf8');
        res.send(html);
        return;
    }
    if(/^\/offlinedev\//.test(req.path) && /\.js$|\.css$|\.html/.test(req.path)){
        var fpath = pathutil.resolve(__dirname, '.'+req.path)
        //var jscontent = fs.readFileSync(fpath, 'utf8'); 
        fs.readFile(fpath, {encoding:'utf8'}, (err, jscontent) => {
            if (err) res.sendStatus(402)
            if(/\.css$/.test(req.path))res.set('Content-Type', 'text/css; charset=UTF-8');
            if(/\.js$/.test(req.path))res.set('Content-Type', 'text/javascript; charset=UTF-8');
            res.send(jscontent);
          });
        return;
    }
    const static_proxy = require('./static-proxy');
    static_proxy.linkToStaticFile(req, res, next)
});
//静态资源转接到web
app.use('/', express.static(webPath));//注意：必须在全局拦截器之后，否则拦截器无法运行
var apiRouter = require('./offlinedev/jsmodule/apiRouter')
app.post('*',function(req, res){
   var accept = req.headers.accept;
    var originalUrl = req.originalUrl;
    if(/^\/offlinedev\/api\//.test(req.url)){
        var result = apiRouter.processPost(req, res, function(data){
            res.json({
                status: 0,
                result: data
            })            
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
app.get('*', function(req, res) {
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
   if(/^\/offlinedev\/api\//.test(req.url)){
        res.json({
            status: 0,
            result: data
        }) 
       return;
   }
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
        var page404 = fs.readFileSync(pathutil.resolve(__dirname, './offlinedev/pages/file-not-exist.tmpl'), 'utf8')
        var template = Handlebars.compile(page404);
        var html404 = template({fpath: fpath});
        return html404
    }
    var html = fs.readFileSync(fpath, 'utf8');
    html = updateStaticsUrl.updateHtml(html);
    var sessionMock = fs.readFileSync(__dirname +'/offlinedev/session.mock', 'utf8');
    //注入标志和辅助性的js文件
    html = html.replace(/\<\/head\>/ig,''+sessionMock+'</head>')

    if(isdeploy) html = html.replace(/\.[\w\d]{5,}\.(js|css)/g, (str)=>{
        str = str.replace(/\.[\w\d]{5,}\./g, '.debug000.')
        return str
    })

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
// console.log('Updating...')
// exec.exec('git pull', {
//         timeout: 10*1000
//     }, (error, stdout, stderr) => {
//     console.log(`${stderr}`);
//     console.log(`${stdout}`);
//     console.log('----------')

module.exports = {
    startHttp:()=>{
        var server = httpServer.listen(PORT, function() {
            var host = server.address().address;
            var port = server.address().port;
            
            console.log('HTTP http://localhost:%s', port);
        });
    }, 
    startHttps:()=>{
        httpsServer.listen(SSLPORT, function() {
            console.log('HTTPS: https://localhost:%s', SSLPORT);
        });
    }
}