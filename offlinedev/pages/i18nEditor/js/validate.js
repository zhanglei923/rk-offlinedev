var do_reportStatus = () =>{
    // $('#table >tbody>tr').each(function(i, tr){
    //     tr=$(tr)
    //     var len1 = tr.find('.cellmainlang').innerWidth()        
    //     var len2 = tr.find('.cellsublang').innerWidth()
    //     //console.log(len1, len2)
    //     tr.find('.validate_info').html(`${len1-len2}`)
    // })
    unselect();
    let reportHtml = '<ul class="validatereport">'
    let localcache = get_localstorage();
    let count=0;
    reportHtml += `<li><input type="checkbox"><b>Cached:</b></li>`
    for(var key in localcache){
        count++;
        reportHtml += `<li>
                            <div class="dirtykey">[KEY]:${key}</div>
                            <div class="dirtycn">[CN]:${htmlEscape(OriginSuperJson[key].cn)}</div>
                            <div class="dirtybefore">[CURRENT]:${htmlEscape(OriginSuperJson[key].en?OriginSuperJson[key].en:'')}</div>
                            <div class="dirtyafter"><input type="checkbox">[CACHED]:${htmlEscape(localcache[key])}</div>
                        </li>`;

    }
    reportHtml += `<li><b>Mondified:</b></li>`
    for(var key in SuperJson){
        let enval0 = OriginSuperJson[key].en?OriginSuperJson[key].en:'';
        let enval1 = SuperJson[key].en?SuperJson[key].en:'';
        
        if(enval0 !== enval1){
            //console.log(OriginSuperJson[key].en , SuperJson[key].en)
            count++;
            reportHtml += `<li>
                                <div class="dirtykey">[KEY]:${key}</div>
                                <div class="dirtycn">[CN]:${htmlEscape(OriginSuperJson[key].cn)}</div>
                                <div class="dirtybefore">[BF]:${htmlEscape(OriginSuperJson[key].en?OriginSuperJson[key].en:'')}</div>
                                <div class="dirtyafter">[AF]:${htmlEscape(SuperJson[key].en)}</div>
                            </li>`;
        }
    }
    reportHtml += '</ul>';
    if(count===0){
        alert('Nothing changed.')
        return;
    }
    do_popupWindow('Summary', (popup)=>{
        popup.html(reportHtml)
    })
}
var updateSummary = function(){
    let nullcn = 0;
    let nullen = 0;
    let total = 0;
    for(var key in SuperJson){
        let cnvalue = SuperJson[key].cn;
        let envalue = SuperJson[key].en;
        if(!cnvalue) nullcn ++;
        if(!envalue) nullen ++;
        total++;
    };
    $('#summary').html(`
    Remains:${nullen}/${total}
    `)
};

do_fileDetails = ()=>{
    close_popupWindow();
    let reportHtml = '234'
    do_popupWindow('File Details', (popup)=>{
        popup.html(reportHtml)
    })
}
do_selfTest = () =>{
    let ipt = $('#selftestInput')//document.getElementById('selftestInput')
    let osuperJson = JSON.parse(JSON.stringify(OriginSuperJson));

    let errors = []
    let count = 0;
    let _test = (key, val0, val)=>{
        ipt.val(escapeValue(val));
        val = unescapeValue(ipt.val());
        if(typeof val0 !== 'undefined' && val0 !== val) {
            errors.push({key, val0, val1: val})
        }
        count++;
    }
    for(let key in osuperJson){
        let val = osuperJson[key].en;
        let val0 = val;
        _test(key, val0, val)
    }
    for(let key in osuperJson){
        let val = osuperJson[key].cn;
        let val0 = val;
        _test(key, val0, val)
    }
    $('#selfTestBtn').addClass(errors.length > 0 ? 'wrong':'correct')
    $('#selfTestBtn').html(errors.length > 0 ? `${errors.length} Errors, Self-Test Failed!!`:`${count}ok`)
    if(errors.length > 0){
        console.warn(`ERRORS: ${errors.length}`, errors)
        $('#saveBtn').remove();
        $('body').addClass('fatal_error')
    }
    delete osuperJson;
}
var do_validate = (savejson)=>{
    for(var lang in savejson){
        var langJson = savejson[lang];
        console.log(langJson)
    }
    return true;
}
$(()=>{
    $('#validateBtn').click(()=>{
        do_reportStatus();
    })
    $('#fileDetailsBtn').click(()=>{
        do_fileDetails();
    })
    $('#selfTestBtn').click(()=>{
        do_selfTest();
    })
})