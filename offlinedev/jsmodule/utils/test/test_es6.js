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
