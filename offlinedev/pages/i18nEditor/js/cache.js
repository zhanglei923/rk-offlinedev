var check_localstorage = ()=>{
    let count = sizeof_localstorage();
    if(count > 0){
        $('#cacheBtn').html(`(${count})Caches`).show()
    }
}
var do_reportCaches = () =>{
    let reportHtml = '<ul class="validatereport">'
    let localcache = get_localstorage();
    let count=0;
    reportHtml += `<li><input type="checkbox"><b>Cached:</b></li>`
    for(var key in localcache){
        count++;
        reportHtml += `<li>
                            <div class="dirtykey">[KEY]:${key}</div>
                            <div class="dirtycn">[CN]:${htmlEscape(OriginSuperJson[key].cn)}</div>
                            <div class="dirtybefore">[CURRENT]:${htmlEscape(OriginSuperJson[key].en?OriginSuperJson[key].en:'')}</div>
                            <div class="dirtyafter"><input type="checkbox">[CACHED]:${htmlEscape(localcache[key])}</div>
                        </li>`;

    }
    reportHtml += '</ul>';
    if(count===0){
        alert('Nothing changed.')
        return;
    }
    do_popupWindow('Cached', (popup)=>{
        popup.html(reportHtml)
    })
}