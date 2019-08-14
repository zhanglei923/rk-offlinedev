export_popupExport = ()=>{
    do_popupWindow('Import Excels', (content, footer)=>{
        let contentHtml = `
            <table id="import_excel_table" class="import_excel_table">
                <tr>
                    <td colspan="999">
                        <button id="do_export">export</button>
                        <span style="color:red;">导出的筛选逻辑，请直接在exportExcel.js里随时改</span>
                    </td>
                </tr>
                <tr>
                    <td class="td_keys"><textarea id="ex_texts_keys" class="texts_keys"/></td>
                    <td class="td_main_vals"><textarea id="ex_texts_main_vals" class="texts_main_vals"/></td>
                    <td class="td_sub_vals"><textarea id="ex_texts_sub_vals" class="texts_sub_vals"/></td>
                </tr>
            </table>
            <table id="import_confirm_table" class="import_confirm_table">
            </table>
        `
        content.html(contentHtml)
        footer.html(``)
        
        let visiblerows = $('#table').find('tr.row[data-key]:visible')
        let keys = {}
        visiblerows.each((i,b)=>{
            let k = b.getAttribute('data-key');
            if(k)keys[k] = true;
        })
        let nullEnItems = []
        for(let key in OriginSuperJson){
            let cn = OriginSuperJson[key].cn;
            let en = OriginSuperJson[key].en;
            if(!en || typeof en === 'undefined')
            if(keys[key]) {
                nullEnItems.push(key)
            }
        }
        let key_str='';
        let cn_str='';
        nullEnItems.forEach((key)=>{
            key_str = key_str + key + '\n'
            cn_str = cn_str + OriginSuperJson[key].cn + '\n'
        })
        $('#ex_texts_keys').val(key_str);
        $('#ex_texts_main_vals').val(cn_str);
        console.log(nullEnItems, nullEnItems.length)
    })
}