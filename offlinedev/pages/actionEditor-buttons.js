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
  updateTotal(pathcount, 0)
}

let handleSaveClick = function(){
    var url = $('#pathInput').val()
    var content = $('#actioncontent').val()
    if(!doTestActionJson(url, content)){
      return;
    }
    var list = []
    $('#filelist li').each(function(i, li){
        var li = $(this);
        list.push({
            selected: li.find('input[type="checkbox"]').prop('checked'),
            filepath: li.attr('filepath')
        })
    });
    console.log(list)
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
    var url = $('#pathInput').val()
    var content = $('#actioncontent').val()
    var succ = doTestActionJson(url, content)
    if(succ) alert('json is OK')
}
let handleSync115Click = function(){
    alert('N/A')
}
