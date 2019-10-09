var pathutil = require('path');
var makeDir = require('make-dir');
var parentFolder = pathutil.resolve(__dirname, '../../../../');
let auxiliaryFolder = pathutil.resolve(parentFolder, './rk-offlinedev-auxiliary')

let tmpFolder = pathutil.resolve(auxiliaryFolder, './tmp')
let nginxDeployFolder = pathutil.resolve(auxiliaryFolder, './nginx_deploy_download')

makeDir.sync(tmpFolder)
makeDir.sync(nginxDeployFolder)

module.exports = {
    getRootFolder: ()=>{
        return auxiliaryFolder;
    },
    tmpFolder,
    nginxDeployFolder
}