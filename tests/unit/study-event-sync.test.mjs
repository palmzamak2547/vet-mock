// ============================================================
// study-event-sync.test.mjs — pulling the study-event archive
// ============================================================
// Every launch while signed in called syncStudyEvents(owner, { pull: true }),
// and the pull paged through the owner's whole study_event_batches archive,
// 100 batches a request, replaying each into IndexedDB. The same answers came
// down again on every cold start.
//
// The pull now keeps a per-owner mark: the newest (updated_at, session_id)
// already stored on this device. A launch asks only for batches from a little
// before that mark. A device with no mark (a new device, or one whose storage
// was cleared) pulls everything, and so does an explicit { pull: 'full' }.
//
// The server here models the real table and RPC: a new batch is stamped with
// the transaction's start time (now()), a late append to an existing session
// restamps it with clock_timestamp(), and the stamps are Postgres's own JSON
// form, microseconds and all. The real study-event-log.js runs on the memory
// IndexedDB. supabase.js and owned-rpc.js read import.meta.env and cannot load
// outside Vite, so Node's module hooks swap those two imports, and only for
// study-event-sync.js, for stubs the test controls. Each simulated device or
// reload gets its own copy of both modules, so nothing cached in memory
// carries over between them.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { memoryIndexedDb } from '../helpers/memory-indexed-db.mjs';

const SYNC = '/src/lib/study-event-sync.js';
registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '');
    const [parentPath, query = ''] = parent.split('?');
    if (parentPath.endsWith(SYNC)) {
      if (specifier === './supabase.js') return { url: 'vetmock-test:study-sync-supabase', shortCircuit: true };
      if (specifier === './owned-rpc.js') return { url: 'vetmock-test:study-sync-rpc', shortCircuit: true };
      if (specifier === './study-event-log.js' && query) {
        const resolved = nextResolve(specifier, context);
        return { ...resolved, url: `${resolved.url}?${query}` };
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'vetmock-test:study-sync-supabase') {
      return { format: 'module', shortCircuit: true, source: 'export const getSupabase = async () => globalThis.__vmxStudySyncServer.client;' };
    }
    if (url === 'vetmock-test:study-sync-rpc') {
      return { format: 'module', shortCircuit: true, source: 'export const ownedRpc = (owner, name, args) => globalThis.__vmxStudySyncServer.rpc(owner, name, args);' };
    }
    return nextLoad(url, context);
  },
});

const OWNER = '4a7f3c1e-9b2d-4e8a-b6c5-0d1e2f3a4b5c';
const HOUR_US = 3_600_000_000;
let deviceSeq = 0;

// ── Postgres timestamps ──────────────────────────────────────────
// Microseconds since the epoch, in and out of the form PostgREST returns:
// '2026-09-23T10:00:00.123456+00:00', trailing zeros of the fraction dropped.
function formatStamp(us) {
  const ms = Math.floor(us / 1000);
  const base = new Date(ms).toISOString().slice(0, 19);
  const frac = String(us % 1_000_000).padStart(6, '0').replace(/0+$/, '');
  return `${base}${frac ? `.${frac}` : ''}+00:00`;
}
function parseStamp(text) {
  const m = /^(.{19})(?:\.(\d{1,6}))?(Z|[+-]\d\d:\d\d)$/.exec(String(text));
  assert.ok(m, `not a timestamp the server would accept: ${text}`);
  const ms = Date.parse(`${m[1]}${m[3] === 'Z' ? 'Z' : m[3]}`);
  return ms * 1000 + Number((m[2] || '').padEnd(6, '0'));
}

function sessionId(n) {
  return `${String(n).padStart(8, '0')}-0000-4000-8000-000000000000`;
}
function attempt(session, q) {
  return {
    id: `attempt:${session}:${q}`, schemaVersion: 1, kind: 'attempt', sessionId: session,
    questionId: q, questionVersion: 'v1', date: 1_758_600_000_000 + q, correct: q % 2 === 0,
    answer: 1, elapsedMs: 1200,
  };
}

