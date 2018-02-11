let filter_path = function(val){
  val = val.replace(/^\s{1,}/g, '').replace(/\s{1,}$/g, '');;
  val = val.replace(/\s{1,}/g, ' ');
  var arr = val.split(/\s/)
      
  var lval = val ? val.toLowerCase() : ''
  var pathcount=0
  $('#actonlist').find('>li').each(function(){
      var li = $(this)
      var text = li.attr('realpath').toLowerCase()
      var show = true;
      arr.forEach(function(key){
          if(text.indexOf(key)>= 0){
           show = show && true
         }else{
          show = false;
         }
      })
      show ? li.show() : li.hide()
      show ? pathcount++ : null;
    })
  $('#pathcount').text('Total: '+pathcount)
}

let handleSaveClick = function(){
    var url = $('#pathInput').val()
    var content = $('#actioncontent').val()
    if(!doValidateSubmit(url, content)){
      return;
    }
    $.ajax({
        url: '/offlinedev/action/save/',
        cache: false,
        method: 'POST',
        data: {
            url: url,
            content: content
        },
        success: function( response ) {
            alert('sucess!')
            
        }
    });
}
let handleTestClick = function(){
    alert('test')
}
let handleSync115Click = function(){
    alert('handleSync115Click')
}
