//动态将代码注入到特定js里
let fs = require('fs');
let pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
let fs_readFile = require('../../static-proxy/supports/fs_readFile')
var getConfig = require('../../config/configUtil')

let isMe = (fpath)=>{ //src/main/webapp/static/router.js
    if(fpath.match(/static\/sea\-config\.js$/)){
        return true;
    }
    return false;
}
let updateJs = (info, content)=>{        
    let fullfilepath = info.fullfilepath;
    if(!isMe(fullfilepath)) return content;
    if(getConfig.getValue('debug.mode') !== 'concat') return content;

    let dir = pathutil.parse(__filename).dir;
    let jspath = pathutil.resolve(dir, './injectSeaConfig_script_content.js')
    let jscontent;
    fs_readFile.fs_readFile(jspath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {
        jscontent = content;
    });
    content += '\n'+jscontent;
    return content;
}
module.exports = {
    updateJs
};