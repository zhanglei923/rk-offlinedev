var babel = require("@babel/core");
var UglifyJS = require("uglify-js");

let minify = (jsContent, opt)=>{
    if(typeof opt === 'undefined') opt = {
        // mangle:{
        //     reserved:['require' ,'exports' ,'module' ,'$']
        // }
    }
    jsContent = transform(jsContent);
    var result = UglifyJS.minify(jsContent, opt);
    var minContent = result.code;
    if(result.error) {
        console.log(result.error); 
        return jsContent;
    }else{
        return minContent;
    }
}
let transform = (jsContent, opt)=>{
    if(typeof opt === 'undefined') opt = {}
    var script = jsContent+'';
    try{
        var result = babel.transform(script, {
            plugins: [
                // "@babel/plugin-proposal-object-rest-spread",
                // "@babel/plugin-transform-arrow-functions"
            ],
            "presets": [//presents 是plugins的集合，npm里有其他定制的presets可用
                [
                  "@babel/preset-env",
                  {
                    "useBuiltIns": false//"entry"
                  }
                ]
            ]
          });
        //console.log(result)
        //console.log('map', result.map)
        script = result.code;
    }catch(e){
        let fullfilepath = opt.fullfilepath;
        console.log(`  Warn: ${fullfilepath} failed at transform es6:`, e)
    }
    return script;
}
var _thisUtil = {
    transform,
    minify
};
module.exports = _thisUtil;