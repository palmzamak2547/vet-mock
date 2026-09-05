// ============================================================
// api-fetch-honesty.test.mjs — a failed fetch must not look like "nothing here"
// ============================================================
// Two reads in src/lib/api.js used to swallow their own failure:
//
//   listQComments  — a PostgREST error became `[]`, so a phone that dropped
//                    its connection while scrolling the review screen was told
//                    "ยังไม่มีความเห็น — เป็นคนแรกได้" under a question that had
//                    a real discussion (often where a wrong key gets corrected),
//                    and a failed background refetch wiped a thread that was
//                    already on screen.
//   saveExamResult — an insert error was console.error'd and the promise
//                    resolved, so a finished mock that never reached the
//                    leaderboard reported success; the failed attempt also
//                    stayed in the 5 s dedupe window, so a retry got the same
//                    dead promise back instead of hitting the DB again.
//
// supabase.js reads import.meta.env at module scope, which node does not
// define, so the real module cannot load here. Everything else api.js imports
// is plain, so only that one import is swapped for a stub whose client each
// test controls. The function bodies under test are the real ones.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const API_PATH = resolve(process.cwd(), 'src/lib/api.js');
const SRC = readFileSync(API_PATH, 'utf8');

const supabaseStub = 'data:text/javascript,' + encodeURIComponent(
  'export const hasSupabase = true;\n'
  + 'export function getSupabase() { return Promise.resolve(globalThis.__vmxTestSupabase); }\n',
);

// A data: module cannot resolve relative specifiers, so every sibling import
// is rewritten to its absolute file URL and supabase.js to the stub above.
const rewritten = SRC.replace(/from '(\.[^']+)'/g, (_m, spec) => {
  if (spec === './supabase.js') return `from '${supabaseStub}'`;
  return `from '${pathToFileURL(resolve(dirname(API_PATH), spec)).href}'`;
});
const api = await import('data:text/javascript;base64,' + Buffer.from(rewritten).toString('base64'));

/** A Supabase client whose reads and inserts answer with what the test says. */
function fakeClient({ select = { data: [], error: null }, insert = { error: null } } = {}) {
  const calls = { selects: 0, inserts: 0 };
  const client = {
    from() {
      const q = {
        select() { calls.selects++; return q; },
        eq() { return q; },
        order() { return q; },
        limit() { return Promise.resolve(select); },
        insert() { calls.inserts++; return Promise.resolve(insert); },
      };
      return q;
    },
  };
  return { client, calls };
}

function useClient(spec) {
  const made = fakeClient(spec);
  globalThis.__vmxTestSupabase = made.client;
  return made;
}

// The functions still log the raw error for whoever is debugging; keep the
// test output readable without changing that.
async function quiet(fn) {
  const { warn, error } = console;
  console.warn = () => {};
  console.error = () => {};
  try { return await fn(); } finally { console.warn = warn; console.error = error; }
}

const THAI = /[ก-๙]/;
const MIDDLE_DOT = '·';

// ── listQComments ────────────────────────────────────────────────────

test('a comment thread that fails to load is not reported as empty', async () => {
  useClient({ select: { data: null, error: { message: 'relation "public.q_comments" does not exist', code: '42P01' } } });
  await quiet(() => assert.rejects(
    api.listQComments('com5', 42),
    (e) => {
      assert.match(e.message, THAI, 'the message a student may see must be Thai');
      assert.ok(!e.message.includes(MIDDLE_DOT), 'no middle dot in user-facing text');
      return true;
    },
    'a PostgREST error used to come back as [] — the exact shape of an empty thread',
  ));
});

test('a dropped connection while loading comments is explained as a connection problem', async () => {
  useClient({ select: { data: null, error: { message: 'TypeError: Failed to fetch' } } });
  await quiet(() => assert.rejects(api.listQComments('com5', 42), /เชื่อมต่อไม่ได้/));
});

test('a thread that really is empty still comes back as an empty list', async () => {
  useClient({ select: { data: [], error: null } });
  assert.deepEqual(await api.listQComments('com5', 42), []);
  useClient({ select: { data: null, error: null } });
  assert.deepEqual(await api.listQComments('com5', 43), []);
});

test('a thread that loads is returned as-is', async () => {
  const rows = [{ id: 1, body: 'เฉลยข้อนี้น่าจะเป็น B' }];
  useClient({ select: { data: rows, error: null } });
  assert.deepEqual(await api.listQComments('com5', 44), rows);
});

// ── saveExamResult ───────────────────────────────────────────────────
// Each test uses its own user_id: the dedupe map is keyed on the row's
// signature and lives for the life of the module.

const row = (user) => ({ user_id: user, mode: 'exam', subject: 'com5', total: 50, correct: 41, pct: 82 });

test('an exam result the database refuses is not treated as saved', async () => {
  useClient({ insert: { error: { message: 'new row violates row-level security policy for table "exam_results"', code: '42501' } } });
  await quiet(() => assert.rejects(
    api.saveExamResult(row('u-refused')),
    (e) => {
      assert.match(e.message, THAI);
      assert.ok(!e.message.includes(MIDDLE_DOT));
      return true;
    },
    'the insert error used to be logged and the promise resolved like a success',
  ));
});

test('a failed save does not block a retry inside the dedupe window', async () => {
  const failing = useClient({ insert: { error: { message: 'TypeError: Failed to fetch' } } });
  await quiet(() => api.saveExamResult(row('u-retry')).catch(() => {}));
  assert.equal(failing.calls.inserts, 1);

  const working = useClient({ insert: { error: null } });
  await api.saveExamResult(row('u-retry'));
  assert.equal(
    working.calls.inserts, 1,
    'the retry must reach the DB — the failed attempt used to sit in the dedupe map for 5 s',
  );
});

test('a save that lands still resolves, and an identical save right after it is deduped', async () => {
  const made = useClient({ insert: { error: null } });
  await api.saveExamResult(row('u-ok'));
  await api.saveExamResult(row('u-ok'));
  assert.equal(made.calls.inserts, 1, 'the second identical save within the window must reuse the first');
});
