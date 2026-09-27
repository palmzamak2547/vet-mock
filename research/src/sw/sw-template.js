/* global self, caches */
// Service worker template for research.vetmock.com [M1-DESIGN.md 12; competitor-gaps.md D4(d)].
// build/sw-plugin.mjs replaces the two placeholders and emits /sw.js. Static files only: it
// precaches the app shell and hashed assets, serves navigations with the cached index.html when
// offline, and never touches IndexedDB, POST requests, or other origins (Supabase auth included).
// It never calls skipWaiting on its own: a new version takes over on the next visit, so an open
// page is never reloaded under the student. OWNER: runtime role.
const PRECACHE = self.__RS_PRECACHE__;
const VERSION = self.__RS_SW_VERSION__;
const CACHE = `rs-static-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('rs-static-') && k !== CACHE).map((k) => caches.delete(k)))),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Implemented by the runtime role: navigations network-first with the cached /index.html as the
  // offline fallback; /assets/* and /fonts/* cache-first; everything else passes through.
});
