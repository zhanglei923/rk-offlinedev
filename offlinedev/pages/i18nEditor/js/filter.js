$('#filterIpt').on('keydown', (e)=>{
    if(e.keyCode === 13){
        do_filterByRegex()
    }
})
let do_filterByRegex = ()=>{   
    $('#untransFiles').val('').change();//不要混合查了
    let type = $('#filterTypes').val() 
    let reg = $('#filterIpt').val();
    if(reg){
        try{
            $('#table > tbody > tr').each(function (i, r){
                let targetStr;
                let key = r.getAttribute('data-key')
                //if(type === "cn") 
                let found = false;
                let _find = (str)=>{
                    let ok = false;
                    eval(`
                            if(${reg}.test(str)){
                                ok = true;
                            }else{
                                ok = false;
                            }                    
                    `);
                    return ok;
                };          
                if(type === "key") {
                    targetStr = r.getAttribute('data-key')
                    found = _find(targetStr)
                }else{                    
                    if(!found){                    
                        targetStr = r.getAttribute('data-key')
                        found = _find(targetStr)
                    }
                    if(!found){                    
                        targetStr = SuperJson[key].cn;
                        found = _find(targetStr)
                    }
                    if(!found){                    
                        targetStr = SuperJson[key].en;
                        found = _find(targetStr)
                    }

                }
                if(found){
                    r.style.display='';
                }else{
                    r.style.display='none';
                }  
                
            });
        }catch(e){
            alert('执行错误')
            throw e;
        }
    }
}
let eachTr = (callback)=>{
    $('#table > tbody > tr').each(function (i, r){
        callback(i, r);
    })
}
let getShortDrivePath = (fpath)=>{
    if(!fpath) return '';
    return fpath.split('source\\core\\i18n')[1]
}
let init_untransFileSelector = ()=>{
    let untrans = OriginUntrans;
    let html = `<option value="all_untrans">All Untranslated.js</option>`
    for(var fpath in untrans){
        var shortfpath = getShortDrivePath(fpath)
        html += `<option value="${fpath}">${shortfpath.replace(/\.js$/, '')}</option>`;
    }
    $('#untransFiles').append(html);
    $('#untransFiles').on('change', ()=>{
        do_filterByUntransFile()
    })
}
let do_filterByUntransFile = ()=>{
    unselect()
    let fpath = $('#untransFiles').val()
    if(!fpath){
        eachTr((i, tr)=>{
            tr.style.display='';
        })
        return;
    }
    let _filt = (fpath)=>{
        let json = OriginUntrans[fpath];
        eachTr((i, tr)=>{
            let key = tr.getAttribute('data-key');
            if(typeof json[key] !== 'undefined'){
                tr.style.display='';
            }else{
                tr.style.display='none';
            }
        })
    }
    if(fpath === 'all_untrans'){
        let arr = {}
        for(var pt in OriginUntrans){
            for(let key in OriginUntrans[pt]){
                arr[key]=true;
            } 
        }
        eachTr((i, tr)=>{
            let key = tr.getAttribute('data-key');
            if(typeof arr[key] !== 'undefined'){
                tr.style.display='';
            }else{
                tr.style.display='none';
            }
        })
    }else{
        _filt(fpath)
    }
}
//
let filterRemoteKeys = (json, keys) =>{
    let unknownKeys = []
    if(!keys) return json;
    keys = keys.split(/\+\,/g)
    keys = _.compact(keys)
    for(let key in json) json[key]._hidden = true;
    for(let i=0;i<keys.length;i++){
        let key = keys[i]
        if(json[key]){
            json[key]._hidden = false;
        }else{
            unknownKeys.push(key)
        }
    }
    if(unknownKeys.length > 0) alert('这些key没有找到:\n'+unknownKeys.join(','))
    return json;
}
let do_openKeysFilter = ()=>{
    do_popupWindow('Input Keys', (content)=>{
        content.html('<textarea style="width:100%;height:80%;"></textarea>')
    })
}