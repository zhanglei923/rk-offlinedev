const LS_CACHE_KEY = 'i18n_translator_cache';
var check_localstorage = ()=>{
    let count = sizeof_localstorage();
    if(count > 0){
        $('#cacheBtn').html(`(${count})Caches`).show()
    }
}
//--------------
var sizeof_localstorage = ()=>{
    let cache = get_localstorage()
    let count = 0;
    for(let key in cache){
        count ++;
    }
    return count > 0 ? count : false;
}
var clean_localstorage = () =>{
    window.localStorage.removeItem(LS_CACHE_KEY)
}
var get_localstorage = (key, val) =>{
    let cache = window.localStorage.getItem(LS_CACHE_KEY)
    if(!cache) {
        cache = {};
    }else{
        cache = JSON.parse(cache)
    }
    return cache;
}
var saveto_localstorage = (key, val) =>{
    let cache = get_localstorage();
    cache[key] = val;
    window.localStorage.setItem(LS_CACHE_KEY, JSON.stringify(cache))
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