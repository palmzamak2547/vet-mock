// ============================================================
// bank-fetch-limit.test.mjs: a year's question banks never take the whole connection
// ============================================================
// A cold visit asks for the selected year's banks at boot: about 70 chunks,
// 2.6 MB gzipped for year 5. They used to be asked for all at once, and a
// screen opened meanwhile waited behind every one of them for its own chunk
// (measured on a slow 4G phone profile, 15 Nov 2026: Progress and the
// question manager drew after 17 s, a VetWiki article after 20 s). The loader
// now fetches a few at a time; this holds the limit and checks that every
// bank still arrives, in order, and that a failure still fails the load.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BANK_FETCHES_AT_ONCE, createLimiter, importBanks } from '../../src/data/questions.js';

const tick = () => new Promise((r) => setImmediate(r));

function fakeBanks(n) {
  const state = { inFlight: 0, peak: 0, started: [] };
  const loaders = Array.from({ length: n }, (_, i) => ({
    file: `questions-${i}.js`,
    exportName: `QB_${i}`,
    fn: () => {
      state.inFlight += 1;
      state.peak = Math.max(state.peak, state.inFlight);
      state.started.push(i);
      return new Promise((resolve) => setTimeout(() => { state.inFlight -= 1; resolve([{ id: i }]); }, 1 + (i % 3)));
    },
  }));
  return { state, loaders };
}

test('a year of banks is fetched a few at a time, and every bank arrives in order', async () => {
  assert.ok(BANK_FETCHES_AT_ONCE >= 2 && BANK_FETCHES_AT_ONCE <= 8, `limit ${BANK_FETCHES_AT_ONCE}`);
  const { state, loaders } = fakeBanks(74);
  const parts = await importBanks(loaders, createLimiter(BANK_FETCHES_AT_ONCE), (fn) => fn());
  assert.equal(state.peak, BANK_FETCHES_AT_ONCE, `${state.peak} banks were in flight at once`);
  assert.deepEqual(state.started, loaders.map((_, i) => i), 'banks started out of order');
  assert.deepEqual(parts.map((p) => p.file), loaders.map((l) => l.file));
  assert.deepEqual(parts.map((p) => p.questions[0].id), loaders.map((_, i) => i));
});

test('a bank that fails fails the load, and the banks behind it still settle', async () => {
  const { state, loaders } = fakeBanks(12);
  loaders[3].fn = () => Promise.reject(new Error('offline'));
  await assert.rejects(importBanks(loaders, createLimiter(4), (fn) => fn()), /offline/);
  for (let i = 0; i < 20; i++) { await new Promise((r) => setTimeout(r, 5)); }
  assert.equal(state.inFlight, 0);
  assert.equal(state.started.length, 11, 'the queue stopped after a failure');
});

test('a task that throws before returning a promise frees its place', async () => {
  const limit = createLimiter(1);
  await assert.rejects(limit(() => { throw new Error('sync'); }), /sync/);
  assert.equal(await limit(() => 7), 7);
  await tick();
});

test('the loader goes through the shared limit for every scope', () => {
  const src = readFileSync(new URL('../../src/data/questions.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const body = src.slice(src.indexOf('function _runLoaders('), src.indexOf('export function loadQB('));
  assert.match(body, /importBanks\(loaders\)/, '_runLoaders must fetch through importBanks and its shared limiter');
  assert.doesNotMatch(body, /loaders\.map\(/, '_runLoaders fetches the banks itself again');
});
