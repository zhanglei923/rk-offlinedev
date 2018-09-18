var doTestUrl = function(url, quite) {
  if(typeof quite === 'undefined') quite = false;
  if(!url) {
    if(!quite)alert('null url')
    else  console.warn('null url')            
    return false;
  }
  if(!/^\//.test(url)) {
    //if(!quite)alert('url without prefix "/"')
    return true;
  }
  return true;
}
var doTestActionJson = function(url, content) {
  if(!doTestUrl(url)) {
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