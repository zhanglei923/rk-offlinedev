let exclude = require('../exclude')

exclude.setSettings({
                        filesToExclude:[
                        'platform/**',
                        'oa/**/*.js',
                        'products/bi/**',
                        "oldcrm/**/*.js"
                    ]})

console.log(exclude.isExcludePathid('platform/oa/workreport/widget.js'))
console.log(exclude.isExcludePathid('oa/workreport/widget.js'))
console.log(exclude.isExcludePathid('oa/workreport/widget.tpl'))
console.log(exclude.isExcludePathid('products/bi/chart/widget.tpl'))
console.log(exclude.isExcludePathid('oldcrm/js/core/business-widgets.js'))