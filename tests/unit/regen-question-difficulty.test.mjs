import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PAGE_SIZE,
  MIN_ATTEMPTS_TO_WRITE,
  eventsOf,
  tallyRows,
  parseContentRange,
  fetchAttempts,
  refusalFor,
  buildOutput,
} from '../../scripts/regen-question-difficulty.mjs';
import { DIFFICULTY_MIN_ATTEMPTS } from '../../src/lib/elo.js';

// The difficulty snapshot is the only generated file fed by the live database,
// and nothing in CI runs it. Every real run used to write an empty map: the
// rows hold an OBJECT of events keyed by id, the parser looked for an array.
// These tests run the parser and the pager against a stubbed PostgREST.

const SCRIPT = fileURLToPath(new URL('../../scripts/regen-question-difficulty.mjs', import.meta.url));

// One study_event_batches row as the app writes it (study-event-sync.js:
// Object.fromEntries(events.map(e => [e.id, e]))), attempts shaped like
// createAttemptEntries in src/lib/study-events.js. An attempt id is per
// session and question, so one session holds one attempt per question.
function batchRow(sessionId, attempts) {
  const events = {};
  for (const [questionId, correct, answer = 1] of attempts) {
    const id = `attempt:${sessionId}:${questionId}`;
    events[id] = { id, schemaVersion: 2, kind: 'attempt', sessionId, questionId, correct, answer, elapsedMs: 900 };
  }
  events[`review:${sessionId}`] = { id: `review:${sessionId}`, kind: 'review', questionId: 1, quality: 2 };
  return { events };
}

// A stub PostgREST over `rows`, capping each response at `serverCap` rows the
// way hosted max_rows does, and recording every request.
function stubRest(rows, { serverCap = PAGE_SIZE, reportTotal = true, ignoreOffset = false } = {}) {
  const requests = [];
  const fetchImpl = async (url, init) => {
    const u = new URL(url);
    requests.push({ url: u, headers: init?.headers ?? {} });
    const limit = Number(u.searchParams.get('limit'));
    const offset = ignoreOffset ? 0 : Number(u.searchParams.get('offset'));
    const page = rows.slice(offset, offset + Math.min(limit, serverCap));
    const total = reportTotal ? String(rows.length) : '*';
    const range = page.length ? `${offset}-${offset + page.length - 1}/${total}` : `*/${total}`;
    return new Response(JSON.stringify(page), { status: 200, headers: { 'content-range': range } });
  };
  return { fetchImpl, requests };
}

test('events are read from the object the table holds, and from an array too', () => {
  const row = batchRow('s1', [[101, true], [102, false]]);
  assert.equal(Array.isArray(row.events), false, 'the fixture has the real container shape');
  assert.equal(eventsOf(row).length, 3);
  assert.equal(eventsOf({ events: Object.values(row.events) }).length, 3);
  assert.deepEqual(eventsOf({ events: null }), []);
  assert.deepEqual(eventsOf(null), []);
});

test('only answered attempts with a verdict are counted', () => {
  const rows = [
    batchRow('s1', [[101, true], [102, true]]),
    batchRow('s2', [[101, false]]),
    { events: {
      a: { kind: 'attempt', questionId: 103, correct: false, answer: null },
      b: { kind: 'attempt', questionId: 104, correct: 'yes', answer: 1 },
      c: { kind: 'attempt', questionId: '', correct: true, answer: 1 },
      d: { kind: 'attempt', questionId: 105, correct: true, answer: [''] },
    } },
  ];
  const tally = tallyRows(rows);
  assert.deepEqual(Object.fromEntries(tally), {
    101: { attempts: 2, wrong: 1 },
    102: { attempts: 1, wrong: 0 },
  });
});

test('Content-Range is read for the first row and the total', () => {
  assert.deepEqual(parseContentRange('0-999/5234'), { start: 0, total: 5234 });
  assert.deepEqual(parseContentRange('*/0'), { start: null, total: 0 });
  assert.deepEqual(parseContentRange('1000-1499/*'), { start: 1000, total: null });
  assert.deepEqual(parseContentRange(null), { start: null, total: null });
});

test('every page is read when the server caps a response at 1,000 rows', async () => {
  const rows = Array.from({ length: 2345 }, (_, i) => batchRow(`s${i}`, [[7, i % 4 !== 0]]));
  const { fetchImpl, requests } = stubRest(rows);
  const result = await fetchAttempts({ url: 'https://stub.example/', key: 'k', fetchImpl });
  assert.equal(result.rowCount, 2345);
  assert.equal(result.total, 2345);
  assert.deepEqual(Object.fromEntries(result.tally), { 7: { attempts: 2345, wrong: 587 } });
  assert.deepEqual(requests.map((r) => Number(r.url.searchParams.get('offset'))), [0, 1000, 2000]);
  for (const { url, headers } of requests) {
    assert.ok(Number(url.searchParams.get('limit')) <= 1000, 'a page never asks for more than 1,000 rows');
    assert.equal(url.searchParams.get('select'), 'events', 'only the events column leaves the database');
    assert.equal(headers.Prefer, 'count=exact', 'the total is requested so completeness can be proven');
  }
});

