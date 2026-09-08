const CACHE='kaptiono-web-v0.4.2';
const SHELL=['./','./index.html','./styles.css?v=0.4.2','./app.js?v=0.4.2','./manifest.webmanifest','./assets/icons/icon-64.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kaptiono-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(fetch(event.request).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(event.request,clone)).catch(()=>{});return res}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))))});
