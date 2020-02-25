let fs = require('fs')
let eachcontentjs = require('eachcontent-js')
let concatcss = require('../supports/concat_css')

let sourcepath = `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/static/source`

eachcontentjs.eachContent(sourcepath, /\.css$/, (content, fpath)=>{
    let output = concatcss.parseUrls(
        `/Users/zhanglei/workspaces/apps-${'ingage'}-web/src/main/webapp/`, 
        fpath, 
        content
    );
    let outputstring = []
    if(output.relative_urls){
        output.relative_urls.forEach((info)=>{
            if(!info.exist){
                outputstring.push(info.raw_url)
            }
        })
    }
    if(output.absolute_urls){
        output.absolute_urls.forEach((info)=>{
            if(!info.exist){
                outputstring.push(info.raw_url)
            }
        })
    }
    if(outputstring.length>0)
    fs.writeFileSync(fpath, outputstring.join('\n'));
});