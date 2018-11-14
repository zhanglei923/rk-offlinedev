var do_validate = () =>{
    // $('#table >tbody>tr').each(function(i, tr){
    //     tr=$(tr)
    //     var len1 = tr.find('.cellmainlang').innerWidth()        
    //     var len2 = tr.find('.cellsublang').innerWidth()
    //     //console.log(len1, len2)
    //     tr.find('.validate_info').html(`${len1-len2}`)
    // })
    let reportHtml = '<ul class="validatereport">'
    for(var key in SuperJson){
        if(SuperJson[key].enIsDirty){
            console.warn(key)
            reportHtml += `<li>
                                <div class="dirtykey">${key}</div>
                                <div class="dirtybefore">${htmlEscape(OriginValues[key].en)}</div>
                                <div class="dirtyafter">${htmlEscape(SuperJson[key].en)}</div>
                            </li>`;
        }
    }
    reportHtml += '</ul>';
    do_popupWindow((popup)=>{
        popup.html(reportHtml)
    })
}

$(()=>{
    $('#validateBtn').click(()=>{
        do_validate();
    })
})