// ── the server: study_event_batches and append_study_events ──────
function server() {
  let clock = Date.UTC(2026, 8, 1) * 1000;
  const rows = new Map();          // session_id → { user_id, session_id, events, updated_at }
  const selects = [];
  let failSelect = null;           // (n) => boolean, n counts selects from 1
  const api = {
    selects,
    tick(us = 1) { clock += us; return clock; },
    now: () => clock,
    failSelectsWhere(fn) { failSelect = fn; },
    /** append_study_events as the migration writes it. `stampedAt` models a
     *  transaction that began earlier than it committed. */
    append(session, events, { stampedAt = null } = {}) {
      const existing = rows.get(session);
      const incoming = Object.fromEntries(events.map((e) => [e.id, e]));
      if (!existing) {
        rows.set(session, { user_id: OWNER, session_id: session, events: incoming, updated_at: stampedAt ?? api.tick() });
        return;
      }
      const merged = { ...incoming, ...existing.events };
      if (JSON.stringify(merged) === JSON.stringify(existing.events)) return;
      rows.set(session, { ...existing, events: merged, updated_at: stampedAt ?? api.tick() });
    },
    /** Every event the server holds, as ids. */
    eventIds() {
      return [...rows.values()].flatMap((r) => Object.keys(r.events)).sort();
    },
    client: {
      auth: { getSession: async () => ({ data: { session: { user: { id: OWNER } } } }) },
      from(table) {
        assert.equal(table, 'study_event_batches');
        const filters = []; const order = []; let limit = Infinity; let columns = '*';
        const request = { filters, order };
        const builder = {
          select(cols) { columns = cols; return builder; },
          eq(col, value) { filters.push([col, 'eq', value]); return builder; },
          gt(col, value) { filters.push([col, 'gt', value]); return builder; },
          gte(col, value) { filters.push([col, 'gte', value]); return builder; },
          order(col, { ascending = true } = {}) { order.push([col, ascending]); return builder; },
          limit(n) { limit = n; return builder; },
          abortSignal() { return builder; },
          then(onOk, onErr) {
            selects.push(request);
            if (failSelect?.(selects.length)) {
              return Promise.resolve({ data: null, error: new Error('network down') }).then(onOk, onErr);
            }
            const value = (row, col) => (col === 'updated_at' ? row.updated_at : row[col]);
            const operand = (col, v) => (col === 'updated_at' ? parseStamp(v) : v);
            const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
            let out = [...rows.values()].filter((row) => filters.every(([col, op, v]) => {
              const c = cmp(value(row, col), operand(col, v));
              return op === 'eq' ? c === 0 : op === 'gt' ? c > 0 : c >= 0;
            }));
            out.sort((a, b) => {
              for (const [col, asc] of order) {
                const c = cmp(value(a, col), value(b, col));
                if (c) return asc ? c : -c;
              }
              return 0;
            });
            out = out.slice(0, limit).map((row) => {
              const picked = {};
              for (const col of columns.split(',')) {
                picked[col] = col === 'updated_at' ? formatStamp(row.updated_at) : structuredClone(row[col]);
              }
              return picked;
            });
            request.rows = out.length;
            return Promise.resolve({ data: out, error: null }).then(onOk, onErr);
          },
        };
        return builder;
      },
    },
    async rpc(owner, name, args) {
      assert.equal(name, 'append_study_events');
      api.append(args.p_session_id, Object.values(args.p_events));
      return { ok: true };
    },
  };
  return api;
}

/** A launch on a device: fresh copies of the sync and log modules over that
 *  device's IndexedDB. */
async function launch(db) {
  const tag = `device=${++deviceSeq}`;
  globalThis.indexedDB = db;
  const sync = await import(`../../src/lib/study-event-sync.js?${tag}`);
  const log = await import(`../../src/lib/study-event-log.js?${tag}`);
  return { sync, log, db };
}
async function localIds(device) {
  globalThis.indexedDB = device.db;
  return (await device.log.listStudyEvents(OWNER)).map((e) => e.id).sort();
}
async function pull(device, options = { pull: true }) {
  globalThis.indexedDB = device.db;
  return device.sync.syncStudyEvents(OWNER, options);
}

/** An archive of `count` sessions, one minute apart, two answers each. */
function seed(api, count, startAt = 0) {
  for (let i = startAt; i < startAt + count; i += 1) {
    api.tick(60_000_000);
    const s = sessionId(i);
    api.append(s, [attempt(s, 1), attempt(s, 2)]);
  }
}

test.afterEach(() => { delete globalThis.indexedDB; delete globalThis.__vmxStudySyncServer; });

test('a launch with an up-to-date mark asks for one small page, not the whole archive', async () => {
  const api = server(); globalThis.__vmxStudySyncServer = api;
  seed(api, 250);
  const db = memoryIndexedDb();

  const first = await launch(db);
  assert.deepEqual(await pull(first), { ok: true, pending: false });
  assert.deepEqual(await localIds(first), api.eventIds(), 'a device with no mark restores everything');

  api.selects.length = 0;
  const next = await launch(db);
  assert.equal((await pull(next)).ok, true);
  assert.equal(api.selects.length, 1, `a cold start made ${api.selects.length} requests`);
  const [request] = api.selects;
  assert.ok(request.filters.some(([col, op]) => col === 'updated_at' && op === 'gte'), 'the request is bounded by the mark');
  assert.ok(request.rows <= 11, `it downloaded ${request.rows} of 250 batches`);
  assert.deepEqual(await localIds(next), api.eventIds());
});

