let fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
let fs_readFile = require('../../utils/fs_readFile');
let thisFolder = pathutil.parse(__filename).dir;
let masterRoot = pathutil.resolve(thisFolder, `../../../../`)

// {
//     "/static/source/lib/breeze/breeze.lib.min.js":"https://127.0.0.1:3000/static/js/bundle.js",
//     "/static/source/breeze/sfa_runtime.min.js":"https://127.0.0.1:3000/static/js/bundle.js"
// }
let config = {}
let init = ()=>{
    let configfilepath = pathutil.resolve(masterRoot, './redirect-config.json');
    if(!fs.existsSync(configfilepath)){
        fs.writeFileSync(configfilepath, '{\n}')
        return null;
    }
    //console.log('[redirect-config]=', configfilepath)
    let succ = true;
    console.log(`[Redirect-config]:`);
    fs_readFile.fs_readFile(configfilepath, {encoding:'utf8', be_sync: true}, (err, content, fileinfo) => {
        //console.log('content=', content)
        try{
            eval(`config = ${content}`);
            for(let key in config){
                console.log('  >[Redirect]', key, '->', config[key])
            }
        }catch(e){
            succ = false;
            console.log(e)
            console.log(`[Syntax Error]: ${configfilepath}`);
        }
    });
    if(!succ) {
        process.exit(0);
    }else{
    }
}

let thisUtil = {
    init,
    loadRedirectConfig: ()=>{
        return config;
    }
};
module.exports = thisUtil;