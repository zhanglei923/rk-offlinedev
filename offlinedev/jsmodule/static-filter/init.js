let initApp = (app, express)=>{
    app.use('/static/source/products/bi', express.static('E:/workspaceGerrit/rk-offlinedev/offlinedev/jsmodule/static-filter'));//注意：必须在全局拦截器之后，否则拦截器无法运行
}
module.exports = {
    initApp
};