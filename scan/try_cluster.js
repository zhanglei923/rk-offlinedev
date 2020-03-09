var fs = require('fs');
var pathutil = require('path');
const cluster = require('cluster');
const numCPUs = 4;//require('os').cpus().length;

let MSG_REQUEST_TASKID = 'request_taskid';

let loadpathlist = []
for(let i=0;i<56;i++){
  loadpathlist.push('path'+i)
}

let tasksmap = {};
let tasknum = 0;
let taskfiles = 0;
let maxtaskfiles = 20;
for(let i=0;i<loadpathlist.length;i++){
  let fpath = loadpathlist[i]
  taskfiles++;
  if(taskfiles > maxtaskfiles) {
    tasknum++;
    taskfiles = 0;
  }
  if(!tasksmap[tasknum+'']) tasksmap[tasknum+''] = []
  tasksmap[tasknum+''].push(fpath)
}
let tasks = []
let totalFilesCount = 0;
for(let taskid in tasksmap){
  let files = tasksmap[taskid]
  totalFilesCount += files.length;
  tasks.push({
    taskid
  });
}

let numWorks = numCPUs;
console.log(`Init: numCPUs ${numCPUs}`, 'Init: tasks=', tasks.length, process.pid, (cluster.isMaster?'(master)':''));
let isEnd = false;

if (cluster.isMaster) {
    let totalFilesFinish = 0;
    taskStack = tasks;
    let totalTaskNum = taskStack.length; 

    for (let i = 0; i < numWorks; i++) {
      let worker = cluster.fork();
      worker.on('message', function(message) {
        //向子worker分配任务
        if(message && message.msgName === MSG_REQUEST_TASKID){
          totalFilesFinish += message.finishedFilesCount;
          console.log('finished=',totalFilesFinish)
          if(!isEnd && totalFilesFinish === totalFilesCount) {
            isEnd = true;
            console.log('Quit!')
          }
          if(taskStack.length > 0){   
            let taskinfo = taskStack.shift();
            worker.send({
              taskid: taskinfo.taskid
            })
          }else{
            worker.kill()
            console.log('no files', process.pid)
          }
        }      
      });
    }

} else {
  let worker = cluster.worker;
  //console.log(` processid=${process.pid} started`);
  process.on('message', function(message) {});
  worker.on('message', function(message) {
      if(message.taskid){
          let taskid = message.taskid;
          let files = tasksmap[taskid];
          if(files){
              let flen = files.length;
              doSth(files)
              worker.send({
                msgName: MSG_REQUEST_TASKID,//向master线程发消息，申请任务
                finishedFilesCount: flen
              });
          }else{
              console.log('Can not find:', message.taskid)
          }
      }
  });
  worker.send({
    msgName: MSG_REQUEST_TASKID,//向master线程发消息，申请任务
    finishedFilesCount: 0
  });
}
let doSth = (files)=>{
  console.log('            [do sth]:', files.length)
}