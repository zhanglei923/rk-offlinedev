const urlParser = require('url');

var _thisUtil = {
    isStaticFile:(url)=>{
        if(url.match(/(\.ts|\.js|\.tpl|\.css)$/)){
            return true;
        }
        return false;
    },
    getUrlQueryAsStr: (url) => {
        const myURL = urlParser.parse(url);
        //console.log('my: ', myURL.hostname, myURL.pathname, myURL.searchParams )
        //console.dir(myURL.query)
        var keys = []
        if(myURL.query){
            var list = myURL.query.split('&');
            list.forEach((pair)=>{ 
                var arr = pair.split('=')
                var key = arr[0]
                var val = arr[1]
                keys.push(key)
            })
            keys = keys.sort();
            console.log(keys)
        }
        var keysStr = keys.join('&')
        return {
            keysStr,
            pathname: myURL.pathname
        };
    },
    getSaveName: function(url){
        var parsed = _thisUtil.getUrlQueryAsStr(url);
		var keysStr = parsed.keysStr;

    	var saveUrl = parsed.pathname;
    	saveUrl = saveUrl.replace(/\/{1,}/ig, '/')
		saveUrl = saveUrl.replace(/\//ig, '~~')
		if(keysStr)saveUrl += '+'+keysStr
        return saveUrl;
    }
};
module.exports = _thisUtil;