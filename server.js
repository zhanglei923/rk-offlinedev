//说明，这是离线开发的server
var express = require('express');
var exec = require('child_process');
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
var scriptLoader = require('./offlinedev/jsmodule/scriptLoader')
var privateKey = fs.readFileSync('./offlinedev/sslKey/private.pem','utf8');
var certificate = fs.readFileSync('./offlinedev/sslKey/file.crt','utf8');
var getConfig = require('./offlinedev/jsmodule/getConfig')
var localStatus = require('./offlinedev/jsmodule/localStatus')
var credentials = {key: privateKey, cert: certificate};

getConfig.initFiles();//初始化配置
localStatus.init();

var webPath = pathutil.resolve(__dirname, '../apps-ingage-web/src/main/webapp/')
if(!fs.existsSync(webPath)){
    console.error('FATAL ERROR: Folder not found:', pathutil.resolve(__dirname, '../apps-ingage-web'))
    return;
} 

let arr = [
    pathutil.resolve(__dirname,'./offlinedev/mocking/actions-local/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking-default/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking-default/actions/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/actions/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/fileslink-local/'),
    pathutil.resolve(__dirname,'./offlinedev/mocking/debug-action-data'),
    
    // pathutil.resolve(__dirname,'../offlinedev-data/'),
    // pathutil.resolve(__dirname,'../offlinedev-data/mocking/'),
    // pathutil.resolve(__dirname,'../offlinedev-data/mocking/actions-local/'),
    // pathutil.resolve(__dirname,'../offlinedev-data/mocking-default/'),
    // pathutil.resolve(__dirname,'../offlinedev-data/mocking-default/actions/'),
    // pathutil.resolve(__dirname,'../offlinedev-data/mocking/actions/'),
    // pathutil.resolve(__dirname,'../offlinedev-data/mocking/fileslink-local/'),
    // pathutil.resolve(__dirname,'../offlinedev-data/mocking/debug-action-data')   
];
arr.forEach((folderpath)=>{
    if (!fs.existsSync(folderpath)){
        fs.mkdirSync(folderpath)
    }
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var PORT = 666;
var SSLPORT = 443;

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));



app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var webProject = 'apps-ingage-web'
var getMockingData = require('./offlinedev/jsmodule/getMockingData')

//全局拦截器
app.use(function (req, res, next) {
    if(/^\/offlinedev\//.test(req.path) && /\.js$|\.css$|\.html/.test(req.path)){
        var fpath = pathutil.resolve(__dirname, '.'+req.path)
        var jscontent = fs.readFileSync(fpath, 'utf8'); 
        if(/\.css$/.test(req.path))res.set('Content-Type', 'text/css; charset=UTF-8');
        if(/\.js$/.test(req.path))res.set('Content-Type', 'text/javascript; charset=UTF-8');
        res.send(jscontent);
        return;
    }
    res.set('About-rk-offlinedev', 'This Is Mocking Data!');
    if(req.originalUrl === '/'){
        var html = fs.readFileSync(__dirname +'/offlinedev/welcome.html', 'utf8');
        res.send(html);
        return;
    }
    if(/\.js$/.test(req.path) || /\.css$/.test(req.path)) {
        if(/\.js$/.test(req.path)){
            var jscontent = scriptLoader.update(req.path)
            jscontent ? res.send(jscontent) : res.sendStatus(404);; 
            return;           
        }else{
            next()
        }
        //next();
        return;
        //res.send();
    }
    next();
});
//静态资源转接到web
app.use('/', express.static(webPath));//注意：必须在全局拦截器之后，否则拦截器无法运行
var actionsRouter = require('./offlinedev/jsmodule/actionsRouter')
app.post('*',function(req, res){
   var accept = req.headers.accept;
    var originalUrl = req.originalUrl;
    if(/^\/offlinedev\//.test(req.url)){
        var result = actionsRouter.processPost(req, res, function(data){
            res.json({
                status: 0,
                result: data
            })            
        })
        return;
    }
    var data = getMockingData.getData(originalUrl, req)
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
   var p = URL.parse(url, true);
   var isdeploy = p.query.isdeploy;
    if(/^\/designer\.action/ig.test(originalUrl)){
        html = getPageHtml(isdeploy, 'frame30_designer.html');
    }else if(/^\/appdesigner\.action/ig.test(originalUrl)){
        html = getPageHtml(isdeploy, 'frame30_appdesigner.html');
    }else if(/^\/[\w]{1,}_detail\.action/ig.test(originalUrl) && originalUrl.indexOf('canvas=1') >=0){//预览
            html = getPageHtml(isdeploy, 'frame30_pc_canvas.html');
    }else if(/^\/mobilepreview\_/ig.test(originalUrl) && originalUrl.indexOf('canvas=1') >=0){//预览
            html = getPageHtml(isdeploy, 'frame30_app_canvas.html');
    }else{
        html = getPageHtml(isdeploy, 'frame30_index.html');
        var data = getMockingData.getData(originalUrl, req)
        if(data || /\/json\//g.test(originalUrl)){
            html = data;
            if(!data) {
                record404Actions(originalUrl)
                res.sendStatus(404)
                return;
            }
        }
    }
    if(isJsonAccept(accept, req)){
        if(typeof html === 'string') {
            try{
                html = JSON.parse(html)
                res.json(html)
            }catch(e){
                console.log('notjson:', req.url)
                res.send(html)
            }
        }
    }else{
        res.send(html);
    }
});
let getPageHtml = function(isdeploy, filename){
    if(isdeploy) filename = 'deploy.'+filename
    var fpath = pathutil.resolve(__dirname, './offlinedev/mocking-default/pages/'+ filename);
    if(!fs.existsSync(fpath)){
        fpath = pathutil.resolve(__dirname, './offlinedev/mocking/pages/'+ filename);
        if(!fs.existsSync(fpath)){
            var page404 = fs.readFileSync(pathutil.resolve(__dirname, './offlinedev/pages/file-not-exist.tmpl'), 'utf8')
            var template = Handlebars.compile(page404);
            var html404 = template({fpath: fpath});
            return html404
        }
    }
    var html = fs.readFileSync(fpath, 'utf8');
    html = updateStaticsUrl.updateHtml(html);
    var sessionMock = fs.readFileSync(__dirname +'/offlinedev/mocking-default/session.mock', 'utf8');
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
    var me = localStatus;
    var nofileUrls = me.get('nofileUrls') ? me.get('nofileUrls') : [];
    nofileUrls.push(originalUrl)
    me.set('nofileUrls', _.uniq(nofileUrls))
    console.log('no-file', originalUrl)
}
// console.log('Updating...')
// exec.exec('git pull', {
//         timeout: 10*1000
//     }, (error, stdout, stderr) => {
//     console.log(`${stderr}`);
//     console.log(`${stdout}`);
//     console.log('----------')
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
//});