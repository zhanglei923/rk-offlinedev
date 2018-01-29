window.onload=function(){
    // $('body').append(
    //     '<div style="height:5px;position:fixed;left:0;top:0;z-index:9999;background-color:red;padding:0px 0px 0px 55px;width:100%;font-size:6px;color:white;">'
    //     +'</div>'
    //     +'<div id="offlinedev_start" style="position:fixed;left:0;top:0;z-index:9999;background-color:red;padding:2px 2px 0px 1px;cursor:hand;">'
    //     +'<img src="/offlinedev/img/fet.jpg" style="width:42px;">'
    //     +'</div>'
        
    //     )
    window.___timer2 = window.setInterval(function(){
        var prefix = '【离线】'
        if(window.document.title.indexOf(prefix) >= 0 ){
            window.clearInterval(window.___timer2);
            return;
        }
        window.document.title = prefix + window.document.title
    }, 100);
    window.___timer = window.setInterval(function(){
        if(window.__rk){
            //window.__rk.formMgr.popupDebugWindow();
            window.clearInterval(window.___timer);
            //
        }
    }, 100);

    $('#maintenance_bar').show().css({
        backgroundColor: '#2ecc71',
        color: 'white',
        fontSize: '20px'
    })
    $('#maintenance_bar .msg').text('离线开发模式！').css({
        background: 'url(/offlinedev/img/fet.jpg) left 14px no-repeat',
        'background-size': '26px 25px',
        'padding-left': '50px'
    })

    $('#offlinedev_start').click(function(){
        if(!$.rk.offlineconfig)
        $.widget('rk.offlineconfig', $.rk.oaDialogCtrl, {
            _create : function(){
                var me = this,
                    elem = me.element,
                    opt = me.options;

                    var html =   '<div>'
                                +'<img src="/offlinedev/img/fet.jpg" style="width:42px;">这里是离线开发的配置界面'
                                +'</div>'
                    elem.html(html)
                    me.getBtn('cancel').on('click', $.proxy(me.cancelClicked,me));

            },
            cancelClicked: function(){
                var me = this;
                var elem = me.element;
                me.closeMe();//关闭
            }

        });
        __rk.dialog({
            title: '离线开发 - 配置',
            success: function (contentElem, footerElem){
                contentElem.offlineconfig();//初始化弹框内容的Ctrl
            },
            close: function (){
            },
            footer: ['cancel', 'ok']
        });
    })
}