// VetMock VCA offline: pages come from the network first and fall back to the last copy, so a
// new release is never held back; content-hashed files (the app, the bank, fonts, plates) come
// from the cache first, so a set that was opened once can be practised again on a train.
const CACHE = 'vca-v1';
const SHELL = '/index.html';
const IMMUTABLE = /^\/(assets|bank|fonts|art|q|icons)\//;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((cache) => cache.put(SHELL, res.clone()));
          return res;
        })
        .catch(() => caches.match(SHELL)),
    );
    return;
  }

  if (IMMUTABLE.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return res;
      })),
    );
  }
});
