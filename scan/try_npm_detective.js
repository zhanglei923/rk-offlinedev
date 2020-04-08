var detective = require('detective');
let _ = require('lodash')
let fs = require('fs')
let pathutil = require('path')
let eachcontentjs = require('eachcontent-js');


let webapp = `E:/workspaceGerrit/apps-ingage-web/src/main/webapp/`;
let staticroot = pathutil.resolve(webapp, './static/source/');

eachcontentjs.eachContent(staticroot, [/\.js$/], (content, csspath, states)=>{
    var requires = detective(content);
    if(requires.length>0){
        console.dir(requires);
        fs.writeFileSync(csspath, '// '+requires.join('\n// ')+'\n\n'+content)
    }
});


// var src = fs.readFileSync(__dirname + '/strings_src.js');
// var requires = detective(src);
// console.dir(requires);