var fs = require('fs');
var pathutil = require('path');

var configJson = require('../config/configUtil').get()

module.exports = {
    updateHtml: function (html){
        var newHost = configJson.debugHost;
        var hostnames = {};
        //获取所有https的url
        html = html.replace(/\"https\:\/\/[\w\-\.\/]{1,}\"/g, function(staticUrl){
            //获取所有ingage和xiaoshouyi的url
            var newUrl = staticUrl.replace(/\"https\:\/\/[\w\-\.\/]{1,}\.(ingageapp|xiaoshouyi)\.com/g, function(host){
                var _host = host.replace(/(\'|\")/g,'');
                hostnames[_host]=_host
                return host;
            })
            return newUrl;
        })
        //替换成新域名
        for(var host in hostnames){
            var reg = new RegExp(host, 'g'); 
            html = html.replace(reg, newHost)
        }
        return html
    }
}