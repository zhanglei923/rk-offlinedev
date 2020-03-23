let initMultiProjectEvents = ()=>{
    $('body').on('click', 'a[act="clone_sub_projects"]', function(){
        let btn = $(this);
        if(btn.hasClass('is_working')) return;
        let project = btn.attr('project');
        let branch = btn.attr('branch');
        beWorkingBtn(btn);
        if(confirm(`确认重新下载${project}工程么，当前文件会被清除。`)){
            cloneProject(project, branch, (status)=>{
                //alert('done, '+status)
                unWorkingBtn(btn);
            })
        }
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
        let branch = btn.attr('branch');
        beWorkingBtn(btn);
        cloneProject(project, branch, (status)=>{
            unWorkingBtn(btn);
            if(buttonlist.length > 0){
                _do_clone(buttonlist);
            }else{
                //done
                unWorkingBtn(masterbtn)
            }
        })
    };
    _do_clone(btns);
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