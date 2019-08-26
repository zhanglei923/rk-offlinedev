let showDupCheck = ()=>{    
    $.ajax({
        url: '/offlinedev/api/self_check/findDupFilesBetweenProjects/',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
            let result = response.result;
            let html = '<span class="status_positive">Ok</span>'
            if(result.dupfiles && result.dupfiles.length > 0){
                html = '<div><div>以下文件同时存在于多个工程中</div>'
                result.dupfiles.forEach((dup)=>{
                    // {root1: "E:\workspaceGerrit\_sub_separation_test\apps-ingage-web\src\main\webapp", 
                    // root2: "E:\workspaceGerrit\_sub_separation_test\xsy-static-breeze", 
                    // relativepath: "embeded\breeze\breeze.lib.min.css"}
                    html += `
                             <div class="status_negative" style="padding-left:15px;">${dup.root1}<span style="text-decoration:underline;font-weight:bolder;">/${dup.relativepath}</span></div>
                             <div class="status_negative" style="padding-left:15px;margin-bottom:7px;">${dup.root2}<span style="text-decoration:underline;font-weight:bolder;">/${dup.relativepath}</span></div>
                             `;
                })
                html += '</div>'
            }
            $('#subproject_verify').html(html)
        },
        error:function(ajaxObj,msg,err){
        }
    });
}