let eachcontentjs = require('eachcontent-js')
let md5 = require('blueimp-md5')
let _ = require('lodash')
require('./global')
global.GLOBAL_DATA = {};

let watchFiles = (opt)=>{
    if(global.GLOBAL_DATA[opt.watchId]) return;
    if(opt.folder && !_.isArray(opt.folder)) opt.folder = [opt.folder];
    if(opt.ignored && !_.isArray(opt.ignored)) opt.ignored = [opt.ignored];
    global.GLOBAL_DATA[opt.watchId] = opt;
}
let isIgnored = (ignored, fpath)=>{
    let ok = true;
    for(let i=0;i<ignored.length;i++){
        if(fpath.match(ignored[i])){
            ok = false;
            break;
        }
    }
    return ok;
}
let getChangedFiles = (watchId)=>{
    let watch_data = global.GLOBAL_DATA[watchId];
    let opt = watch_data;
    let filereg = watch_data.filereg;
    if(!watch_data.files36) watch_data.files36 = {};
    //let t0 = new Date()*1;
    //let totalmc36_1 = '';
    let changedfiles = [];
    let r = Math.random()+'';
    watch_data.folder.forEach((folder)=>{
        eachcontentjs.eachStatus(folder, filereg, (status, fpath)=>{
            let ok = true;
            if(opt.ignored){ok = isIgnored(opt.ignored, fpath);}
            if(ok){
                fpath = global.rk_formatPath(fpath);
                if(status){
                    let mc36 = global.getStatMC36(status).replace(/(\.|\-)/g,'');
                    if(watch_data.files36[fpath] && mc36 !== watch_data.files36[fpath].mc36){
                        changedfiles.push(fpath);
                        watch_data.files36[fpath].mc36 = mc36;
                    }
                    if(!watch_data.files36[fpath]){
                        changedfiles.push(fpath);
                        watch_data.files36[fpath] = {
                            mc36
                        };
                    }
                }else{
                    changedfiles.push(fpath);
                }
                watch_data.files36[fpath].r = r;
            }
            //console.log(fpath, watch_data.files36[fpath].r, r)
            //totalmc36_1 += mc36;
        })
    })
    for(let fpath in watch_data.files36){//被删掉的
        let ok = true;
        if(opt.ignored){ok = isIgnored(opt.ignored, fpath);}
        if(ok)
        if(watch_data.files36[fpath].r !== r){
            //console.log(fpath, watch_data.files36[fpath].r, r)
            changedfiles.push(fpath);
            delete watch_data.files36[fpath];//清除
        }
    }
    global.GLOBAL_DATA[watchId] = watch_data;
    return changedfiles;
}
var _thisUtil = {
    watchFiles,
    getChangedFiles
};
module.exports = _thisUtil;