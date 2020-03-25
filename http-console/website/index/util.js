let beWorkingBtn = (btn)=>{
    btn = $(btn)
    if(btn.hasClass('is_working'))return;
    let orignal_html = btn.html();
    let orignal_txt = btn.text();
    btn.attr('orignal_html', encodeURIComponent(orignal_html));
    btn.attr('orignal_txt', encodeURIComponent(orignal_txt));
    btn.addClass('is_working');
    btn.html(`${orignal_txt}...`);

    let randomid = 'r'+Math.random()+'';
    btn.attr('working_timer', randomid)
    btn.attr('working_timer_val', 0)
    showWorkingCounting(btn);
}
let showWorkingCounting = (btn)=>{
    let randomid = btn.attr('working_timer')
    clearTimeout(window[randomid])
    let newtime = 1000+Math.random()*500;
    let orignal_txt = btn.attr('orignal_txt');
    orignal_txt = decodeURIComponent(orignal_txt)
    window[randomid] = setTimeout(()=>{
        let working_timer_val = btn.attr('working_timer_val')*1;
        working_timer_val = working_timer_val + newtime;
        btn.attr('working_timer_val', working_timer_val)
        btn.html(`${orignal_txt}...(${Math.round(working_timer_val/1000)}s)`);
        showWorkingCounting(btn);
    }, newtime)
}
let unWorkingBtn = (btn)=>{
    btn = $(btn)
    let orignal_html = btn.attr('orignal_html');
    orignal_html = decodeURIComponent(orignal_html);
    btn.removeClass('is_working');
    let randomid = btn.attr('working_timer')
    clearTimeout(window[randomid])
    btn.html(orignal_html)
}