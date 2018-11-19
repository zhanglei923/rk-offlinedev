var fs = require('fs');
let access = require('./i18nAccess')

let all = access.loadLanguagesFromAll()
fs.writeFileSync('./all.json', JSON.stringify(all))


let all_untrans = access.loadLanguagesFromUntranslated()
fs.writeFileSync('./all_untrans.json', JSON.stringify(all_untrans))

let count = 0;
let allcn = all["all_zh-cn"]
for(let fpath in all_untrans){
    let untrans = all_untrans[fpath]
    for(let key in untrans){
        if(typeof allcn[key] !== 'undefined'){
            if(allcn[key] === untrans[key]){
                delete allcn[key];
                count++
            }else{
                console.log('[unknown]', key)
            }
        }
    }
}
console.log(count,'removed')
fs.writeFileSync('./all2.json', JSON.stringify(allcn))

access.saveAllLanguages({'cn': allcn})