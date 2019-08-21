let _ = require('lodash')
let regexp = require('../jsmodule/utils/seajs/reg')

let urlist = []
let _require = (url)=>{
    urlist.push(url)
}
let scan = (fpath, jscontent)=>{
    let requires = jscontent.match(regexp.REQUIRE_REGEX);
    if(_.isArray(requires)){
        console.log(JSON.stringify(requires))
        let evalstr = '';
        requires.forEach((str)=>{
            evalstr = evalstr + ';' + str.replace(/^require/g, '_require') + ';'
        })
        urlist = [];
        console.log(evalstr)
        eval(evalstr)
        console.log(urlist)
    }
}
module.exports = {
    scan
}