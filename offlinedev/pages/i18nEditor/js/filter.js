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
            eval(`
                $('#table > tbody > tr').each(function (i, r){
                    let targetStr;
                    let key = r.getAttribute('data-key')
                    if(type === "key") targetStr = r.getAttribute('data-key')
                    if(type === "cn") targetStr = SuperJson[key].cn;
                    if(type === "en") targetStr = SuperJson[key].en;
                    if(${reg}.test(targetStr)){
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
        var shortfpath = fpath.split('source\\core\\i18n\\')[1]
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