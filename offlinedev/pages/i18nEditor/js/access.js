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
    init(values[0].result, values[1].result);
});

$(()=>{
    $('#saveBtn').click(()=>{
        unselect();
        do_save();
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
        savejson.cn[key] = o.cn;// ? o.cn : '';
        savejson.en[key] = o.en ? o.en : undefined;
    }
    let promise = $.ajax({
        url: '/offlinedev/action/saveAllLanguages',
        cache: false,
        method: 'POST',
        data: {all: JSON.stringify(savejson)},
        success: function( response ) {
            console.log('response!', response)
            alert('SAVED!')
        }
    });

};