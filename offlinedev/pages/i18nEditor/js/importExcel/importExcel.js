import_help_text = `
使用说明：
1) 准备好“key”，“中文”，“英文”三列，最好不含任何头部
2) 将这三列分别粘贴进这三个文本框，如果没有中文，可以忽略。
2.1) 注意，这三列的内容行必须完全匹配，否则会有错位。
3) 点击ok，进入确认列表，目视检查key-value是否正确配对了。
`
import_popupImport = ()=>{
    do_popupWindow('Import Excels', (content, footer)=>{
        let contentHtml = `
            <table id="import_excel_table" class="import_excel_table">
                <tr>
                    <td class="td_keys"><textarea id="texts_keys" class="texts_keys" placeholder="KEY\n---------------------${import_help_text}"></textarea></td>
                    <td class="td_main_vals"><textarea id="texts_main_vals" class="texts_main_vals"  placeholder="CN\n---------------------"/></td>
                    <td class="td_sub_vals"><textarea id="texts_sub_vals" class="texts_sub_vals"  placeholder="EN\n---------------------"/></td>
                </tr>
            </table>
            <table id="import_confirm_table" class="import_confirm_table">
            </table>
        `
        content.html(contentHtml)
        footer.html(`
                        <button id="do_importExcel" class="btn do_importExcel">Ok -&gt;</button>
                        <a href="javascript:;" id="do_importExcel_step0" style="display:none;">&lt;back</a>
                        &nbsp;
                        <button id="do_importExcel_save" class="btn" style="display:none;">Apply!</button>
                        
                        `)
        $('#do_importExcel').click(()=>{
            do_importExcel()
        })        
        $('#do_importExcel_step0').click(()=>{
            $('#do_importExcel').show()
            $('#import_excel_table').show()
            $('#do_importExcel_step0').hide()
            $('#do_importExcel_save').hide()

            $('#import_confirm_table').hide()
        })
        $('#do_importExcel_save').click(()=>{
            do_saveImportExcel()
        })
        $('#texts_keys').scroll(function(e){
            $('#texts_main_vals').scrollTop($('#texts_keys').scrollTop())
            $('#texts_sub_vals').scrollTop($('#texts_keys').scrollTop())
        });
        $('#texts_main_vals').scroll(function(e){
            $('#texts_keys').scrollTop($('#texts_main_vals').scrollTop())
            $('#texts_sub_vals').scrollTop($('#texts_main_vals').scrollTop())
        });
        $('#texts_sub_vals').scroll(function(e){
            $('#texts_keys').scrollTop($('#texts_sub_vals').scrollTop())
            $('#texts_main_vals').scrollTop($('#texts_sub_vals').scrollTop())
        });
    })
}
do_importExcel = ()=>{
    let keys = $('#texts_keys').val();
    let texts_main_vals = $('#texts_main_vals').val();
    let texts_sub_vals = $('#texts_sub_vals').val();

    keys = $.trim(keys)
    texts_main_vals = $.trim(texts_main_vals)
    texts_sub_vals = $.trim(texts_sub_vals)
    if(!keys){
        alert('key是空的，闹哪样呀！')
        return;
    }
    let midreg = /\n/
    let keysArr = keys.split(midreg)
    let mainArr = texts_main_vals.split(midreg)
    let subArr = texts_sub_vals.split(midreg)
    window.impinfo = {
        keysArr,
        mainArr,
        subArr
    }
    // console.log(keysArr)
    // console.log(mainArr)
    // console.log(subArr)
    if(keysArr.length !== subArr.length){
        alert('key和英文的数量不一致！'+keysArr.length+':'+subArr.length)
    }
    if(texts_main_vals)
    if(keysArr.length !== mainArr.length || mainArr.length !== subArr.length){
        alert('key和中/英文的数量不一致！'+keysArr.length+':'+mainArr.length+':'+subArr.length)
    }
    
    $('#import_excel_table').hide()
    let trs = ''
    let hasdup = false;
    let dupkeys = {}
    let main_json = {};
    let sub_json = {};

    let bad_mains = {}
    keysArr.forEach((key, i)=>{
        if(key){
            key = _.trim(key);
            keysArr[i] = key;
            if(dupkeys[key]){ 
                hasdup=true;
                dupkeys[key].push(subArr[i]); 
            }else{
                dupkeys[key]=[subArr[i]];
            }
            main_json[key] = mainArr[i]
            sub_json[key] = subArr[i]
            let key_exist = false;
            let mainVal_isSame = false;
            let subVal_isSame = false;
            if(!bad_mains[key])bad_mains[key] = []
            bad_mains[key].push(main_json[key])
            if(SuperJson[key]) {
                key_exist = true;
                if(SuperJson[key].cn === main_json[key]) mainVal_isSame = true;
                if(SuperJson[key].en === sub_json[key]) subVal_isSame = true;
            }
            trs += `<tr class="${i%2===0?'one':'two'}">
            <td style="color: gray;">${i+1}</td>
                <td class="${key_exist?'key_exist':''}" style="color: blue;">${getDisplayText(key)}</td>
                <td class="${mainVal_isSame?'mainVal_isSame':''}">${getDisplayText(mainArr[i])}</td>
                <td class="${subVal_isSame?'subVal_isSame':''}">${getDisplayText(subArr[i])}</td>
            </tr>`
        }
    })
    trs += `<tr><td colspan="99"><textarea id="textarea_import_excel" style="min-width:300px;width:100%;height:300px;"></textarea></td></tr>`
    let rpt_badmains = {}
    let has_badmains = false;
    for(let key in bad_mains){
        bad_mains[key] = _.uniq(bad_mains[key])
        if(bad_mains[key].length > 1) {
            rpt_badmains[key] = bad_mains[key];
            has_badmains = true;
        }
    }
    if(has_badmains){
        alert('同样的key，中文不一样！')
        console.warn(JSON.stringify(rpt_badmains))
    }
    if(hasdup){
        alert('发现重复的key，请在console中查看')
        for(let key in dupkeys){
            if(dupkeys[key].length>1)
            console.warn(key, dupkeys[key])
        }
        let hasconflict = false;
        for(let key in dupkeys){
            let arr = dupkeys[key];
            arr = _.uniq(arr);
            if(arr.length > 1) {
                hasconflict = true
                console.error('重复的key有多个文案：', key, arr)
            }
        }
        if(hasconflict) alert('发现重复的key，且英文值不一样，请在console中查看')
    }
    $('#do_importExcel').hide()
    $('#do_importExcel_step0').show()
    $('#do_importExcel_save').show()

    $('#import_confirm_table').show()
    $('#import_confirm_table').html(trs)
    $('#textarea_import_excel').val('var main_json='+JSON.stringify(main_json)+';\n\nvar sub_json='+JSON.stringify(sub_json));
}
do_saveImportExcel = () =>{
    let keysArr = window.impinfo.keysArr;
    let mainArr = window.impinfo.mainArr;
    let subArr = window.impinfo.subArr;

    if(keysArr.length !== subArr.length){
        alert('key和en的数量不一致'+keysArr.length+':'+subArr.length)
        return;
    }
    let newMainJson = {}
    let newSubJson = {}
    keysArr.forEach((key, i)=>{
        if(key){
            let o = OriginSuperJson[key];
            if(o){
                let oldMainVal = o.cn;
                let newMainVal = mainArr[i];
    
                let oldSubVal = o.en;
                let newSubVal = subArr[i];
    
                if(oldMainVal !== newMainVal) {
                    //丢弃，只收英文
                    //newMainJson[key] = newMainVal;
                }
                if(oldSubVal !== newSubVal) {
                    newSubJson[key] = newSubVal;
                }
            }else{
                newMainJson[key] = mainArr[i];
                newSubJson[key] = subArr[i];
            }
        }
    })
    let count = 0;
    for(let key in newSubJson) {
        if(!SuperJson[key]) SuperJson[key] = {}
        SuperJson[key].cn = newMainJson[key];
        SuperJson[key].en = newSubJson[key];
        count++;
    }
    console.log(JSON.stringify(newSubJson))
    console.log(JSON.stringify(newMainJson))
    console.log(`共${count}个`)
    updateSummary();
    close_popupWindow();
    
    $.ajax({//保存系统不存在的中文
        url: '/offlinedev/api/action/i18nSaveAsUntrans',
        cache: false,
        method: 'POST',
        data: {all: JSON.stringify(newMainJson)},
        success: function( response ) {
            console.log('response!')  
            do_save();//保存英文          
        }
    })    
}
do_verifyExcelEn = () =>{

}