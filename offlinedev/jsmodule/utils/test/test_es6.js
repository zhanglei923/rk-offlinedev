let es6 = require('../es6')
let code = `let a=()=>{return a;}`
let code2 = es6.transform(code);
console.log(code2)

code = `let arr=[1,2,3]; let b=[...arr,4,5,6]`
code2 = es6.transform(code);
console.log(code2)


code = `sdfasdfas/sdfas323(&*(&^))`
code2 = es6.transform(code);
console.log(code2)

code = `

define(function(require, exports, module) {
    'use strict';
    $('#a');//a jquery
    var babel = require("@babel/core");
    var UglifyJS = require("uglify-js");

    let minify = (jsContent, opt)=>{
        if(typeof opt === 'undefined') opt = {}
        jsContent = transform(jsContent);
        var result = UglifyJS.minify(jsContent);
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
        }
        return script;
    }
    var _thisUtil = {
        transform,
        minify
    };
    module.exports = _thisUtil;
});

`
code2 = es6.minify(code, {        
    uglifyOpt:{
        mangle:{
            reserved:['require' ,'exports' ,'module' ,'$']
        }
    }
});
console.log(code2)
