let openTerminal = (prjpath)=>{
    window.open('./pages/terminal/xterm.html?folder='+(prjpath))
}
let resetGit = (myid, prjpath, callback)=>{
    if(typeof callback === 'undefined') callback = false;
    prjpath = decodeURIComponent(prjpath);
    if(!confirm(`确定重置${prjpath}工程吗？改动全丢弃啦？`)) return;
    execShell(prjpath, `git checkout . && git clean -df && git reset --hard HEAD`, ()=>{
        if(callback){
            callback()
        }else{
            showGitStatus($(`[myid="${myid}"]`))
        }
    })
}
let resetAndPullGit = (myid, prjpath, callback)=>{
    if(typeof callback === 'undefined') callback = ()=>{};
    prjpath = decodeURIComponent(prjpath);
    resetGit(myid, prjpath, ()=>{
        execShell(prjpath, `git pull`, ()=>{
            showGitStatus($(`[myid="${myid}"]`))
            callback()
        })
    })
}
let execShell = (prjpath, inputline, callback)=>{
    if(typeof callback === 'undefined') callback = ()=>{};
    $.ajax({
        url: '/offlinedev/api/terminal/exec',
        cache: false,
        method: 'POST',
        data: {
            inputline: encodeURIComponent(inputline), 
            prjpath
        },
        success: function( response ) {
          let result = response.result;
          if(result){
            result = decodeURIComponent(result);
            console.log(result);
            callback(result);
          }
        },
        error:function(ajaxObj,msg,err){
            callback(false)
        }
    });
}