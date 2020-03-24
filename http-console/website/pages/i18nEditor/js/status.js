var checkKeyIsDirty = (key)=>{
    if(!OriginSuperJson[key]) OriginSuperJson[key]={}
    let enval0 = OriginSuperJson[key].en//?OriginSuperJson[key].en:'';
    let enval1 = SuperJson[key].en//?SuperJson[key].en:'';
    if(!enval0) enval0='';
    if(!enval1) enval1='';
    if(enval0 !== enval1){
        return true;
    }
    return false;
};
var do_reportStatus = () =>{
    // $('#table >tbody>tr').each(function(i, tr){
    //     tr=$(tr)
    //     var len1 = tr.find('.cellmainlang').innerWidth()        
    //     var len2 = tr.find('.cellsublang').innerWidth()
    //     //console.log(len1, len2)
    //     tr.find('.validate_info').html(`${len1-len2}`)
    // })
    unselect();
    let count=0;
    let reportHtml = '<ul class="validatereport">'
    reportHtml += `<li><b>Mondified:</b></li>`
    for(var key in SuperJson){
        let dirty = checkKeyIsDirty(key)
        if(dirty){
            //console.log(OriginSuperJson[key].en , SuperJson[key].en)
            count++;
            reportHtml += `<li>
                                <div class="dirtykey" style="color:#ccc;">[KEY]:${key}</div>
                                <div class="dirtycn">[CN]:&quot;${htmlEscape(OriginSuperJson[key].cn)}&quot;</div>
                                <div class="dirtybefore" style="display:none;">[BF]:&quot;${htmlEscape(OriginSuperJson[key].en?OriginSuperJson[key].en:'')}&quot;</div>
                                <div class="dirtyafter">[AF]:&quot;${htmlEscape(SuperJson[key].en)}&quot;</div>
                            </li>`;
        }
    }
    reportHtml += '</ul>';
    if(count===0){
        reportHtml = ('Nothing changed.')
    }
    do_popupWindow('Summary', (popup)=>{
        popup.html(reportHtml)
    })
}
let updateSummaryTimer;
var updateSummary = function(){
    updateSummaryTimer = window.setTimeout(()=>{
        do_updateSummary()
    }, 800)
}
var updateSummary = function(){
    let nullcn = 0;
    let nullen = 0;
    let total = 0;
    let nullCnKeys = [];
    for(var key in SuperJson){
        let cnvalue = SuperJson[key].cn;
        let envalue = SuperJson[key].en;
        if(!cnvalue) nullcn ++;
        if(!cnvalue) nullCnKeys.push(key)
        if(!envalue) nullen ++;
        total++;
    };
    let rate = nullen/total;
    let strRate = Math.round(rate*1000)/10;
    $('#summary').html(`<span class="remains">${nullen}</span>/<span class="total">${total}</span>=<span class="remains">${strRate}%</span>`)
    if(nullen > 0) $('#summary .remains').css('color', '#f96b6b')
    
    if(nullCnKeys.length > 0) notice_error(`有英文但无中文：${nullCnKeys.join(', ')}`)
};
$('#summary').on('click', '.remains', ()=>{
    $('#nullEnBtn').attr('state', '1').click();
})
$('#summary').on('click', '.total', ()=>{
    $('#nullEnBtn').attr('state', '').click();
})

do_fileDetails = ()=>{
    close_popupWindow();
    let reportHtml = '234'
    do_popupWindow('File Details', (popup)=>{
        popup.html(reportHtml)
    })
}
init_branchInfo = ()=>{
    $.ajax({
        url: '/offlinedev/api/getWebProjectInfo/',
        cache: false,
        method: 'POST',
        success:(data)=>{
            let branchName = data.result.branchName
            $('#branchInfo').html(`
                <span>${branchName}</span>
            `)
            //console.log(branchName)
        }
    })
}