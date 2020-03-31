var fs = require('fs');
let os = require('os');
var _ = require('lodash')
var pathutil = require('path');
var makeDir = require('make-dir');
var watcher = require('node-watch');
let jsonformat = require('json-format')

let vpp = require('../utils/fs-vpp')

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
let configFileExamplePath = pathutil.resolve(projectFolder, './user-config.json.example')
let configFilePath = pathutil.resolve(projectFolder, './user-config.json')
let defaultConfig;
eval(`defaultConfig = `+fs.readFileSync(configFileExamplePath, 'utf8'));
let config={};
//var parentFolder = pathutil.resolve(__dirname, '../../../../');
var webparent;
var webroot;
var webappFolder;
var static_project_root;
let parseUserAccounts = ()=>{
    let accountExamplePath = pathutil.resolve(projectFolder, './user-accounts.cfg.example')
    let accountFilePath = pathutil.resolve(projectFolder, './user-accounts.cfg')
    let content;
    if(!fs.existsSync(accountFilePath)) {
        let example = fs.readFileSync(accountExamplePath, 'utf8')
        fs.writeFileSync(accountFilePath, example);
        content = example;
    }else{
        content = fs.readFileSync(accountFilePath, 'utf8');
    }
    if(!content){
        console.log('[user-account]: is-empty')
        return {};
    }
    let arr = rk_formatLineBreaker(content).split('\n');
    let accounts = {}
    arr.forEach((line)=>{
        line = _.trim(line);
        if(line && !line.match(/^\#/) && line.indexOf('=')>=0){
            line = line.split('#')[0];
            let linearr = line.split('=');
            let key = _.trim(linearr[0])
            let val = _.trim(linearr[1])
            accounts[key] = val;
        }
    })
    //console.log(accounts)
    return accounts;
};
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
let checkIfConfigChanged = ()=>{
    let new_mc36 = getFileMC36(configFilePath);
    if(global.rk_userconfig_mc36 && global.rk_userconfig_mc36!==new_mc36){
        console.log('----STOP----')
        console.log('[rk-exit]您的user-config.json被改动过了，请重启server。')
        console.log('[rk-exit]您的user-config.json被改动过了，请重启server。')
        console.log('[rk-exit]user-config.json has been "changed", Please restart server.')
        console.log('[rk-exit]user-config.json has been "changed", Please restart server.')
        console.log('')
        process.exit(0);
    }
    global.rk_userconfig_mc36 = new_mc36;
};
let reloadConfig = (printinfo)=>{
    if(typeof printinfo === 'undefined') printinfo = true;
    if(!fs.existsSync(configFilePath)){
        config = defaultConfig;
        fs.writeFileSync(configFilePath, jsonformat(config));
    }else{        
        checkIfConfigChanged();
    }
    let txtconfig = fs.readFileSync(configFilePath, 'utf8');
    eval('config='+txtconfig)
    let df = JSON.parse(JSON.stringify(defaultConfig));
    config = _.merge(df, config);
    //console.log(JSON.stringify(config))
    let accounts = parseUserAccounts();
    config.$userAccounts = accounts;
    if(accounts['gerrit.username']) console.log('[Gerrit Account]=', accounts['gerrit.username'])

    if(config.debug){
        let modeconfig = config.debug[`${config.debug.mode}`];
        let keys = ['concatStaticTplRequests',
                    'concatStaticJsRequests',
                    'concatStaticCssRequests'];
        keys.forEach((key)=>{
            config.debug[key] = !!modeconfig[key]
        })
        if(config.debug.concatStaticTplRequests) config.debug.concatStaticRequests = true;
    }
 
    config.auxiliaryFolder = auxiliaryFolder;

    webroot = config.webProjectPath ? config.webProjectPath : pathutil.resolve(parentFolder, './apps-ingage-web');
    if(!fs.existsSync(webroot)){
        console.log('[致命错误]找不到web工程目录', config.webProjectPath)
        console.log('[FATAL ERROR]Can not find webProjectPath:', config.webProjectPath)
        config = null;
        process.exit(0)
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
    vpp.setPathInfo(allpathinfo);
    let offlineDevBranch = gitUtil.getBranchName(projectFolder)
    let webProjectBranch = gitUtil.getBranchName(webroot)
    config.webProjectInfo = {
        folder: webroot,
        branch: webProjectBranch
    };
    config.offlineDevInfo = {
        folder:projectFolder,
        branch: offlineDevBranch
    };
    webparent = allpathinfo.webparent;
    webappFolder = allpathinfo.webappFolder;

    static_project_root = allpathinfo.static_project_root;
    let staticConfigFilePath = allpathinfo.staticConfigFilePath;
    let staticDebugConfigFilePath = allpathinfo.staticDebugConfigFilePath;

    config.runtime.seajsConfig.alias = webprojectUtil.loadSeaConfig(webroot)
    staticFilter.loadFilterDef(webroot);

    let modestatbrief = '';
    (()=>{
        modestatbrief += config.debug.concatStaticCssRequests?'y':'n'
        modestatbrief += config.debug.concatStaticTplRequests?'y':'n'
        modestatbrief += config.debug.concatStaticJsRequests?'y':'n'
        config.debug.modestatbrief = modestatbrief;
    })();

    global.rkGlobalConfig = config;
    let node_version_detail = process.version.replace(/[a-z]/g,'').split('.');
    let version_main = node_version_detail[0]*1;
    if(printinfo){
        console.log('\n>>>>>>>> [User-Config] >>>>>>>>\n', JSON.stringify(config),'\n<<<<<<<< [User-Config] <<<<<<<<\n')
        console.log('----------')
        console.log(' [RkDev]=',`"${projectFolder}"(${offlineDevBranch})`)
        console.log('   [Web]=', `"${webroot}"(${webProjectBranch})`)
        console.log(`  [Node]= "${process.version}"`);
        console.log('   [Web]=', `"${webroot}"(${webProjectBranch})`)
        //console.log(' [Web-Branch]=', `""`)
        console.log('[Static]=', `"${static_project_root}"`)
        console.log('[Deploy]=', `"${config.deployStaticPath_val}"`)
        console.log('    [OS]=', `"${os.platform()}"`)
        console.log('  [Mode]=', '"'+config.debug.mode+'"'+':'+modestatbrief)
        console.log('----------')
    }
    if(version_main <10){
        console.log('[Exit]node版本要v10以上');
        process.exit(0);
    }
}
reloadConfig();

// watcher(configFilePath, { recursive: false }, function(evt, name) {
//     console.log('%s changed.', name, evt);
//     reloadConfig();
// });

let thisUtil = {
    checkIfConfigChanged,
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