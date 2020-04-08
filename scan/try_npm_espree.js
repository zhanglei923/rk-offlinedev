var detective = require('detective');
let _ = require('lodash')
let fs = require('fs')
let pathutil = require('path')
let eachcontentjs = require('eachcontent-js');
const espree = require("espree");
 

let webapp = `E:/workspaceGerrit/apps-ingage-web/src/main/webapp/`;
let staticroot = pathutil.resolve(webapp, './static/source/');

eachcontentjs.eachContent(staticroot, [/\.js$/], (content, csspath, states)=>{
    try{
        const ast = espree.parse(content, {
            ecmaVersion: 10,
        });
        //console.log(ast)
    }catch(e){
        console.log(e,'\n',csspath)
    }
});


// var src = fs.readFileSync(__dirname + '/strings_src.js');
// var requires = detective(src);
// console.dir(requires);