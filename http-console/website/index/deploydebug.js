let updateDeployAsDebug000 = ()=>{
    let branchname = prompt('请输入想调试的分支名，offlinedev会去144上下载到本地：')
    do_updateDeployAsDebug000(branchname)
}
let do_updateDeployAsDebug000 = (branchname)=>{
    branchname = _.trim(branchname)
    if(!branchname) {
        alert('名称不合法')
        return;
    }
    $('#info_updateDeployAsDebug000').show();
    $('#info_updateDeployAsDebug000').text('syncing...');
    $('#btn_updateDeployAsDebug000').hide();
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
            alert('updateDeployAsDebug000 failed!')
        },
        complete:function(ajaxObj,msg,err){
            $('#info_updateDeployAsDebug000').hide();
            $('#btn_updateDeployAsDebug000').show();

        }
    });
}