let showInfomation = (result)=>{
    $('#branchname').text()
    $('#webpath').html(``)

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
        <tr><td align="right">工具：</td><td><span style="color:blue;">${result.masterFolder}</span></td></tr>
        <tr><td align="right">当前工作区：</td><td><span style="color:blue;">${result.webParentPath}</span></td></tr>
        <tr><td align="right">主工程：</td><td><span class="projectname">apps-ingage-web</span>
                                                    <span style="color:blue;" class="${result.isCustomizedWebRoot?' customized ':''}">
                                                        ${result.webpath}
                                                    </span>
                                                    <span>(${result.branchName})</span>
                                                    <button class="terminal_btn" onclick="openTerminal('${result.webpath}')" ppath="${result.webpath}">&gt;_</button>
                                                </td>
        </tr>
        <tr><td align="right" valign="top">子工程：</td><td><table><tbody id="subproject_list"></tbody></table></td></tr>
        <tr><td align="right">转义ES6：</td><td>${userConfig.es6.autoTransformJs?'<span class="status_warn_fill">On</span>':'<span class="status_positive">Off</span>'}</td></tr>
        <tr><td align="right" valign="top">子工程冲突：</td><td><table><tbody><tr><td><div id="subproject_verify" class="subproject_verify"><span class="status_negative">Verifying...</span></div></td></tr></tbody></table></td></tr>
        <tr style="display:none;"><td colspan="999" style="padding-left: 14px;">&nbsp;</td></tr>
        <tr><td align="right">Http快速访问：</td><td><a target="_blank" href="${httpurl}">${httpurl}</a></td></tr>
        <tr><td align="right">Host调试用：</td><td><a target="_blank" href="${httpsurl}">${httpsurl}</a>&nbsp;(等价于gulp https命令)</td></tr>
        <tr><td align="right">自定义端口：</td><td><a target="_blank" href="https://${hostname}:444/static/sea-config.js">https://${hostname}:444/static/sea-config.js</a>&nbsp;(避免和本地https服务的443端口冲突)</td></tr>
        
    </tbody>
    </table>
    `
    $('#infomation').html(html)
    showSubProjects(result)
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
                        <td align="left">-<span class="projectname">${item.project}</span></td>
                        <td>
                        <span class="projectpath ${!item.branchname?'status_negative_fill':''}">
                            ${item.projectPath}
                        </span>
                        ${!item.def_branchname?'<span class="status_negative_fill">没有指定分支</span>':''}
                        ${!item.projectExist?'<span class="status_negative_fill">目录不存在<button>立刻下载</button></span>':''}
                        (${item.branchname?item.branchname:'<span class="status_negative_fill">不是git工程</span>'})
                        ${item.projectExist?`<button class="terminal_btn" onclick="openTerminal('${item.projectPath}')" ppath="${item.projectPath}">&gt;_</button>`:''}
                        ${branchMatch?'':`<span class="status_negative_fill">分支不对</span>`}
                        ${branchMatch?'':`<span class="status_negative_fill">期望分支为：${item.def_branchname}</span>`}
                        </td>
                    </tr>`
        })
    }
    if(!has) html = `<tr><td align="right">无</td></tr>`
    $('#subproject_list').html(html)
}