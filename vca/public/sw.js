// VetMock VCA offline: pages come from the network first and fall back to the last copy, so a
// new release is never held back. Content-hashed files (the app, the bank, figures) never change
// under their names, so they come from the cache first and a set opened once can be practised
// again on a train. Fonts, art and icons keep their names when they change: they come from the
// cache too, and are refreshed behind it for the next visit.
const CACHE = 'vca-v2';
// The app shell as the host serves it: /index.html answers 308 to / (cleanUrls), and a redirected
// response stored and served to a navigation is refused by the browser, so offline never opened.
const SHELL = '/';
const IMMUTABLE = /^\/(assets|bank|q)\//;
const NAMED = /^\/(fonts|art|icons)\//;

// Hashed files from old releases are never asked for again: past this many entries the oldest
// go, so a phone does not keep every release's app and bank for good.
const MAX_ENTRIES = 400;
const trim = (cache) => cache.keys().then((keys) => Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_ENTRIES)).filter((k) => new URL(k.url).pathname !== SHELL).map((k) => cache.delete(k))));

const keep = (request, res) => {
  if (res.ok && !res.redirected) {
    const copy = res.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy).then(() => trim(cache))).catch(() => {});
  }
  return res;
};

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
          // Cloned now, before the page reads the body: a clone made later fails.
          if (res.ok && !res.redirected) {
            const copy = res.clone();
            event.waitUntil(caches.open(CACHE).then((cache) => cache.put(SHELL, copy)));
          }
          return res;
        })
        .catch(() => caches.match(SHELL)),
    );
    return;
  }

  if (IMMUTABLE.test(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => keep(request, res))));
    return;
  }

  if (NAMED.test(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => {
      const fresh = fetch(request).then((res) => keep(request, res));
      if (!hit) return fresh;
      event.waitUntil(fresh.catch(() => {}));
      return hit;
    }));
  }
});
