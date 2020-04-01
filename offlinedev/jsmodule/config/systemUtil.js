var fs = require('fs');
var _ = require('lodash')
var pathutil = require('path');

var format = function(bytes) { 
    return (bytes/1024/1024).toFixed(2); 
};
module.exports = {
    reportStatus: ()=>{
        var mem = process.memoryUsage();
        let node_version = process.version;
        return {
            node_version,
            mem,
            meminfo:{
                usedtotalPersentage: ((mem.heapUsed/mem.heapTotal)*100).toFixed(2),
                heapTotalMB: format(mem.heapTotal),
                heapUsedMB: format(mem.heapUsed),
                rssMB: format(mem.rss),
            }
        }
    }
}