test('late appends, equal stamps, out-of-order commits, an interrupted pull and a new device all converge', async () => {
  const api = server(); globalThis.__vmxStudySyncServer = api;
  seed(api, 120);
  const dbA = memoryIndexedDb();
  const a = await launch(dbA);
  assert.equal((await pull(a)).ok, true);
  const markedAt = api.now();

  // Another device answers more of an old session: its stamp moves forward.
  api.tick(HOUR_US);
  api.append(sessionId(3), [attempt(sessionId(3), 9)]);
  // 230 new sessions stamped in the same microsecond: more than two pages
  // that cannot be told apart by time.
  api.tick(HOUR_US);
  const same = api.tick();
  for (let i = 1000; i < 1230; i += 1) api.append(sessionId(i), [attempt(sessionId(i), 1)], { stampedAt: same });
  // A transaction that started five minutes before this device's last pull
  // and committed only now.
  api.append(sessionId(2000), [attempt(sessionId(2000), 1)], { stampedAt: markedAt - 5 * 60_000_000 });

  // The next launch loses the network on its second page.
  api.selects.length = 0;
  api.failSelectsWhere((n) => n === 2);
  const interrupted = await launch(dbA);
  assert.equal((await pull(interrupted)).ok, false);
  api.failSelectsWhere(null);

  const resumed = await launch(dbA);
  assert.equal((await pull(resumed)).ok, true);
  assert.deepEqual(await localIds(resumed), api.eventIds(), 'the returning device has every event');

  const fresh = await launch(memoryIndexedDb());
  assert.equal((await pull(fresh)).ok, true);
  assert.deepEqual(await localIds(fresh), api.eventIds(), 'a new device has every event');
});

test('an explicit full pull ignores the mark, and restores what was lost locally', async () => {
  const api = server(); globalThis.__vmxStudySyncServer = api;
  seed(api, 30);
  const db = memoryIndexedDb();
  const device = await launch(db);
  assert.equal((await pull(device)).ok, true);

  api.selects.length = 0;
  const again = await launch(db);
  assert.equal((await pull(again, { pull: 'full' })).ok, true);
  assert.ok(api.selects.every((r) => !r.filters.some(([col]) => col === 'updated_at')), 'a full pull is not bounded by the mark');
  assert.equal(api.selects.reduce((n, r) => n + r.rows, 0), 30);

  // Clearing this owner's events clears the mark with them, so the next
  // ordinary launch pulls everything back.
  globalThis.indexedDB = db;
  assert.equal((await again.log.clearStudyEvents(OWNER)).ok, true);
  assert.equal(await again.log.readStudyEventPullMark(OWNER), null);
  const after = await launch(db);
  assert.equal((await pull(after)).ok, true);
  assert.deepEqual(await localIds(after), api.eventIds());
});

test('the mark never runs ahead of what was stored', async () => {
  const api = server(); globalThis.__vmxStudySyncServer = api;
  seed(api, 20);
  const db = memoryIndexedDb();
  const device = await launch(db);
  db.failWrites = true;
  assert.equal((await pull(device)).ok, false);
  db.failWrites = false;
  assert.equal(await device.log.readStudyEventPullMark(OWNER), null, 'nothing was stored, so nothing is marked');
  const retry = await launch(db);
  assert.equal((await pull(retry)).ok, true);
  assert.deepEqual(await localIds(retry), api.eventIds());
  const mark = await retry.log.readStudyEventPullMark(OWNER);
  assert.equal(parseStamp(mark.updatedAt), api.now(), 'the mark is the newest stored batch, in the server’s own form');
  assert.equal((await retry.log.pendingStudyEvents(OWNER)).length, 0, 'the mark is not an event');
});

test('a page that cannot be stored leaves the mark at the last page that was', async () => {
  const api = server(); globalThis.__vmxStudySyncServer = api;
  seed(api, 120);
  // The server accepts this batch; the device's own validation does not, so
  // it can never be stored here. Everything before it must stay marked as
  // pulled, and nothing from its page may be marked.
  api.tick(60_000_000);
  api.append(sessionId(120), [{ ...attempt(sessionId(120), 1), questionVersion: 5 }]);
  seed(api, 29, 121);
  const db = memoryIndexedDb();
  const device = await launch(db);
  assert.equal((await pull(device)).ok, false);
  const mark = await device.log.readStudyEventPullMark(OWNER);
  assert.equal(mark?.sessionId, sessionId(99), 'the mark stops at the end of the first page');
  const stored = await localIds(device);
  assert.ok(stored.includes(`attempt:${sessionId(119)}:2`), 'the second page is stored up to the bad batch');
});
