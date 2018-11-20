var do_validate = (savejson)=>{
    for(var lang in savejson){
        var langJson = savejson[lang];
        for(var key in langJson){
            var str = langJson[key];
        }
    }
    return true;
}
var do_validateValue = (key, value)=>{
    if(/\\r/g.test(value)) {
        alert(`不可以含有"\\r"`)
        return;
    }
    let regex = /\$\s{1,}[0-9]/g
    if(regex.test(value)) {
        alert(`取参占位符不能有空格：${value.match(regex).join(', ')}`)
        return;
    }
    return true;
}

do_selfTest = () =>{
    $('#selfTestBtn').removeClass('wrong').removeClass('correct').html('testing...')
    let errors = []
    let count = 0;
    let ids = ['selftestInput','selftestInput2'];
    ids.forEach((id)=>{
        let ipt = $('#'+id)//document.getElementById('selftestInput')
        let osuperJson = JSON.parse(JSON.stringify(OriginSuperJson));
    
        let _test = (key, val0, val)=>{
            ipt.val(escapeValue(val));
            val = unescapeValue(ipt.val());
            if(typeof val0 !== 'undefined' && val0 !== val) {
                errors.push({key, val0, val1: val})
            }
            count++;
        }
        let baddata1 = '~!@#$%^&*()_+=-0`|}{[]\":;?><$for,./'+"'\n "
        baddata1 += baddata1
        baddata1 += baddata1
        _test('baddata1', baddata1, baddata1);//terrible data test
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
    })
    $('#selfTestBtn').addClass(errors.length > 0 ? 'wrong':'correct')
    $('#selfTestBtn').html(errors.length > 0 ? `${errors.length} Errors, Self-Test Failed!!`:`${count}safe`)
    if(errors.length > 0){
        console.warn(`ERRORS: ${errors.length}`, errors)
        $('#saveBtn').remove();
        $('body').addClass('fatal_error')
    }
    delete osuperJson;
}