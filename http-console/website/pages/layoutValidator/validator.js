let doValidate = ()=>{
    let txt = $('#jsonstring').val()
    $('#rightContent').html('');
    if(_.trim(txt))
    $.ajax({
        url: '/offlinedev/api/layoutJson/validator/',
        cache: false,
        method: 'POST',
        data: {
            content: txt
        },
        success: function( response ) {
            console.log(response)
            let html = '<ul>'
            let noErr = true;
            response.result.forEach((err, i)=>{
                if(!err.level || err.level==='fatal'){
                    noErr = false;
                    html += `<li idx="${i}" class="item ${!err.level?'error':err.level}">${i}: ${err.errorMsg}</li>`
                }
            })
            if(noErr) html += '<li style="color:green;">Congratulations! your json data is healthy!</li>'
            html += '</ul>';
            $('#rightContent').html(html);
        }
    });
}