// ============================================================
// user-data-cas.test.mjs — the write only lands on the row it read
// ============================================================
// The sync engine re-reads user_data before every write and rebases its own
// edits onto it. The write itself used to be an unconditional upsert, so a
// second device that had read the same row a moment earlier replaced the
// first device's write, and both said "synced". The write is now a
// compare-and-set on updated_at: it names the exact updated_at it read, and
// when another device has written since, zero rows match and the engine
// re-reads and tries again.
//
// No schema change. Clients from before this change keep their upsert; every
// one of their writes still moves updated_at, so these writes notice them.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { casWriteUserData, nextSyncToken, SYNC_CONFLICT } from '../../src/lib/user-data-cas.js';

/** Records the PostgREST builder chain and answers with a canned result. */
function fakeSupabase(result) {
  const calls = [];
  const builder = {
    insert(v) { calls.push(['insert', v]); return builder; },
    update(v) { calls.push(['update', v]); return builder; },
    upsert(v) { calls.push(['upsert', v]); return builder; },
    eq(c, v) { calls.push(['eq', c, v]); return builder; },
    is(c, v) { calls.push(['is', c, v]); return builder; },
    select(c) { calls.push(['select', c]); return builder; },
    then(ok, fail) { return Promise.resolve(result).then(ok, fail); },
  };
  return { calls, from(t) { calls.push(['from', t]); return builder; } };
}
const NOW = Date.parse('2026-09-25T05:00:00.000Z');
const MICROS = '2026-09-22T18:14:56.123456+00:00';

test('update is conditional on the exact updated_at string that was read', async () => {
  const sb = fakeSupabase({ data: [{ updated_at: 'new' }], error: null });
  const r = await casWriteUserData(sb, 'u1', { notes: {} }, { rowExists: true, expectedUpdatedAt: MICROS }, NOW);
  assert.equal(r.updatedAt, 'new');
  assert.deepEqual(sb.calls.filter((c) => c[0] === 'eq'), [['eq', 'user_id', 'u1'], ['eq', 'updated_at', MICROS]],
    'the raw PostgREST string, never re-serialised: 3 live rows carry microseconds');
  assert.equal(sb.calls.find((c) => c[0] === 'update')[1].updated_at, '2026-09-25T05:00:00.000Z');
  assert.ok(!sb.calls.some((c) => c[0] === 'upsert'), 'an existing row is never upserted');
});

test('zero rows updated is a conflict, not a success', async () => {
  const sb = fakeSupabase({ data: [], error: null });
  await assert.rejects(casWriteUserData(sb, 'u1', {}, { rowExists: true, expectedUpdatedAt: 't' }, NOW), (e) => e.code === SYNC_CONFLICT);
});

test('a null updated_at is matched with IS NULL', async () => {
  const sb = fakeSupabase({ data: [{ updated_at: 'x' }], error: null });
  await casWriteUserData(sb, 'u1', {}, { rowExists: true, expectedUpdatedAt: null }, NOW);
  assert.ok(sb.calls.some((c) => c[0] === 'is' && c[1] === 'updated_at' && c[2] === null));
});

test('creating the row: a unique violation means another device won', async () => {
  const sb = fakeSupabase({ data: null, error: { code: '23505', message: 'duplicate key' } });
  await assert.rejects(casWriteUserData(sb, 'u1', {}, { rowExists: false, expectedUpdatedAt: null }, NOW), (e) => e.code === SYNC_CONFLICT);
  assert.equal(sb.calls[1][0], 'insert');
});

test('other errors stay errors', async () => {
  const sb = fakeSupabase({ data: null, error: { code: '42501', message: 'rls' } });
  await assert.rejects(casWriteUserData(sb, 'u1', {}, { rowExists: true, expectedUpdatedAt: 't' }, NOW), (e) => e.code === '42501');
});

test('the token only moves forward, even behind a fast clock or microseconds', () => {
  assert.equal(nextSyncToken('2026-09-26T00:00:00.000+00:00', NOW), '2026-09-26T00:00:00.001Z');
  assert.equal(nextSyncToken(MICROS, Date.parse('2026-09-22T18:14:56.123Z')), '2026-09-22T18:14:56.124Z');
  assert.equal(nextSyncToken(null, NOW), '2026-09-25T05:00:00.000Z');
});

// ── the real PostgREST client ────────────────────────────────────────
// The builder above cannot tell whether the request the SDK actually sends
// is conditional. This runs the same call through supabase-js with a fetch
// that records the request and answers like PostgREST.

function realClient(answer) {
  const requests = [];
  const fetch = async (url, init = {}) => {
    const request = { url: new URL(String(url)), method: init.method, headers: new Headers(init.headers), body: init.body };
    requests.push(request);
    const { status, body } = answer(request);
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  };
  const client = createClient('https://example.supabase.co', 'anon-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch },
  });
  return { client, requests };
}

