var ls_key = 'offlinedev_casename'

$('#caseselect').on('change', function(){
  var casename = $(this).val();
  localStorage.setItem(ls_key, casename);
})
$('#webpath').on('change', function(){
  var webprojectpath = $(this).val();
  //console.log(webprojectpath)
  saveWebProjectPath(webprojectpath)
})
$.ajax({
        url: 'http://10.10.0.115:3004/offlinedev/folders',
        jsonp: "callback",
        jsonpCallback:"Callback",
        dataType: "jsonp",
        cache: false,
        timeout: 2500,
        data: {},
        success: function( response ) {
            console.log(response)
            var data = JSON.parse(response);
            console.log(data)
            var html = ''// '<option value="">LOCAL</option>'
            data.forEach(function(name){
              name = name.replace(/\/{1,}/g,'');
              html += '<option value="'+name+'">[115]:' +name+ '</option>'
            })
            $('#caseselect').html(html)
            $('#caseselect').val(localStorage.getItem(ls_key))
        },
        error:function(ajaxObj,msg,err){
          $('#caseselect').replaceWith('<span style="color:red">115 is out-of-service.</span>')
          $('#download-btn').remove();
        },
        complete: function(){
          
        }
    });
$.ajax({
        url: '/offlinedev/api/getWebProjectInfo/',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
          console.log(response)
          let result = response.result;
          $('#branchname').text(result.branchName)
          $('#webpath').html(`${result.isCustomizedWebRoot?'自定义:':''} ${result.webpath}`)
          if(result.isCustomizedWebRoot)$('#webpath').addClass('user-config')
          showInfomation(result);
        },
        error:function(ajaxObj,msg,err){
        }
    });
var save = function(){
  $.ajax({
        url: '/offlinedev/api/saveUserConfig/',
        cache: false,
        method: 'POST',
        data: {
          caseName: 2222
        },
        success: function( response ) {

        },
        error:function(ajaxObj,msg,err){
        }
    });
}
$('#download-btn').click(function(){
  var caseName = $('#caseselect').val()
  if(!caseName){
     alert('本地开发，不需同步')
     return;
  }
  $('#download-btn').addClass('busy')
  $('#download-btn').text('Downloading...')
   $.ajax({
        url: '/offlinedev/api/syncCases/',
        cache: false,
        method: 'POST',
        data: {
          caseName: $('#caseselect').val()
        },
        success: function( response ) {
          $('#download-btn').removeClass('busy')
          $('#download-btn').text('Success, re-Use')
        },
        error:function(ajaxObj,msg,err){
        }
    });
})
let saveWebProjectPath = (prjpath)=>{
  $.ajax({
        url: '/offlinedev/api/webpath/updateWebProjectPath/',
        cache: false,
        method: 'POST',
        data: {prjpath},
        success: function( response ) {
          console.log(response)
        },
        error:function(ajaxObj,msg,err){
        }
    });
}
var visithistoryKey = 'offlinedev_visithistory'
var visithistory = localStorage.getItem(visithistoryKey) ? localStorage.getItem(visithistoryKey).split(',') : []
var visithistoryHtml = ''
visithistory.reverse().forEach(function(his){
  visithistoryHtml += `<li>- <a href="${his}" target="_blank">${his}</a></li>`
})
$('#visithistory').html('<ul>'+visithistoryHtml+'</ul>');