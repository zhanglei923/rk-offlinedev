/****
 * Copyright https://github.com/zhanglei923/zl-strip-css-comment
 * Liscense MIT
 * Author: zhangei923@gmail.com / https://github.com/zhanglei923
 */
'use strict'

module.exports = function(cssContent) {

    let will_outof_comment = false;
    let is_in_comment = false;
    let newcontent = '';
    let prevChar1;
    let prevChar;
    let parseHtml = (char, forward)=>{
        //console.log('--->rd:', char, forward)
        if(char === '/' && forward[0] === '*') is_in_comment = true;
        if(is_in_comment && char === '*' && forward.match(/^\*{0,}\//)){
            will_outof_comment = true;
        } 
        if(will_outof_comment && prevChar1+prevChar === '*/' && char !== '/') {
            is_in_comment = false;
            will_outof_comment = false;
        }
        if(!is_in_comment) newcontent += char;
        prevChar1 = prevChar;
        prevChar = char;
    }
    
    let fultureArr = []//往前看10个
    let length = cssContent.length;
    for(let count = 0; count < length; count++) {
      let char = cssContent[count];
      //console.log('~~~~>', char)
      fultureArr.push(char)
      if(fultureArr.length > 10) {
          let char = fultureArr.shift();
          //console.log(char, fultureArr.join(''))
          parseHtml(char, fultureArr.join(''))
      }
    }
    //console.log(fultureArr.join(''))
    while(fultureArr.length > 0){
        let char = fultureArr.shift();
        //console.log(char, fultureArr.join(''))
        parseHtml(char, fultureArr.join(''))
    }
    
    return newcontent;
}
