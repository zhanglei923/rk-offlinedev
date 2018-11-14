let promise1 = $.ajax({
    url: '/offlinedev/action/loadLangFromAll',
    cache: false,
    method: 'POST',
    data: {},
    success: function( response ) {
        console.log('response!', response)            
    }
});
let promise2 = $.ajax({
    url: '/offlinedev/action/loadLanguagesFromUntranslated',
    cache: false,
    method: 'POST',
    data: {},
    success: function( response ) {
        console.log('response!', response)            
    }
});
Promise.all([promise1, promise2]).then(function(values) {
    init(values[0].result, values[1].result);
});

$(()=>{
    $('#saveBtn').click(()=>{
        do_save()
    })
})
var do_validate = ()=>{
};
var do_save = () => {    
    var savejson = {
        cn:{}, 
        en:{}
    }
    for(var key in SuperJson){
        var o = SuperJson[key];
        savejson.cn[key] = o.cn ? o.cn : '';
        savejson.en[key] = o.en ? o.en : '';
    }
    let promise = $.ajax({
        url: '/offlinedev/action/saveAllLanguages',
        cache: false,
        method: 'POST',
        data: {all: JSON.stringify(savejson)},
        success: function( response ) {
            console.log('response!', response)
        }
    });

};