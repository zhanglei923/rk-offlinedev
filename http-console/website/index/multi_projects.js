let initMultiProjectEvents = ()=>{
    $('body').on('click', 'a[act="clone_sub_projects"]', function(){
        let btn = $(this);
        if(btn.hasClass('is_working')) return;
        let project = btn.attr('project');
        let branch = btn.attr('branch');
        beWorkingBtn(btn);
        if(confirm(`确认重新下载${project}工程么，当前文件会被清除。`)){
            cloneProject(project, branch, (status)=>{
                alert('done, '+status)
                unWorkingBtn(btn);
            })
        }
    })
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