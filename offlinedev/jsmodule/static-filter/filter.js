let getLocalPath = (req_path)=>{
    let arr = [{
        url: '/static/source/products/creekflow/',
        localpath: 'E:/workspaceGerrit/_sub_sepration_test/xsy-static-product_creekflow'
    }]
    let localpath;
    for(let i = 0;i<arr.length;i++){
        let o = arr[i];
        let url = o.url;
        if(!url.match(/^\^/)) url = '^' + url;
        let regex = new RegExp(url);
        if(req_path.match(regex)){
            localpath = o.localpath;
            break;
        }
    }
    return localpath;
}
module.exports = {
    getLocalPath
};