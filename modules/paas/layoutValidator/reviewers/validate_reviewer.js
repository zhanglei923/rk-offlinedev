var rk_layout = require('./rk_layout');
var _ = require('lodash')

module.exports = {
    check: function(result) {
        var errors = [], fatal = [];
        var json, layout, widgets;
        for(var i = 0, len = result.length; i<len;i++){
            json = result[i];
            layout = json.layout;
            widgets = json.widgets;

            if(!layout){
                errors.push({
                    errorType: 'no_layout',
                    errorInfo: {
                        jsonid: json.id
                    },
                    errorMsg: '找不到layout段：layout id='+json.id+''
                })
                fatal.push(json.id)
                continue;
            }
            if(!widgets){
                errors.push({
                    errorType: 'no_widgets',
                    errorInfo: {
                        jsonid: json.id
                    },
                    errorMsg: '找不到widgets段：layout id='+json.id+''
                })
                fatal.push(json.id)
                continue;
            }
            if(_.isArray(layout)){//手机布局，有时候没有root的节点，因此构造一个假的
                var fakeid="999999999"
                layout = {
                    "uuid": fakeid,
                    "children": layout
                }
                widgets[fakeid] = {"uuid": fakeid}
                errors.push({
                    level: 'warn',
                    errorType: 'mobile_has_no_root',
                    errorInfo: {
                        jsonid: json.id
                    },
                    errorMsg: '移动端layout没有root节点，id='+json.id
                }) 
            }
            var str_widgets = JSON.stringify(widgets)
            if(/[\u4e00-\u9fa5]+/ig.test(str_widgets)){
                //console.log('needs_i18n')
                errors.push({
                    level: 'info',
                    errorType: 'needs_i18n',
                    errorInfo: {
                        jsonid: json.id
                    },
                    errorMsg: '有未国际化的字符串，id='+json.id
                }) 
            }
            {
                for(var uuid in widgets){
                    var reg1 = new RegExp('\\"'+uuid+'\\"\s?\:','g');
                    var result1 = str_widgets.match(reg1);
                    if(result1 && result1.length > 1) errors.push({
                                                            errorType: 'dup_widgets_uuid',
                                                            errorInfo: {
                                                                jsonid: json.id
                                                            },
                                                            errorMsg: 'widgets里有重复定义的id'
                                                        })
                    if(!/^-?[0-9]*$/.test(uuid+''))errors.push({
                                                            errorType: 'not_numeric_uuid',
                                                            errorInfo: {
                                                                jsonid: json.id
                                                            },
                                                            errorMsg: '控件uuid不是数字'+uuid
                                                        })
                }
            }
            var layoutidList = {}
            rk_layout.foreachChildren(layout, function(node){
                //console.log(node)
                if(!node.uuid) {
                    errors.push({
                        errorType: 'no_widget_id',
                        errorInfo: {
                            jsonid: json.id
                        },
                        errorMsg: 'layout里的控件无uuid：layout id='+json.id
                    })
                    fatal.push(json.id)
                }else if(!widgets[node.uuid]) {
                    errors.push({
                        errorType: 'no_widget_define',
                        errorInfo: {
                            jsonid: json.id
                        },
                        errorMsg: 'layout里的控件在widgets段里无定义：uuid=' + node.uuid
                    })
                }
                if(layoutidList[node.uuid+'']){
                    errors.push({
                        errorType: 'dup_uuid',
                        errorInfo: {
                            jsonid: json.id
                        },
                        errorMsg: 'layout里含有重复的uuid：' + node.uuid
                    })
                }
                layoutidList[node.uuid+''] = true;
            })
            for(var layoutuuid in widgets){
                if(!layoutidList[layoutuuid]){
                    errors.push({
                        level: 'warn',
                        errorType: 'useless_widgets_info',
                        errorInfo: {
                            jsonid: json.id
                        },
                        errorMsg: 'widgets里有废数据：控件id='+ layoutuuid
                    })
                }
            }
        }
        if(fatal.length > 0)
        errors.push({
            errorType: 'invalid_json',
            errorInfo: {
                fatal_id: fatal
            },
            errorMsg: 'json是废数据，无法使用'
        });
        return errors;
    }
}