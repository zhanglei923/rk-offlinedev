//注意，这个文件是在static-proxy.js里转接过的，因为如果是根目录/sw.js，默认是访问webapp目录下，因此在static-proxy.js里做了一个转接
//chrome访问chrome://inspect/#service-workers或chrome://serviceworker-internals查看service-workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw-offlinedev.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}