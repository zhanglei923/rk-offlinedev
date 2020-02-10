this.addEventListener('install', function (event) {
    console.log('Service Worker installed');
    event.waitUntil(caches.open)
});
this.addEventListener('activate', function (event) {
    console.log('Service Worker activated');
});
this.addEventListener('message', function (event) {
    console.log(event.data); // this message is from page
});

var cacheName = 'v1';
var assetsToCache = [
  '/offlinedev-http-console/index/infomation.js'
];

if(0)
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(assetsToCache);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});
if(0)
self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
        event.respondWith(
          caches.open(cacheName).then(function(cache) {
            return fetch(event.request).then(function(networkResponse) {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }).catch(function() {
              return cache.match(event.request);
            });
          })
        );
      }
    }
  
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });

// let cacheName='zl'
// self.addEventListener('fetch', function(event) {
//     var requestUrl = new URL(event.request.url);
//     //console.log('fetch',event.request.url,requestUrl)
//     if (requestUrl.origin === location.origin) {
//         console.log('xxx1', requestUrl.pathname)
//         if (1) {
//             console.log('xxx2', requestUrl.pathname)
//         event.respondWith(
//           caches.open(cacheName).then(function(cache) {
//             return fetch(event.request).then(function(networkResponse) {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             }).catch(function() {
//               return cache.match(event.request);
//             });
//           })
//         );
//       }
//     }
//   });