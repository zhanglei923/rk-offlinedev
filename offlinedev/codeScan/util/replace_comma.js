let do_replace = (content)=>{
    content = content.replace(/\,\s{0,}(\r\n){1,}\s{0,}[\)\}]{1}/g, (txt)=>{
        console.log(txt)
        return txt.replace(/\,/g, '');
    });
    return content;
}
module.exports = {
    do_replace
}