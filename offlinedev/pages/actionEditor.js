$.ajax({
            url: '/offlinedev/action/list/',
            cache: false,
            method: 'get',
            data: {},
            success: function( response ) {
              console.log(response)
              $('#branchname').text(response.result.branchName)
              $('#webpath').text(response.result.webpath)
            },
            error:function(ajaxObj,msg,err){
            }
        });