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

const SW_VERSION = 'v195-2026-09-26';
const RUNTIME = `vmx-runtime-${SW_VERSION}`;
const ASSETS = 'vmx-assets-v1';
// Atlas verifies content hashes and owns a bounded public-model cache.
const ATLAS_MODELS = 'vmx-atlas-models-v1';
const ATLAS_SHELL = 'vmx-atlas-shell-v1';
// Hashed chunks are immutable, so the assets cache is deliberately kept
// across worker versions — but every deploy mints new hashes and nothing
// ever removed the old ones. Trim to 300 only when no window can still need
// them: one tab updating must never evict another tab's older build. Keep
// the cached dependency graphs of retained HTML even after all tabs close.
// 300 is a soft cleanup target; a complete build can itself exceed it.
const ASSETS_MAX_ENTRIES = 300;
// Library documents, cached by CONTENT HASH (the `h` query param), not by
// URL — the signed token in the URL rotates every mint window, but the same
// bytes keep the same hash forever. Unversioned on purpose: a worker update
// must not throw away a student's downloaded decks.
const LIB_DOCS = 'vmx-lib-docs-v1';
const LIB_DOC_MAX_ENTRIES = 6;
const LIB_DOC_MAX_BYTES = 40 * 1024 * 1024;
// The shelf's catalog snapshot (library.js keeps it here rather than in
// localStorage, which it was filling). Unversioned like LIB_DOCS: a worker
// update must not make the next library visit paint late.
const CATALOG = 'vmx-library-catalog-v1';
const LIB_ACCESS_URL = '/__vmx/library-access.json';
const libraryClients = new Map();
let libraryWrites = Promise.resolve();
const NAV_TIMEOUT_MS = 4000;
const ASSET_CLEANUP_DELAY_MS = 1000;

self.addEventListener('install', (event) => {
  // Install in the background. The browser activates after old clients close.
  event.waitUntil(
    caches.open(RUNTIME).then(async (cache) =>
      // Best-effort precache of the app shell, one request per entry.
      // addAll is atomic: a single failed icon (a Wi-Fi blip during
      // install) used to leave the NEW worker with no shell at all after
      // activate had already dropped the old one — and every offline
      // navigation depends on '/'.
      Promise.allSettled([
        // Background installation has not loaded this build's entry chunks.
        // Keep the already-used document for offline navigation; a natural
        // online document load will cache the new HTML with its own assets.
        ...((await shouldPrecacheRoot()) ? ['/'] : []),
        '/manifest.webmanifest',
        '/favicon.svg',
        '/icon-192.png',
      ].map((url) => cache.add(url)))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Installation is best-effort. Keep the newest previous shell as a
      // fallback even if this install fetched only an icon (or no files).
      // At most the current runtime and one previous runtime are retained.
      caches.keys().then(async (keys) => {
        let previousShell;
        for (const name of keys.filter(k => k.startsWith('vmx-runtime-') && k !== RUNTIME).reverse()) {
          // A failed read is not proof that this shell is absent. Let the
          // outer catch cancel pruning so a transient failure cannot erase it.
          const root = await caches.open(name).then(cache => cache.match('/'));
          if (root?.ok) { previousShell = name; break; }
        }
        const retained = new Set([RUNTIME, previousShell, ASSETS, LIB_DOCS, ATLAS_MODELS, ATLAS_SHELL, CATALOG]);
        await Promise.all(keys.filter(k => k.startsWith('vmx-') && !retained.has(k)).map(k => caches.delete(k)));
      }).catch(() => {}),
      // Optional asset maintenance belongs to departure/cache-write events.
      // Client enumeration must not compete with claim during takeover.
      self.clients.claim(),
    ])
  );
});

// ── Helpers ─────────────────────────────────────────────────────────
async function shouldPrecacheRoot() {
  try {
    for (const name of await caches.keys()) {
      if (!name.startsWith('vmx-runtime-')) continue;
      const root = await (await caches.open(name)).match('/');
      if (root?.ok) return false;
    }
    return true;
  } catch {
    // An unreadable earlier shell may still be usable. Do not displace it
    // with new HTML whose entry chunks this browser has never downloaded.
    return false;
  }
}

