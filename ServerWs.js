//说明，这是离线开发的server
var express = require('express');
let compression = require('compression')
var app = express();
var fs = require('fs');
var https = require('https');
var http = require('http');
var bodyParser = require('body-parser')
var _ = require('lodash')
var privateKey = fs.readFileSync('./offlinedev/sslKey/v2/private.pem','utf8');
var certificate = fs.readFileSync('./offlinedev/sslKey/v2/file.crt','utf8');
var getConfig = require('./offlinedev/jsmodule/config/configUtil')
var localStatus = require('./offlinedev/jsmodule/config/statusUtil')
var credentials = {key: privateKey, cert: certificate};

let userConfig = getConfig.getUserConfig();
var workspacePath = getConfig.getWebParentRoot();

if(!fs.existsSync(workspacePath)){
    console.error('致命错误！web工程目录不存在，请检查user-config文件！:', workspacePath)
    console.error('How to fix: mondify "%rk-offlinedev%/user-config.json" to assign your web project path')
    return;
}

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var PORT = 667;
var SSLPORT = 44301;

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
    next();
});
//静态资源转接到web
app.use('/', express.static(workspacePath));//注意：必须在全局拦截器之后，否则拦截器无法运行
//action转接
app.get('*', function(req, res, next) {
    next()
});
//启动
module.exports = {
    startHttps:(succ)=>{
        httpsServer.listen(SSLPORT, function() {
            console.log('[STATIC-WS] https://localhost:%s', SSLPORT);
            console.log('----------')
            succ()
        });
    }
}