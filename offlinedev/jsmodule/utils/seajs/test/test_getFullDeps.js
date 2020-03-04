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
    'z':[]
}

let expect= 'x,z,y,a,u,v,b,1,c,2,e,f,d,3,0'

let fulldeps = []




let parse = (pid, pathid)=>{
    //console.log(pid, pathid)
    let arr = deps[pathid];
    arr.forEach((fpath)=>{
        parse(pathid, fpath);
        fulldeps.push(fpath)
    })
    fulldeps.push(pathid)
}
parse(null, '0')

fulldeps = _.uniq(fulldeps)
let fulldepsstr = fulldeps.join(',')
console.log(fulldepsstr === expect)