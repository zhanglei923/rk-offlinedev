var getConfig = require('../../configUtil')
let rk = require('../../utils/rk')

var regex = [/.js$/ig]
let a=false;
let t0=new Date()
rk.eachContent(getConfig.getSourceFolder(), regex, function(content, fpath, states){
    content = rk.cleanComments(content)
    if(content.indexOf('ahaha'))a=true;
});
console.log(new Date()-t0)