let seajsUtil = require('../seajsUtil')
// /Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/i18n/untranslated.js
console.log(seajsUtil.resolveRequirePath(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`,
                                        `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/i18n/untranslated.js`,
                                        `../a.js`
))

console.log(seajsUtil.resolveRequirePath(`/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source`,
                                        `/Users/zhanglei/workspaces/apps-ingage-web/src/main/webapp/static/source/core/i18n/untranslated.js`,
                                        `aaa/bbb/ccc`
))

