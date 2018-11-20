
let loadData = (success) =>{
    let promise1 = $.ajax({
        url: '/offlinedev/action/loadLangFromAll',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
            console.log('response!')            
        }
    });
    let promise2 = $.ajax({
        url: '/offlinedev/action/loadLanguagesFromUntranslated',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
            console.log('response!')            
        }
    });
    Promise.all([promise1, promise2]).then(function(values) {
        let all_trans = values[0].result
        let all_untrans = values[1].result
        success(all_trans, all_untrans)
    });
}

$(()=>{
    $('#saveBtn').click(()=>{
        unselect();
        do_save();
    })
})
var do_reportStatus = ()=>{
};
var do_save = () => {    
    if(!confirm('Sync to i18n files?')) return;
    var savejson = {
        cn:{}, 
        en:{}
    }
    for(var key in SuperJson){
        var o = SuperJson[key];
        savejson.cn[key] = o.cn;// ? o.cn : '';
        savejson.en[key] = o.en ? o.en : undefined;
    }
    delete savejson['cn'];//暂时不保存中文
    do_save_req(savejson, (response)=>{
        console.log('response!', response)
        clean_localstorage()
        alert('Save successfully! \nPlease return to the project directory and push to Gerrit repo!')

    })
};
var do_save_req = (savejson, callback) => {    
    if(!do_validate(savejson)){
        return;
    }
    let promise = $.ajax({
        url: '/offlinedev/action/saveAllLanguages',
        cache: false,
        method: 'POST',
        data: {all: JSON.stringify(savejson)},
        success: function( response ) {
            callback(response)
        }
    });
}
//--------------
const LS_CACHE_KEY = 'i18n_translator_cache';
check_localstorage = ()=>{
    let cache = get_localstorage()
    let count = 0;
    for(let key in cache){
        count ++;
    }
    if(count > 0){
        alert(`You have ${count} un-saved key-values! 
You can:
    1) Open your browser console and check the outputs.
    2) Click 'Status' button to see details.
    `)
        console.warn('Un-Saved:', cache)
    }
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