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

let getAllDepsFiles = (deps, initId)=>{
    //私有函数
    let _push = (array, pathid)=>{
        if(!global.hitedId[pathid]){
            global.hitedId[pathid] = true;
            array.push(pathid)
        }
        return array;
    }
    //私有函数
    let do_getAllDepsFiles = (deps, fulldeps,pathid)=>{
        //console.log(pid, pathid)
        let arr = deps[pathid];
        if(arr){
            arr.forEach((fpath)=>{
                if(!global.hitedId[pathid])do_getAllDepsFiles(deps, fulldeps, fpath);
                fulldeps = _push(fulldeps, fpath)
                //fulldeps.push(fpath)
            })
            fulldeps = _push(fulldeps, pathid)
        }
    }
    //正文
    global.hitedId = {}
    let fulldeps = []
    do_getAllDepsFiles(deps, fulldeps, initId)
    for(let pathid in deps){
        //fulldeps.push(pathid)
        fulldeps = _push(fulldeps, pathid)
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

let arr1 = getAllDepsFiles(json, "core/rkloader.js")
arr1 = _.uniq(arr1)
console.log(arr1.length)
let arr2 = getAllDepsFiles(json, 'page/js/frame/pageMainCtrl.js')
arr2 = _.uniq(arr2)
console.log(arr2.length)
let arr3 = getAllDepsFiles(json, 'oldcrm/js/core/common-crm.js')
arr3 = _.uniq(arr3)
console.log(arr3.length)

fullarr = [];
fullarr = _.uniq(fullarr.concat(arr1))
fullarr = _.uniq(fullarr.concat(arr2))
fullarr = _.uniq(fullarr.concat(arr3))

fs.writeFileSync(thisdir+'/full_dependencylist.txt', fullarr.join('\n'))




//console.log(json)