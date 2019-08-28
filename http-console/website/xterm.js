var term = new Terminal({
    rows:30
});
term.open(document.getElementById('terminal'));
const prefix = '>'
term.write(`${prefix}`)
let commands = []
term.on('key', function(key, ev) {
    let keyCode = ev.keyCode;
    if(keyCode !== 13){
        term.write(key)//输入
        commands.push(key)
    }else{
        let inputlines = commands.join('');
        commands = []
        term.writeln(``)
        term.write(`${prefix}`)
        submit(inputlines)
    }
    console.log("key==========",ev.keyCode);
    
    //term.writeln(key)//输入并换行
});
term.addDisposableListener('focus', function () {
    console.log('focus')
  })
let submit = (inputlines)=>{
    console.log(inputlines)
    $.ajax({
        url: '/offlinedev/api/terminal/aaa',
        cache: false,
        method: 'POST',
        data: {},
        success: function( response ) {
          console.log(response)

        },
        error:function(ajaxObj,msg,err){
        }
    });
}