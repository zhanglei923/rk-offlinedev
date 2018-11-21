const LS_CACHE_KEY = 'i18n_translator_cache';
var check_localstorage = ()=>{
    let count = sizeof_localstorage();
    if(count > 0){
        $('#cacheBtn').html(`(${count})Caches`).show()
        //do_reportCaches()
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
var delkey_localstorage = (key) =>{
    let cache = get_localstorage();
    delete cache[key];
    window.localStorage.setItem(LS_CACHE_KEY, JSON.stringify(cache))
}
var do_reportCaches = () =>{
    let reportHtml = '<ul class="validatereport">'
    let localcache = get_localstorage();
    let count=0;
    reportHtml += `<li><input type="checkbox"><b>Cached:</b></li>`
    for(var key in localcache){
        if(OriginSuperJson[key].en !== localcache[key]){
            count++;
            reportHtml += `<li data-key="${key}">
                                <div class="dirtykey"><input type="checkbox">[KEY]:${key}</div>
                                <div class="dirtycn">[CN]:&quot;${htmlEscape(OriginSuperJson[key].cn)}&quot;</div>
                                <div class="dirtybefore">[CURRENT]:&quot;${htmlEscape(OriginSuperJson[key].en?OriginSuperJson[key].en:'')}&quot;</div>
                                <div class="dirtyafter">[CACHED ]:&quot;${htmlEscape(localcache[key])}&quot;
                                                        <button class="btn" title="Apply into Editing Data" onclick="apply_fromcache(this);">
                                                            Apply
                                                        </button>
                                                        <button class="btn danger" title="Remove from cache" onclick="remove_fromcache(this);">
                                                            Del
                                                        </button>
                                </div>
                            </li>`;
        }
    }
    reportHtml += '</ul>';
    do_popupWindow('Cached', (popup)=>{
        popup.html(reportHtml)
        $('#popup >.footer').html(`
        <button class="btn danger" onclick="if(confirm('Sure?')){clean_localstorage();close_popupWindow();$('#cacheBtn').hide();}">Clean All Caches</button>
        <button class="btn" onclick="close_popupWindow();">Close</button>
        `)
    })
}
var apply_fromcache = function(btn){
    btn = $(btn)
    let localcache = get_localstorage();
    let li =  btn.closest('li');
    let key = li.data('key');
    let val = localcache[key];
    updateValue(key, 'en', val)
    btn.off().replaceWith('<span>used.</span>');
}
var remove_fromcache = function(btn){
    btn = $(btn)
    let li =  btn.closest('li');
    let key = li.data('key');
    delkey_localstorage(key);
    li.off().html('<span>removed.</span>');
}