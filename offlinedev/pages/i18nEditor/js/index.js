var isChrome = !!window.chrome && !!window.chrome.webstore;
$(()=>{
    $('#saveBtn').click(()=>{
        do_reportStatus(false);
        window.setTimeout(()=>{
            $('#popup > .footer').append(`
                                        <button class="btn" onclick="do_save();">Save!</button>
                                        <button  class="btn danger" onclick="close_popupWindow();">Cancel</button>
                                        `)
        }, 300)
    })
    $('#validateBtn').click(()=>{
        do_reportStatus();
    })
    $('#fileDetailsBtn').click(()=>{
        do_fileDetails();
    })
    $('#selfTestBtn').click(()=>{
        do_selfTest();
    })
    $('#cacheBtn').click(()=>{
        do_reportCaches();
    })
    $('#importExcelBtn').click(()=>{
        import_popupImport();
    })
    $('#exportExcelBtn')
    $('#untransFilesBtn').click(()=>{
        do_filterByUntransFile()
    })
    $('#filterBtn').click(()=>{
        do_filterByRegex();
    })
    $('#openKeysFilter').click(()=>{
        do_openKeysFilter()
    })
    $('#nullEnBtn').click(()=>{
        do_showNullEnglishOnly()
    })    
    $('#compactViewSwitch').on('change', (e)=>{
        let val = $('#compactViewSwitch').val()
        if(val === 'mod_compact'){
            $('#table').addClass('compactview')
        }else{
            $('#table').removeClass('compactview')
        }
    })
    $('#typeViewSwitch').on('change', (e)=>{
        let val = $('#typeViewSwitch').val()
        $('#table').removeClass('mod_mix');
        $('#table').removeClass('mod_cn');
        $('#table').removeClass('mod_en');
        $('#table').addClass(val);
    })
    $('#table').on('keydown', '.cellsublang textarea', (e)=>{
        if(e.keyCode === 27) {
            unselect()
            _is_editmode = false;
        }else
        if(e.keyCode === 13) {
            let textarea = $(e.currentTarget);
            e.preventDefault();
            textarea.css({'background-color':'pink'});
            window.setTimeout(()=>{
                textarea.css({'background-color':''});
            }, 100)
        }
    })
    
})
var htmlEscape = (s) => {
    var type = typeof s;
    if (!s || type != 'string') return s;
    s = (s + '').replace('&lt;script', '<script');//跟xssUtil中呼应，避免重复&转码
    let w = (s + '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#039;')
        .replace(/"/g, '&quot;')
        .replace(/^[ ]{1,}/, (w)=>{let s='';for(var i=0;i<w.length;i++)s+='&nbsp;';return s;})
        .replace(/[ ]{1,}$/, (w)=>{let s='';for(var i=0;i<w.length;i++)s+='&nbsp;';return s;})
        .replace(/\n/g, '<span class="keyofenter_mark">\\n</span>');
    w = w//.replace(/\{\d{1,}\}/g,(w)=>{return '<span class="unknown_mark">'+w+'</span>';})
        .replace(/\{\w{1,}\}/g,(w)=>{
            var s=w.replace(/\{/g,'').replace(/\}/,'');
            if(isNaN(parseInt(s))){
                return '<span class="warn_mark">'+w+'</span>';
            }else{
                return '<span class="unknown_mark">'+w+'</span>';
            }
        })
        .replace(/\$[0-9]{1,2}/,(w)=>{if(w==='$0'){return '<span class="unknown_mark">'+w+'</span>';}else{return '<span class="keyword_mark">'+w+'</span>';}})
        .replace(/\#[\w\_]{1,}\#/g,(w)=>{return '<span class="keyword_mark">'+w+'</span>';})
    return w;
};
var unescapeValue = (s)=>{
    return s.replace(/\\n/g,'\n')
};
var escapeValue = (s)=>{
    if(typeof s === 'undefined') s = '';
    if(!s) return s;   
    return s.replace(/\n/g, '\\n');
};
let SuperJson = {};
let OriginSuperJson = {};
let OriginUntrans = {}
let UntransMap = {}
loadData((all_trans, all_untrans)=>{
    if(!isChrome){ notice_error('必须用Chrome浏览器');return;}
    if(!do_validateDupBetweenTransUntrans(all_trans, all_untrans)) return;
    OriginUntrans = JSON.parse(JSON.stringify(all_untrans))
    init_untransFileSelector()
    init_branchInfo()
    init(all_trans, all_untrans);
    check_localstorage()
    $('#saveBtn').show();
})
let init = (all_trans, all_untrans)=>{
    let html = ''
    let count = 0;
    //console.log(all_trans, all_untrans)

    cnjson = all_trans['all_zh-cn'];
    enjson = all_trans['all_en'];
    //console.log(cnjson, enjson)

    for(var key in cnjson){
        SuperJson[key] = {};
        SuperJson[key].cn = cnjson[key];
    }
    for(var key in enjson){
        if(typeof SuperJson[key] === 'undefined') SuperJson[key] = {};
        SuperJson[key].en = enjson[key];
    }
    for(var path in all_untrans){
        var json = all_untrans[path];
        for(var key in json){
            if(!SuperJson[key]) SuperJson[key] = {};
            SuperJson[key].cn = json[key];
        }
    }

    let allNullValueKeys = [];
    let allWithValueKeys = [];

    OriginSuperJson = JSON.parse(JSON.stringify(SuperJson));
    
    for(var key in SuperJson){
        var item = SuperJson[key];
        if(!item.cn || !item.en || typeof item.cn === 'undefined' || typeof item.en === 'undefined'){
            allNullValueKeys.push(key);
        }else{
            allWithValueKeys.push(key);
        }
    }
    SuperJson = filterRemoteKeys(SuperJson, $.query('keys'))
    allNullValueKeys.sort();
    allWithValueKeys.sort();
    let allKeys = [];
    allKeys = allKeys.concat(allNullValueKeys);
    allKeys = allKeys.concat(allWithValueKeys);
    allKeys.sort();
    for(var i = 0, len=allKeys.length;i<len;i++){
        var key = allKeys[i];
        count = i;
        let cnvalue = SuperJson[key].cn;
        let envalue = SuperJson[key].en;
        let hidden = !!SuperJson[key]._hidden;
        if(typeof cnvalue === 'undefined') cnvalue = '';
        if(typeof envalue === 'undefined') envalue = '';
        let belongpath = UntransMap[key]?(''+getShortDrivePath(UntransMap[key]))+'':'all_zh-cn';
        html = html + `<tr class="row ${count%2===0?'row_a':'row_b'}" data-key="${key}" title="" style="${hidden?'display:none;':''}">`+
                            //`<td>#${count+1}</td>`+
                            `<td class="cellkey" title="${belongpath}">`+
                                `#${count+1}&nbsp;${key}`+
                                //`<div class="untrans_path">${belongpath}</div>`+
                            `</td>`+
                            `<td class="cellval">`+
                                `<div class="cellmainlang word">`+
                                    `${getDisplayText(cnvalue, 'cn')}`+
                                    //`<div class="cellfilepath word">${belongpath}</div>`+
                                `</div>`+
                                `<div class="cellsublang word">${getDisplayText(envalue)}</div>`+
                            `</td>`+
                        `</tr>`
    }
    //console.log(html)
    $('#table >tbody').html(html);
    afterInit()
};
let afterInit = ()=>{
    $('#loading').remove();
    updateSummary();
    window.setTimeout(()=>{
        do_selfTest();
    }, 20)

    //do_reportStatus()
    //---
    $('#table').on('mouseover', 'tr', function(e){
        handleTrHover(e.currentTarget)
    });
    $('#table').on('mouseout', 'tr', function(e){
        handleTrOut(e.currentTarget)
    });
    $('#table').on('dblclick', 'td.cellval', function(e){
        let tr = $(e.currentTarget).closest('tr');
        // handleTrSelect(tr)
        // if(!$(tr).hasClass('selected_tr')){            
        //     unselect()
        // }
        _is_editmode = true;
        $(tr).click()
    });
    $('#table').on('click', 'tr', function(e){
        if(e.ctrlKey){ _is_editmode = true; }
        if(_is_editmode){
            handleTrSelect(e.currentTarget)
        }else{            
            if(!$(e.currentTarget).hasClass('selected_tr')){            
                unselect()
            }
        }
    });
    $('#table').on('click', 'button.resetEnRowBtn', function(e){
        let btn = e.currentTarget;
        let tr = $(btn).closest('tr[data-key]')
        let key = tr.attr('data-key')
        tr.find('.valinput').val(OriginSuperJson[key].en?OriginSuperJson[key].en:'')
    });
}
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
    unselect()
    do_select(t);
}
var getDisplayText = (val, lang)=>{
    if(typeof lang === 'undefined') lang = 'en';
    if(!val) {
        if(lang === 'cn')  return '<span class="null_val">-LOST-CHINESE-VALUE!!-</span>'//'<span class="null_val">&quot;&quot;</span>'
        return '<span class="null_val">-untranslated-</span>'//'<span class="null_val">&quot;&quot;</span>'
    }
    return `${htmlEscape(val)}`
};
var _is_editmode = false;
var selectedTr = [];
var do_select = (t) =>{
    selectedTr = []
    t.addClass('selected_tr')
    showHelpTip(t);
    selectedTr.push(t)

    var key = t.attr('data-key');
    var val0 = SuperJson[key].cn;
    var val1 = SuperJson[key].en;

    let belongpath = $(t).find('.cellkey').attr('title')
    t.find('.cellmainlang .cellfilepath').remove()
    t.find('.cellmainlang').append(`<div class="cellfilepath word">${belongpath}</div>`);

    t.find('.cellsublang').html(`<textarea class="valinput"></textarea>`+
    // `<hr>
    // <a href="https://www.gingersoftware.com/" target="_blank">
    //     <img src="https://www.gingersoftware.com/simple/assets/images/header-logo.png" style="height: 23px;"/>
    // </a>
    // <a href="https://app.grammarly.com/" target="_blank">
    //     <svg height="24" viewBox="0 0 140 33" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M43.007 24.161c-.514-.197-.85-.612-.85-1.165a1.23 1.23 0 0 1 1.718-1.124 6.836 6.836 0 0 0 2.921.631c2.053 0 3.02-.986 3.02-2.881v-.513c-.889 1.066-1.855 1.716-3.454 1.716-2.467 0-4.698-1.796-4.698-4.934v-.039c0-3.158 2.27-4.934 4.698-4.934 1.638 0 2.605.69 3.414 1.579v-.02c0-.81.671-1.48 1.5-1.48s1.5.67 1.5 1.5v6.809c0 1.895-.454 3.276-1.342 4.164-.987.987-2.507 1.422-4.559 1.422a10.13 10.13 0 0 1-3.868-.731zm6.809-8.27v-.039c0-1.44-1.126-2.447-2.586-2.447s-2.566 1.006-2.566 2.447v.04c0 1.46 1.106 2.447 2.566 2.447 1.46 0 2.586-1.007 2.586-2.448zm4.658-3.394a1.499 1.499 0 1 1 3 0v.473c.435-1.026 1.145-1.973 2.033-1.973.928 0 1.46.612 1.46 1.46 0 .79-.513 1.263-1.124 1.402-1.52.355-2.37 1.52-2.37 3.65v2.803a1.5 1.5 0 1 1-2.999 0v-7.815m6.139 6.158v-.04c0-2.309 1.756-3.375 4.263-3.375 1.066 0 1.835.177 2.586.434v-.177c0-1.243-.77-1.935-2.27-1.935-.829 0-1.5.12-2.073.297a1.267 1.267 0 0 1-.434.079c-.69 0-1.243-.533-1.243-1.225 0-.532.335-.986.81-1.164.946-.355 1.973-.552 3.374-.552 1.638 0 2.822.434 3.572 1.184.79.789 1.145 1.954 1.145 3.375v4.815a1.44 1.44 0 0 1-1.46 1.442c-.869 0-1.441-.612-1.441-1.244v-.02c-.73.81-1.737 1.342-3.198 1.342-1.993 0-3.631-1.144-3.631-3.236zm6.888-.691v-.533a4.655 4.655 0 0 0-1.915-.395c-1.283 0-2.072.513-2.072 1.461v.04c0 .809.672 1.282 1.638 1.282 1.402 0 2.35-.77 2.35-1.855zm4.442-5.467a1.5 1.5 0 1 1 3 0v.119c.69-.889 1.599-1.698 3.118-1.698 1.382 0 2.428.612 2.98 1.678.928-1.086 2.034-1.678 3.474-1.678 2.23 0 3.573 1.342 3.573 3.889v5.505a1.5 1.5 0 1 1-3 0v-4.519c0-1.421-.632-2.152-1.757-2.152s-1.816.73-1.816 2.152v4.52a1.5 1.5 0 1 1-3 0v-4.52c0-1.421-.631-2.152-1.756-2.152-1.126 0-1.816.73-1.816 2.152v4.52a1.5 1.5 0 1 1-3 0v-7.816m17.764 0a1.5 1.5 0 1 1 3 0v.119c.69-.889 1.6-1.698 3.119-1.698 1.381 0 2.427.612 2.98 1.678.928-1.086 2.033-1.678 3.473-1.678 2.231 0 3.573 1.342 3.573 3.889v5.505a1.5 1.5 0 1 1-3 0v-4.519c0-1.421-.632-2.152-1.756-2.152-1.126 0-1.816.73-1.816 2.152v4.52a1.5 1.5 0 1 1-3 0v-4.52c0-1.421-.632-2.152-1.757-2.152s-1.815.73-1.815 2.152v4.52a1.5 1.5 0 1 1-3 0v-7.816m17.132 6.158v-.04c0-2.309 1.757-3.375 4.263-3.375a7.5 7.5 0 0 1 2.585.434v-.177c0-1.243-.769-1.935-2.27-1.935-.828 0-1.5.12-2.071.297a1.275 1.275 0 0 1-.434.079c-.692 0-1.244-.533-1.244-1.225 0-.532.336-.986.809-1.164.948-.355 1.974-.552 3.375-.552 1.639 0 2.823.434 3.572 1.184.79.789 1.145 1.954 1.145 3.375v4.815c0 .81-.65 1.442-1.46 1.442-.868 0-1.44-.612-1.44-1.244v-.02c-.731.81-1.738 1.342-3.198 1.342-1.994 0-3.632-1.144-3.632-3.236zm6.888-.691v-.533a4.656 4.656 0 0 0-1.914-.395c-1.284 0-2.073.513-2.073 1.461v.04c0 .809.671 1.282 1.638 1.282 1.401 0 2.35-.77 2.35-1.855zm4.442-5.467a1.5 1.5 0 1 1 3 0v.473c.434-1.026 1.144-1.973 2.033-1.973.927 0 1.46.612 1.46 1.46 0 .79-.513 1.263-1.125 1.402-1.52.355-2.368 1.52-2.368 3.65v2.803a1.5 1.5 0 1 1-3 0v-7.815m7.402-3.83a1.5 1.5 0 1 1 3 0v11.645a1.5 1.5 0 1 1-3 0V8.667m5.388 15.968c-.434-.158-.948-.513-.948-1.243 0-.73.573-1.224 1.185-1.224.237 0 .375.04.493.079.257.079.415.119.632.119.533 0 .79-.1 1.066-.633l.098-.236-3.611-8.369c-.08-.197-.158-.493-.158-.69 0-.85.651-1.44 1.48-1.44.75 0 1.184.413 1.44 1.123l2.29 6.159 2.21-6.139c.238-.63.671-1.144 1.442-1.144.77 0 1.42.592 1.42 1.381 0 .238-.078.573-.138.711l-3.69 8.862c-.889 2.15-1.777 2.96-3.573 2.96a4.498 4.498 0 0 1-1.638-.276" fill="#4C4C4C"/><path d="M33.362 16.392c0 9.053-7.339 16.393-16.392 16.393-9.053 0-16.393-7.34-16.393-16.393S7.917 0 16.97 0s16.392 7.339 16.392 16.392" fill="#15C39A"/><path d="M20.204 18.614c-.681 0-1.22.614-1.092 1.318.097.536.602.904 1.147.904h1.718l.995-.14c-1.593 2.337-4.359 3.413-7.383 2.938-2.462-.386-4.576-2.052-5.468-4.378-2.026-5.28 1.83-10.322 6.856-10.322 2.62 0 4.915 1.533 6.233 3.385v.04c.35.503 1.043.648 1.548.298.478-.332.61-.963.322-1.459h.008a9.618 9.618 0 0 0-8.776-4.417c-4.793.322-8.672 4.244-8.948 9.04-.32 5.58 4.107 10.137 9.613 10.137a9.53 9.53 0 0 0 7.245-3.297l-.209 1.169v1.056c0 .544.367 1.05.904 1.147a1.112 1.112 0 0 0 1.318-1.093v-6.326h-6.031" fill="#FFF"/></g></svg>
    // </a>`+
    `<hr>
    <button class="resetEnRowBtn btn">Reset</button>`);

    //t.find('.cellmainlang textarea').val(escapeValue(val0));
    t.find('.cellsublang textarea').val(escapeValue(val1)).focus();;
}
var unselect = () =>{
    let succ=true;
    selectedTr.forEach((o)=>{
        succ = succ && do_unselect($(o));
    })
    if(!succ) return;
    selectedTr = []
    hideHelpTip();
    updateSummary();
}
var do_unselect = (t) =>{
    if(!t.hasClass('selected_tr')) return;
    var key = t.attr('data-key');
    //var val0 = t.find('.cellmainlang textarea').val()
    var val1 = t.find('.cellsublang textarea').val()

    if(self_test_completed)//不要影响初始自检
    if(!do_validateValue(key, SuperJson[key].cn, val1)) return;

    t.removeClass('selected_tr')

    //var newVal0 = unescapeValue(val0);
    var newVal1 = unescapeValue(val1);
    
    //SuperJson[key].cn = newVal0;
    SuperJson[key].en = newVal1;

    var enIsDirty = false;
    if(SuperJson[key].en !== OriginSuperJson[key].en) enIsDirty = true;
    ////console.log(val0, val1)
    //t.find('.cellmainlang').html(`${getDisplayText(val0)}`)
    t.find('.cellsublang').html(`${getDisplayText(val1)}`)

    if(enIsDirty && newVal1) saveto_localstorage(key, newVal1)
    enIsDirty ? t.find('.cellsublang').addClass('isdirty') : t.find('.cellsublang').removeClass('isdirty')
    return true;
}
var updateValue = (key, lang, val) =>{
    unselect()
    let tr = $(`#table>tbody>tr[data-key="${key}"]:first`);
    if(lang === 'en'){
        SuperJson[key].en = val;
        tr.find('.cellsublang').html(`${getDisplayText(val)}`)
    }
}