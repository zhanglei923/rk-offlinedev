let fs = require('fs')
var validate_reviewer = require('./reviewers/validate_reviewer')
var betajson_reviewer = require('./reviewers/betajson_reviewer')
var widgets_reviewer = require('./reviewers/widgets_reviewer')

let thisUtil = {
    validate:(jsonString)=>{
        var errors = [];
        let json; 
        try{
            json  = JSON.parse(jsonString);
        }catch(e){
            console.log(e);
        }
        if(!json) {
            errors.push({
                level: 'fatal',
                errorType: 'not_json',
                errorMsg: '不是json字符串'
            }) 
            return errors;
        }
        if(json.config) json = json.config;
        json = [json]
        errors = errors.concat(validate_reviewer.check(json));
        errors = errors.concat(betajson_reviewer.check(json));
        errors = errors.concat(widgets_reviewer.check(json));
        return errors;        
    }
}
module.exports = thisUtil;