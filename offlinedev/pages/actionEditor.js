$.ajax({
    url: '/offlinedev/action/list/',
    cache: false,
    method: 'POST',
    data: {},
    success: function( response ) {
      renderList(response.result.files)
    },
    error:function(ajaxObj,msg,err){
    }
});
let renderList = function (files){
  let html = ''
  files.forEach(path =>{
    var nicknamepath = path+'';
    path = path.replace(/\~\~/g, '/');
    html += `<li nicknamepath="${nicknamepath}"><a href="javascript:">${path}</a></li>`
  });
  $('#actonlist').html(html)
  
}
let showActionContent = function(url){
  $('#actioncontent').val('loading...')
  $.ajax({
    url: '/offlinedev/action/content/',
    cache: false,
    method: 'POST',
    data: {
      url: url
    },
    success: function( response ) {
      $('#actioncontent').val(response.result.content)
    },
    error:function(ajaxObj,msg,err){
    }
});
}
$(document).on( "click", "li[nicknamepath]", function() {
  var li = $(this)
  li.addClass('selected');
  li.siblings().removeClass('selected')
  var nicknamepath = li.attr('nicknamepath')
  showActionContent(nicknamepath)
  console.log(nicknamepath)
});