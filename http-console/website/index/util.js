let beWorkingBtn = (btn)=>{
    if(btn.hasClass('is_working'))return;
    let orignal_html = btn.html();
    btn.attr('orignal_html', encodeURIComponent(orignal_html));
    btn.addClass('is_working');
    btn.html('working...');

    let randomid = 'r'+Math.random()+'';
    btn.attr('working_timer', randomid)
    btn.attr('working_timer_val', 0)
    showWorkingCounting(btn);
}
let showWorkingCounting = (btn)=>{
    let randomid = btn.attr('working_timer')
    clearTimeout(window[randomid])
    let newtime = 1000+Math.random()*500;
    window[randomid] = setTimeout(()=>{
        let working_timer_val = btn.attr('working_timer_val')*1;
        working_timer_val = working_timer_val + newtime;
        btn.attr('working_timer_val', working_timer_val)
        btn.html(`working...(${Math.round(working_timer_val/1000)}s)`);
        showWorkingCounting(btn);
    }, newtime)
}
let unWorkingBtn = (btn)=>{
    let orignal_html = btn.attr('orignal_html');
    orignal_html = decodeURIComponent(orignal_html);
    btn.removeClass('is_working');
    let randomid = btn.attr('working_timer')
    clearTimeout(window[randomid])
    btn.html(orignal_html)
}