var getConfig = require('../../getConfig')
let rk = require('../../utils/rk')

var regex = [/.js$/ig]
rk.eachContent(getConfig.getSourceFolder(), regex, function(content, fpath, states){
    console.log(fpath)
});