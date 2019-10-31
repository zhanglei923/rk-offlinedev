let showDupCheck = ()=>{    
    $.ajax({
        url: '/offlinedev/api/self_check/findDupFilesBetweenProjects/',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
            let result = response.result;
            let html = '<span class="status_positive">None</span>'
            if(result.dupfiles && result.dupfiles.length > 0){
                html = '<div><div class="status_negative_fill">发现重复文件：</div><table class="subproject_dup_table"><tbody>'
                result.dupfiles.forEach((dup, i)=>{
                    let zebra = i%2;
                    // {root1: "E:\workspaceGerrit\_sub_separation_test\apps-ingage-web\src\main\webapp", 
                    // root2: "E:\workspaceGerrit\_sub_separation_test\xsy-static-breeze", 
                    // relativepath: "embeded\breeze\breeze.lib.min.css"}
                    html += `
                            <tr class="row_${zebra}">
                                <td align="right">A</td>
                                <td align="right">${dup.root1}</td>
                                <td rowspan="2" class="">/${dup.relativepath}</td>
                            </tr>
                            <tr class="row_${zebra}">
                                <td align="right">B</td>
                                <td align="right">${dup.root2}</td>
                            </tr>`;
                })
                html += '</tbody></table></div>'
            }
            $('#subproject_verify').html(html)
        },
        error:function(ajaxObj,msg,err){
        }
    });
}