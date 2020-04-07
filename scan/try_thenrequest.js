var request = require('then-request');

let hosts = [
    'http://10.10.0.144:3010',
    'http://10.10.0.115:3010'
]
let parr = [];
hosts.forEach((host)=>{
    let url = `${host}/json/listRunningPackings?jsonp=false&callback=jQuery22409643904908519338_1586300667866&_=1586300668212`
    console.log(url)
    let p = request('GET', url)
    parr.push(p);
})
console.log(parr)
Promise.all(parr).then(function(values) {
    let results = []
    values.forEach((res)=>{
        let data = res.getBody().toString('utf8')
        results.push(JSON.parse(data));
    })
    console.log('ALL:');
    console.log(results);
});

// .done(function (res) {
//     console.log('done')

//     console.log(data);
//     //console.log(res)
// });