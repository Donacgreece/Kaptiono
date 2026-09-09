const CACHE='kaptiono-web-v0.5.14';
const SHELL=[
  './','./index.html','./styles.css?v=0.5.14','./app.js?v=0.5.14','./whisper-worker.js?v=0.5.14','./manifest.webmanifest',
  './assets/icons/icon-64.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png','./assets/icons/favicon-32x32.png','./assets/icons/favicon-16x16.png',
  './assets/share/kaptiono-og-1200x630.png','./robots.txt','./sitemap.xml','./llms.txt'
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL).catch(()=>{})));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('kaptiono-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    clients.forEach(client=>client.postMessage({type:'KAPTIONO_UPDATE_READY',version:'0.5.14'}));
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname.endsWith('/version.json')||url.pathname.endsWith('version.json')){
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }
  event.respondWith(
    fetch(event.request,{cache:'no-store'}).then(response=>{
      const clone=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,clone)).catch(()=>{});
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html')))
  );
});
