let fs=require('fs')
let pathutil = require('path')
let _ = require('lodash')
let eachcontentjs = require('eachcontent-js')

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





let do_getAllDepsFiles = (deps, fulldeps,pathid)=>{
    //console.log(pid, pathid)
    let arr = deps[pathid];
    if(arr){
        arr.forEach((fpath)=>{
            do_getAllDepsFiles(deps, fulldeps, fpath);
            fulldeps.push(fpath)
        })
        fulldeps.push(pathid)
    }
}
let getAllDepsFiles = (deps, initId)=>{
    let fulldeps = []
    do_getAllDepsFiles(deps, fulldeps, initId)

    for(let pathid in deps){
        fulldeps.push(pathid)
    }
    fulldeps = _.uniq(fulldeps)
    return fulldeps;
}
let output = getAllDepsFiles(deps1, '0')

let fulldepsstr = output.join(',')
console.log(fulldepsstr)
console.log(expect)
console.log(fulldepsstr === expect)

let thisdir = pathutil.parse(__filename).dir

let json = fs.readFileSync(thisdir+'/dependencyMap.json');
json = JSON.parse(json)

let fullarr = getAllDepsFiles(json, "core/rkloader.js")
fs.writeFileSync(thisdir+'/full_dependencylist.txt', fullarr.join('\n'))
//console.log(json)