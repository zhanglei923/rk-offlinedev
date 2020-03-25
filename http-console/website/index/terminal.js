let openTerminal = (prjpath)=>{
    window.open('./pages/terminal/xterm.html?folder='+(prjpath))
}
let execShell = (prjpath, callback)=>{
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