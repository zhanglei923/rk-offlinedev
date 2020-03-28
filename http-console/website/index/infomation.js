let showInfomation = (result)=>{
    $('#branchname').text()
    $('#webpath').html(``)

    let adminWebBranchMatch = false;
    if(result.adminInfo){
        adminWebBranchMatch = (result.adminInfo.branch === result.branchName);
    }
    let hostname = window.location.hostname;
    let userConfig = result.userConfig;
    let sysStatus = result.sysStatus;
    //let cacheStatus = result.cacheStatus;
    console.log(userConfig)
    let gerritUserName;
    if(userConfig.$userAccounts){
        let acc = userConfig.$userAccounts;
        if(acc['gerrit.username']){
            gerritUserName = acc['gerrit.username'];
            $('#gerrit_username').text(' ' + gerritUserName)
        }        
    }
    let httpurl = `http://${hostname}:${userConfig.http.port}/static/sea-config.js`;
    let httpsurl = `https://${hostname}:${userConfig.https.port}/static/sea-config.js`;
    let html = `<table border=0 class="offlineinfo">
    <thead class="table_title" style="display:none;">
        <tr>
            <th align="left" colspan="999">状态：</th>
        </tr>
    </thead>
    <tbody>
        <tr><td align="right">账号：</td>
        <td>
            ${gerritUserName?`<span>${gerritUserName}</span>`:
                            '<span class="status_warn_fill" title="">匿名</span><span class="comment">请在/user-accounts.cfg文件里填写gerrit账号名。</span>'}
        </td></tr>
        <tr><td align="right">工具地址：</td>
        <td>
            <span>${result.masterFolder}</span>
            <span git_project_info="true" git_path="${encodeURIComponent(result.masterFolder)}"></span>
        </td></tr>
        <tr><td align="right" valign="top">配置：</td><td>
            <span title="更改user-config里的: debug.mode" class="status_group">
            <span style="color:#d1d2d46e;">[</span><span class="${userConfig.debug && userConfig.debug.mode === 'source'?'status_is_on underline':'status_is_off '}">${"source"}</span><span style="color:#7c7e82;">/</span><span
             class="${userConfig.debug && userConfig.debug.mode === 'concat'?'':'status_is_off '}" style="color:#00feff;"
             >${"concat"}${
                 (userConfig.debug.mode === 'concat' && userConfig.debug.concat.filesToExclude && userConfig.debug.concat.filesToExclude.length>0)?
                 '<span class="status_warn_fill">'+userConfig.debug.concat.filesToExclude.length+' excludes</span>':''
                }</span><span style="color:#d1d2d46e;">]</span>
            </span>
            <span title="更改user-config里的: httpConfig.http2" class="${userConfig.httpConfig && userConfig.httpConfig.http2?'status_is_on status_is_positive':'status_is_off status_is_neutral'}">h2</span>
            <span title="更改user-config里的: httpConfig.gzip" class="${userConfig.httpConfig && userConfig.httpConfig.gzip?'status_is_on status_is_positive':'status_is_off status_is_negative'}">gzip</span>
            <span title="更改user-config里的: debug.autoCacheStatic" class="${userConfig.debug && userConfig.debug.autoCacheStatic?'status_is_on status_is_positive':'status_is_off status_is_negative'}">Cache L1</span>
            <span title="更改user-config里的: debug.autoCacheStaticLevel2" class="${userConfig.debug && userConfig.debug.autoCacheStaticLevel2?'status_is_on status_is_positive':'status_is_off status_is_negative'}">L2</span>
            <span title="更改user-config里的: debug.concatStaticTplRequests" class="${userConfig.debug && userConfig.debug.concatStaticTplRequests?'status_is_on status_is_neutral':'status_is_off status_is_neutral'}">+Tpl</span>
            <span title="更改user-config里的: debug.concatStaticJsRequests" class="${userConfig.debug && userConfig.debug.concatStaticJsRequests?'status_is_on status_is_neutral':'status_is_off status_is_neutral'}">+Js</span>
            <span title="更改user-config里的: debug.concatStaticCssRequests" class="${userConfig.debug && userConfig.debug.concatStaticCssRequests?'status_is_on status_is_neutral':'status_is_off status_is_neutral'}">+Css</span>
            <span title="更改user-config里的: es6.autoTransformJs" class="${userConfig.es6.autoTransformJs?'status_is_on status_is_warn':'status_is_off status_is_neutral'}">ES6</span>
            <span title="更改user-config里的: es6.autoTransformJs & debug.mode" class="${userConfig.es6.autoTransformJs && userConfig.debug.mode!=='source'?'status_negative_fill':'status_invisible'}">ES6 Low Perf!</span>
            <span title="更改user-config里的: debug.detect404RequireUrls" class="${userConfig.debug && userConfig.debug.detect404RequireUrls?'status_is_on status_is_warn':'status_is_off status_is_neutral'}">404</span>
        </td></tr>
        <tr><td align="right" valign="top">状态：</td><td>
            <span>Heap:&nbsp;${sysStatus.meminfo.heapUsedMB}MB&nbsp;/&nbsp;${sysStatus.meminfo.heapTotalMB}MB&nbsp;=&nbsp;${sysStatus.meminfo.usedtotalPersentage}%</span>
            <span>,&nbsp;rss:&nbsp;${sysStatus.meminfo.rssMB}MB</span>
            <br>
            <span id="cacheinfo">Loading cache status...</span>
        </td></tr>
        <tr style="display:none;"><td align="right">当前工作区：</td><td><span>${result.webParentPath}</span></td></tr>
        </tbody>
        </table>

        <table border=0 class="infotable">
    <thead class="table_title">
        <tr>
            <th align="left" colspan="999">Web开发：</th>
        </tr>
    </thead>
    <tbody>
        <tr><td align="right">Web工程：</td><td>
                <span style="display:none;" class="projectname">
                    <a target="_blank" href="http://ger${'rit.ingage'}app.com/#/admin/projects/${"apps-ingage-web"}">${"apps-ingage-web"}</a>
                </span>
                <span style="margin-left:0px;" class="status_positive ${result.isCustomizedWebRoot?' customized ':''}">
                    ${highlightProjectPath(result.webpath, "apps-ingage-web")}
                </span>
                <span git_project_info="true" project="apps-ingage-web" git_path="${encodeURIComponent(result.webpath)}"></span>
            </td>
        </tr>
        <tr><td align="right" valign="top">&nbsp;</td><td>
            <button id="deepCheck_web_project" class="status_off_fill" onclick="javascript:deepCheck_web_project();">Web工程全面自检</button>
        </td></tr>
        <tr><td align="right" valign="top">子工程：</td><td><table><tbody id="subproject_list"></tbody></table></td></tr>
        <tr><td align="right" valign="top">子冲突：</td><td><table><tbody><tr><td><div id="subproject_verify" class="subproject_verify"><span class="status_loading">Verifying...</span></div></td></tr></tbody></table></td></tr>

        <tr style="display:none;"><td colspan="999" style="padding-left: 14px;">&nbsp;</td></tr>
        <tr><td align="right"><span class="comment">URLs：</span></td><td>
                    <a class="url" target="_blank" href="${httpurl}">${httpurl}</a>
                    <span class="comment">//默认的http端口是666<span>
                </td></tr>
        <tr><td align="right"></td><td>
                    <a class="url" target="_blank" href="${httpsurl}">${httpsurl}</a>
                    <span class="comment">//这是https路径，用来替代gulp https命令<span>
                </td></tr>
        <tr><td align="right"></td><td>
                    <a class="url" target="_blank" href="https://${hostname}:444/static/sea-config.js">https://${hostname}:444/static/sea-config.js</a>
                    <span class="comment">//如果https的443端口被占用了，可以访问444这个替代端口<span>
                </td></tr>
        
    </tbody>
    </table>

    <table border=0 class="infotable">
    <thead class="table_title">
        <tr>
            <th align="left" colspan="999">Admin和打包调试：</th>
        </tr>
    </thead>
    <tbody>
        <tr><td align="right" valign="top">Admin工程：</td>${result.adminInfo?`
        <td>
            <span class="projectpath status_positive">${highlightProjectPath(result.adminInfo.adminFolder, 'apps-ingage-admin')}</span>
            <span git_project_info="true" project="apps-ingage-admin" git_path="${encodeURIComponent(result.adminInfo.adminFolder)}"></span>
            ${adminWebBranchMatch?'<span class="status_positive">=web':'<span class="status_warn">!=web'}</span>
        </td>
        `:`<td valign="top" colspan="999" class="">Not-Found</td>`}
        </tr>
        <tr><td align="right"><span class="comment">URLs：</span></td><td>
                <a class="url" target="_blank" href="${'http://localhost:666/admin/js/core/global.js'}">${'http://localhost:666/admin/js/core/global.js'}</a>
                <span class="comment">//如果也下载了admin工程，也可以访问admin工程的资源<span>
            </td></tr>
        <tr><td align="right"></td><td>
                    <a class="url" target="_blank" href="${'https://localhost/admin/js/core/global.js'}">${'https://localhost/admin/js/core/global.js'}</a>
                    <span class="comment">//admin资源的https路径<span>
                </td></tr>
        <tr><td align="right"></td><td>
                    <a class="url" target="_blank" href="${'https://localhost:444/admin/js/core/global.js'}">${'https://localhost:444/admin/js/core/global.js'}</a>
                    <span class="comment">//如果https的443端口被占用了，可以访问444这个替代端口<span>
                </td></tr>
        
        <tr>
            <td align="right" valign="top">调试Deploy：</td>
            <td><span class="${userConfig.webProjectPathOfDeploy?'projectpath status_positive':''}">${userConfig.webProjectPathOfDeploy?userConfig.webProjectPathOfDeploy:'未定义'}</span></td>
        </tr>
        <tr><td align="right"><span class="comment">URLs：</span></td><td>
                <a class="url" target="_blank" href="${'https://localhost/static/hash.js'}">${'https://localhost/static/hash.js'}</a><span class="comment">//把线上rs资源通过hosts映射到这个路径</span>
           </td></tr>
        <tr><td align="right"></td><td colspan="999"><hr></td></tr>
        <tr>
            <td align="right" valign="top">实验Deploy<br>(不成熟)：</td>
            <td>
                <span id="deploydebug000abtn" style="${!userConfig.deployStaticPath_val_exist?'':'display:none;'}">
                    <span>Not-Found</span> 
                    <a href="#" onclick="javascript:$('#deploydebug000console').show();$('#deploydebug000abtn').hide()">Download</a>
                </span>
                <span id="deploydebug000console" ${userConfig.deployStaticPath_val_exist?'':'style="display:none;" class="status_negative"'}>
                    <span class="projectpath status_positive">${userConfig.deployStaticPath_val}</span>
                    <br>
                    期望调试的打包分支是：${userConfig.deployStaticPath_val_exist?`<span class="">"${userConfig.branchnameOfDeployDebug}"</span>`:''}
                    ${userConfig.deployStaticPath_val_exist?'':'<span class="status_negative_fill">UNKNOWN</span>'}
                    <span id="info_updateDeployAsDebug000" class="status_loading" style="display:none;"></span>
                    &nbsp;<button id="btn_updateDeployAsDebug000" style="display:auto;" href="javascript:void(0)" onclick="updateDeployAsDebug000()">从144上下载tar包到本地</button>
                </span>
            </td>
        </tr>
        <tr><td align="right"><span class="comment">URLs：</span></td><td>
                <a class="url" target="_blank" href="${'http://localhost:666/static/hash.debug000.js'}">${'http://localhost:666/static/hash.debug000.js'}</a>
                <span class="comment">//这个用来调试打包后的资源<span>
            </td></tr>
    </tbody>
    </table>
    `;
    $('#infomation').removeClass(`loading`)
    $('#infomation').html(html)
    showSubProjects(result)
    showGitStatus();
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
        html += `<tr>
                    <td style="display:none;">工程名</td>
                    <td>地址</td>
                    <td><a class="" href="javascript:void(0)" onclick="javascript:cloneAllSubProjects(this);">全下载</a></td>
                    <td></td>
                </tr>`;
        result.projects.forEach((item)=>{
            let branchMatch = (item.def_branchname === item.branchname)
            html += `<tr is_subprj_row="true" project="${item.project}" def_branchname="${item.def_branchname}">
                        <td style="display:none;" align="left">
                            -<span class="projectname ">
                                <a target="_blank" class="${!item.projectExist?'status_negative':''}" href="http://gerrit.ingageapp.com/#/admin/projects/${item.project}">${item.project}</a>
                            </span>
                        </td>
                        <td>
                            <span class="projectpath ${!item.branchname?'status_negative':'status_positive'}" style="${!item.branchname?'text-decoration:line-through;':''}">
                                ${highlightProjectPath(item.projectPath, item.project)}
                            </span>
                        </td>
                        <td>
                            <a class="" act="clone_sub_projects" project="${item.project}" def_branchname="${item.def_branchname}" href="javascript:void(0)">重新下载</a>
                        </td>
                        <td>
                            <span git_project_info="true" project="${item.project}" git_path="${encodeURIComponent(item.projectPath)}"></span>
                            ${item.def_branchname?``:'<span class="status_negative_fill">没有指定分支</span>'}
                            ${!item.projectExist?'<button class="clone_project_btn" style="display:none;">立刻下载</button>&nbsp;<span class="status_negative_fill">目录不存在</span>':''}
                            ${item.branchname?
                                `${branchMatch?
                                    `<span class="status_positive">as-required</span>`:
                                    `<span class="status_negative_fill">!=${item.branchname}</span>`}`:
                                '<span class="status_negative_fill">不是git工程</span>'}
                            ${branchMatch?'':`<span class="status_negative_fill">期望分支为：${item.def_branchname}</span>`}
                        </td>
                    </tr>`
        })
        //showSubProjectGitStatus(result.projects)
    }
    if(!has) html = `<tr><td align="right">无</td></tr>`
    $('#subproject_list').html(html)
};
let highlightProjectPath = (prjpath, prjname)=>{
    let reg = new RegExp(prjname);
    prjpath = prjpath.replace(reg, `<span><a class="prjname_in_path" href="http://ger${'rit.ingage'}app.com/#/admin/projects/${prjname}" target="_blank">${prjname}</a></span>`)
    return prjpath;
};
let showGitStatus = (elem, callback)=>{
    if(typeof callback === 'undefined') callback = ()=>{};
    let loadingCss = 'status_loading';
    let targetelem;
    if(typeof elem === 'undefined'){
        targetelem = $('span[git_project_info="true"]')
    }else if(elem.attr('git_project_info')){
        targetelem = elem;
    }else{
        targetelem = elem.find('span[git_project_info="true"]')
    }
    targetelem.each((i, span)=>{
        span = $(span);
        let myid = span.attr('myid')
        if(!myid) {
            myid = 'myid'+Math.random()
            span.attr('myid', myid)
        }
        span.html('[?]')
        let time = Math.random()*10;
        while(time > 5){
            time = Math.random()*10;
        }
        setTimeout(()=>{
            span.addClass(loadingCss)
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
                    span.removeClass(loadingCss) 
                    if(!status) {
                        span.html(`<span class="status_negative_fill">Not Found!${''}</span>`)
                        return;
                    };
                    let isClean = status && (status.ahead===0&&status.dirty===0&&status.stashes===0&&status.untracked===0)
                    let txt = 'modified';
                    if(status.ahead===1) txt += ', need-pull';
                    let isDirty = !isClean;
                    let isSSHClone = !!status.isSSHClone;
                    if(gitpath.indexOf('offlinedev')>=0) isSSHClone = true;//忽略，只检测gerrit的工程
                    let branchHref = status.branch ? `<a href="javascript:void(0)" act="btn_change_branch" encodedpath="${encodedpath}">${status.branch}</a>`:'';
                    let html = `<span class="${isDirty?'status_positive':'status_positive'}">(${status.branch?branchHref:'?'})</span>
                                ${isSSHClone?`<span class="status_positive"></span>`:'<span class="status_warn">anonymous-cloned</span>'}
                                ${isDirty?`<span class="status_warn">${txt}</span>`:'<span class="status_positive"></span>'}
                                <button class="terminal_btn" onclick="openTerminal('${encodeURIComponent(gitpath)}')" ppath="${gitpath}">&gt;_</button>
                                <button class="gitreset_btn" onclick="beWorkingBtn(this);updateGit('${myid}','${encodeURIComponent(gitpath)}', ()=>{unWorkingBtn(this);})" ppath="${gitpath}">refresh</button>
                                <button class="gitreset_btn" onclick="beWorkingBtn(this);resetGit('${myid}','${encodeURIComponent(gitpath)}', ()=>{unWorkingBtn(this);})" ppath="${gitpath}">Reset</button>
                                <button class="gitreset_btn" onclick="beWorkingBtn(this);resetAndPullGit('${myid}','${encodeURIComponent(gitpath)}', ()=>{unWorkingBtn(this);})" ppath="${gitpath}">&Pull</button>
                                `;
                    span.html(html);   
                    span.removeClass(loadingCss) 
                    callback()
                },
                error:function(ajaxObj,msg,err){
                    span.html(`<span class="status_negative_fill">Load-Git-Info-Failed!${err}</span>`)
                    callback()
                }
            });
        }, time*200)                         
    })
}