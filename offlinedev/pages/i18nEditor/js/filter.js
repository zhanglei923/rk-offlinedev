let do_filterByRegex = ()=>{    
    let reg = $('#filterIpt').val();
    if(reg){
        try{
            eval(`
                $('#table > tbody > tr').each(function (i, r){
                    if(${reg}.test(r.getAttribute('data-key'))){
                        r.style.display='';
                    }else{
                        r.style.display='none';
                    }
                })
            `)
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
let init_untransFileSelector = ()=>{
    let untrans = OriginUntrans;
    let html = `<option value="all_untrans">All Untranslated.js</option>`
    for(var fpath in untrans){
        var shortfpath = fpath.split('webapp')[1]
        html += `<option value="${fpath}">${shortfpath}</option>`;
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