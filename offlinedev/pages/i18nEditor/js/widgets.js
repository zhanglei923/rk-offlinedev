let do_popupWindow = (callback)=>{
    if(!document.getElementById('popup'))$('body').append(`<div id="popup" class="popup">
                                                    <div class="toolbar">
                                                        <button onclick="close_popupWindow()">close</button>
                                                    </div>
                                                    <div class="content"></div>
                                                </div>`)
    $('#popup').show();
    callback($('#popup > .content'));
}
let close_popupWindow = ()=>{
    $('#popup').hide();
}
let showHelpTip = (tr)=>{
    let pos = tr.position();
    $('#helptip').show().css({top:pos.top+57})
}
let hideHelpTip = ()=>{
    $('#helptip').hide()
}