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
                let _find = ()=>{
                    eval(`
                            if(${reg}.test(targetStr)){
                                r.style.display='';
                                found = true;
                            }else{
                                r.style.display='none';
                            }                    
                    `);
                };                
                if(type === "key") {
                    targetStr = r.getAttribute('data-key')
                    _find(targetStr)
                }else{
                    if(!found){                    
                        targetStr = SuperJson[key].cn;
                        _find(targetStr)
                    }
                    if(!found){                    
                        targetStr = SuperJson[key].en;
                        _find(targetStr)
                    }

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