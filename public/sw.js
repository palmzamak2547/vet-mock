// ============================================================
// VetMock Service Worker — true offline support
// ============================================================
// Strategies:
//   • Hashed assets in /assets/ (Vite output): cache-first, immutable
//     — once cached, never re-fetch. Hash in filename guarantees safety.
//   • HTML navigations: network-first with timeout fallback to cache.
//     New deploy → served fresh. Offline → last cached index.html.
//   • Images, audio, manifest icons: stale-while-revalidate.
//   • Other GETs: network-first, fall back to cache.
//
// Install + activate are kept lean. No precache list — we'd have to
// regenerate it on every deploy. Runtime caching is sufficient because
// the user must visit at least once online to populate the cache.
//
// Versioning: bump SW_VERSION to force a clean activate (drops old
// caches). Old service workers self-delete when superseded by a new
// version that calls clients.claim().
// ============================================================

const SW_VERSION = 'v3-2026-05-10';
const RUNTIME = `vmx-runtime-${SW_VERSION}`;
const ASSETS = `vmx-assets-${SW_VERSION}`;
const NAV_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  // Skip waiting so the new SW activates as soon as install completes.
  // We coordinate with clients via the 'controllerchange' event in main.jsx
  // — the user gets a soft prompt to refresh, never a hard reload mid-exam.
  self.skipWaiting();
  event.waitUntil(
    caches.open(ASSETS).then((cache) =>
      // Best-effort precache of the app shell. Failures are silent —
      // runtime caching will fill in any missed assets on first request.
      cache.addAll([
        '/',
        '/manifest.webmanifest',
        '/favicon.svg',
        '/icon-192.png',
      ]).catch(() => {})
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Drop caches from older SW versions
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('vmx-') && !k.endsWith(SW_VERSION))
            .map((k) => caches.delete(k))
        )
      ),
      self.clients.claim(),
    ])
  );
});

// ── Helpers ─────────────────────────────────────────────────────────
function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((res) => {
        if (res && res.ok && res.type === 'basic') cache.put(request, res.clone());
        return res;
      });
    })
  );
}

function networkFirst(request, cacheName, timeoutMs) {
  return new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (resolved) return;
      caches.match(request).then((hit) => {
        if (hit) { resolved = true; resolve(hit); }
      });
    }, timeoutMs);
    fetch(request)
      .then((res) => {
        clearTimeout(timer);
        if (resolved) return;
        resolved = true;
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(cacheName).then((cache) => cache.put(request, clone));
        }
        resolve(res);
      })
      .catch(() => {
        clearTimeout(timer);
        if (resolved) return;
        caches.match(request).then((hit) => {
          resolved = true;
          resolve(hit || new Response('Offline', { status: 503 }));
        });
      });
  });
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((res) => {
        if (res && res.ok) cache.put(request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
}

// ── Fetch handler ───────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Same-origin only — never intercept cross-origin (Supabase, YouTube,
  // image hosts). Cross-origin caching has CORS pitfalls and gives
  // negligible offline value here since those need network anyway.
  if (url.origin !== self.location.origin) return;

  // Vite-hashed chunks under /assets/ are immutable — perfect for
  // cache-first. Once cached, they survive offline forever.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request, ASSETS));
    return;
  }

  // Navigation requests (HTML) — network-first so deploys propagate
  // immediately when online; fall back to cached index.html when offline.
  if (request.mode === 'navigate' || (request.headers.get('Accept') || '').includes('text/html')) {
    event.respondWith(
      networkFirst(request, RUNTIME, NAV_TIMEOUT_MS).then((res) => {
        // Offline + no cache match → serve cached root as fallback
        if (!res || !res.ok) {
          return caches.match('/').then((root) => root || res);
        }
        return res;
      })
    );
    return;
  }

  // Images, fonts, manifest, icons → stale-while-revalidate
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'manifest' ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME));
    return;
  }

  // Everything else (API responses, scripts not under /assets/, etc.):
  // network-first with cache fallback.
  event.respondWith(networkFirst(request, RUNTIME, NAV_TIMEOUT_MS));
});

// Allow the page to ask "are you ready?" (used by main.jsx to detect
// successful activation without a reload race).
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'GET_VERSION') {
    event.ports?.[0]?.postMessage({ version: SW_VERSION });
  }
});
