let showInfomation = (result)=>{
    $('#branchname').text()
    $('#webpath').html(``)

    let adminWebBranchMatch = false;
    if(result.adminInfo){
        adminWebBranchMatch = (result.adminInfo.branch === result.branchName);
    }
    let hostname = window.location.hostname;
    let userConfig = result.userConfig;
    console.log(userConfig)
    let httpurl = `http://${hostname}:${userConfig.http.port}/static/sea-config.js`;
    let httpsurl = `https://${hostname}:${userConfig.https.port}/static/sea-config.js`;
    let html = `<table border=0 class="infotable">
    <thead class="table_title">
        <tr>
            <th align="left" colspan="999">状态</th>
        </tr>
    </thead>
    <tbody>
        <tr><td align="right">工具：</td>
        <td>
            <span>${result.masterFolder}</span>
            <span git_project_info="true" git_path="${encodeURIComponent(result.masterFolder)}" class="status_warn"></span>
        </td></tr>
        <tr><td align="right">当前工作区：</td><td><span>${result.webParentPath}</span></td></tr>
        <tr><td align="right">主工程：</td><td><span class="projectname"><a target="_blank" href="http://gerrit.ingageapp.com/#/admin/projects/${"apps-ingage-web"}">${"apps-ingage-web"}</a></span>
                                                    <span style="margin-left:18px;" class="status_positive ${result.isCustomizedWebRoot?' customized ':''}">
                                                        ${result.webpath}
                                                    </span>
                                                    <span git_project_info="true" git_path="${encodeURIComponent(result.webpath)}" class="status_warn"></span>
                                                </td>
        </tr>
        <tr><td align="right" valign="top">子工程：</td><td><table><tbody id="subproject_list"></tbody></table></td></tr>
        <tr><td align="right">转义ES6：</td><td>${userConfig.es6.autoTransformJs?'<span class="status_warn_fill">On</span>':'<span class="status_positive">Off</span>'}</td></tr>
        <tr><td align="right" valign="top">子工程冲突：</td><td><table><tbody><tr><td><div id="subproject_verify" class="subproject_verify"><span class="status_warn">Verifying...</span></div></td></tr></tbody></table></td></tr>
        <tr>
            <td align="right" valign="top">Deploy目录：</td>
            <td>
                <span class="projectpath status_positive">${userConfig.deployStaticPath_val}</span>
                <span class="status_positive_fill">${userConfig.branchnameOfDeployDebug}</span>
                ${userConfig.deployStaticPath_val_exist?'<span class="status_positive">Ok</span>':'<span class="status_negative_fill">not-found</span>'}
                <span id="info_updateDeployAsDebug000" class="status_warn" style="display:none;"></span>
                <a id="btn_updateDeployAsDebug000" style="display:auto;" href="javascript:void(0)" onclick="updateDeployAsDebug000()">change</a>
            </td>
        </tr>
        <tr><td align="right" valign="top">Admin工程：</td>${result.adminInfo?`
        <td>
            <span class="projectpath status_positive">${result.adminInfo.adminFolder}</span>
            <span git_project_info="true" git_path="${encodeURIComponent(result.adminInfo.adminFolder)}" class="status_warn"></span>
            ${adminWebBranchMatch?'<span class="status_positive">=web':'<span class="status_warn">!=web'}</span>
        </td>
        `:`<td valign="top" colspan="999" class="status_warn">Not-Found</td>`}
        </tr>
        <tr style="display:none;"><td colspan="999" style="padding-left: 14px;">&nbsp;</td></tr>
        <tr><td align="right">Http快速访问：</td><td><a target="_blank" href="${httpurl}">${httpurl}</a></td></tr>
        <tr><td align="right">Host调试用：</td><td><a target="_blank" href="${httpsurl}">${httpsurl}</a>&nbsp;(等价于gulp https命令)</td></tr>
        <tr><td align="right">自定义端口：</td><td><a target="_blank" href="https://${hostname}:444/static/sea-config.js">https://${hostname}:444/static/sea-config.js</a>&nbsp;(避免和本地https服务的443端口冲突)</td></tr>
        
    </tbody>
    </table>
    `
    $('#infomation').html(html)
    showGitStatus();
    showSubProjects(result)
}
let showGitStatus = ()=>{
    $('span[git_project_info="true"]').each((i, span)=>{
        span = $(span);
        span.html('Loading...')
        let encodedpath = span.attr('git_path')
        let gitpath = decodeURIComponent(encodedpath)
        //console.log(span, i)
        $.ajax({
            url: '/offlinedev/api/getGitInfo/',
            cache: false,
            method: 'POST',
            data: {projectpath:encodeURIComponent(gitpath)},
            success: function( response ) {
                console.log(response.result)
                let result = response.result;
                let status = result.status;
                let isClean = (status.ahead===0&&status.dirty===0&&status.stashes===0&&status.untracked===0)
                let txt = 'git-dirty'
                if(status.ahead===1) txt += ', git-need-sync'
                let isDirty = !isClean;
                let html = `<span class="${isDirty?'status_warn_fill':'status_positive_fill'}">${status.branch}</span>
                            ${isDirty?`<span class="status_warn">${txt}</span>`:'<span class="status_positive">git-clean</span>'}
                            <button class="terminal_btn" onclick="openTerminal('${encodeURIComponent(gitpath)}')" ppath="${gitpath}">&gt;_</button>
                            `;
                span.html(html);   
                span.removeClass('status_warn') 
            },
            error:function(ajaxObj,msg,err){
                span.html(`<span class="status_negative_fill">Load-Git-Info-Failed!${err}</span>`)
            }
        });
                                            
    })
}
let showSubProjects = (result)=>{
    let has = false;
    let html = ``
    if(result.filters && result.filters.length > 0){     
        has = true;   
        result.filters.forEach((item)=>{
            html += `<tr>
                        <td align="left">路径<span class="url_pattern">${item.url_pattern}</span></td>
                        <td><span class="projectpath">${item.localpath}</span></td>
                    </tr>`
        })
    }
    if(result.projects && result.projects.length > 0){   
        has = true;   
        result.projects.forEach((item)=>{
            let branchMatch = (item.def_branchname === item.branchname)
            html += `<tr>
                        <td align="left">
                            -<span class="projectname ">
                                <a target="_blank" class="${!item.projectExist?'status_negative':''}" href="http://gerrit.ingageapp.com/#/admin/projects/${item.project}">${item.project}</a>
                            </span>
                        </td>
                        <td>
                        <span class="projectpath ${!item.branchname?'status_negative':'status_positive'}" style="${!item.branchname?'text-decoration:line-through;':''}">
                            ${item.projectPath}
                        </span>
                        </td>
                        <td>
                        ${item.def_branchname?`<span class="status_positive_fill">${item.def_branchname}</span>`:'<span class="status_negative_fill">没有指定分支</span>'}
                        ${!item.projectExist?'<button class="clone_project_btn" style="display:none;">立刻下载</button>&nbsp;<span class="status_negative_fill">目录不存在</span>':''}
                        ${item.branchname?`${branchMatch?`<span class="status_positive_fill">=${item.branchname}</span>`:`<span class="status_negative_fill">!=${item.branchname}</span>`}&nbsp;<span id="gitdirty_${item.project}" class="status_warn">checking..</span>`:'<span class="status_negative_fill">不是git工程</span>'}
                        ${branchMatch?'':`<span class="status_negative_fill">期望分支为：${item.def_branchname}</span>`}
                        ${item.projectExist?`<button class="terminal_btn" onclick="openTerminal('${encodeURIComponent(item.projectPath)}')" ppath="${item.projectPath}">&gt;_</button>`:''}
                        </td>
                    </tr>`
        })
        showSubProjectGitStatus(result.projects)
    }
    if(!has) html = `<tr><td align="right">无</td></tr>`
    $('#subproject_list').html(html)
}
let showSubProjectGitStatus = (projects)=>{
    projects.forEach((item)=>{
        $.ajax({
            url: '/offlinedev/api/self_check/isGitDirty/',
            cache: false,
            method: 'POST',
            data: {
                prjpath: encodeURIComponent(item.projectPath),
                prjname: item.project
            },
            success: function( response ) {
                let result = response.result;
                // {"status":0,"result":{"dirty":false,"prjname":"xsy-static-breeze"}}
                let div = $('#gitdirty_' + result.prjname);
                if(result.dirty !== null){
                    div.addClass(result.dirty?'status_warn_fill':'status_positive_fill')
                    div.html(result.dirty?'有未提交代码':'git干净')
                    result.dirty ? div.show() : div.hide()
                }else{                    
                    div.hide()
                }
                console.warn(result)
            },
            error:function(ajaxObj,msg,err){
            }
        });
    });
}