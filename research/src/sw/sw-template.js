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
const SHELL = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('rs-static-') && k !== CACHE).map((k) => caches.delete(k)))),
  );
});

// A navigation goes to the network first (so a new deploy is seen), with the cached shell when the
// network fails. The shell is refreshed from successful navigations only when it is the SPA page.
async function navigation(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const shell = await cache.match(SHELL);
    return shell || Response.error();
  }
}

// Hashed assets and fonts never change under the same URL: cache first, network to fill a miss.
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok && response.type === 'basic') cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(navigation(request));
    return;
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/icons/') || url.pathname === '/manifest.webmanifest') {
    event.respondWith(cacheFirst(request));
  }
});
