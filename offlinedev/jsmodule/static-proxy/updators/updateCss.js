var fs = require('fs');
var pathutil = require('path');
let eachcontentjs = require('eachcontent-js')
let concatcss = require('../supports/concat_css')
let rk = require('../../utils/rk')
let fs_readFile = require('../supports/fs_readFile')
var CleanCSS = require('clean-css');

var configJson = require('../../config/configUtil').get()

let concatConfig = {
    sourceDirList: [],
    filterFun:()=>{},
    destFile:``
}
let updateCss = function (config){
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
                csscontent += `\n/*** ${csspath} ***/\n`+concatcss.getNewCssContent(csspath, content, config.destFile);
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
module.exports = {
    updateCss
}