let openTerminal = (prjpath)=>{
    window.open('./pages/terminal/xterm.html?folder='+(prjpath))
}
let updateGit = (myid, prjpath, callback)=>{
    if(typeof callback === 'undefined') callback = ()=>{};
    showGitStatus($(`[myid="${myid}"]`), ()=>{
        callback()
    })
}
let resetGit = (myid, prjpath, callback, update)=>{
    if(typeof callback === 'undefined') callback = false;
    if(typeof update === 'undefined') update = true;
    prjpath = decodeURIComponent(prjpath);
    if(!confirm(`确定重置${prjpath}工程吗？改动全丢弃啦？`)) return;
    execShell(prjpath, `git checkout . && git clean -df && git reset --hard HEAD`, ()=>{
        if(update)showGitStatus($(`[myid="${myid}"]`))
        if(callback){
            callback()
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
    }, false);
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