// A completed response does not keep the worker alive for detached writes.
// Cache failures must not fail a usable network response or worker upgrade.
function keepAlive(event, work) {
  event.waitUntil(work.catch(() => {}));
}

async function runtimeMatch(request, cacheName) {
  const current = await caches.open(cacheName).then(cache => cache.match(request)).catch(() => undefined);
  if (current) return current;
  // CacheStorage.match searches by creation order, so retaining an older
  // runtime must not make its document win over a newer cached document.
  // Match the exact request in runtime caches only; library/Atlas snapshots
  // belong to their own routes and are not generic navigation fallbacks.
  const names = await caches.keys().catch(() => []);
  for (const name of names.filter(key => key.startsWith('vmx-runtime-') && key !== cacheName).reverse()) {
    const previous = await caches.open(name).then(cache => cache.match(request)).catch(() => undefined);
    if (previous) return previous;
  }
}

async function cachedShellAssets(cache, keys) {
  const cachedByPath = new Map(keys.map(key => [new URL(key.url).pathname, key]));
  const protectedPaths = new Set(), pending = [];
  const include = (reference, base) => {
    let url;
    try {
      // Vite mapDeps is rooted at the deployment base; ordinary imports are
      // relative to their JS/CSS file. Neither path ever needs a network read.
      url = new URL(reference.startsWith('assets/') ? `/${reference}` : reference, base);
    } catch { return; }
    if (url.origin !== self.location.origin || !cachedByPath.has(url.pathname) || protectedPaths.has(url.pathname)) return;
    protectedPaths.add(url.pathname);
    pending.push(cachedByPath.get(url.pathname));
  };
  const references = (text, base) => {
    // Cover HTML attributes, static/dynamic imports and Vite mapDeps. Match
    // path-shaped strings, not arbitrary JS strings containing other quotes.
    for (const match of text.matchAll(/["'`]((?:https?:\/\/|\/?assets\/|\.\.?\/)[^"'`\r\n]+|[A-Za-z0-9_.-]+\.[A-Za-z0-9]+(?:[?#][^"'`\r\n]*)?)["'`]/g)) include(match[1], base);
    for (const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) include(match[1], base);
  };
  for (const name of await caches.keys()) {
    if (!name.startsWith('vmx-runtime-')) continue;
    const runtime = await caches.open(name);
    for (const key of await runtime.keys()) {
      const document = await runtime.match(key);
      if (!document) throw new Error('Runtime cache changed during cleanup');
      if (new URL(key.url).pathname === '/' || /(?:text\/html|application\/xhtml\+xml)/i.test(document.headers.get('Content-Type') || '')) {
        references(await document.text(), key.url);
      }
    }
  }
  for (let index = 0; index < pending.length; index++) {
    const key = pending[index];
    if (!/\.(?:m?js|css)$/i.test(new URL(key.url).pathname)) continue;
    const asset = await cache.match(key);
    if (!asset) throw new Error('Asset cache changed during cleanup');
    references(await asset.text(), key.url);
  }
  return protectedPaths;
}

async function trimAssetsWhenUnused(cache, incoming = 0) {
  // Fail closed on inspection/read errors. Include uncontrolled older tabs,
  // and check again after the graph scan in case a new window opened meanwhile.
  try {
    const options = { type: 'window', includeUncontrolled: true };
    if ((await self.clients.matchAll(options)).length) return;
    const keys = await cache.keys();
    let excess = keys.length + incoming - ASSETS_MAX_ENTRIES;
    if (excess <= 0) return;
    const protectedPaths = await cachedShellAssets(cache, keys);
    if ((await self.clients.matchAll(options)).length) return;
    for (const key of keys) {
      if (excess <= 0) break;
      if (protectedPaths.has(new URL(key.url).pathname)) continue;
      if (await cache.delete(key)) excess--;
    }
  } catch { /* An uncertain cache graph must never be pruned. */ }
}

