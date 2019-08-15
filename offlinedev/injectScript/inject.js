console.warn('目前是离线开发状态！')
window.onload=function(){
    $('#offlinedev_tray').draggable();
    window.___timer2 = window.setInterval(function(){
        var prefix = '【离线】'
        if(window.document.title.indexOf(prefix) >= 0 ){
            window.clearInterval(window.___timer2);
            return;
        }
        window.document.title = prefix + window.document.title
    }, 100);
}