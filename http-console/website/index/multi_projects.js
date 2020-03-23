let initMultiProjectEvents = ()=>{
    $('body').on('click', 'a[act="clone_sub_projects"]', function(){
        let btn = $(this);
        if(btn.hasClass('is_working')) return;
        let project = btn.attr('project');
        let branch = btn.attr('def_branchname');
        if(!confirm(`确认重新下载${project}工程么，当前文件会被清除。`))return;
        beWorkingBtn(btn);
        cloneProject(project, branch, (status)=>{
            //alert('done, '+status)
            unWorkingBtn(btn);
            showGitStatus($(`tr[is_subprj_row][project="${project}"][def_branchname="${branch}"]`));
        })
    })
}
let cloneAllSubProjects = (masterbtn)=>{
    if(!confirm(`确认重新下载全部工程么，当前工程会被清除。`)) return;
    masterbtn = $(masterbtn);
    beWorkingBtn(masterbtn);
    let btns = [];
    $('a[act="clone_sub_projects"]').each(function(){
        let btn = $(this)
        beWorkingBtn(btn);
        btns.push(btn);
    });
    let _do_clone = (buttonlist)=>{
        let btn = buttonlist.shift();
        let project = btn.attr('project');
        let branch = btn.attr('def_branchname');
        beWorkingBtn(btn);
        cloneProject(project, branch, (status)=>{
            unWorkingBtn(btn);
            if(buttonlist.length > 0){
                _do_clone(buttonlist);
            }else{
                //finally Done
                unWorkingBtn(masterbtn)
                reloadSubProjectInfo()
            }
        })
    };
    _do_clone(btns);
}
let reloadSubProjectInfo = ()=>{
    loadWebProjectData(function( result ) {    
        showSubProjects(result);
        showGitStatus($('#subproject_list'));
    });
}
let cloneProject = (project, branch, callback)=>{
    $.ajax({
        url: '/offlinedev/api/cloneProject/',
        cache: false,
        method: 'POST',
        data: {
            project,
            branch
        },
        success: function( response ) {
            //{"status":0,"result":{}}
            if(response.status === 0){
                callback(true);
            }else{
                callback(false);
            }
        }
    });
};