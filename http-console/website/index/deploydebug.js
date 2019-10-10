let updateDeployAsDebug000 = ()=>{
    let branchname = prompt('请输入想调试的分支名，offlinedev会去144上下载到本地：')
    do_updateDeployAsDebug000(branchname)
}
let do_updateDeployAsDebug000 = (branchname)=>{
    branchname = _.trim(branchname)
    $.ajax({
        url: '/offlinedev/api/deploydebug/syncTarFile/',
        cache: false,
        method: 'POST',
        data: {
            branchnickname: branchname.replace(/\//g, '~~')
        },
        success: function( response ) {
            let result = response.result;

            console.warn(result)
        },
        error:function(ajaxObj,msg,err){
        }
    });
}