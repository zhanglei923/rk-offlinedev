let fs=require('fs')
let pathutil = require('path')
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')

let seajsUtil = require('../seajsUtil')

let deps1 = {
    '0':['1','2','3'],
    '1':['a', 'b'],
    '2':['a', 'c'],
    '3':['b', 'd'],
    'a':['x','y'],
    'b':['u','v'],
    'c':[],
    'd':['e','f'],
    'e':[],
    'f':[],
    'u':[],
    'v':[],
    'x':[],
    'y':['z'],
    'z':[],
    '11':[],
    '12':[]
}

let expect= 'x,z,y,a,u,v,b,1,c,2,e,f,d,3,0,11,12'

let output = seajsUtil.reduceAllDepsIntoArray(deps1, '0')

let fulldepsstr = output.join(',')
console.log(fulldepsstr)
console.log(expect)
console.log(fulldepsstr === expect)

let thisdir = pathutil.parse(__filename).dir

let json = fs.readFileSync(thisdir+'/dependencyMap.json');
json = JSON.parse(json)

json['root'] = ["core/rkloader.js",'page/js/frame/pageMainCtrl.js','oldcrm/js/core/common-crm.js']

let arr1 = seajsUtil.reduceAllDepsIntoArray(json, 'root')
// arr1 = _.uniq(arr1)
// console.log(arr1.length)
// let arr2 = seajsUtil.reduceAllDepsIntoArray(json, 'page/js/frame/pageMainCtrl.js')
// arr2 = _.uniq(arr2)
// console.log(arr2.length)
// let arr3 = seajsUtil.reduceAllDepsIntoArray(json, 'oldcrm/js/core/common-crm.js')
// arr3 = _.uniq(arr3)
// console.log(arr3.length)

fullarr = [];
fullarr = _.uniq(fullarr.concat(arr1))

fs.writeFileSync(thisdir+'/full_dependencylist.txt', fullarr.join('\n'))

// for(let i=0;i<2000;i++){
//     let pathid = fullarr[i];

// }


//console.log(json)