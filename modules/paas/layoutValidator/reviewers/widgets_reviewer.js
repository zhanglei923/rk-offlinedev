var rk_layout = require('./rk_layout');
var _ = require('lodash')

module.exports = {
    check: function(result) {
        //检测xsyHorizontalLayout的孩子是否为数组
        var errors = [];
        var json, layout, widgets;
        for(var i = 0, len = result.length; i<len;i++){
            json = result[i];
            layout = json.layout;
            widgets = json.widgets;

            if(!layout || !widgets){
                continue;
            }

            rk_layout.foreachChildren(layout, function(info){
                var parent = info._parent;
                if(/Refer$/.test(info.widgetType)){
                    if(parent.widgetType !== 'xsyReferContainer'){
                        errors.push({
                            errorType: 'parent_mustbe_xsyReferContainer',
                            errorInfo: {
                                jsonid: json.id
                            },
                            errorMsg: 'Refer控件的父容器比如是xsyReferContainer：' + info.uuid
                        })
                    }
                }
            });
        }
        return errors;
    }
}