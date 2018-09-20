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
    $('#file').on('change', function(){
        var filepath = $(this).val()
        appendFileLink(filepath)
        saveFileList();
    })
    $('#filepath_addbtn').on('click', function(){
        var filepath = prompt('Input file path')
        if(filepath){
            appendFileLink(filepath)
            saveFileList();
        }
    })
    $('#actionfiles').on('click', '.file_item', function(){
        var item = $(this);
        $('#actionfiles').find('.file_item input[type="checkbox"]').prop('checked','');
        item.find('input[type="checkbox"]').prop('checked','true');
        updateToolbarStatus(item.attr('filepath'))
        saveFileList();
        let filepath = item.attr('filepath')
        if(filepath === 'mock'){
            showActionContent(currentNickUrl)
        }else{
            loadLinkFileContent(filepath)
        }
    });    
    $(document).on( "click", "li[nicknamepath]", function() {
        var li = $(this)
        li.addClass('selected');
        li.siblings().removeClass('selected')
        var nicknamepath = li.attr('nicknamepath')
        currentNickUrl  = nicknamepath;
        var realpath = li.attr('realpath')
        showFileLinks(nicknamepath, realpath)
        $('#pathInput').val(realpath)
        //showActionContent(nicknamepath, li.hasClass('action404'))
        //console.log(nicknamepath)
    });
    $(document).on( "mouseover", "li[nicknamepath]", function() {
        var li = $(this)
        li.addClass('mouseover');
        li.siblings().removeClass('mouseover')
    });
}
let updateToolbarStatus = (filepath)=>{
    if(filepath==="mock"){
        $('#actioncontent').attr('readonly','').removeClass('readonly');
        $('#btnsave').prop('disabled', false)
    }else{
        $('#actioncontent').attr('readonly','readonly').addClass('readonly');
        $('#btnsave').prop('disabled', true)
    }
}
let appendFileLink = (filepath, checked)=>{
    if(typeof checked === 'undefined') checked =  false;
    if(checked){
        $('#filelist li input[type="checkbox"]').each(function(){
            var ipt = $(this)
            ipt.prop('checked', false)//先reset
        })
    }
    let ipt = checked ? `<input type="checkbox" checked="checked">`:`<input type="checkbox">`;
    let li = `<li class="file_item" filepath="${filepath}">${ipt}${filepath}</li>`
    $('#filelist').append(li)
}
let saveFileList = ()=>{
    var url = $('#pathInput').val()
    if(!doTestUrl(url, false)) return;
    var flist = []
    $('#filelist li').each(function(i, li){
        li=$(li)
        flist.push({
            selected: li.find('input[type="checkbox"]').prop('checked'),
            filepath: li.attr('filepath')
        })
    });
    $.ajax({
        url: '/offlinedev/action/savefilelink/',
        cache: false,
        method: 'POST',
        data: {
            url: url,
            flist: flist
        },
        success: function( response ) {
            console.log('saved!')            
        }
    });
};
let renderList = function (result){
  let html = ''
  let path404count = 0;
  let pathcount = 0;
  result.files404.forEach(path =>{
      var nicknamepath = path+'';
      path404count++
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
  updateTotal(pathcount, path404count)
}
let updateTotal = function(pathcount, path404count){
  $('#pathcount').html(`Total: <span class="totalcount totalcount404">${path404count}</span><span class="totalcount">${pathcount}</span>`)
}
let loadLinkFileContent = function(filepath){
    console.log('load:', filepath)
    $.ajax({
        url: '/offlinedev/action/loadfilelinkContent/',
        cache: false,
        method: 'POST',
        data: {
            filepath: encodeURIComponent(filepath)
        },
        success: function( response ) {
            console.log(response);
            if(response && response.result){
                $('#actioncontent').val(response.result)
            }else{
                $('#actioncontent').val('')
            }
        }
    });
}
let showFileLinks = (url, realpath)=>{
    $.ajax({
        url: '/offlinedev/action/getfilelink/',
        cache: false,
        method: 'POST',
        data: {
            url: url
        },
        success: function( response ) {
            $('#filelist').html('')
            if(response.result && $.isArray(response.result)){
                appendFileLink('mock');
                var is_non_mock;
                response.result.forEach((o)=>{
                  if(o.filepath !== 'mock'){
                    appendFileLink(o.filepath, o.selected);
                    if(o.selected) is_non_mock = true;
                  }
                })
                if(!is_non_mock){
                    $('li[filepath="mock"] input').prop('checked', true)
                }
            }else{              
              appendFileLink('mock', true);
            }
            $('#filelist li').each((i, li)=>{
                li=$(li)
                if(li.find('[type="checkbox"]').prop('checked')) li.click();
            })
        }
    });
}
var currentNickUrl;
let showActionContent = function(nickurl, is404){
  $('#actioncontent').val('loading...');  
  if(typeof is404 === 'undefined') is404 = false;
  $.ajax({
      url: '/offlinedev/action/content/',
      cache: false,
      method: 'POST',
      is404: is404,
      data: {
          url: nickurl
      },
      success: function( response ) {
          
          $('#actioncontent').val(
            $('#prettify').prop('checked') ? response.result.prettifycontent : response.result.content
          )
      },
      error: function(){
          var opt = $(this)[0]
          if(opt.is404){
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
//start!
$(()=>{
    init()
    initEvents()
})