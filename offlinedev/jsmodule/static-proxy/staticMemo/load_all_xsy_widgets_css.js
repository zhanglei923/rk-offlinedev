var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')
let updateCss = require('../updators/updateCss')

module.exports = {
    is:(url)=>{
        return /all\-xsy\-widgets\.css$/.test(url);
    },
    load:(webappFolder, callback)=>{
        let destFile = pathutil.resolve(webappFolder, './static/source/platform/core/css/all-xsy-widgets.css')
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