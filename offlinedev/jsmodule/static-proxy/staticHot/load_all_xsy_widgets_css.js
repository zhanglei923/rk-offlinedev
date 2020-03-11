var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../../utils/fs_readFile')
var getConfig = require('../../config/configUtil')
let updateCss = require('../supports/concat_css')

module.exports = {
    isMyHotUrl:(url)=>{
        return url.match(/all\-xsy\-widgets\_HOT\.css$/);
    },
    shouldReplacedWithThis:(sourceDir, req_realpath)=>{
        if(req_realpath.match(/all\-xsy\-widgets.css$/)){
            return 'platform/core/css/all-xsy-widgets_HOT.css';
        }
    },
    load:(webappFolder, callback)=>{
        let destFile = pathutil.resolve(webappFolder, './static/source/platform/core/css/all-xsy-widgets_HOT.css')
        updateCss.concatCss({
            sourceDirList: [
                pathutil.resolve(webappFolder, 'platform/widgets'),
                pathutil.resolve(webappFolder, 'platform/layout')
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