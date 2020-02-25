var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')
let updateCss = require('../updators/updateCss')

module.exports = {
    isMyHotUrl:(url)=>{
        return /all\-xsy\-widgets\_HOT\.css$/.test(url);
    },
    shouldReplacedWithThis:(sourceDir, req_realpath)=>{
        if(req_realpath.match(/all\-xsy\-widgets.css$/)){
            return 'platform/core/css/all-xsy-widgets_HOT.css';
        }
    },
    load:(webappFolder, callback)=>{
        let destFile = pathutil.resolve(webappFolder, './static/source/platform/core/css/all-xsy-widgets_HOT.css')
        updateCss.updateCss({
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