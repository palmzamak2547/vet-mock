// ============================================================
// contribution-fetch-errors.test.mjs — a failed read is not an empty list
// ============================================================
// fetchMySubmissions, fetchReviewQueue and fetchLeaderboard turned a
// PostgREST/Postgres error into `[]`, and fetchSubmissionReviews never read
// `error` at all. Every caller already had a try/catch with a Thai error
// state waiting behind it — ReviewQueueView's queueError, and now
// ContributeView's loadError — but none of that could ever run, because the
// promise always resolved. A reviewer whose request failed was told the
// queue was empty; a contributor with fifteen questions in review was told
// they had never submitted anything, with score 0 next to it.
//
// fetchMyReputation in the same file was fixed the same way earlier and its
// comment explains why: a swallowed error is indistinguishable from "this
// user has no row". The four fetchers below get the same rule.
//
// contributions.js imports ./supabase.js, which reads import.meta.env at
// module scope and cannot load outside Vite. Node's own module hooks swap
// that one import for a stub whose client the test controls, so the real
// fetchers run against a real `{ data, error }` result.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { registerHooks } from 'node:module';

const STUB_URL = 'vetmock-test:supabase-stub';

registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '');
    if (specifier === './supabase.js' && parent.endsWith('/src/lib/contributions.js')) {
      return { url: STUB_URL, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === STUB_URL) {
      return {
        format: 'module',
        shortCircuit: true,
        source: [
          'export const hasSupabase = true;',
          'export function getSupabase() { return Promise.resolve(globalThis.__vmxTestSupabase); }',
        ].join('\n'),
      };
    }
    return nextLoad(url, context);
  },
});

const lib = await import('../../src/lib/contributions.js');

/** A supabase-js client whose every query resolves to `result`. */
function installClient(result, { user = { id: 'user-1' } } = {}) {
  const q = {};
  for (const m of ['select', 'order', 'limit', 'eq', 'in', 'neq', 'maybeSingle']) q[m] = () => q;
  q.then = (onOk, onErr) => Promise.resolve(result).then(onOk, onErr);
  globalThis.__vmxTestSupabase = {
    auth: { getUser: async () => ({ data: { user } }) },
    from: () => q,
  };
}

const FETCHERS = [
  ['fetchMySubmissions', () => lib.fetchMySubmissions(20)],
  ['fetchReviewQueue (peer)', () => lib.fetchReviewQueue({ founderOnly: false })],
  ['fetchReviewQueue (founder)', () => lib.fetchReviewQueue({ founderOnly: true })],
  ['fetchSubmissionReviews', () => lib.fetchSubmissionReviews('sub-1')],
  ['fetchLeaderboard', () => lib.fetchLeaderboard(20)],
];

for (const [name, call] of FETCHERS) {
  test(`${name}: a query error rejects instead of reading as an empty list`, async () => {
    const error = new Error('relation "public.q_submissions" does not exist');
    installClient({ data: null, error });
    await assert.rejects(
      call(),
      /does not exist/,
      `${name} resolved for a failed query — the caller cannot tell "the read failed" from "there is nothing here"`,
    );
  });

  test(`${name}: a successful query still returns its rows`, async () => {
    const rows = [{ id: 'row-1' }, { id: 'row-2' }];
    installClient({ data: rows, error: null });
    assert.deepEqual(await call(), rows);
  });

  test(`${name}: a genuinely empty result is an empty list`, async () => {
    installClient({ data: [], error: null });
    assert.deepEqual(await call(), []);
  });
}

// ─── ContributeView: the failure has somewhere to go ─────────────
// The view is JSX, so its contract is pinned at the source level.
const VIEW = readFileSync(join(resolve(process.cwd()), 'src/views/ContributeView.jsx'), 'utf8');

function refreshAllBlock() {
  const start = VIEW.indexOf('const refreshAll = useCallback(async () => {');
  assert.notEqual(start, -1, 'ContributeView must still load reputation + submissions in refreshAll');
  const end = VIEW.indexOf('}, []);', start);
  assert.notEqual(end, -1, 'could not find the end of refreshAll');
  return VIEW.slice(start, end);
}

test('ContributeView: a failed refresh is surfaced through thaiError, not only console.warn', () => {
  const block = refreshAllBlock();
  const catchAt = block.indexOf('catch (e) {');
  assert.notEqual(catchAt, -1, 'refreshAll must still catch its own failure');
  const finallyAt = block.indexOf('} finally {', catchAt);
  assert.notEqual(finallyAt, -1, 'refreshAll must still clear its loading flag');
  const catchBody = block.slice(catchAt, finallyAt);
  assert.match(
    catchBody,
    /setLoadError\(\s*thaiError\(/,
    'the catch block only logs — rep stays null and mySubs stays [], so the screen reads as a brand-new contributor',
  );
});

test('ContributeView: "ยังไม่มีคำถามที่ส่ง" is not the fallback for a load that failed', () => {
  const emptyCopyAt = VIEW.indexOf("'ยังไม่มีคำถามที่ส่ง");
  assert.notEqual(emptyCopyAt, -1, 'the empty-state copy should still exist for a real empty list');
  const decisionStart = VIEW.lastIndexOf('{mySubs.length > 0', emptyCopyAt);
  assert.notEqual(decisionStart, -1, 'could not find the caption ternary');
  assert.match(
    VIEW.slice(decisionStart, emptyCopyAt),
    /loadError/,
    'the caption reaches the definite "never submitted" copy without checking whether the load failed',
  );
  const sectionStart = VIEW.indexOf('My Submissions');
  const listStart = VIEW.indexOf('{mySubs.length > 0 && (', sectionStart);
  assert.ok(sectionStart !== -1 && listStart !== -1, 'could not isolate the My Submissions section');
  assert.match(
    VIEW.slice(sectionStart, listStart),
    /<StatePanel[\s\S]*?kind="error"[\s\S]*?onAction=\{refreshAll\}/,
    'a failed load needs an error panel with a retry, the way GroupsView shows one',
  );
});

test('ContributeView: the reputation chip does not print 0 for a lookup that failed', () => {
  const chipStart = VIEW.indexOf('{/* Reputation chip */}');
  const chipEnd = VIEW.indexOf('{/* Toast */}', chipStart);
  assert.ok(chipStart !== -1 && chipEnd !== -1, 'could not isolate the reputation chip');
  const chip = VIEW.slice(chipStart, chipEnd);
  assert.doesNotMatch(chip, /\{rep\?\.score \?\? 0\}/, 'a bare `rep?.score ?? 0` shows score 0 when the read failed');
  assert.doesNotMatch(chip, /\{rep\?\.approved_count \?\? 0\}/, 'a bare `rep?.approved_count ?? 0` shows approved 0 when the read failed');
  assert.match(chip, /loadError/, 'the chip must consult the load-error state before printing a number');
});