test('on the wire: a PATCH filtered on user_id AND the updated_at that was read', async () => {
  const { client, requests } = realClient(() => ({ status: 200, body: [{ updated_at: '2026-09-25T05:00:00+00:00' }] }));
  const r = await casWriteUserData(client, 'u1', { notes: { k: 'v' } }, { rowExists: true, expectedUpdatedAt: MICROS }, NOW);
  assert.equal(r.updatedAt, '2026-09-25T05:00:00+00:00');
  assert.equal(requests.length, 1);
  const [req] = requests;
  assert.equal(req.method, 'PATCH');
  assert.equal(req.url.pathname, '/rest/v1/user_data');
  assert.equal(req.url.searchParams.get('user_id'), 'eq.u1');
  assert.equal(req.url.searchParams.get('updated_at'), `eq.${MICROS}`, 'the + of +00:00 must survive the query string');
  assert.match(req.url.search, /updated_at=eq\.2026-09-22T18%3A14%3A56\.123456%2B00%3A00/);
  assert.match(req.headers.get('prefer') || '', /return=representation/, 'without the rows back, zero matches looks like success');
  assert.deepEqual(JSON.parse(req.body), { notes: { k: 'v' }, updated_at: '2026-09-25T05:00:00.000Z' });
});

test('on the wire: PostgREST answering no rows is a conflict', async () => {
  const { client } = realClient(() => ({ status: 200, body: [] }));
  await assert.rejects(
    casWriteUserData(client, 'u1', { notes: {} }, { rowExists: true, expectedUpdatedAt: MICROS }, NOW),
    (e) => e.code === SYNC_CONFLICT,
  );
});

test('on the wire: creating the row is a plain insert, and a 409 duplicate is a conflict', async () => {
  const { client, requests } = realClient(() => ({ status: 409, body: { code: '23505', message: 'duplicate key value violates unique constraint "user_data_pkey"' } }));
  await assert.rejects(
    casWriteUserData(client, 'u1', { notes: {} }, { rowExists: false, expectedUpdatedAt: null }, NOW),
    (e) => e.code === SYNC_CONFLICT,
  );
  const [req] = requests;
  assert.equal(req.method, 'POST');
  assert.doesNotMatch(req.headers.get('prefer') || '', /resolution=merge-duplicates/, 'an insert must not quietly become an upsert');
  assert.equal(JSON.parse(req.body).user_id, 'u1');
});

// ── pushUserData in src/lib/api.js ───────────────────────────────────
// supabase.js reads import.meta.env at module scope, which node does not
// define, so api.js is loaded with only that one import swapped for a stub
// (the same technique as api-fetch-honesty.test.mjs). The function bodies
// under test are the real ones.

const API_PATH = resolve(process.cwd(), 'src/lib/api.js');
const supabaseStub = 'data:text/javascript,' + encodeURIComponent(
  'export const hasSupabase = true;\n'
  + 'export function getSupabase() { return Promise.resolve(globalThis.__vmxCasTestSupabase); }\n',
);
const rewritten = readFileSync(API_PATH, 'utf8').replace(/from '(\.[^']+)'/g, (_m, spec) => {
  if (spec === './supabase.js') return `from '${supabaseStub}'`;
  return `from '${pathToFileURL(resolve(dirname(API_PATH), spec)).href}'`;
});
const api = await import('data:text/javascript;base64,' + Buffer.from(rewritten + '\n//# sourceURL=api-cas-under-test.mjs').toString('base64'));

test('pushUserData with a precondition writes conditionally, never an upsert', async () => {
  const sb = fakeSupabase({ data: [{ updated_at: 'new' }], error: null });
  globalThis.__vmxCasTestSupabase = sb;
  await api.pushUserData('u1', { notes: { a: 1 } }, { rowExists: true, expectedUpdatedAt: MICROS });
  assert.ok(!sb.calls.some((c) => c[0] === 'upsert'), 'the unconditional upsert replaced a newer row');
  assert.ok(sb.calls.some((c) => c[0] === 'update'));
  assert.ok(sb.calls.some((c) => c[0] === 'eq' && c[1] === 'updated_at' && c[2] === MICROS));
});

test('pushUserData reports a lost race as SYNC_CONFLICT for the engine to retry', async () => {
  globalThis.__vmxCasTestSupabase = fakeSupabase({ data: [], error: null });
  await assert.rejects(
    api.pushUserData('u1', { notes: {} }, { rowExists: true, expectedUpdatedAt: MICROS }),
    (e) => e.code === SYNC_CONFLICT,
  );
});

test('pushUserData without a precondition keeps the old upsert for any other caller', async () => {
  const sb = fakeSupabase({ data: null, error: null });
  globalThis.__vmxCasTestSupabase = sb;
  await api.pushUserData('u1', { notes: {} });
  const upsert = sb.calls.find((c) => c[0] === 'upsert');
  assert.ok(upsert, 'the call shape old callers rely on is unchanged');
  assert.equal(upsert[1].user_id, 'u1');
});

// ── the React adapter ────────────────────────────────────────────────
// useUserDataSync is a hook and cannot run here. It is the one place the
// engine's remote is built, so a dropped third argument would silently put
// every device back on the unconditional write.

test('useUserDataSync hands the precondition through to pushUserData', () => {
  const hook = readFileSync(resolve(process.cwd(), 'src/hooks/useUserDataSync.js'), 'utf8');
  assert.match(
    hook,
    /push:\s*\((\w+),\s*(\w+),\s*(\w+)\)\s*=>\s*pushUserData\(\1,\s*\2,\s*\3\)/,
    'the remote adapter must forward (userId, payload, precondition)',
  );
});
