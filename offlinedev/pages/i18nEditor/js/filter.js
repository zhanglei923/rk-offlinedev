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
    let html = ``
    for(var fpath in untrans){
        var shortfpath = fpath.split('webapp')[1]
        html += `<option value="${fpath}">${shortfpath}</option>`;
    }
    $('#untransFiles').append(html);
}
let do_filterByUntransFile = ()=>{
    let fpath = $('#untransFiles').val()
    if(!fpath){
        eachTr((i, tr)=>{
            tr.style.display='';
        })
        return;
    }
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