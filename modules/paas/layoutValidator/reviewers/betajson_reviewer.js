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

            var real_id13 = '13', real_id14 = '14';
            var invalid_children = false;
            rk_layout.foreachChildren(layout, function(info){
                if(widgets[info.uuid] && widgets[info.uuid].widgetType === 'xsyHorizontalLayout' && _.isArray(info.children)) {
                    invalid_children = true;
                    if(info.children.length > 2){
                        console.log('xsyHorizontalLayout为数组时，孩子不应当大于两个')
                        errors.push({
                            errorType: 'xsyHorizontalLayout_multi_children',
                            errorInfo: {
                                jsonid: json.id
                            },
                            errorMsg: 'xsyHorizontalLayout为数组时，孩子不应当大于两个：layout id='+json.id+''
                        }) 
                    }
                }

                // if(invalid_children){
                //     errors.push({
                //         level: 'warn',
                //         errorType: 'xsyHorizontalLayout_sin',
                //         errorInfo: {
                //             jsonid: json.id
                //         },
                //         errorMsg: 'xsyHorizontalLayout的孩子不应当为数组：layout id='+json.id+''
                //     }) 
                // }
            });
        }
        return errors;
    }
}