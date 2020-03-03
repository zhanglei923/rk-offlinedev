let fs = require('fs')
let pathutil = require('path')
let util = require('util')
let _ = require('lodash')
let makeDir = require('make-dir')
let execSh = require('exec-sh')
let is_path_inside = require('is-path-inside')
let eachcontentjs = require('eachcontent-js')
let rk = require('../../../utils/rk')
var fs_readFile = require('../../../static-proxy/supports/fs_readFile')
let parser = require('../../../utils/seajs/regParserMini')
var seajsUtil = require('../../../utils/seajs/seajsUtil')
var updateStaticsUrl = require('../../../static-proxy/updators/updateStaticsUrl')
var configUtil = require('../../../config/configUtil')

let prepareMergeStrategy = function (sourcepath, seaconfig){


}
let getMergeStrategy = function (sourcepath){
    //
}
module.exports = {
    prepareMergeStrategy,
    getMergeStrategy
}