test('a server cap below the page size still reads every row', async () => {
  const rows = Array.from({ length: 1210 }, (_, i) => batchRow(`s${i}`, [[8, true]]));
  const { fetchImpl, requests } = stubRest(rows, { serverCap: 500 });
  const result = await fetchAttempts({ url: 'https://stub.example', key: 'k', fetchImpl });
  assert.equal(result.rowCount, 1210, 'a short page is not the last page');
  assert.deepEqual(requests.map((r) => Number(r.url.searchParams.get('offset'))), [0, 500, 1000]);
});

test('without a reported total the pager stops on the first empty page', async () => {
  const rows = Array.from({ length: 1500 }, (_, i) => batchRow(`s${i}`, [[9, false]]));
  const { fetchImpl, requests } = stubRest(rows, { reportTotal: false });
  const result = await fetchAttempts({ url: 'https://stub.example', key: 'k', fetchImpl });
  assert.equal(result.rowCount, 1500);
  assert.equal(requests.length, 3, 'two full pages, then the empty page that ends it');
});

test('a server that ignores the offset is refused instead of counted twice', async () => {
  const rows = Array.from({ length: 1500 }, (_, i) => batchRow(`s${i}`, [[10, true]]));
  const { fetchImpl } = stubRest(rows, { ignoreOffset: true });
  await assert.rejects(fetchAttempts({ url: 'https://stub.example', key: 'k', fetchImpl }), /เริ่มที่ 0 แต่ขอที่ 1000/);
});

test('a run that read rows but counted nothing refuses to write', () => {
  const tally = tallyRows([{ events: { r: { kind: 'review', questionId: 1 } } }]);
  assert.match(refusalFor({ rowCount: 1, tally }), /นับ attempt ได้ 0/);
  assert.match(refusalFor({ rowCount: 0, tally: new Map() }), /ไม่พบแถว/);
  assert.equal(refusalFor({ rowCount: 1, tally: tallyRows([batchRow('s', [[1, true]])]) }), null);
});

test('the snapshot holds only id to rating and count, from the trusted attempt count', () => {
  assert.equal(MIN_ATTEMPTS_TO_WRITE, DIFFICULTY_MIN_ATTEMPTS, 'writer and reader share one threshold');
  const tally = new Map([
    ['11', { attempts: DIFFICULTY_MIN_ATTEMPTS, wrong: 14 }],
    ['12', { attempts: DIFFICULTY_MIN_ATTEMPTS - 1, wrong: 0 }],
  ]);
  const text = buildOutput(tally, new Date('2026-10-11T00:00:00.000Z'));
  const map = JSON.parse(text.slice(text.indexOf('QUESTION_DIFFICULTY = ') + 'QUESTION_DIFFICULTY = '.length, text.lastIndexOf(';')));
  assert.deepEqual(Object.keys(map), ['11'], 'a question below the trusted count is not published');
  assert.deepEqual(Object.keys(map['11']).sort(), ['n', 'rating']);
  assert.equal(map['11'].n, DIFFICULTY_MIN_ATTEMPTS);
  assert.ok(map['11'].rating > 1500, 'a question most students miss sits above the neutral rating');
});

// The CLI end to end, with fetch stubbed before the script loads.
function runCli(rows, args) {
  const range = `0-${rows.length - 1}/${rows.length}`;
  const stub = `globalThis.fetch = async () => new Response(${JSON.stringify(JSON.stringify(rows))}, `
    + `{ status: 200, headers: { 'content-range': ${JSON.stringify(range)} } });`;
  return spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(stub)}`, SCRIPT, ...args], {
    env: { ...process.env, SUPABASE_URL: 'https://stub.example', SUPABASE_SERVICE_ROLE_KEY: 'stub' },
    encoding: 'utf8',
  });
}

test('the CLI counts object-shaped events and exits non-zero when it counts none', () => {
  const dir = mkdtempSync(join(tmpdir(), 'vmx-difficulty-'));
  try {
    const out = join(dir, 'difficulty.js');
    const sessions = Array.from({ length: DIFFICULTY_MIN_ATTEMPTS }, (_, i) => batchRow(`s${i}`, [[555, i % 2 === 0]]));
    const ok = runCli(sessions, [`--out=${out}`]);
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(readFileSync(out, 'utf8'), /"555": \{\s*"rating": \d+,\s*"n": 20\s*\}/);

    const emptyOut = join(dir, 'empty.js');
    const none = runCli([{ events: { r: { kind: 'review', questionId: 1 } } }], [`--out=${emptyOut}`]);
    assert.notEqual(none.status, 0, 'rows without a countable attempt must fail the run');
    assert.equal(existsSync(emptyOut), false, 'and must not write a snapshot');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
