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
        .replace(/\n/g, '\\n');
};
var textEscape = (s)=>{
    if(typeof s === 'undefined') s = '';
    if(!s) return s;   
    return s.replace(/\n/g, '\\n');
};
let SuperJson = {};
$(()=>{
    let html = ''
    let count = 0;

    for(var key in cnjson){
        SuperJson[key] = {};
        SuperJson[key].cn = cnjson[key];
    }
    for(var key in enjson){
        if(typeof SuperJson[key] === 'undefined') SuperJson[key] = {};
        SuperJson[key].en = enjson[key];
    }
    let allNullValueKeys = [];
    let allWithValueKeys = [];
    
    for(var key in SuperJson){
        var item = SuperJson[key];
        if(typeof item.cn === 'undefined' || typeof item.en === 'undefined'){
            allNullValueKeys.push(key);
        }else{
            allWithValueKeys.push(key);
        }
    }
    let allKeys = [];
    allKeys = allKeys.concat(allNullValueKeys);
    allKeys = allKeys.concat(allWithValueKeys);
    for(var i = 0, len=allKeys.length;i<len;i++){
        var key = allKeys[i];
        count = i;
        let cnvalue = SuperJson[key].cn;
        let envalue = SuperJson[key].en;
        if(typeof cnvalue === 'undefined') cnvalue = '';
        if(typeof envalue === 'undefined') envalue = '';
        html = html + `<tr class="${count%2===0?'row_a':'row_b'}" data-key="${key}"> 
                            <td>${count}</td>
                            <td class="cellkey">
                                <span class="word">${key}</span
                            </td>
                            <td class="cellval">
                                <span class="cellmainlang word">${getDisplayText(cnvalue)}</span>
                                <br>
                                <span class="cellsublang word">${getDisplayText(envalue)}</span>
                            </td>
                            <td class="validate_info"></td>
                        </tr>`
    }
    $('#table >tbody').append(html);
    //do_validate()
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
var getDisplayText = (val)=>{
    if(!val) return '<span class="null_val">&quot;&quot;</span>'
    return `${htmlEscape(val)}`
};
var selectedTr = [];
var do_select = (t) =>{
    selectedTr = []
    t.addClass('selected_tr')
    selectedTr.push(t)

    var key = t.attr('data-key');
    var val0 = SuperJson[key].cn;
    var val1 = SuperJson[key].en;

    t.find('.cellmainlang').html(`<input class="valinput" value="${textEscape(val0)}">`)
    t.find('.cellsublang').html(`<input class="valinput" value="${textEscape(val1)}">`)
}
var do_unselect = (t) =>{
    var key = t.attr('data-key');
    t.removeClass('selected_tr')
    var val0 = t.find('.cellmainlang input').val()
    var val1 = t.find('.cellsublang input').val()
    SuperJson[key].cn = val0;
    SuperJson[key].en = val1;
    //console.log(val0, val1)
    t.find('.cellmainlang').html(`${getDisplayText(val0)}`)
    t.find('.cellsublang').html(`${getDisplayText(val1)}`)
}