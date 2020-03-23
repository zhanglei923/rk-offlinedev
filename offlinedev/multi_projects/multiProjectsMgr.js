const fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
var execSh = require("exec-sh");

global.rk_configOfStatic = {};
let loadConfig = (webprojectPath)=>{
    //src\main\webapp\static-config.json
    let configpath = pathutil.resolve(webprojectPath, './src/main/webapp/static-config.json');
    if(fs.existsSync(configpath)){
        let configtxt = fs.readFileSync(configpath);
        let config = JSON.parse(configtxt);
        let dependencies = config.dependencies;
        let rpt = ``;
        dependencies.forEach((dep)=>{
            rpt += `\n   ${dep.project} (${dep.branch})`
        })
        global.rk_configOfStatic = config;
        console.log(`[MultiPrj]: ${rpt}`);
    }else{
        console.log('[MultiPrj]: Define not found.')
    }
};
let eachProjectsFolder = (callback)=>{//所有子工程和主工程

};

module.exports = {
    loadConfig,
    eachProjectsFolder
};