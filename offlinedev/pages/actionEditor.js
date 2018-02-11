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
    $('#btncreate').on('click', function(){
        $('#pathInput').val('')
        $('#actioncontent').val('')
    })
    $('#btnsave').on('click', function(){
        handleSaveClick()
    })
    $('#btntest').on('click', function(){
        handleTestClick()
    })
    $('#btnsync115').on('click', function(){
        handleSync115Click()
    })
    
    $(document).on( "click", "li[nicknamepath]", function() {
        var li = $(this)
        li.addClass('selected');
        li.siblings().removeClass('selected')
        var nicknamepath = li.attr('nicknamepath')
        var realpath = li.attr('realpath')
        showActionContent(nicknamepath, realpath, li.hasClass('action404'))
        //console.log(nicknamepath)
    });
    $(document).on( "mouseover", "li[nicknamepath]", function() {
        var li = $(this)
        li.addClass('mouseover');
        li.siblings().removeClass('mouseover')
    });
}
let renderList = function (result){
  let html = ''
  let pathcount = 0;
  result.files404.forEach(path =>{
      var nicknamepath = path+'';
      path = path.replace(/\~\~/g, '/');
      html += `<li realpath="${path}" nicknamepath="${nicknamepath}" class="actionurl action404">
                  <input type="checkbox">
                  <span class="tag">404</span>
                  <a href="javascript:">${path}</a>
                </li>`
  });
  result.files.forEach(path =>{
      pathcount++
      var nicknamepath = path+'';
      path = path.replace(/\~\~/g, '/');
      html += `<li realpath="${path}" nicknamepath="${nicknamepath}" class="actionurl">
                  <input type="checkbox">
                  <span class="tag">Local</span>
                  <a href="javascript:">${path}</a>
                  <div class="toolbar">
                    <a href="javascript:">+Schema</a>
                    <a href="javascript:">Use</a>
                  </div>
                </li>`
  });
  result.filesComp.forEach(path =>{
      pathcount++
      var nicknamepath = path+'';
      path = path.replace(/\.compdata/g, '');
      html += `<li realpath="${path}" nicknamepath="${nicknamepath}" class="actionurl comp">
                  <input type="checkbox">
                  <span class="tag">Local</span>
                  <a href="javascript:">${path}</a>
                  <div class="toolbar">
                    <a href="javascript:">+Schema</a>
                    <a href="javascript:">Use</a>
                  </div>
      </li>`
  });
  $('#actonlist').html(html)
  $('#pathcount').text('Total: '+pathcount)
}
let showActionContent = function(url, realpath, is404){
  $('#actioncontent').val('loading...')
  $.ajax({
      url: '/offlinedev/action/content/',
      cache: false,
      method: 'POST',
      is404: is404,
      data: {
          url: url
      },
      success: function( response ) {
          $('#pathInput').val(realpath)
          $('#actioncontent').val(
            $('#prettify').prop('checked') ? response.result.prettifycontent : response.result.content
          )
      },
      error: function(){
          var opt = $(this)[0]
          if(opt.is404){
              $('#pathInput').val(realpath)
              $('#actioncontent').val(
                ' >This data does not exist!\n'+
                ' >You can:\n'+
                '   1. Put your json content here and click [Save] to save.\n'+
                '   2. Or, click [Sync from 115] to download from server115 (N/A)\n'
                )
          }
      }
  });
}
var doValidateSubmit = function(url, content) {
  if(!url) {
    alert('null url')
    return false;
  }
  if(!/^\//.test(url)) {
    alert('url without prefix "/"')
    return false;
  }
  if(!content) {
    alert('null content')
    return false;
  }
  try{
     JSON.parse(content)
  }catch(e){
    alert('not valid json')
    return false;
  }
  return true;
}
//start!
$(()=>{
    init()
    initEvents()
})