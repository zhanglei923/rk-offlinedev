var fs = require('fs');
var pathutil = require('path');
var fs_readFile = require('../supports/fs_readFile')
var getConfig = require('../../config/configUtil')
let updateCss = require('../updators/updateCss')

module.exports = {
    is:(url)=>{
        return /all\-bi\-widgets\.css$/.test(url);
    },
    load:(webappFolder, callback)=>{
        let destFile = pathutil.resolve(webappFolder, './static/source/platform/core/css/all-bi-widgets.css')
        updateCss.updateCss({
            sourceDirList: [
                pathutil.resolve(webappFolder, './static/source/products/bi')
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