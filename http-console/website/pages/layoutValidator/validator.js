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
            response.result.forEach((err, i)=>{
                if(!err.level || err.level==='fatal')
                html += `<li idx="${i}" class="item ${!err.level?'error':err.level}">${i}: ${err.errorMsg}</li>`
            })
            html += '</ul>';
            $('#rightContent').html(html);
        }
    });
}