function cacheFirst(request, cacheName, event) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then(async (hit) => {
      if (hit) return hit;
      if (cacheName === ASSETS) {
        const atlasHit = await caches.open(ATLAS_SHELL).then(atlas => atlas.match(request)).catch(() => undefined);
        if (atlasHit) return atlasHit;
      }
      return fetch(request).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const clone = res.clone();
          keepAlive(event, (async () => {
            if (cacheName === ASSETS) await trimAssetsWhenUnused(cache, 1);
            await cache.put(request, clone);
          })());
        }
        return res;
      });
    })
  );
}

async function networkFirst(request, cacheName, timeoutMs, event) {
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
      const hit = await runtimeMatch(request, cacheName);
      resolve(hit || offlineResponse());
    }, timeoutMs);
  });

  const network = fetch(request, controller ? { signal: controller.signal } : undefined)
    .then((res) => {
      if (res && res.ok) {
        const clone = res.clone();
        keepAlive(event, caches.open(cacheName).then((cache) => cache.put(request, clone)));
      }
      return res;
    })
    .catch(async () => {
      const hit = await runtimeMatch(request, cacheName);
      return hit || offlineResponse();
    });

  try {
    return await Promise.race([network, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

function staleWhileRevalidate(request, cacheName, event) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then(async (cached) => {
      if (!cached) cached = await caches.open(ATLAS_SHELL).then(atlas => atlas.match(request)).catch(() => undefined);
      const fetchPromise = fetch(request).then((res) => {
        if (res && res.ok) keepAlive(event, cache.put(request, res.clone()));
        return res;
      }).catch(() => cached);
      keepAlive(event, fetchPromise);
      return cached || fetchPromise;
    })
  );
}

// Library blobs: serve the cached copy when the hash matches, otherwise
// stream from the network and remember the bytes. FIFO capped — six recent
// documents at up to 40 MB each is a week of reading, not a hoard.
async function libraryAccess() {
  return caches.open(CATALOG).then(cache => cache.match(LIB_ACCESS_URL)).then(hit => hit?.json()).catch(() => null);
}

async function libraryClientAllowed(request, event, access) {
  if (!access?.signedIn || !access.epoch || new URL(request.url).searchParams.get('a') !== access.epoch) return false;
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const nativeClient = clients.find(client => client.id === event.clientId);
    const nativeUrl = nativeClient ? new URL(nativeClient.url) : null;
    const nativeDocument = nativeUrl?.origin === self.location.origin && nativeUrl.pathname === '/api/library-blob'
      && nativeUrl.searchParams.get('a') === access.epoch
      && nativeUrl.searchParams.get('h') === new URL(request.url).searchParams.get('h');
    for (const client of clients) {
      if (client.id === event.excludeClientId) continue;
      // A native PDF tab may issue later range reads under its own client id.
      // Its held document capability still requires a live authorized app.
      if (event.clientId && !nativeDocument ? client.id !== event.clientId : !nativeDocument && request.mode !== 'navigate') continue;
      if (libraryClients.get(client.id) === access.epoch) return true;
      const source = new URL(client.url);
      if (source.origin !== self.location.origin || !(source.pathname === '/' || /^\/(?:app|wiki)\//.test(source.pathname))) continue;
      // Browsers may terminate an idle worker. A held PDF URL must still work
      // after its RAM registration is gone, but only a live signed-in page can
      // answer this fresh challenge; persisted access alone cannot authorize it.
      const allowed = await new Promise(resolve => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => done(false), 1000);
        function done(ok) { clearTimeout(timer); channel.port1.close(); channel.port2.close(); resolve(ok); }
        channel.port1.onmessage = event => done(event.data?.epoch === access.epoch);
        try { client.postMessage({ type: 'LIBRARY_ACCESS_CHECK', epoch: access.epoch }, [channel.port2]); }
        catch { done(false); }
      });
      if (allowed) { libraryClients.set(client.id, access.epoch); return true; }
    }
    return false;
  } catch { return false; }
}

