let fs = require('fs')
let validator = require('../validator')


let jsonstr1 = fs.readFileSync('./err1.json', 'utf8')
let jsonstr2 = fs.readFileSync('./err2.json', 'utf8')
JSON.parse(jsonstr1)
//return;
//console.log(jsonstr1)
let errors = validator.validate(jsonstr1)


if(errors.length>0) fs.writeFileSync('./_rpt.json', JSON.stringify(errors))
let fatals = [];
let wrongs = [];
errors.forEach((err)=>{
    if(!err.level || err.level==='fatal') wrongs.push(err);
})
if(wrongs.length>0) fs.writeFileSync('./_rpt_mustfix.json', JSON.stringify(wrongs))
console.log(errors)
