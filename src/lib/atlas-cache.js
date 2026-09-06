// Public, content-hashed geometry only. Kept separate from personal study data.
export const ATLAS_CACHE_NAME = 'vmx-atlas-models-v1';
export const ATLAS_CACHE_BUDGET = 32 * 1024 * 1024;
const HASHED_MODEL = /^\/atlas\/[a-z0-9-]+-[a-f0-9]{12}\.glb$/;
let cacheWrite = Promise.resolve();
let cacheWritesDisabled = false;

function bounded(operation, milliseconds) {
  let timer;
  return Promise.race([
    operation,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Cache timed out')), milliseconds);
    }),
  ]).finally(() => clearTimeout(timer));
}

function validateAsset(asset) {
  if (
    !asset ||
    !HASHED_MODEL.test(asset.model) ||
    !Number.isSafeInteger(asset.bytes) ||
    asset.bytes < 20 ||
    asset.bytes > 16 * 1024 * 1024 ||
    !/^[a-f0-9]{64}$/.test(asset.sha256)
  ) {
    throw new Error('Invalid atlas asset descriptor.');
  }
}
async function verified(bytes, asset) {
  if (bytes.byteLength !== asset.bytes || new DataView(bytes).getUint32(0, true) !== 0x46546c67) return false;
  if (!globalThis.crypto?.subtle) return false;
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (value) => value.toString(16).padStart(2, '0')).join('') === asset.sha256;
}
async function readCached(asset) {
  try {
    const cache = await caches.open(ATLAS_CACHE_NAME);
    const hit = await cache.match(asset.model);
    if (!hit) return null;
    const bytes = await hit.arrayBuffer();
    if (await verified(bytes, asset)) return bytes;
    // Do not delete here: a slow read could otherwise erase a newer valid
    // write. A successful fetch replaces these rejected bytes in place.
  } catch {
    /* Private browsing/quota restrictions must not block reading. */
  }
  return null;
}
async function storeCached(asset, bytes, signal) {
  if (cacheWritesDisabled || signal?.aborted) return false;
  let stored = false;
  cacheWrite = cacheWrite
    .catch(() => {})
    .then(async () => {
      if (cacheWritesDisabled || signal?.aborted) return;
      try {
        await bounded(
          (async () => {
            const cache = await caches.open(ATLAS_CACHE_NAME);
            if (signal?.aborted) return;
            const entries = await cache.keys();
            if (signal?.aborted) return;
            let total = 0;
            const inventory = [];
            for (const request of entries) {
              const response = await cache.match(request);
              if (signal?.aborted) return;
              const size = Number(response?.headers.get('X-Atlas-Bytes')) || 0;
              inventory.push({ request, size });
              total += size;
            }
            for (const entry of inventory) {
              if (signal?.aborted) return;
              if (total + bytes.byteLength <= ATLAS_CACHE_BUDGET) break;
              await cache.delete(entry.request);
              total -= entry.size;
            }
            if (signal?.aborted) return;
            await cache.put(
              asset.model,
              new Response(bytes, {
                headers: { 'Content-Type': 'model/gltf-binary', 'X-Atlas-Bytes': String(bytes.byteLength) },
              }),
            );
            stored = true;
          })(),
          5000,
        );
      } catch {
        if (!signal?.aborted) cacheWritesDisabled = true;
        /* Network result remains usable even if persistent caching fails. */
      }
    });
  await cacheWrite;
  return stored;
}

export async function loadAtlasAsset(asset, { signal, onProgress = () => {}, onStored = () => {} } = {}) {
  validateAsset(asset);
  const cached = await bounded(readCached(asset), globalThis.navigator?.onLine === false ? 5000 : 1200).catch(
    () => null,
  );
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  if (cached) {
    onProgress(100);
    return { bytes: cached, cached: true, stored: true };
  }
  const response = await fetch(asset.model, { signal });
  if (!response.ok) throw new Error('โหลดไฟล์โมเดลไม่สำเร็จ');
  let bytes;
  if (response.body?.getReader) {
    const reader = response.body.getReader();
    const output = new Uint8Array(asset.bytes);
    let offset = 0,
      previous = -1;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (offset + value.length > asset.bytes) throw new Error('ขนาดโมเดลไม่ตรงกับข้อมูลต้นฉบับ');
        output.set(value, offset);
        offset += value.length;
        const percent = Math.floor((offset / asset.bytes) * 100);
        if (percent !== previous) {
          previous = percent;
          onProgress(percent);
        }
      }
    } catch (error) {
      await reader.cancel().catch(() => {});
      throw error;
    }
    if (offset !== asset.bytes) throw new Error('ดาวน์โหลดโมเดลมาไม่ครบ');
    bytes = output.buffer;
  } else bytes = await response.arrayBuffer();
  if (!(await verified(bytes, asset))) throw new Error('ไฟล์โมเดลไม่ตรงกับเวอร์ชันที่ตรวจไว้');
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  // Rendering can start as soon as validated bytes arrive. Storage is optional,
  // bounded work; the UI only promises offline readiness after it completes.
  const reportStored = stored => { if (!signal?.aborted) onStored(stored); };
  void storeCached(asset, bytes, signal)
    .then(reportStored)
    .catch(() => reportStored(false));
  return { bytes, cached: false, stored: false };
}

export async function atlasCacheStatus(assets) {
  try {
    const cache = await caches.open(ATLAS_CACHE_NAME);
    const hits = await Promise.all(assets.map((asset) => cache.match(asset.model)));
    return { available: true, count: hits.filter(Boolean).length };
  } catch {
    return { available: false, count: 0 };
  }
}
