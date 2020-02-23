var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('./supports/fs_readFile')
var getConfig = require('../config/configUtil')

let webFolder = getConfig.getWebRoot()
let staticFolder = getConfig.getStaticFolder()
let sourceFolder = getConfig.getSourceFolder()
var webappFolder = getConfig.getWebAppFolder()

let isHotUrl = (url)=>{
    return /\_hotresponse\_\.js$/.test(url);
}
let loadContent = (res, url)=>{
    // https://crm-dev61rs.ingageapp.com/static/source/products/bi/common/service/_hotresponse_.js
    let dir = pathutil.parse(url).dir;
    dir = dir.replace(/^\/{1,}/, './')
    dir = pathutil.resolve(webappFolder, dir);
    console.log('dir=', dir)
    if(!fs.existsSync(dir)){
        console.log(`[rk error]not found: ${dir}`)
        res.sendStatus(404).send(`Not Found: ${dir}`)
        return;
    }
    let files = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        //console.log(file)
        var stat = fs.statSync(file)
        if (stat && !stat.isDirectory()) {
            files.push(file)
        }
    })
    let len = files.length;
    let fullcontent = ''
    let onall = (fullcontent)=>{
        res.send(fullcontent);
    }
    files.forEach((fullfilepath)=>{
        fs_readFile.fs_readFile(fullfilepath, {encoding:'utf8'}, (err, jsContent, fileinfo) => {  
            len--;
            if(err){}else{
                fullcontent += `;${fullfilepath};\n${jsContent}`
            }
            if(len === 0){
                onall(fullcontent)
            }
        });
    })
}
let me = {
    isHotUrl,
    loadContent
}
module.exports = me;