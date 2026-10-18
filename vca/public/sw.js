// VetMock VCA offline: pages come from the network first and fall back to the last copy, so a
// new release is never held back. Content-hashed files (the app, the bank, figures) never change
// under their names, so they come from the cache first and a set opened once can be practised
// again on a train. Fonts, art and icons keep their names when they change: they come from the
// cache too, and are refreshed behind it for the next visit.
//
// Two caches, because they grow differently. The app's own files (APP) are a few dozen a release.
// The bank (BANK) is one index and a run of shards per domain, 520 small files, and a set takes
// whichever shards its questions happen to be in. Kept together, a few mock exams' worth of
// shards pushed the oldest files out first, and the oldest files are the app's entry scripts.
const APP = 'vca-v3';
const BANK = 'vca-bank-v1';
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
const APP_FILES = /^\/assets\//;
const BANK_FILES = /^\/(bank|q)\//;
const NAMED = /^\/(fonts|art|icons)\/|^\/theme-boot\.js$/;

// Hashed files from old releases are never asked for again: past this many entries the oldest
// go, so a phone does not keep every release's app and bank for good. The app's files are about a
// hundred, so 400 holds some six releases. A whole bank is 556 entries (520 bank files and 36
// figures), so 1,200 holds the current one and most of the one before it, which a returning visitor
// still has open in a tab; each release replaces only the shards whose questions changed.
const LIMITS = { [APP]: 400, [BANK]: 1200 };
// Trimming reads every key of a cache, so it runs once for a burst of new files, not for each
// one: a mock exam stores some forty shards in a second. This long after the first of them.
const TRIM_AFTER = 4000;

const trimming = new Set();
const trim = (name, cache) => cache.keys().then((keys) => Promise.all(keys.slice(0, Math.max(0, keys.length - LIMITS[name])).filter((k) => new URL(k.url).pathname !== SHELL).map((k) => cache.delete(k))));
const scheduleTrim = (event, name) => {
  if (trimming.has(name)) return;
  trimming.add(name);
  event.waitUntil(new Promise((resolve) => setTimeout(resolve, TRIM_AFTER))
    .then(() => caches.open(name))
    .then((cache) => trim(name, cache))
    .catch(() => {})
    .then(() => { trimming.delete(name); }));
};

const keep = (event, name, request, res) => {
  if (res.ok && !res.redirected) {
    const copy = res.clone();
    event.waitUntil(caches.open(name).then((cache) => cache.put(request, copy)).then(() => scheduleTrim(event, name)).catch(() => {}));
  }
  return res;
};

/** The files a page needs before it can draw: its scripts, stylesheets and preloaded fonts. */
const entryFiles = (html) => {
  const urls = new Set();
  for (const tag of html.match(/<(?:script|link)\b[^>]*>/gi) || []) {
    const attr = (name) => (new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag) || [])[1] || '';
    const rel = attr('rel').toLowerCase();
    const url = attr('src') || attr('href');
    if (!/^\/[^/]/.test(url)) continue;
    if (/^<script/i.test(tag) || rel === 'modulepreload' || rel === 'stylesheet' || (rel === 'preload' && attr('as') === 'font')) urls.add(url);
  }
  return [...urls];
};

// The shell must be stored for the worker to install. Its entry files are stored too, as a favour
// to a first visit that ends offline: the page that installed the worker loaded them before the
// worker was in charge, so nothing else would ever have put them in the cache, and the shell alone
// is a blank page. They come from the browser's own cache at no cost, and one that cannot be had
// does not hold the worker back.
const precache = () => caches.open(APP).then(async (cache) => {
  await cache.add(SHELL);
  try {
    const html = await (await cache.match(SHELL)).text();
    await Promise.all(entryFiles(html).map((url) => cache.add(url).catch(() => {})));
  } catch { /* a favour, not a condition */ }
});

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== APP && k !== BANK).map((k) => caches.delete(k))))
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
    event.waitUntil(network.then(({ copy }) => copy && caches.open(APP).then((cache) => cache.put(SHELL, copy))).catch(() => {}));
    event.respondWith(new Promise((resolve) => {
      let answered = false;
      const answer = (res) => { if (!answered) { answered = true; clearTimeout(timer); resolve(res); } };
      const timer = setTimeout(() => { caches.match(SHELL).then((hit) => { if (hit) answer(hit); }); }, NAV_WAIT);
      network.then(({ res }) => answer(res), () => caches.match(SHELL).then(answer));
    }));
    return;
  }

  const immutable = APP_FILES.test(url.pathname) ? APP : BANK_FILES.test(url.pathname) ? BANK : null;
  if (immutable) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => keep(event, immutable, request, res))));
    return;
  }

  if (NAMED.test(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => {
      const fresh = fetch(request).then((res) => keep(event, APP, request, res));
      if (!hit) return fresh;
      event.waitUntil(fresh.catch(() => {}));
      return hit;
    }));
  }
});
