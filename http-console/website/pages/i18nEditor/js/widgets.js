let do_popupWindow = (title, callback)=>{
    close_popupWindow()
    if(!document.getElementById('popup'))$('body').append(`<div id="popup" class="popup"></div>`)
    if(!document.getElementById('model_background'))$('body').append(`<div id="model_background" class="model_background"></div>`)
    $('#popup').html(`<div class="toolbar">
                            <span class="title">&gt;${title}</span>
                            <button class="closeBtn" onclick="close_popupWindow()">X</button>
                        </div>
                        <div class="content"></div>
                        <div class="footer"></div>`);
    $('#popup').show();
    $('#model_background').show();
    callback($('#popup > .content'), $('#popup > .footer'));
}
let close_popupWindow = ()=>{
    $('#popup').hide();
    $('#model_background').hide();
}
let showHelpTip = (tr)=>{
    let pos = tr.position();
    $('#helptip').show()//.css({top:pos.top + 80})
}
let hideHelpTip = ()=>{
    $('#helptip').hide()
}
(()=>{
    var queryJson, str;
    $.query = function (name) {
        if (!queryJson) {
            queryJson = {};
            str = location.search.slice(1) + '&' + location.hash.slice(1);
            if (str) {
                $.each(str.split('&'), function (i, s, key, value) {
                    s = s.split('='), key = s[0], value = s[1];
                    if (key in queryJson) {
                        if ($.isArray(queryJson[key])) {
                            queryJson[key].push(value);
                        } else {
                            queryJson[key] = [queryJson[key], value];
                        }
                    } else {
                        queryJson[key] = value;
                    }
                });
            }
        }
        return queryJson[name];
    };
})()
notice_error = function(msg){
    let md5id = md5(msg)
    if($('#'+md5id))$('#'+md5id).remove();
    $('#error_info').css({'display':'inline-block'})
    $('#error_info').append(`<div id="${md5id}">${msg}</div>`)
}