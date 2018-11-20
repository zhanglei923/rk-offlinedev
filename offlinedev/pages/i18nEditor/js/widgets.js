let do_popupWindow = (title, callback)=>{
    close_popupWindow()
    if(!document.getElementById('popup'))$('body').append(`<div id="popup" class="popup"></div>`)
    $('#popup').html(`<div class="toolbar">
                            <span class="title">${title}</span>
                            <button class="closeBtn" onclick="close_popupWindow()">[X]</button>
                        </div>
                        <div class="content"></div>
                        <div class="footer"></div>`);
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