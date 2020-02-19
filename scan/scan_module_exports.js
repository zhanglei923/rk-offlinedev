let fs = require('fs')
let _ = require('lodash')
let rk = require('../offlinedev/jsmodule/utils/rk')
let eachcontentjs = require('eachcontent-js')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`
let t0=new Date()*1;

eachcontentjs.eachContent(sourcepath, /\.js$/, (content, fpath)=>{
    if(!rk.isCookedJsPath(fpath) && !rk.isLibJsPath(fpath) && rk.mightBeCmdFile(content)){
        content = _.trim(content);
        let arr = content.split('define');
        let header = arr[0];
        if(header) header = _.trim(rk.cleanComments(header));            
        if(header) {
            //头部有问题
            console.log('header:', header)
        }else{
            arr[0]='';
            for(let i=0;i<3;i++){//节约时间                
                if(arr[i])
                arr[i] = arr[i].replace(/\(\s?require\s?\,\s?exports\s?\,\s?module\s?\)/g, '(/** replaced **/)')
            }
            let newcontent = arr.join('define');
            newcontent = `define(function (require, exports, module) {\nreturn rk_offlinedev_debug_`+newcontent+'\n});';
            fs.writeFileSync(fpath, newcontent)
        }

    }
})


console.log(new Date()*1-t0)