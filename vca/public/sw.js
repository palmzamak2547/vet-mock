// VetMock VCA offline: pages come from the network first and fall back to the last copy, so a
// new release is never held back. Content-hashed files (the app, the bank, figures) never change
// under their names, so they come from the cache first and a set opened once can be practised
// again on a train. Fonts, art and icons keep their names when they change: they come from the
// cache too, and are refreshed behind it for the next visit.
const CACHE = 'vca-v2';
// A page is asked of the network first, so a release is never held back. But a connection that
// accepts the request and never answers (a tunnel, a captive Wi-Fi) used to leave a returning visitor
// on a blank page for as long as the network cared to hang (25.6 s in a test) with the whole app
// sitting in the cache. After this long the copy answers instead; the request itself carries on, and
// its answer, if it comes, refreshes the copy for the next visit. 3 s is well past this one small
// page's round trip on a slow phone connection (a 4 KB document, a few hundred ms on 3G), so a
// working network is never cut short, and soon enough to read as a slow start rather than a hang.
// With no copy yet (a first visit) there is nothing to answer with, so the network is waited for.
const NAV_WAIT = 3000;
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
    // Cloned the moment the answer arrives, before the page reads the body: a clone made later fails.
    // Only a page is kept as the shell: opening /sitemap.xml once made the offline app an XML file.
    const page = (res) => res.ok && !res.redirected && /text\/html/i.test(res.headers.get('content-type') || '');
    const network = fetch(request).then((res) => ({ res, copy: page(res) ? res.clone() : null }));
    // The copy is kept whenever the network does answer, however late, so the worker is held awake for it.
    event.waitUntil(network.then(({ copy }) => copy && caches.open(CACHE).then((cache) => cache.put(SHELL, copy))).catch(() => {}));
    event.respondWith(new Promise((resolve) => {
      let answered = false;
      const answer = (res) => { if (!answered) { answered = true; clearTimeout(timer); resolve(res); } };
      const timer = setTimeout(() => { caches.match(SHELL).then((hit) => { if (hit) answer(hit); }); }, NAV_WAIT);
      network.then(({ res }) => answer(res), () => caches.match(SHELL).then(answer));
    }));
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
