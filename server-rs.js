//说明，这是离线开发的server
var express = require('express');
var exec = require('child_process');
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
var jsContentLoader = require('./offlinedev/jsmodule/jsContentLoader')
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

var PORT = 667;
var SSLPORT = 444;

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

//全局拦截器
app.use(function (req, res, next) {
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
});
//静态资源转接到web
app.use('/', express.static(webPath));//注意：必须在全局拦截器之后，否则拦截器无法运行
//action转接
app.get('*', function(req, res, next) {
    next()
});

//启动
var server = httpServer.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('HTTP http://localhost:%s', port);
    //exec.exec('start http://localhost:'+port);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS: https://localhost:%s', SSLPORT);
    console.log('----------')
});