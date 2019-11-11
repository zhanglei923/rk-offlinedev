let fs = require('fs')
let validator = require('../validator')


let jsonstr1 = fs.readFileSync('./err1.json', 'utf8')
let jsonstr2 = fs.readFileSync('./err2.json', 'utf8')
JSON.parse(jsonstr1)
//return;
//console.log(jsonstr1)
let errors = validator.validate(jsonstr1)


console.log(errors)
