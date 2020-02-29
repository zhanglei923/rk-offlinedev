let fs=require('fs')
let pathutil = require('path')
let eachcontentjs = require('eachcontent-js')

let parser1 = require('../regParserMini')
let parser2 = require('../regParserMini2')

let t0=(new Date()*1);
let examplejspath = pathutil.resolve(pathutil.parse(__filename).dir, './example_requires.js')
let content = fs.readFileSync(examplejspath,'utf8')
let deps = parser1.getRequiresAsArray(content)



console.log(deps)