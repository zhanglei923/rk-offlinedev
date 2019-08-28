var term = new Terminal({
    //rows:30
});
term.open(document.getElementById('terminal'));
const prefix = '>'
term.write(`${prefix}`)
let inputingChars = []
let history = []

let KEY_ENTER = 13;
let KEY_BACKWARD = 8;
let KEY_ARROW_LEFT = 37;
let KEY_ARROW_RIGHT = 39;
let KEY_ARROW_UP = 38;
let KEY_ARROW_DOWN = 40;

term.on('key', function(key, ev) {
    let keyCode = ev.keyCode;
    if(keyCode === KEY_ENTER){
        let inputline = inputingChars.join('');
        inputingChars = []
        term.writeln(``)
        term.write(`${prefix}`)
        submit(inputline)
    }else if(keyCode === KEY_BACKWARD){
        inputingChars.pop();
        term.writeln(``)
        term.write(`${prefix}`+inputingChars.join(''))
    }else if(keyCode === KEY_ARROW_LEFT){
        
    }else if(keyCode === KEY_ARROW_RIGHT){
        
    }else if(keyCode === KEY_ARROW_UP){
        
    }else if(keyCode === KEY_ARROW_DOWN){
        
    }else{
        term.write(key)//输入
        inputingChars.push(key)
    }
    console.log("key==========",ev.keyCode);
    
    //term.writeln(key)//输入并换行
});
term.addDisposableListener('focus', function () {
    console.log('focus')
  })
let submit = (inputline)=>{
    console.log(inputline)
    history.push(inputline)
    $.ajax({
        url: '/offlinedev/api/terminal/aaa',
        cache: false,
        method: 'POST',
        data: {inputline},
        success: function( response ) {
          let result = response.result;
          if(result){
            console.log(result)
              let arr = result.split('\n');
              console.log(arr)
              arr.forEach((line)=>{
                term.writeln(`${line}`)
              })
              term.write(`${prefix}`)
              term.scrollToBottom()
          }

        },
        error:function(ajaxObj,msg,err){
        }
    });
}