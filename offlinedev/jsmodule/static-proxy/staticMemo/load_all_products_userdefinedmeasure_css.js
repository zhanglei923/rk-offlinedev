var fs = require('fs');
var pathutil = require('path');
let is_path_inside = require('is-path-inside')
var fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')
let updateCss = require('../updators/updateCss')

module.exports = {
    isMyHotUrl:(url)=>{
        return /all\-products\_userdefinedmeasure\-widgets\_HOT\.css$/.test(url);
    },
    shouldReplacedWithThis:(sourceDir, req_realpath)=>{
        if(req_realpath.match(/\.css$/)){
            let bi_path = pathutil.resolve(sourceDir, './products/userdefinedmeasure')
            if(is_path_inside(req_realpath, bi_path)){
                return 'products/userdefinedmeasure/all-products_userdefinedmeasure-widgets_HOT.css';
            }
        }
    },
    load:(webappFolder, callback)=>{
        let destFile = pathutil.resolve(webappFolder, './static/source/platform/core/css/all-products_userdefinedmeasure-widgets_HOT.css')
        updateCss.concatCss({
            sourceDirList: [
                pathutil.resolve(webappFolder, './static/source/products/userdefinedmeasure')
            ],
            filterFun:()=>{
                return true;
            },
            destFile,
            success: function(newcontent){
                newcontent = `/**** load from memoery, by rk-offlinedev ****/\n${newcontent}`;
                callback(newcontent);
            }
        })
    }
};