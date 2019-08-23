//检测主子工程是否存在重复路径
let configUtil = require('../jsmodule/config/configUtil')
let projectFileSearch = require('../jsmodule/static-proxy/supports/projectFileSearch')

module.exports = {
    watch:()=>{
        let allpathinfo = configUtil.getAllPathInfo();
        let webroot = allpathinfo.webroot;

        //console.log(webroot)

        let rpt = projectFileSearch.loadAllVPPStaticFiles(webroot)
        
        return rpt;
        //console.log(rpt)
    }
}