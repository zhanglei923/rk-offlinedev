let updateDeployAsDebug000 = ()=>{
    $.ajax({
        url: '/offlinedev/api/deploydebug/updateDeployAsDebug000/',
        cache: false,
        method: 'POST',
        data: {
        },
        success: function( response ) {
            let result = response.result;

            console.warn(result)
        },
        error:function(ajaxObj,msg,err){
        }
    });
}