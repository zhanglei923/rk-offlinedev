var fs = require('fs');
let filter = require('./filter')
let fullfilepath;
console.log(fs.existsSync(fullfilepath))
let o = filter.loadFilterDef(
                        'E:/workspaceGerrit/_sub_separation_test/apps-ingage-web', 
                        'E:/workspaceGerrit/_sub_separation_test/apps-ingage-web/static-config.json', 
                        'E:/workspaceGerrit/_sub_separation_test/apps-ingage-web/static-debug-config.json'
                    );
console.log(o)
// filter.loadFilterDef(
//     '/Users/zhanglei/workspaces/apps-ingage-web', 
//     '/Users/zhanglei/workspaces/apps-ingage-web/static-config.json', 
//     '/Users/zhanglei/workspaces/apps-ingage-web/static-debug-config.json'
// )