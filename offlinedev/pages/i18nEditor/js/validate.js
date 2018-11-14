var do_validate = () =>{
    // $('#table >tbody>tr').each(function(i, tr){
    //     tr=$(tr)
    //     var len1 = tr.find('.cellmainlang').innerWidth()        
    //     var len2 = tr.find('.cellsublang').innerWidth()
    //     //console.log(len1, len2)
    //     tr.find('.validate_info').html(`${len1-len2}`)
    // })
    unselect();
    let reportHtml = '<ul class="validatereport">'
    let count=0;
    for(var key in SuperJson){
        if(SuperJson[key].enIsDirty){
            count++;
            reportHtml += `<li>
                                <div class="dirtykey">[KEY]:${key}</div>
                                <div class="dirtycn">[CN]:${htmlEscape(OriginValues[key].cn)}</div>
                                <div class="dirtybefore">[BF]:${htmlEscape(OriginValues[key].en?OriginValues[key].en:'')}</div>
                                <div class="dirtyafter">[AF]:${htmlEscape(SuperJson[key].en)}</div>
                            </li>`;
        }
    }
    reportHtml += '</ul>';
    if(count===0){
        alert('Nothing changed.')
        return;
    }
    do_popupWindow((popup)=>{
        popup.html(reportHtml)
    })
}

$(()=>{
    $('#validateBtn').click(()=>{
        do_validate();
    })
})