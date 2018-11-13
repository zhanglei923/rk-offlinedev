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
        html = html + `<tr class="${count%2===0?'row_a':'row_b'}"> 
                            <td>${count}</td>
                            <td class="cellkey">
                                <span class="word">${key}</span
                            </td>
                            <td class="cellmainlang">
                                "<span class="cellmainlang word">${htmlEscape(value)}</span>"
                                <br>
                                "<span class="cellsublang word">${htmlEscape(envalue)}</span>"
                            </td>
                        </tr>`
    }
    $('#table >tbody').append(html);
})