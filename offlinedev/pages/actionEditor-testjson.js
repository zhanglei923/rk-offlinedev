var doTestActionJson = function(url, content) {
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