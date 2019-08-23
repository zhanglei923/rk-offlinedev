let showDupCheck = ()=>{    
    $.ajax({
        url: '/offlinedev/api/self_check/findDupFilesBetweenProjects/',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
            let result = response.result;
            console.log(result)
            let html = '正常'
            if(result.dupfiles && result.dupfiles.length > 0){
                html = '<div><div>以下文件同时存在于多个工程中</div>'
                result.dupfiles.forEach((dup)=>{
                    // {root1: "E:\workspaceGerrit\_sub_separation_test\apps-ingage-web\src\main\webapp", 
                    // root2: "E:\workspaceGerrit\_sub_separation_test\xsy-static-breeze", 
                    // relativepath: "embeded\breeze\breeze.lib.min.css"}
                    html += `
                             <div class="status_negative_fill" style="padding-left:10px;">${dup.relativepath}</div>
                             <div class="status_negative" style="padding-left:15px;">${dup.root1}</div>
                             <div class="status_negative" style="padding-left:15px;">${dup.root2}</div>
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