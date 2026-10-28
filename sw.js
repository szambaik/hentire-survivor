const CACHE = 'pocket-grimoire-v16';
const CORE = ['./', './index.html', './manifest.json', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './icon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE && /^(hentire-survivors-|pocket-grimoire-)/.test(key)).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !/^https?:/.test(event.request.url)) return;
  // Network-first HTML makes public beta fixes visible without a manual cache reset.
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) { const copy=response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put('./index.html', copy))); }
      return response;
    }).catch(() => caches.match('./index.html').then(cached => cached || Response.error())));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => {
    const fresh = fetch(event.request).then(response => {
      if (response.ok || response.type === 'opaque') { const copy=response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy))); }
      return response;
    }).catch(() => cached || Response.error());
    return cached || fresh;
  }));
});
