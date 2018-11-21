var fs = require('fs');
let access = require('./i18nAccess')


access.saveAsUntranslated({a:10})

let all = access.loadLanguagesFromAll()
fs.writeFileSync('./all.json', JSON.stringify(all))


let all2 = access.loadLanguagesFromUntranslated()
fs.writeFileSync('./all2.json', JSON.stringify(all2))