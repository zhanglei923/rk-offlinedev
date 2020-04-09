//自动拆分web工程的工具
const fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
var execSh = require("exec-sh");
let moment = require('moment');
let makeDir = require('make-dir');
let eachcontentjs = require('eachcontent-js');

let static_path = `E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static`;
let new_workspace = `E:/workspaceGerrit/a_new_home`;
let plan = [
'source/products/creekflow,xsy-static-creekflow,test/2006',
'source/products/bi,xsy-static-bi',
'source/breeze,xsy-static-breeze',
'source/core,xsy-static-core',
'source/cpq,xsy-static-cpq',
'source/crm,xsy-static-crm',
'source/core/i18n,xsy-static-i18n',
'source/lib,xsy-static-lib',
'source/oldcrm,xsy-static-oldcrm'
];

let cloneProject = (dir, pname, branch, callback)=>{
    makeDir.sync(new_workspace);
    let init_static_cmd = [
        `cd ${dir} && rm -rf ${pname}`,
        `git clone http://gerrit.ingageapp.com/${pname}`,
        `cd ${pname}`,
        `git pull`,
        `git checkout ${branch}`
    ];
    console.log(init_static_cmd.join(' && '));
    execSh(`${init_static_cmd.join(' && ')}`, true, function(err, stdout, stderr){
        makeDir.sync(`${new_workspace}/${pname}/static`);
        callback();
    });
};
cloneProject(new_workspace, 'xsy-static', 'master', ()=>{
    console.log('init done')
    let staticdir = `${new_workspace}/xsy-static`;
    let cp_static_cmd = [
        `echo "copy /static"`,
        `cd ${staticdir}`,
        `pwd`,
        `rm -rf static`,
        `mkdir static && cd static`,
        `cp -r ${static_path}/* ./`
    ];
    console.log(cp_static_cmd.join(' && '));
    execSh(`${cp_static_cmd.join(' && ')}`, true, function(err, stdout, stderr){
        console.log('cp done')
        doPlan(plan);
    });

})

let doPlan = (theplan)=>{
    if(theplan.length === 0) {
        return;
    }
    let oneplan = theplan.shift();

    let arr = oneplan.split(',');
    let folder = arr[0];
    let projectname = arr[1];
    let projectbranch = arr[2]?arr[2]:'master';

    let fullfolder = pathutil.resolve(static_path, folder);
    let targetfolder = pathutil.resolve(`${new_workspace}/${projectname}/static/${folder}`);
    let targetparentfolder = pathutil.resolve(targetfolder, '../')
    console.log(fs.existsSync(fullfolder), fullfolder);

    cloneProject(new_workspace, projectname, projectbranch, ()=>{
        let staticdir = `${new_workspace}/xsy-static/static`
        let split_static_cmd = [
            `echo "split /static"`,
            `cd ${staticdir}`,
            `mv ${folder} ${targetparentfolder}`
        ];
        console.log(split_static_cmd.join(' && '));
        execSh(`${split_static_cmd.join(' && ')}`, true, function(err, stdout, stderr){
            console.log('mv done')
            doPlan(theplan);//执行下一个
        });
    })
}

//doPlan(plan);