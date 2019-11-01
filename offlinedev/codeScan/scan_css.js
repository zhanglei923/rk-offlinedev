let _ = require('lodash')
let fs = require('fs')
let pathutil = require('path')
let decomment = require('decomment')
let stripcomments = require('strip-comments')
let stripcsscomments = require('./util/zl-strip-css-comment.js')
let eachcontentjs = require('eachcontent-js')
let webprojectUtil = require('../jsmodule/config/webprojectUtil')
let regexp = /url\((.*?)\)/gi

let webapp = `E:/workspaceGerrit/_sub_branches/apps-ingage-web/src/main/webapp/`;
let staticroot = pathutil.resolve(webapp, './static');
//let allfiles = eachcontentjs.getAllFiles(staticroot)

// console.log(pathutil.resolve(webapp,  'aaa/bbb/c.png'))
// return;
let reports = {}
let badcount=0;
eachcontentjs.eachContent(staticroot, [/\.css$/], (content, csspath, states)=>{
    //console.log(csspath)
    content = stripcsscomments(content)

    let cssfolder = pathutil.parse(csspath).dir;
    let urls = content.match(regexp);
    if(urls){
        urls.forEach((url)=>{
            let orign_url = url;
            url = _.trim(url)
            url = url.replace(/['|"]/g, '')
            url = url.replace(/url\s{0,}\(/g, '')
            url = url.replace(/\)/g, '')
            //console.log(url)
            if(!url.match(/^data\:/) && !url.match(/\#default\#/) && !url.match(/^http(s)?:\/\//)){
                let relativeRoot = cssfolder;
                if(url.match(/^\//)) {
                    relativeRoot = webapp;
                    url = '.'+url;
                }
                url = url.split('?')[0]
                //if(!url.match(/^[\.\/]/)) url = './' + url;
                let fullpath = pathutil.resolve(relativeRoot, url);
                //console.log(fullpath)
                if(!fs.existsSync(fullpath)){
                    if(!reports[csspath]) reports[csspath] = [];
                    reports[csspath].push(orign_url)
                    badcount++
                }
            }
        })
    }
})

fs.writeFileSync('./rpt.json', JSON.stringify(reports))
console.log('[wrong]:', badcount)
