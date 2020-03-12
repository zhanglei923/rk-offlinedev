let exclude = require('../exclude')

exclude.setSettings({
                        filesToExclude:[
                        'platform',
                        'oa/**/*.js',
                        'products/bi/**'
                    ]})

console.log(exclude.isExcludePathid('platform/oa/workreport/widget.js'))
console.log(exclude.isExcludePathid('oa/workreport/widget.js'))
console.log(exclude.isExcludePathid('oa/workreport/widget.tpl'))
console.log(exclude.isExcludePathid('products/bi/chart/widget.tpl'))