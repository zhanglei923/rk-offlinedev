//自动拆分web工程的工具
const fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
var execSh = require("exec-sh");
let moment = require('moment');
let makeDir = require('make-dir');
let eachcontentjs = require('eachcontent-js');

let web_path = `E:/workspaceGerrit/apps-ingage-web`;

let new_workspace = `E:/workspaceGerrit/a_new_home`;
let new_web_path = pathutil.resolve(new_workspace, './apps-ingage-web')
let static_path = pathutil.resolve(new_web_path, `./src/main/webapp/static`);

console.log('web_path=', web_path)
console.log('new_workspace=', new_workspace)
console.log('new_web_path=', new_web_path)
console.log('static_path=', static_path)

let plan = [
    'source/products/creekflow,xsy-static-creekflow,test/2006',
    'source/products/bi,xsy-static-bi',
    'source/breeze,xsy-static-breeze',
    'source/cpq,xsy-static-cpq',
    'source/crm,xsy-static-crm',
    'source/core/i18n,xsy-static-i18n',
    'source/core,xsy-static-core',
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
console.log(`echo "cp web" && rm -rf ${new_web_path} && cp -r ${web_path} ${new_workspace}`)
execSh(`echo "cp web" && rm -rf ${new_web_path} && cp -r ${web_path} ${new_workspace}`, true, function(err, stdout, stderr){
    console.log('cp web done')

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
});

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

    cloneProject(new_workspace, projectname, projectbranch, ()=>{
        makeDir.sync(targetparentfolder)
        console.log(fs.existsSync(targetparentfolder), targetparentfolder);
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