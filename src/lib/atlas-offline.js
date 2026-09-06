import { useEffect, useState } from 'react';

export const ATLAS_SHELL_CACHE = 'vmx-atlas-shell-v1';
const MANIFEST_KEY = '/__atlas-shell-manifest';
export function offlineHeaders(source) {
  const headers = new Headers(source);
  headers.delete('content-encoding');
  headers.delete('content-length');
  for (const name of ['connection', 'keep-alive', 'transfer-encoding', 'te', 'trailer', 'upgrade'])
    headers.delete(name);
  // Verified public bytes do not vary by CORS/compression negotiation.
  const vary = (headers.get('vary') || '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value && !['origin', 'accept-encoding'].includes(value.toLowerCase()));
  if (vary.length) headers.set('vary', vary.join(', '));
  else headers.delete('vary');
  return headers;
}
const ALLOWED =
  /^\/(?:assets\/[a-zA-Z0-9_./-]+\.(?:js|css)|fonts\/sarabun-[a-z0-9]+\.woff2|atlas\/[a-z0-9-]+-[a-f0-9]{12}\.webp)$/;
let preparation;
const deadline = (promise, ms) => {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Offline preparation timed out')), ms);
    }),
  ]).finally(() => clearTimeout(timer));
};
async function supportsOfflineShell() {
  const registration = await deadline(navigator.serviceWorker.ready, 12000);
  const worker = registration.active;
  if (!worker) return false;
  const channel = new MessageChannel();
  try {
    return await deadline(
      new Promise((resolve) => {
        channel.port1.onmessage = (event) => resolve(event.data?.atlasShell === true);
        worker.postMessage('ATLAS_OFFLINE_CAPABILITY', [channel.port2]);
      }),
      3000,
    );
  } finally {
    channel.port1.close();
  }
}
export function validManifest(manifest) {
  return (
    manifest?.version === 1 &&
    /^[a-f0-9]{64}$/.test(manifest.revision || '') &&
    typeof manifest.entryScript === 'string' &&
    manifest.entryScript.startsWith('assets/') &&
    Array.isArray(manifest.assets) &&
    manifest.assets.length > 0 &&
    manifest.assets.length < 64 &&
    manifest.assets.every(
      (asset) =>
        ALLOWED.test(asset.url) &&
        !asset.url.includes('..') &&
        Number.isSafeInteger(asset.bytes) &&
        asset.bytes > 0 &&
        /^[a-f0-9]{64}$/.test(asset.sha256),
    ) &&
    manifest.assets.reduce((sum, asset) => sum + asset.bytes, 0) <= 8 * 1024 * 1024
  );
}
async function prepare() {
  if (!('caches' in globalThis) || !('serviceWorker' in navigator) || !globalThis.crypto?.subtle)
    return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  const check = () => {
    if (controller.signal.aborted) throw new Error('Offline preparation cancelled');
  };
  try {
    if (!(await supportsOfflineShell())) return false;
    const cache = await deadline(caches.open(ATLAS_SHELL_CACHE), 3000);
    const storedResponse = await deadline(cache.match(MANIFEST_KEY), 3000);
    const stored = storedResponse ? await storedResponse.json() : null;
    let manifest;
    try {
      const response = await fetch('/atlas-offline.json', { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('Manifest unavailable');
      manifest = await response.json();
    } catch {
      if (!validManifest(stored)) return false;
      manifest = stored;
    }
    if (!validManifest(manifest)) return false;
    const keys = new Set(
      (await deadline(cache.keys(), 3000)).map((request) => new URL(request.url).pathname),
    );
    const urls = [...manifest.assets.map((asset) => asset.url), '/app/atlas'];
    if (stored?.revision === manifest.revision && urls.every((url) => keys.has(url))) return true;
    const fetched = [];
    let cursor = 0;
    await Promise.all(
      Array.from({ length: 3 }, async () => {
        while (cursor < manifest.assets.length) {
          const asset = manifest.assets[cursor++];
          check();
          const response = await fetch(asset.url, { cache: 'force-cache', signal: controller.signal });
          if (!response.ok) throw new Error('Offline asset unavailable');
          const bytes = await response.arrayBuffer();
          const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (byte) =>
            byte.toString(16).padStart(2, '0'),
          ).join('');
          if (bytes.byteLength !== asset.bytes || digest !== asset.sha256)
            throw new Error('Offline asset changed');
          const type = asset.url.endsWith('.js')
            ? 'application/javascript'
            : asset.url.endsWith('.css')
              ? 'text/css'
              : asset.url.endsWith('.woff2')
                ? 'font/woff2'
                : 'image/webp';
          const headers = offlineHeaders(response.headers);
          headers.set('Content-Type', type);
          fetched.push({ url: asset.url, response: new Response(bytes, { headers }) });
        }
      }),
    );
    const htmlResponse = await fetch('/app/atlas', { cache: 'no-store', signal: controller.signal });
    if (!htmlResponse.ok) throw new Error('Offline entry unavailable');
    const html = await htmlResponse.text();
    if (!html.includes(`/${manifest.entryScript}`)) throw new Error('Offline entry and build do not match');
    // Keep the last working document until every dependency is durable.
    for (const asset of fetched) {
      check();
      await deadline(cache.put(asset.url, asset.response), 5000);
    }
    check();
    const htmlHeaders = offlineHeaders(htmlResponse.headers);
    htmlHeaders.set('Content-Type', 'text/html; charset=utf-8');
    await deadline(cache.put('/app/atlas', new Response(html, { headers: htmlHeaders })), 5000);
    await deadline(
      cache.put(
        MANIFEST_KEY,
        new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } }),
      ),
      5000,
    );
    const keep = new Set([...urls, MANIFEST_KEY]);
    for (const request of await cache.keys())
      if (!keep.has(new URL(request.url).pathname)) await cache.delete(request);
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
export function prepareAtlasOffline() {
  if (!preparation)
    preparation = prepare().then((result) => {
      if (!result) preparation = null;
      return result;
    });
  return preparation;
}
export function useAtlasOffline() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!import.meta.env.PROD) return undefined;
    let active = true;
    prepareAtlasOffline().then((value) => {
      if (active) setReady(value);
    });
    return () => {
      active = false;
    };
  }, []);
  return ready;
}
