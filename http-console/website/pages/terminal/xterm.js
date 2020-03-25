const prefix = '[应急用/莫当真]$ '
let inputingChars = []
let history = []

let KEY_ENTER = 13;
let KEY_BACKWARD = 8;
let KEY_ALT = 9;
let KEY_ARROW_LEFT = 37;
let KEY_ARROW_RIGHT = 39;
let KEY_ARROW_UP = 38;
let KEY_ARROW_DOWN = 40;

let query = window.location.search;
let prjpath = decodeURIComponent(query.replace(/^\?folder=/,''));
$('#prjpath').html(`当前目录: "<span style="color:blue;">${prjpath}</span>"。临时应急用，请勿当正常终端。`)
$('body').on('click', 'button[act]', (e)=>{
    let btn = $(e.target);
    let act=  btn.attr('act');
    if(act==='reset-git-project' && confirm(`确定重置${prjpath}工程吗？改动全丢弃啦？`)){
        submit(`git checkout . && git clean -xdf && git reset --hard HEAD`, ()=>{
            submit(`git status`)
        })
    }
})
$(function () {
    var term = new Terminal({rows:30});
    window.term=term;
    term.open(document.getElementById('terminal'));
    // $('body').on('mousedown', ()=>{
    //     console.log('f')
    //     term.focus()
    // })
    function runFakeTerminal() {
        if (term._initialized) {
            return;
        }
        term._initialized = true;
        term.addDisposableListener('focus', function () {
            console.log('focus')
        })
        term.prompt = () => {
            term.write(`${prefix}`);
        };
        //term.writeln(``);
        //term.writeln(`Working on:  \x1B[1;1;4m${prjpath}\x1B[0m `);
        term.prompt();
        term.focus()
        term.writeln(``); submit('git status')
        term.on('key', function(key, ev) {
            if(KEY_ALT === ev.keyCode) return;
            const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode === KEY_ENTER) {
                term.writeln(``)
                let inputline = inputingChars.join('');
                inputingChars = []
                //term.writeln(``)
                //term.write(`${prefix}`)
                submit(inputline)
            } else if (ev.keyCode === KEY_BACKWARD) {
                // Do not delete the prompt
                if (term._core.buffer.x > 2) {
                    term.write('\b \b');
                }
                inputingChars.pop();
            } else if (printable) {
                term.write(key);
                inputingChars.push(key)
            }
        });

        term.on('paste', function(data) {
            term.write(data);
        });
    }
    runFakeTerminal();
});
let submit = (inputline, callback)=>{
    if(typeof callback === 'undefined') callback = ()=>{};
    console.log(inputline)
    history.push(inputline)
    $.ajax({
        url: '/offlinedev/api/terminal/exec',
        cache: false,
        method: 'POST',
        data: {
            inputline: encodeURIComponent(inputline), 
            prjpath
        },
        success: function( response ) {
          let result = response.result;
          if(result){
            result = decodeURIComponent(result)
            console.log(result)
              let arr = result.split('\n');
              arr.forEach((line)=>{
                term.writeln(`${line}`)
              })
          }
          term.write(`${prefix}`)
          term.scrollToBottom()
          callback(true)
        },
        error:function(ajaxObj,msg,err){
            callback(false)
        }
    });
}