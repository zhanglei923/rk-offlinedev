let updateDeployAsDebug000 = ()=>{
    $.ajax({
        url: '/offlinedev/api/deploydebug/syncTarFile/',
        cache: false,
        method: 'POST',
        data: {
            branchnickname: 'develop'
        },
        success: function( response ) {
            let result = response.result;

            console.warn(result)
        },
        error:function(ajaxObj,msg,err){
        }
    });
}