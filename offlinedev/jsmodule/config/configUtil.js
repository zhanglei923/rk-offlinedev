var fs = require('fs');
let os = require('os');
var _ = require('lodash')
var pathutil = require('path');
var makeDir = require('make-dir');
var watcher = require('node-watch');
let jsonformat = require('json-format')

let gitUtil = require('../utils/gitUtil')
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
let configFileExamplePath = pathutil.resolve(projectFolder, './user-config.example')
let configFilePath = pathutil.resolve(projectFolder, './user-config.json')
let defaultConfig;
eval(`defaultConfig = `+fs.readFileSync(configFileExamplePath, 'utf8'));
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
    let df = JSON.parse(JSON.stringify(defaultConfig));
    config = _.merge(df, config);
    //console.log(JSON.stringify(config))

    if(config.debug){
        if(config.debug.concatStaticTplRequests) config.debug.concatStaticRequests = true;
    }
 
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
    let webProjectBranch = gitUtil.getBranchName(webroot)
    config.webProjectInfo = {
        branch: webProjectBranch
    }
    webparent = allpathinfo.webparent;
    webappFolder = allpathinfo.webappFolder;

    static_project_root = allpathinfo.static_project_root;
    let staticConfigFilePath = allpathinfo.staticConfigFilePath;
    let staticDebugConfigFilePath = allpathinfo.staticDebugConfigFilePath;

    config.runtime.seajsConfig.alias = webprojectUtil.loadSeaConfig(webroot)
    staticFilter.loadFilterDef(webroot);

    global.rkGlobalConfig = config;
    console.log('[user-config]=', JSON.stringify(config))
    console.log('[web-root]=', webroot)
    console.log('[web-branch]=', webProjectBranch)
    console.log('[static-root]=', static_project_root)
    console.log('[deploy]=', config.deployStaticPath_val)
    console.log('[platform]=', os.platform())
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
    getDeployFolder: function(){
        return this.getStaticFolder() + '/deploy';
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