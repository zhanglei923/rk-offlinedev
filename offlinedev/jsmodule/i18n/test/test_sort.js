var fs = require('fs');
let access = require('../i18nAccess')

let json = {
    'z':'z',
    b:'b',
    a:'a',
    c:'c',
}
console.log(json)
console.log(access._sortJson(json))