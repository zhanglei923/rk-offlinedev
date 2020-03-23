let showDupCheck = ()=>{    
    $.ajax({
        url: '/offlinedev/api/self_check/findDupFilesBetweenProjects/',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
            let result = response.result;
            let html = '<span class="status_positive">None</span>'
            if(result.dupReport && result.dupReport.has){
                let count = 0;
                let rowhtml = '';
                let pathcount = 0;
                for(let pathid in result.dupReport.dupFilesInfo){
                    count++;
                    pathcount++;
                    let owners = result.dupReport.dupFilesInfo[pathid];
                    //console.log(owners)
                    owners.forEach((ownerfolder, i)=>{
                        let zebra = pathcount%2;
                        rowhtml += `
                                <tr class="row_${zebra}">
                                    ${i===0?`<td rowspan="${owners.length}" class="">${pathcount}</td>`:''}
                                    <td align="center" style="display:none;">${i+1}</td>
                                    ${i===0?`<td rowspan="${owners.length}" class="">/${pathid}</td>`:''}
                                    <td align="right">${ownerfolder}</td>
                                </tr>`
                    });
                }
                html = `<div><div class="status_negative_fill">发现${count}个重复文件：</div><table class="subproject_dup_table"><tbody>`
                html += rowhtml;
                html += '</tbody></table></div>'
            }
            $('#subproject_verify').html(html)
        },
        error:function(ajaxObj,msg,err){
        }
    });
}