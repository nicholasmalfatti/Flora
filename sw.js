const CACHE="floramaster-cache-syncfix-v1";
const ASSETS=["./","./index.html","./app.js","./manifest.webmanifest"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).catch(()=>cached)));
});
