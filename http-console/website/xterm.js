const prefix = '[offlinedev]>'
let inputingChars = []
let history = []

let KEY_ENTER = 13;
let KEY_BACKWARD = 8;
let KEY_ARROW_LEFT = 37;
let KEY_ARROW_RIGHT = 39;
let KEY_ARROW_UP = 38;
let KEY_ARROW_DOWN = 40;

let query = window.location.search;
let prjpath = decodeURIComponent(query.replace(/^\?folder=/,''));

$(function () {
    var term = new Terminal();
    window.term=term;
    term.open(document.getElementById('terminal'));

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
        term.writeln('Welcome to rk-offline terminal!');
        term.writeln(`Working on directory: ${prjpath}`);
        term.prompt();
        term.focus()
        term.on('key', function(key, ev) {
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
let submit = (inputline)=>{
    console.log(inputline)
    history.push(inputline)
    $.ajax({
        url: '/offlinedev/api/terminal/exec',
        cache: false,
        method: 'POST',
        data: {inputline, prjpath},
        success: function( response ) {
          let result = response.result;
          if(result){
            console.log(result)
              let arr = result.split('\n');
              arr.forEach((line)=>{
                term.writeln(`${line}`)
              })
              //term.prompt();
              term.write(`${prefix}`)
              term.scrollToBottom()
          }

        },
        error:function(ajaxObj,msg,err){
        }
    });
}