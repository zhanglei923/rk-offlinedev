let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let CleanCSS = require("clean-css")
let parseCssUrls = require("css-url-parser")

let getUrls = (content)=>{
    var cssUrls = parseCssUrls(content);
    cssUrls = _.uniq(cssUrls)
    let relative_urls = [];
    let absolute_urls = [];
    let http_urls = [];
    cssUrls.forEach((raw_url)=>{
        if(raw_url.match(/^http\s{0,1}\:/)){
            http_urls.push(raw_url);
        }else if(raw_url.match(/^\//)){
            absolute_urls.push(raw_url);
        }else{
            relative_urls.push(raw_url);
        }
    });
    return {
        relative_urls: relative_urls.length === 0 ? null : relative_urls,
        absolute_urls: absolute_urls.length === 0 ? null : absolute_urls,
        http_urls: http_urls.length === 0 ? null : http_urls
    }
}
let parseUrls = (webbaseDir, filepath, content)=>{
    let urls = getUrls(content);
    let details = {}
    if(urls.http_urls){
        details.http_urls = []
        urls.http_urls.forEach((raw_url)=>{
            let realfilepath = raw_url;
            details.http_urls.push({
                raw_url,
                realfilepath
            })
        })
    }
    if(urls.absolute_urls){
        details.absolute_urls = []
        urls.absolute_urls.forEach((raw_url)=>{
            let realfilepath = webbaseDir+''+raw_url;
            let testpath = realfilepath.split('?')[0];//去掉可能的请求参数
            details.absolute_urls.push({
                raw_url,
                realfilepath,
                exist: fs.existsSync(testpath)
            })
        })
    }
    if(urls.relative_urls){
        details.relative_urls = []
        let pathinfo = pathutil.parse(filepath);
        let dir = pathinfo.dir;
        urls.relative_urls.forEach((raw_url)=>{
            let realfilepath = pathutil.resolve(dir, raw_url);
            let testpath = realfilepath.split('?')[0];//去掉可能的请求参数
            details.relative_urls.push({
                raw_url,    
                realfilepath,
                exist: fs.existsSync(testpath)
            })
        })
    }
    return details;
}

let me = {
    getUrls,
    parseUrls,
    concatCss: (targetfolder, filterFun)=>{

    },
    testUrls: (webbaseDir, filepath, csscontent)=>{

    },
    getNewCssContent: (oldfilepath, targetdir, csscontent)=>{
        if(!csscontent) return csscontent;
        
        
    }
}
module.exports = me;