async function verifiedLibraryResponse(response, hash, access) {
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > LIB_DOC_MAX_BYTES) return null;
  const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2, '0')).join('');
  if (digest.slice(0, hash.length) !== hash.toLowerCase()) return null;
  const headers = new Headers(response.headers);
  headers.set('X-VetMock-Library-Access', access);
  headers.set('X-VetMock-Library-Hash', hash.toLowerCase());
  return new Response(bytes, { status: response.status, headers });
}

async function libraryDoc(request, hash, event) {
  const cache = await caches.open(LIB_DOCS);
  const key = new Request(`/__lib-doc/${hash}`);
  const access = await libraryAccess();
  const hit = await cache.match(key);
  if (hit) {
    let kind = hit.headers.get('X-VetMock-Library-Access');
    const verified = hit.headers.get('X-VetMock-Library-Hash') === hash.toLowerCase();
    let response = verified ? hit : null;
    if (!verified) {
      // Legacy caches trusted an unsigned h. Only actual bytes matching a
      // published catalogue hash may become a public offline response.
      const snapshot = await caches.open(CATALOG).then(store => store.match('/__vmx/library-catalog.json'))
        .then(value => value?.json()).catch(() => null);
      const publicHash = snapshot?.docs?.some(doc => doc.status === 'public' && doc.sha256_16 === hash);
      kind = kind === 'restricted' || !publicHash ? 'restricted' : 'public';
      response = await verifiedLibraryResponse(hit, hash, kind).catch(() => null);
    }
    if (response && kind === 'public') return response;
    if (response && await libraryClientAllowed(request, event, access)) {
      const current = await libraryAccess();
      if (current?.signedIn && current.epoch === access?.epoch) return response;
    }
  }

  const offlineOnly = new URL(request.url).searchParams.get('offline') === '1';
  if (offlineOnly) {
    // The page could not even reach the mint endpoint; only the cache can
    // answer. This document was never opened on this device.
    return new Response(JSON.stringify({ error: 'offline_not_cached' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  const res = await fetch(request);
  if (res && res.status === 200) {
    const len = Number(res.headers.get('content-length'));
    if (Number.isFinite(len) && len > 0 && len <= LIB_DOC_MAX_BYTES) {
      const kind = res.headers.get('X-VetMock-Library-Access') === 'public' ? 'public' : 'restricted';
      const verification = verifiedLibraryResponse(res.clone(), hash, kind).catch(() => null);
      // ponytail: one write queue for six document slots; split only if actual
      // concurrent shelf downloads make this measurable. Streaming is outside it.
      libraryWrites = libraryWrites.catch(() => {}).then(async () => {
        const response = await verification;
        if (!response) return;
        if (kind !== 'public') {
          const current = await libraryAccess();
          if (current?.epoch !== access?.epoch || !await libraryClientAllowed(request, event, current)) return;
        }
        // A logout deletes this named cache; this captured handle then writes
        // only into its detached predecessor, never the replacement cache.
        await cache.put(key, response);
        const keys = await cache.keys();
        for (const old of keys.slice(0, Math.max(0, keys.length - LIB_DOC_MAX_ENTRIES))) await cache.delete(old);
      });
      keepAlive(event, libraryWrites);
    }
  }
  return res;
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

  // Library document bytes — the one API route that IS cached, because the
  // cache key is a content hash, not the rotating signed URL. Lets a deck
  // opened on campus re-open on the train with zero bandwidth.
  if (url.pathname === '/api/library-blob') {
    const hash = url.searchParams.get('h');
    if (hash && /^(?:[a-f0-9]{16}|[a-f0-9]{64})$/i.test(hash)) {
      event.respondWith(libraryDoc(request, hash, event));
      return;
    }
  }

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
    event.respondWith(cacheFirst(request, ASSETS, event));
    return;
  }

  // The entry is committed to the offline cache only after its full dependency
  // graph is durable. Preserve that last working document across SW upgrades.
  if (['/app/atlas', '/app/atlas/', '/atlas.html'].includes(url.pathname)) {
    event.respondWith((async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), NAV_TIMEOUT_MS);
      try {
        const response = await fetch(request, { signal: controller.signal });
        if (response.ok) return response;
      } catch { /* Use the last complete Atlas entry below. */ }
      finally { clearTimeout(timer); }
      return await caches.open(ATLAS_SHELL).then(cache => cache.match('/app/atlas'))
        || new Response('Atlas is not available offline yet.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
    return;
  }

  // Do not duplicate multi-megabyte geometry in the generic runtime cache.
  // Atlas checks its own content-addressed cache before making this request.
  if (/^\/atlas\/[a-z0-9-]+-[a-f0-9]{12}\.glb$/.test(url.pathname)) {
    event.respondWith(fetch(request).catch(() => new Response('Offline', { status: 503 })));
    return;
  }

  // Navigation requests (HTML) — network-first so deploys propagate
  // immediately when online; fall back to cached index.html when offline.
  if (request.mode === 'navigate' || (request.headers.get('Accept') || '').includes('text/html')) {
    event.respondWith(
      networkFirst(request, RUNTIME, NAV_TIMEOUT_MS, event).then((res) => {
        // Offline + no cache match → serve cached root as fallback
        if (!res || !res.ok) {
          return runtimeMatch('/', RUNTIME).then((root) => root || res);
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
    event.respondWith(staleWhileRevalidate(request, RUNTIME, event));
    return;
  }

  // Everything else (scripts not under /assets/, data files, etc.):
  // network-first with a bounded cache fallback.
  event.respondWith(networkFirst(request, RUNTIME, NAV_TIMEOUT_MS, event));
});

// Allow the page to ask "are you ready?" (used by main.jsx to detect
// successful activation without a reload race).
self.addEventListener('message', (event) => {
  if (event.data?.type === 'LIBRARY_ACCESS_REVOKE') {
    libraryClients.delete(event.source?.id);
    keepAlive(event, libraryAccess().then(async access => {
      const request = { url: `${self.location.origin}/api/library-blob?a=${encodeURIComponent(event.data.epoch)}`, mode: 'navigate' };
      const active = await libraryClientAllowed(request, { excludeClientId: event.source?.id }, access);
      event.ports?.[0]?.postMessage({ active });
    }));
  }
  if (event.data?.type === 'LIBRARY_ACCESS') {
    // Only a live app client can register itself. The persisted access epoch
    // alone cannot carry a session-only login into a later direct navigation.
    try {
      const source = new URL(event.source?.url);
      if (source.origin === self.location.origin && (source.pathname === '/' || /^\/(?:app|wiki)\//.test(source.pathname))) {
        libraryClients.set(event.source.id, event.data.epoch);
      }
    } catch { /* Unidentified clients cannot read restricted offline bytes. */ }
    event.ports?.[0]?.postMessage({ ready: true });
  }
  // Ignore early-activation messages, including legacy SKIP_WAITING. The
  // browser waits until old documents close; none can receive a forced switch.
  if (event.data === 'TRIM_ASSETS_IF_UNUSED') {
    // pagehide runs before the departing window disappears from clients.
    // Keep this one cleanup opportunity alive, then recheck all windows;
    // another tab (or a newly opened one) still protects its cached build.
    keepAlive(event, new Promise(resolve => setTimeout(resolve, ASSET_CLEANUP_DELAY_MS))
      .then(() => caches.open(ASSETS))
      .then(cache => trimAssetsWhenUnused(cache)));
  }
  if (event.data === 'GET_VERSION') {
    event.ports?.[0]?.postMessage({ version: SW_VERSION });
  }
  if (event.data === 'ATLAS_OFFLINE_CAPABILITY') event.ports?.[0]?.postMessage({ atlasShell: true });
});
