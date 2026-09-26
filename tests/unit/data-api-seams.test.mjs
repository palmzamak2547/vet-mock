// ============================================================
// data-api-seams — api.js paths that talk to the account backend
// ============================================================
// Bug hunt 2026-09-26, package data-api:
//
//   B12  saveExamResult must say which HTTP status refused a result, so the
//        outbox can tell "the server will never take this" (400/409/413)
//        from "try again later", and set the first aside instead of letting
//        it hold every later result on the device.
//   B79  subscribeQComments: a classmate's new comment arrives from Realtime
//        without its author (no profiles join), and a DELETE on an RLS table
//        carries only the primary key, so it never matched q_id and a deleted
//        comment stayed on everyone else's screen.
//
// supabase.js reads import.meta.env and cannot load outside Vite, so Node's
// module hooks swap that one import, only for api.js, for a stub this test
// drives. The rest of api.js runs as shipped.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '').split('?')[0];
    if (parent.endsWith('/src/lib/api.js') && specifier === './supabase.js') {
      return { url: 'vetmock-test:data-api-supabase', shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'vetmock-test:data-api-supabase') {
      return {
        format: 'module', shortCircuit: true,
        source: 'export const getSupabase = async () => globalThis.__vmxDataApi; export const ensureProfile = async () => {}; export const hasSupabase = true;',
      };
    }
    return nextLoad(url, context);
  },
});

const api = await import('../../src/lib/api.js');

// ── B12 ────────────────────────────────────────────────────────────
test('B12: a refused exam result carries the HTTP status the outbox decides on', async () => {
  globalThis.__vmxDataApi = {
    auth: { getSession: async () => ({ data: { session: { user: { id: 'u1' }, access_token: 't' } } }) },
  };
  const realFetch = globalThis.fetch;
  const answers = [
    { status: 409, body: { ok: false, id: 'r1', error: 'result_conflict' } },
    { status: 400, body: { error: 'invalid-submission' } },
    { status: 503, body: { error: 'result_pending', retryAfter: 30 } },
  ];
  try {
    for (const answer of answers) {
      globalThis.fetch = async () => new Response(JSON.stringify(answer.body), { status: answer.status });
      await assert.rejects(
        api.saveExamResult({ id: 'r1', user_id: 'u1', question_ids: ['1'], answers: {} }),
        (error) => {
          assert.equal(error.status, answer.status, `status ${answer.status} reaches the outbox`);
          return true;
        },
      );
    }
  } finally {
    globalThis.fetch = realFetch;
    delete globalThis.__vmxDataApi;
  }
});

// ── B79 ────────────────────────────────────────────────────────────
function realtimeFake(rows) {
  const listeners = [];
  const channel = {
    on(type, filter, cb) { listeners.push({ filter, cb }); return channel; },
    subscribe() { return channel; },
  };
  const client = {
    channel: () => channel,
    from(table) {
      assert.equal(table, 'q_comments');
      let id;
      const q = {
        select() { return q; },
        eq(column, value) { if (column === 'id') id = value; return q; },
        maybeSingle: async () => ({ data: rows.get(id) || null, error: null }),
      };
      return q;
    },
  };
  // Deliver a server event to every listener whose filter Realtime would
  // match. A DELETE cannot be column-filtered: only an unfiltered listener
  // hears it, and its old row holds the primary key alone.
  const emit = (payload) => {
    for (const { filter, cb } of listeners) {
      if (filter.event !== '*' && filter.event !== payload.eventType) continue;
      if (filter.filter && payload.eventType === 'DELETE') continue;
      if (filter.filter) {
        const [column, rest] = filter.filter.split('=');
        const row = payload.new || payload.old;
        if (String(row?.[column]) !== rest.replace(/^eq\./, '')) continue;
      }
      cb(payload);
    }
  };
  return { client, emit };
}

const flush = async () => { for (let i = 0; i < 5; i++) await new Promise((r) => setImmediate(r)); };

test('B79: a classmate\'s new comment arrives with its author, and a deleted one is removed', async () => {
  const stored = { id: 'c1', q_subject: 'com5', q_id: 42, user_id: 'friend', body: 'key should be B', parent_id: null,
    created_at: 't', updated_at: 't', profiles: { username: 'bee', avatar_emoji: '🐶' } };
  const rows = new Map([['c1', stored]]);
  const fake = realtimeFake(rows);
  globalThis.__vmxDataApi = fake.client;
  const events = [];
  try {
    await api.subscribeQComments('com5', 42, (payload) => events.push(payload));
    const { profiles: _drop, ...bare } = stored;
    fake.emit({ eventType: 'INSERT', new: bare, old: {} });
    await flush();
    assert.equal(events.length, 1);
    assert.equal(events[0].new.profiles?.username, 'bee', 'the author is on the row the thread appends');

    rows.delete('c1');
    fake.emit({ eventType: 'DELETE', new: {}, old: { id: 'c1' } });
    await flush();
    assert.equal(events.length, 2, 'the deletion reaches the thread');
    assert.equal(events[1].eventType, 'DELETE');
    assert.equal(events[1].old.id, 'c1');
  } finally { delete globalThis.__vmxDataApi; }
});

test('B79: a comment posted and deleted before it could be read back is never shown', async () => {
  const fake = realtimeFake(new Map());
  globalThis.__vmxDataApi = fake.client;
  const events = [];
  try {
    await api.subscribeQComments('com5', 42, (payload) => events.push(payload));
    fake.emit({ eventType: 'INSERT', new: { id: 'gone', q_subject: 'com5', q_id: 42, body: 'x' }, old: {} });
    fake.emit({ eventType: 'INSERT', new: { id: 'other-q', q_subject: 'com5', q_id: 7, body: 'y' }, old: {} });
    await flush();
    assert.equal(events.length, 0);
  } finally { delete globalThis.__vmxDataApi; }
});
