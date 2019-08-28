var term = new Terminal({
    //rows:30
});
term.open(document.getElementById('terminal'));
const prefix = '>'
term.write(`${prefix}`)
let inputingChars = []
let history = []
term.on('key', function(key, ev) {
    let keyCode = ev.keyCode;
    if(keyCode !== 13){
        term.write(key)//输入
        inputingChars.push(key)
    }else{
        let inputline = inputingChars.join('');
        inputingChars = []
        term.writeln(``)
        term.write(`${prefix}`)
        submit(inputline)
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