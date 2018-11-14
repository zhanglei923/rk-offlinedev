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