let showInfomation = (result)=>{
    $('#branchname').text()
    $('#webpath').html(``)


    let userConfig = result.userConfig;
    console.log(userConfig)
    let httpurl = `http://localhost:${userConfig.http.port}/static/sea-config.js`;
    let httpsurl = `https://localhost:${userConfig.https.port}/static/sea-config.js`;
    let html = `<table border=0>
    <thead style="background-color: #eaeaea;">
        <tr>
            <th align="left" colspan="999">状态</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>分支：</td><td>${result.branchName}</td></tr>
        <tr><td>offline目录：</td><td>${result.masterFolder}</td></tr>
        <tr><td>web目录：</td><td class="${result.isCustomizedWebRoot?'user-config':''}">${result.webpath}&nbsp;${result.isCustomizedWebRoot?'(自定义)':''}</td></tr>
        <tr><td>转义ES6：</td><td>${userConfig.es6.autoTransformJs?'<span class="status_positive">Yes</span>':'<span class="status_negative">No</span>'}</td></tr>
        <tr><td>静态资源：</td><td><a target="_blank" href="${httpurl}">${httpurl}</a></td></tr>
        <tr><td>静态资源：</td><td><a target="_blank" href="${httpsurl}">${httpsurl}</a></td></tr>
    </tbody>
    </table>
    `
    $('#infomation').html(html)
}