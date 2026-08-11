// ============================================================
// VetMock Service Worker — true offline support
// ============================================================
// Strategies:
//   • Hashed assets in /assets/ (Vite output): cache-first, immutable
//     — once cached, never re-fetch. Hash in filename guarantees safety.
//   • HTML navigations: network-first with timeout fallback to cache.
//     New deploy → served fresh. Offline → last cached index.html.
//   • Images, audio, manifest icons: stale-while-revalidate.
//   • Same-origin /api requests: network-only, never cached.
//   • Other GETs: network-first, fall back to cache.
//
// Install + activate are kept lean. The small static shell is cached
// best-effort; Vite's hashed assets populate a shared immutable cache
// as the browser requests them.
//
// Versioning: bump SW_VERSION for each worker release. Runtime data is
// version-scoped, while immutable hashed assets survive across deploys.
// ============================================================

const SW_VERSION = 'v61-2026-08-11';
const RUNTIME = `vmx-runtime-${SW_VERSION}`;
const ASSETS = 'vmx-assets-v1';
const NAV_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  // Keep updates waiting until the page explicitly sends SKIP_WAITING.
  event.waitUntil(
    caches.open(RUNTIME).then((cache) =>
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
      // Drop old runtime caches while retaining shared immutable assets.
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('vmx-') && k !== RUNTIME && k !== ASSETS)
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

async function networkFirst(request, cacheName, timeoutMs) {
  const offlineResponse = () => new Response('Offline', {
    status: 503,
    headers: { 'Cache-Control': 'no-store' },
  });
  const controller = typeof AbortController === 'undefined'
    ? null
    : new AbortController();
  let timer;

  const timeout = new Promise((resolve) => {
    timer = setTimeout(async () => {
      controller?.abort();
      const hit = await caches.match(request).catch(() => undefined);
      resolve(hit || offlineResponse());
    }, timeoutMs);
  });

  const network = fetch(request, controller ? { signal: controller.signal } : undefined)
    .then((res) => {
      if (res && res.ok) {
        const clone = res.clone();
        caches.open(cacheName)
          .then((cache) => cache.put(request, clone))
          .catch(() => {});
      }
      return res;
    })
    .catch(async () => {
      const hit = await caches.match(request).catch(() => undefined);
      return hit || offlineResponse();
    });

  try {
    return await Promise.race([network, timeout]);
  } finally {
    clearTimeout(timer);
  }
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

  // User-specific API responses are network-only and never enter CacheStorage.
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        JSON.stringify({ error: 'Offline' }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        },
      ))
    );
    return;
  }

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

  // Everything else (scripts not under /assets/, data files, etc.):
  // network-first with a bounded cache fallback.
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
