const CACHE='kaptiono-web-v1.0.1';
const SHELL=[
  './','./index.html','./styles.css?v=1.0.1','./app.js?v=1.0.1','./consent.js?v=1.0.1','./legal.js?v=1.0.1','./whisper-worker.js?v=1.0.1','./manifest.webmanifest','./about/','./about/index.html','./about/about.css?v=1.0.1','./about/about.js?v=1.0.1',
  './privacy/','./cookies/','./terms/','./NOTICE','./LICENSE_SCOPE.md','./THIRD_PARTY_NOTICES.md','./PATENT_NOTICE.md','./THIRD_PARTY_SOURCE_OFFER.md','./LIBAV_RUNTIME_REPLACEMENT.md',
  './assets/icons/icon-64.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png','./assets/icons/favicon-32x32.png','./assets/icons/favicon-16x16.png',
  './assets/share/kaptiono-og-1200x630.png','./robots.txt','./sitemap.xml','./llms.txt'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL).catch(()=>{})));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('kaptiono-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
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
