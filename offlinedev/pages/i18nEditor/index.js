var htmlEscape = (s) => {
    var type = typeof s;
    if (!s || type != 'string') return s;
    s = (s + '').replace('&lt;script', '<script');//跟xssUtil中呼应，避免重复&转码
    return (s + '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#039;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br />');
};
$(()=>{
    let html = ''
    let count = 0;
    for(var key in cnjson){
        count++;
        let value = cnjson[key]
        let envalue = enjson[key]
        if(typeof value === 'undefined') value = '';
        if(typeof envalue === 'undefined') envalue = '';
        html = html + `<tr class="${count%2===0?'row_a':'row_b'}" data-key="${key}"> 
                            <td>${count}</td>
                            <td class="cellkey">
                                <span class="word">${key}</span
                            </td>
                            <td class="cellval">
                                "<span class="cellmainlang word">${htmlEscape(value)}</span>"
                                    <br>
                                "<span class="cellsublang word">${htmlEscape(envalue)}</span>"
                            </td>
                        </tr>`
    }
    $('#table >tbody').append(html);
    //---
    $('#table').on('mouseover', 'tr', function(e){
        handleTrHover(e.currentTarget)
    });
    $('#table').on('mouseout', 'tr', function(e){
        handleTrOut(e.currentTarget)
    });
    $('#table').on('click', 'tr', function(e){
        handleTrSelect(e.currentTarget)
    });
})
var hoveringList = []
var handleTrHover = function(t){
    $(t).addClass('hovering_tr')
}
var handleTrOut = function(t){
    $(t).removeClass('hovering_tr')
}
var handleTrSelect = function(t){
    t = $(t);
    if(t.hasClass('selected_tr')) return;
    selectedTr.forEach((o)=>{
        do_unselect($(o));
    })
    do_select(t);
}
var selectedTr = [];
var do_select = (t) =>{
    selectedTr = []
    t.addClass('selected_tr')
    selectedTr.push(t)

    var key = t.attr('data-key');
    var val0 = cnjson[key];
    var val1 = enjson[key];

    t.find('.cellmainlang').html(`<input class="valinput" value="${val0}">`)
    t.find('.cellsublang').html(`<input class="valinput" value="${val1}">`)
}
var do_unselect = (t) =>{
    t.removeClass('selected_tr')
    var val0 = t.find('.cellmainlang input').val()
    var val1 = t.find('.cellsublang input').val()
    t.find('.cellmainlang').html(`${htmlEscape(val0)}`)
    t.find('.cellsublang').html(`${htmlEscape(val1)}`)
}