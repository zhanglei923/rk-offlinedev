var _ = require('lodash')
var foreachChildren = function (layoutInfo, callback) {
    (callback)(layoutInfo);
    var children = layoutInfo.children;
    if (children) {
        if (_.isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
                children[i]._parent = layoutInfo;
                foreachChildren(children[i], callback)
            }
        } else {
            for (var key in children) {
                var arr = children[key];
                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i]._parent = layoutInfo;
                    foreachChildren(arr[i], callback)
                }
            }
        }
    }
};

module.exports = {
    foreachChildren: foreachChildren
}