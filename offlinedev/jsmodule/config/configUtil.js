var fs = require('fs');
var _ = require('lodash')
var pathutil = require('path');
var makeDir = require('make-dir');
var watcher = require('node-watch');
let jsonformat = require('json-format')

let statusUtil = require('./statusUtil')

let webprojectUtil = require('./webprojectUtil')
let auxiliaryUtil = require('./auxiliary')

let staticFilter = require('../static-filter/filter');

let auxiliaryFolder = auxiliaryUtil.getRootFolder();

var rootpath = pathutil.resolve(__dirname, '../../');
let tmp_folder = auxiliaryUtil.tmpFolder;
makeDir.sync(tmp_folder);

var configJson;

var offlineFolder = pathutil.resolve(__dirname, '../../');
var projectFolder = pathutil.resolve(offlineFolder, '../');
var parentFolder = pathutil.resolve(projectFolder, '../');


var fpath = offlineFolder + '/config.json'
if(fs.existsSync(fpath)){
    var data = fs.readFileSync(fpath, 'utf8');
    if(data){
        configJson = JSON.parse(data);
    }
}else{
    console.log('Can not find:', fpath)
}
let configFilePath = pathutil.resolve(projectFolder, './user-config.json')
let defaultConfig = {
    webProjectPath: '',//default
    staticProjectPath: '',//default
    deployWebProjectPath:'',//default
    http:{
        port: 666
    },
    https:{
        port: 443
    },
    es6:{
        autoTransformJs: false
    },
    jira:{
        username:'',
        password:''
    },
    debug:{
        console: true
    }
};
let config={};
//var parentFolder = pathutil.resolve(__dirname, '../../../../');
var webparent;
var webroot;
var webappFolder;
var static_project_root;

let getAllPathInfo = (_webroot)=>{
    if(typeof _webroot === 'undefined') _webroot = webroot;
    let webparent = pathutil.resolve(_webroot, '../')
    let webappFolder = pathutil.resolve(_webroot, './src/main/webapp/');

    let adminFolder = pathutil.resolve(webparent, './apps-ingage-admin')
    let admin_webappFolder = pathutil.resolve(adminFolder, './src/main/webapp/')
    
    let static_project_root = config.staticProjectPath ? config.staticProjectPath : pathutil.resolve(webappFolder, './static');
    let staticConfigFilePath = pathutil.resolve(webappFolder, './static-config.json')
    let staticDebugConfigFilePath = pathutil.resolve(webappFolder, './static-debug-config.json')

    return {
        webroot,
        webparent,
        webappFolder,
        
        adminFolder,
        admin_webappFolder,

        static_project_root,
        staticConfigFilePath,
        staticDebugConfigFilePath
    }
};
let getBranchNickName = (branchname)=>{
    let nickname = branchname.replace(/\//g, '~~');
    return nickname;
}
let getDeployDebugWebPath = (branchname)=>{
    let nickname = getBranchNickName(branchname);
    let nginxDeployFolder = auxiliaryUtil.nginxDeployFolder;
    return pathutil.resolve(nginxDeployFolder, nickname+'/apps-ingage-web');
}
let reloadConfig = ()=>{    
    if(!fs.existsSync(configFilePath)){
        config = defaultConfig;
        fs.writeFileSync(configFilePath, jsonformat(config));
    }
    let txtconfig = fs.readFileSync(configFilePath, 'utf8');
    eval('config='+txtconfig)
    config = Object.assign(defaultConfig, config);

    config.auxiliaryFolder = auxiliaryFolder;

    webroot = config.webProjectPath ? config.webProjectPath : pathutil.resolve(parentFolder, './apps-ingage-web');
    if(!fs.existsSync(webroot)){
        config = null;
        return;
    }
    let branchnameOfDeployDebug = statusUtil.getData('branchnameOfDeployDebug');
    branchnameOfDeployDebug = branchnameOfDeployDebug ? branchnameOfDeployDebug : 'develop';
    config.branchnameOfDeployDebug = branchnameOfDeployDebug;
    //console.log('xxx', getDeployDebugWebPath(branchnameOfDeployDebug))
    let deployWebProjectPath_val = config.deployWebProjectPath ? config.deployWebProjectPath : config.webProjectPath;
    deployWebProjectPath_val = getDeployDebugWebPath(branchnameOfDeployDebug);
    config.deployWebProjectPath_val = deployWebProjectPath_val;
    config.deployWebProjectPath_val_exist = fs.existsSync(config.deployWebProjectPath_val)

    
    config.deployWebappPath_val = pathutil.resolve(deployWebProjectPath_val, './src/main/webapp')
    config.deployStaticPath_val = pathutil.resolve(deployWebProjectPath_val, './src/main/webapp/static')
    config.deployStaticPath_val_exist = fs.existsSync(config.deployStaticPath_val)
    let allpathinfo = getAllPathInfo(webroot);
    webparent = allpathinfo.webparent;
    webappFolder = allpathinfo.webappFolder;

    static_project_root = allpathinfo.static_project_root;
    let staticConfigFilePath = allpathinfo.staticConfigFilePath;
    let staticDebugConfigFilePath = allpathinfo.staticDebugConfigFilePath;

    webprojectUtil.loadSeaConfig(webroot)
    staticFilter.loadFilterDef(webroot);

    console.log('[user-config]=', JSON.stringify(config))
    console.log('[web-root]=', webroot)
    console.log('[static-root]=', static_project_root)
    console.log('[deploy]=', config.deployStaticPath_val)
    console.log('---')
}
reloadConfig();

// watcher(configFilePath, { recursive: false }, function(evt, name) {
//     console.log('%s changed.', name, evt);
//     reloadConfig();
// });

let thisUtil = {
    reloadConfig,
    getAllPathInfo,
    getBranchNickName,
    isTrue:(cfgpath)=>{
        let bool = false;
        //console.log((`bool = config.${cfgpath}`))
        try{
            eval(`bool = config.${cfgpath}`)
        }catch(e){}
        return !!bool;
    },
    getUserConfig: function(){
        return config;
    },
    getValue: (cfgpath)=>{
        let val;
        try{
            eval(`val = config.${cfgpath}`)
        }catch(e){}
        return val;
    },
    get: function (){
        return configJson;
    },
    getMasterRoot: function(){
        return projectFolder;
    },
    getMyRoot: function(){
        return parentFolder;
    },
    isCustomizedWebRoot: function(){
        return !!config.webProjectPath;
    },
    getWebParentRoot: function(){
        return pathutil.resolve(webroot, '../');
    },
    getWebRoot: function(){
        return webroot;
    },
    getWebAppFolder: function(){
        return webappFolder;
    },
    getStaticFolder: function(){
        return static_project_root;
    },
    getSourceFolder: function(){
        return this.getStaticFolder() + '/source';
    },
    getMasterTmpFolder: ()=>{
        return tmp_folder;
    },
    initFiles: function(){
        var webpath = webappFolder;
        var rootpath = pathutil.resolve(__dirname, '../../');
        var path = rootpath + '/mocking/'
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        } 
        path = rootpath + '/mocking/actions'
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        } 
        path = rootpath + '/mocking/pages'
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        } 
    }
}
module.exports = thisUtil;