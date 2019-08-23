let webroot = `E:/workspaceGerrit/_sub_separation_test/apps-ingage-web`
let configUtil = require('../../config/configUtil');
let staticFilter = require('../../static-filter/filter');
let allpathinfo = configUtil.getAllPathInfo(webroot);

console.log(allpathinfo)

staticFilter.loadFilterDef(webroot, allpathinfo.staticConfigFilePath, allpathinfo.staticDebugConfigFilePath);

let projects = staticFilter.getProjectsDef()
let filters = staticFilter.getFilterDef()

console.log(projects)
console.log(projects.length)