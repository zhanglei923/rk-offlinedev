let init = function(){
  $.ajax({
      url: '/offlinedev/action/list/',
      cache: false,
      method: 'POST',
      data: {},
      success: function( response ) {
        renderList(response.result)
      }
  });
}
let filter_timer;
let initEvents = function(){
  $('#pathfilterinput').on('keyup', function(){
    var val = $(this).val()
    window.clearTimeout(filter_timer)
    filter_timer = window.setTimeout(function(){
      filter_path(val);      
    }, 200)
  })
}
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
let renderList = function (result){
  let html = ''
  let pathcount = 0;
  result.files.forEach(path =>{
    pathcount++
    var nicknamepath = path+'';
    path = path.replace(/\~\~/g, '/');
    html += `<li realpath="${path}" nicknamepath="${nicknamepath}"><a href="javascript:">${path}</a></li>`
  });
  result.filesComp.forEach(path =>{
    pathcount++
    var nicknamepath = path+'';
    path = path.replace(/\.compdata/g, '');
    html += `<li realpath="${path}" nicknamepath="${nicknamepath}" class="comp"><a href="javascript:">控件：${path}</a></li>`
  });
  $('#actonlist').html(html)
  $('#pathcount').text('Total: '+pathcount)
}
let showActionContent = function(url, realpath){
  $('#actioncontent').val('loading...')
  $.ajax({
    url: '/offlinedev/action/content/',
    cache: false,
    method: 'POST',
    data: {
      url: url,
      prettify: true
    },
    success: function( response ) {
      $('#pathInput').val(realpath)
      $('#actioncontent').val(response.result.content)
    }
});
}
$(document).on( "click", "li[nicknamepath]", function() {
  var li = $(this)
  li.addClass('selected');
  li.siblings().removeClass('selected')
  var nicknamepath = li.attr('nicknamepath')
  var realpath = li.text()
  showActionContent(nicknamepath, realpath)
  console.log(nicknamepath)
});
$(()=>{
  init()
  initEvents()
})