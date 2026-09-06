import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { setImmediate } from 'node:timers/promises';

test('a disposed viewer cannot continue its queued cache write or notify state', async t => {
  const { loadAtlasAsset } = await import('../../src/lib/atlas-cache.js?cancel-test');
  const bytes = new Uint8Array(28);
  new DataView(bytes.buffer).setUint32(0, 0x46546c67, true);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const asset = { model: `/atlas/test-${sha256.slice(0, 12)}.glb`, bytes: bytes.length, sha256 };
  let releaseKeys, enteredKeys;
  const entered = new Promise(resolve => { enteredKeys = resolve; });
  const held = new Promise(resolve => { releaseKeys = resolve; });
  let writes = 0, notifications = 0;
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'caches');
  Object.defineProperty(globalThis, 'caches', { configurable: true, value: { open: async () => ({
    match: async () => undefined,
    keys: async () => { enteredKeys(); await held; return []; },
    put: async () => { writes++; },
  }) } });
  t.mock.method(globalThis, 'fetch', async () => new Response(bytes));
  try {
    const controller = new AbortController();
    await loadAtlasAsset(asset, { signal: controller.signal, onStored: () => { notifications++; } });
    await entered;
    controller.abort();
    releaseKeys();
    await setImmediate();
    assert.equal(writes, 0);
    assert.equal(notifications, 0);
    const stored = new Promise(resolve => {
      loadAtlasAsset(asset, { onStored: resolve }).catch(resolve);
    });
    assert.equal(await stored, true, 'a later viewer can still cache normally');
    assert.equal(writes, 1);
  } finally {
    releaseKeys();
    if (prior) Object.defineProperty(globalThis, 'caches', prior);
    else delete globalThis.caches;
  }
});
