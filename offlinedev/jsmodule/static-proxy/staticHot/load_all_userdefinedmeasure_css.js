var fs = require('fs');
var pathutil = require('path');
let is_path_inside = require('is-path-inside')
var fs_readFile = require('../../utils/fs_readFile')
var getConfig = require('../../config/configUtil')
let updateCss = require('../supports/concat_css')

module.exports = {
    isMyHotUrl:(url)=>{
        return url.match(/all\-userdefinedmeasure\_HOT\.css$/);
    },
    shouldReplacedWithThis:(req_realpath)=>{
        let sourceDir = global.rk_masterSourceFolder;
        if(req_realpath.match(/\.css$/)){
            let bi_path = pathutil.resolve(sourceDir, './products/userdefinedmeasure')
            if(is_path_inside(req_realpath, bi_path)){
                return 'products/userdefinedmeasure/all-userdefinedmeasure_HOT.css';
            }
        }
    },
    load:(webappFolder, callback)=>{
        let destFile = pathutil.resolve(webappFolder, './static/source/platform/core/css/all-userdefinedmeasure_HOT.css')
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