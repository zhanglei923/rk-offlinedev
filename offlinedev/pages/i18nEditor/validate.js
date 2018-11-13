var do_validate = () =>{
    $('#table >tbody>tr').each(function(i, tr){
        tr=$(tr)
        var len1 = tr.find('.cellmainlang').innerWidth()        
        var len2 = tr.find('.cellsublang').innerWidth()
        //console.log(len1, len2)
        tr.find('.validate_info').html(`${len1-len2}`)
    })
}