var do_validate = () =>{
    // $('#table >tbody>tr').each(function(i, tr){
    //     tr=$(tr)
    //     var len1 = tr.find('.cellmainlang').innerWidth()        
    //     var len2 = tr.find('.cellsublang').innerWidth()
    //     //console.log(len1, len2)
    //     tr.find('.validate_info').html(`${len1-len2}`)
    // })
    unselect();
    let reportHtml = '<ul class="validatereport">'
    let count=0;
    for(var key in SuperJson){
        let enval0 = OriginSuperJson[key].en?OriginSuperJson[key].en:'';
        let enval1 = SuperJson[key].en?SuperJson[key].en:'';
        
        if(enval0 !== enval1){
            console.log(OriginSuperJson[key].en , SuperJson[key].en)
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
    Remains: ${nullen}/${total}
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
    $('#selfTestBtn').html(errors.length > 0 ? `${errors.length} errors!`:`${count} OK!`)
    console.warn(`ERRORS: ${errors.length}`, errors)
    delete osuperJson;
}
$(()=>{
    $('#validateBtn').click(()=>{
        do_validate();
    })
    $('#fileDetailsBtn').click(()=>{
        do_fileDetails();
    })
    $('#selfTestBtn').click(()=>{
        do_selfTest();
    })
})