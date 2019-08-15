var fs = require('fs');
let filter = require('./filter')
let fullfilepath;
console.log(fs.existsSync(fullfilepath))
filter.loadFilterDef(
                        'E:/workspaceGerrit/_sub_separation_test', 
                        'E:/workspaceGerrit/_sub_separation_test/apps-ingage-web/static-config.json', 
                        'E:/workspaceGerrit/_sub_separation_test/apps-ingage-web/static-debug-config.json'
                    )
filter.loadFilterDef(
    '/Users/zhanglei/workspaces/', 
    '/Users/zhanglei/workspaces/apps-ingage-web/static-config.json', 
    '/Users/zhanglei/workspaces/apps-ingage-web/static-debug-config.json'
)