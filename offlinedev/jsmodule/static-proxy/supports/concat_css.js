let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')
let fs_readFile = require('./fs_readFile')
var CleanCSS = require('clean-css');
let parseCssUrls = require("css-url-parser")

let getUrls = (content)=>{
    var cssUrls = parseCssUrls(content);
    cssUrls = _.uniq(cssUrls)
    let relative_urls = [];
    let absolute_urls = [];
    let http_urls = [];
    cssUrls.forEach((raw_url)=>{
        if(raw_url.match(/^http\s{0,1}\:/) || raw_url.match(/^#/)){// http://, https://, #default#VML
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
let getNewCssContent = (fullfilepath, csscontent, destfile)=>{
    if(!csscontent) return csscontent;
    let dir = pathutil.parse(fullfilepath).dir;
    let destdir = pathutil.parse(destfile).dir;
    let newcontent = csscontent;
    let output = getUrls(csscontent);
    if(output.relative_urls){
        output.relative_urls.forEach((raw_url)=>{
            let raw_fullpath = pathutil.resolve(dir, raw_url);
            let new_relative_url = pathutil.relative(destdir,raw_fullpath);
            //if(!/^\.\//.test(new_relative_url)) new_relative_url = './'+new_relative_url
            let bfreg = raw_url.replace(/\?/g, '\\?')
            let reg = new RegExp(`${bfreg}`, 'g');
            new_relative_url = rk_formatPath(new_relative_url)
            newcontent = newcontent.replace(reg, new_relative_url)
        })
    }
    return newcontent;
}
let testUrls = (webbaseDir, fpath, content)=>{
    let output = parseUrls(
        webbaseDir, 
        fpath, 
        content
    );
    let badurls = []
    if(output.relative_urls){
        output.relative_urls.forEach((info)=>{
            if(!info.exist){
                badurls.push(info.raw_url)
            }
        })
    }
    if(output.absolute_urls){
        output.absolute_urls.forEach((info)=>{
            if(!info.exist){
                badurls.push(info.raw_url)
            }
        })
    }
    return badurls;
}
let concatCss = function (config){
    let csspathlist = [];
    config.sourceDirList.forEach((dir)=>{
        //console.log(dir)
        eachcontentjs.eachPath(dir, /\.css$/, (csspath)=>{
            //console.log(csspath)
            csspathlist.push(csspath);
        })
    })
            
    let len = csspathlist.length;
    let csscontent = ''
    csspathlist.forEach((csspath)=>{
        fs_readFile.fs_readFile(csspath, {encoding:'utf8'}, (err, content) => {
            len--;
            if(err){
                console.log(err)
            }else{
                csscontent += `\n/*** ${csspath} ***/\n`+getNewCssContent(csspath, content, config.destFile);
            }
            if(len === 0) {
                if(1){
                    config.success(csscontent);
                }else{
                    var output = new CleanCSS( { /* options */ }).minify(csscontent);
                    config.success(output.styles);
                }                
            }
        });
    })
}
let me = {
    getUrls,
    parseUrls,
    concatCss,
    testUrls,
    getNewCssContent
}
module.exports = me;