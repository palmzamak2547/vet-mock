// ============================================================
// qcomments-thread-lifetime.test.mjs — a closed thread owns no channel
// ============================================================
// QComments mounts when a student taps 💬 under a question in ReviewView
// and unmounts on the second tap. Its realtime effect calls
// subscribeQComments(), which awaits getSupabase() — a dynamic import of
// @supabase/supabase-js on first use — before it joins the channel, and
// only then hands the channel back through a promise.
//
// The cleanup read `channelRef.current`, which is still null while that
// promise is in flight. Close the thread inside that window and nothing is
// unsubscribed; the promise then resolves and writes a live, joined channel
// into the ref of a component that no longer exists. Every open/close cycle
// could leave one more channel joined until reload — the exact accumulation
// ReviewView's lazy mounting was written to prevent. Once the connection's
// channel budget is spent, newly opened threads stop receiving live
// replies, with no error anywhere.
//
// QComments imports React, so the component cannot be imported here. The
// two effects that matter are plain JavaScript, though: this lifts each
// effect body out of the source text and runs it under stubs, so the race
// is driven for real rather than described.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { thaiError } from '../../src/lib/errors.js';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/components/QComments.jsx'), 'utf8');

/** The `() => { ... }` callback of the first useEffect after `anchor`. */
function effectBodyAfter(anchor) {
  const at = SRC.indexOf(anchor);
  assert.notEqual(at, -1, `anchor missing from QComments.jsx: ${anchor}`);
  const start = SRC.indexOf('useEffect(() => {', at);
  assert.notEqual(start, -1, `no effect follows "${anchor}"`);
  const end = SRC.indexOf('}, [qSubject, qId', start);
  assert.notEqual(end, -1, 'the effect must still key on the question');
  return SRC.slice(start + 'useEffect('.length, end + 1);
}

/** Compile an effect body into a function of the identifiers it closes over. */
function compileEffect(anchor, scope) {
  const names = Object.keys(scope);
  // eslint-disable-next-line no-new-func
  const make = new Function(...names, `return (${effectBodyAfter(anchor)});`);
  return make(...names.map((n) => scope[n]));
}

const flush = () => new Promise((r) => setImmediate(r));

function fakeChannel(log, name) {
  return { name, unsubscribe() { log.push(name); return Promise.resolve('ok'); } };
}

/** The realtime effect for one question, sharing `channelRef` across renders like useRef does. */
function realtimeHarness({ subscribeQComments, channelRef = { current: null }, qId = 42 }) {
  const applied = [];
  const effect = compileEffect('// Realtime', {
    hasSupabase: true,
    subscribeQComments,
    channelRef,
    setComments: (fn) => applied.push(fn),
    qSubject: 'com5',
    qId,
  });
  return { effect, channelRef, applied };
}

// ── The leak ────────────────────────────────────────────────────────────

test('a channel that arrives after the thread was closed is unsubscribed on arrival', async () => {
  const log = [];
  let deliver;
  const pending = new Promise((r) => { deliver = r; });
  const { effect, channelRef } = realtimeHarness({ subscribeQComments: () => pending });

  const cleanup = effect();
  cleanup();                       // second tap on 💬 before getSupabase() resolved
  deliver(fakeChannel(log, 'late'));
  await flush();

  assert.deepEqual(log, ['late'], 'the channel handed to a closed thread must be unsubscribed, not kept');
  assert.equal(channelRef.current, null, 'a closed thread must not hold a channel');
});

test('the normal path still unsubscribes once and lets go of the ref', async () => {
  const log = [];
  const { effect, channelRef } = realtimeHarness({
    subscribeQComments: () => Promise.resolve(fakeChannel(log, 'live')),
  });

  const cleanup = effect();
  await flush();
  assert.equal(channelRef.current?.name, 'live', 'an open thread holds its channel');
  cleanup();

  assert.deepEqual(log, ['live']);
  assert.equal(channelRef.current, null, 'after cleanup the ref must not point at a dead channel');
});

