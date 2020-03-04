let _ = require('lodash')
let deps = {
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

let fulldeps = []




let getAllDepsFiles = (pathid)=>{
    //console.log(pid, pathid)
    let arr = deps[pathid];
    arr.forEach((fpath)=>{
        getAllDepsFiles(fpath);
        fulldeps.push(fpath)
    })
    fulldeps.push(pathid)
}
getAllDepsFiles('0')

for(let pathid in deps){
    fulldeps.push(pathid)
}

fulldeps = _.uniq(fulldeps)
let fulldepsstr = fulldeps.join(',')
console.log(fulldepsstr)
console.log(expect)
console.log(fulldepsstr === expect)