//由于fs.existSync速度太慢，因此采用其他方式
global.__rk_updateExistingFiles_timer;
global.__rk_updateExistingFiles_running;
let updateExistingFiles = ()=>{
    console.log(global.__rk_updateExistingFiles_running)
    if(!global.__rk_updateExistingFiles_running){
        do_updateExistingFiles();
        return;
    }
    global.clearTimeout(global.__rk_updateExistingFiles_timer);//避免密集执行
    global.__rk_updateExistingFiles_timer = global.setTimeout(()=>{        
        global.__rk_updateExistingFiles_running = false;
    },10)
};
let do_updateExistingFiles = ()=>{
    global.__rk_updateExistingFiles_running = '1';
    console.log('update exi');
};
let existSync = ()=>{

};
var _thisUtil = {
    updateExistingFiles,
    existSync
};
module.exports = _thisUtil;