test('switching question then closing does not double-unsubscribe the old channel or leak the new one', async () => {
  const log = [];
  let deliverSecond;
  const channels = [
    Promise.resolve(fakeChannel(log, 'first')),
    new Promise((r) => { deliverSecond = r; }),
  ];
  const subscribeQComments = () => channels.shift();
  const channelRef = { current: null };
  const first = realtimeHarness({ subscribeQComments, channelRef, qId: 1 });
  const second = realtimeHarness({ subscribeQComments, channelRef, qId: 2 });

  const cleanupFirst = first.effect();
  await flush();
  cleanupFirst();                  // deps changed: React tears the old run down
  const cleanupSecond = second.effect();
  cleanupSecond();                 // ...and the thread is closed before the new channel joined
  deliverSecond(fakeChannel(log, 'second'));
  await flush();

  assert.deepEqual(
    log.sort(),
    ['first', 'second'],
    'each channel is unsubscribed exactly once — the stale ref must not stand in for the new channel',
  );
});

test('a realtime event that lands after cleanup is ignored', async () => {
  const log = [];
  let onEvent;
  const { effect, applied } = realtimeHarness({
    subscribeQComments: (_s, _id, cb) => { onEvent = cb; return Promise.resolve(fakeChannel(log, 'live')); },
  });

  const cleanup = effect();
  await flush();
  onEvent({ eventType: 'INSERT', new: { id: 1 } });
  assert.equal(applied.length, 1, 'a live event reaches state while the thread is open');
  cleanup();
  onEvent({ eventType: 'INSERT', new: { id: 2 } });
  assert.equal(applied.length, 1, 'no state update after the thread is closed');
});

// ── A failed read is not an empty thread ────────────────────────────────
// listQComments used to swallow errors into []. If it starts to throw, the
// thread must say the read failed and offer a retry — never "be the first"
// over a discussion that exists, and never a spinner that spins forever.

test('a rejected comment fetch shows a Thai load error and stops loading', async () => {
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on('unhandledRejection', onUnhandled);
  try {
    const loading = [];
    const loadErrs = [];
    const effect = compileEffect('// Initial fetch', {
      hasSupabase: true,
      listQComments: () => Promise.reject(new Error('Failed to fetch')),
      setComments: () => assert.fail('a failed read must not overwrite the list'),
      setLoading: (v) => loading.push(v),
      setLoadErr: (v) => loadErrs.push(v),
      thaiError,
      qSubject: 'com5',
      qId: 42,
    });
    const cleanup = effect();
    await flush();
    cleanup?.();

    assert.equal(unhandled.length, 0, 'the rejection must be handled inside the effect');
    assert.equal(loading.at(-1), false, 'loading must end so the thread is not stuck on กำลังโหลด…');
    const shown = loadErrs.filter((v) => v !== null);
    assert.equal(shown.length, 1, 'exactly one load error is set');
    assert.match(shown[0], /[ก-๙]/, 'the message a student sees is Thai');
    assert.doesNotMatch(shown[0], /ยังไม่มีความเห็น/, 'a failed read is never presented as an empty thread');
  } finally {
    process.off('unhandledRejection', onUnhandled);
  }
});

test('the empty-thread copy is gated on the read having succeeded', () => {
  assert.match(SRC, /ยังไม่มีความเห็น/, 'the empty state still exists');
  assert.match(
    SRC,
    /!loading && !loadErr && comments\.length === 0/,
    'the "be the first" copy must not render while the read failed',
  );
  assert.match(SRC, /ลองใหม่/, 'a failed read offers a retry');
});

test('post and delete failures reach the student through thaiError', () => {
  assert.match(SRC, /setErr\(thaiError\(e, 'โพสต์ไม่สำเร็จ'\)\)/, 'a failed post is not raw PostgREST English');
  assert.match(SRC, /setErr\(thaiError\(e, 'ลบไม่สำเร็จ'\)\)/, 'a failed delete is not raw PostgREST English');
  assert.doesNotMatch(SRC, /setErr\(e\.message/, 'no raw e.message reaches the UI');
});
