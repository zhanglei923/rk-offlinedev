
 
 //*********************************************************************************/
 //   rk-offlinedev 注入一些辅助性代码
 //*********************************************************************************/
 (function(){
     var initRkOfflineDev = function(){
         var div = document.createElement('div');
         document.body.appendChild(div)
         div.setAttribute('id','rk-offlinediv')
         div.style.position='fixed';
         div.style['background-color']='#002520';
         div.style.color='#2fff56'
         div.style['font-size']= '11px';
         div.style.right='0px';
         div.style.bottom='0px';
         div.style.padding='1px 1px 1px 4px';
         div.style['z-index']='999998765';
         div.style['pointer-events']='none';
   
         let webbranch = rk_offlinedev.userConfig.webProjectInfo.branch;
         let offlinedevbranch = rk_offlinedev.userConfig.offlineDevInfo.branch;
         let debugmode = rk_offlinedev.userConfig.debug.mode;
         let modestatbrief = rk_offlinedev.userConfig.debug.modestatbrief;
         debugmode = debugmode?debugmode:'?'
         let debugcolor = (debugmode==='concat'?'color:#3497ff;':'')
         div.setAttribute('about', 'mini-console')
         div.innerHTML='<a style="color:#2fff56 !important;" href="http://localhost:666/offlinedev-http-console/" target="_blank">'+
                        'rk-dev'+
                        '</a>'+
                        '('+offlinedevbranch+')'+
                        ',&nbsp;"<span style="'+debugcolor+'">'+debugmode+'</span>"'+
                        '[<span title="css/tpl/js">'+modestatbrief+'<span>],&nbsp;web('+
                        webbranch+')'
         console.warn('[rk-offlinedev]seajs-text注入成功')
     };
     initRkOfflineDev()
     // if(document.all) {   
     //   window.attachEvent('onload', initRkOfflineDev);   
     // }else{   
     //   window.addEventListener('load', initRkOfflineDev, false);   
     // }
   })()