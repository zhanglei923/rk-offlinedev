import_help_text = `
---------------------
使用说明：
1) 将excel梳理成“key”，“中文”，“英文”三列，最好不含任何头部
2) 将这三列分别粘贴进这三个文本框，如果没有中文，可以忽略。
3) 点击ok，进入确认列表
`
import_popupImport = ()=>{
    do_popupWindow('Import Excels', (content, footer)=>{
        let contentHtml = `
            <table id="import_excel_table" class="import_excel_table">
                <tr>
                    <td class="td_keys"><textarea id="texts_keys" class="texts_keys" placeholder="KEY ${import_help_text}"></textarea></td>
                    <td class="td_main_vals"><textarea id="texts_main_vals" class="texts_main_vals"  placeholder="CN"/></td>
                    <td class="td_sub_vals"><textarea id="texts_sub_vals" class="texts_sub_vals"  placeholder="EN"/></td>
                </tr>
            </table>
            <table id="import_confirm_table" class="import_confirm_table">
            </table>
        `
        content.html(contentHtml)
        footer.html(`
                        <button id="do_importExcel" class="do_importExcel">Ok&gt;</button>
                        <a href="javascript:;" id="do_importExcel_step0" style="display:none;">&lt;back</a>
                        &nbsp;
                        <button id="do_importExcel_save" style="display:none;">Apply!</button>
                        
                        `)
        $('#do_importExcel').click(()=>{
            $('#do_importExcel').hide()
            $('#do_importExcel_step0').show()
            $('#do_importExcel_save').show()
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

    let keysArr = keys.split(/\n/)
    let mainArr = texts_main_vals.split(/\n/)
    let subArr = texts_sub_vals.split(/\n/)
    window.impinfo = {
        keysArr,
        mainArr,
        subArr
    }
    // console.log(keysArr)
    // console.log(mainArr)
    // console.log(subArr)
    if(keysArr.length !== subArr.length){
        alert('key和英文的数量不一致！')
        return;
    }
    
    $('#import_excel_table').hide()
    let trs = ''
    keysArr.forEach((key, i)=>{
        if(key)
        trs += `<tr class="${i%2===0?'one':'two'}">
        <td style="color: gray;">${i}</td>
            <td style="color: blue;">${getDisplayText(key)}</td>
            <td>${getDisplayText(subArr[i])}</td>
        </tr>`
    })
    $('#import_confirm_table').show()
    $('#import_confirm_table').html(trs)
}
do_saveImportExcel = () =>{
    let keysArr = window.impinfo.keysArr;
    let mainArr = window.impinfo.mainArr;
    let subArr = window.impinfo.subArr;

    if(keysArr.length !== subArr.length){
        alert('key和en的数量不一致')
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
        url: '/offlinedev/action/i18nSaveAsUntrans',
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