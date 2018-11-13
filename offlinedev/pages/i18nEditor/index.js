$(()=>{
    let html = ''
    let count = 0;
    for(var key in cnjson){
        count++;
        let value = cnjson[key]
        let envalue = enjson[key]
        html = html + `<tr>
                            <td class="cellkey">${count}: ${key}</td>
                            <td class="cellmainlang"><span class="word">${value}</span></td>
                            <td class="cellsublang"><span class="word">${envalue}</span></td>
                        </tr>`
    }
    $('#table >tbody').append(html);
})