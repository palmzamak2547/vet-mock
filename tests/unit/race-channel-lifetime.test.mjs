// ============================================================
// race-channel-lifetime.test.mjs — the race must outlive the lobby
// ============================================================
// RaceView opens one Supabase Realtime channel and does everything over it:
// presence in the lobby, the 'start' broadcast, and a 'progress' broadcast
// after every answer so each racer watches the other's bar move.
//
// The effect that owns the channel was guarded with
// `if (!code || phase !== 'lobby') return;` and listed `phase` in its
// dependency array. Starting the race sets phase to 'run', React re-runs the
// effect, the guard returns immediately — and the cleanup from the lobby run
// has already unsubscribed the channel. For the rest of the race no client
// receives a progress broadcast (the listener is gone) and none sends one
// either (answerQ sends on channelRef.current, now unsubscribed). Both
// racers see an opponent frozen at zero, which is the whole feature.
//
// A two-client Realtime race cannot be driven from a unit test, so this pins
// the property that made it break: the channel's lifetime must not be tied
// to the phase.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/RaceView.jsx'), 'utf8');

/** The effect that creates `supabase.channel(...)`: its body and its deps. */
function channelEffect() {
  const anchor = SRC.indexOf('supabase.channel(`race:');
  assert.notEqual(anchor, -1, 'RaceView must still open a race channel');
  const start = SRC.lastIndexOf('useEffect(() => {', anchor);
  assert.notEqual(start, -1, 'the channel must still live in an effect');
  const teardown = SRC.indexOf('return () => { active = false;', anchor);
  assert.notEqual(teardown, -1, 'the effect must still clean itself up');
  const depsAt = SRC.indexOf(', [', teardown);
  const close = SRC.indexOf(']);', depsAt);
  assert.ok(depsAt !== -1 && close !== -1, 'could not find the dependency array');
  return { body: SRC.slice(start, close + 3), deps: SRC.slice(depsAt + 3, close) };
}

test('the race channel is not torn down when the phase changes', () => {
  const { deps } = channelEffect();
  const list = deps.split(',').map((d) => d.trim()).filter(Boolean);
  assert.ok(list.length > 0, 'the effect should still declare dependencies');
  assert.ok(
    !list.includes('phase'),
    `phase is back in the channel effect's deps (${list.join(', ')}) — `
    + 'every phase change would drop the connection the race runs on',
  );
});

test('the guard does not send the effect home once the race starts', () => {
  const { body } = channelEffect();
  const guard = body.slice(0, body.indexOf('let active = true;'));
  assert.ok(guard.length > 0, 'could not isolate the guard');
  assert.doesNotMatch(
    guard,
    /phase\s*!==\s*'lobby'/,
    'the channel effect must not return early once the race starts',
  );
  assert.match(guard, /if \(!code\) return;/, 'a missing race code should still short-circuit');
});

test('progress is still broadcast over the channel that effect owns', () => {
  // If a later refactor moved the sends onto their own channel, the checks
  // above would pass while meaning nothing.
  assert.match(SRC, /event: 'progress'/, 'progress broadcasts must still exist');
  const sends = SRC.match(/const ch = channelRef\.current;/g) || [];
  assert.ok(sends.length >= 2, 'answerQ still sends progress over channelRef');
});

// ── The bank the race counts against ────────────────────────────────────
// RaceView offers EVERY year's subjects and defaults to a year-4 one, but it
// read QB, which App loads for the student's own year only. A year-5 student
// was told COM III has 0 MCQ questions when it has hundreds, and a guest
// resolved the host's `subject:id` keys against a bank that never held them —
// so they either sat in the lobby forever or raced a shorter set than the
// host while the podium compared both against the host's total.

test('the race loads the bank for the subject it is about to count', () => {
  assert.match(SRC, /loadQBForYear/, 'RaceView must load the chosen subject\'s year');
  assert.match(SRC, /yearForSubject\(subject\)/, 'the year comes from the chosen subject');
  const memo = SRC.slice(SRC.indexOf('const eligibleQs'), SRC.indexOf('const eligibleQs') + 420);
  assert.match(
    memo,
    /\[subject, bankTick\]/,
    'the eligible-question memo must recompute once the bank has loaded — '
    + 'QB is mutated in place, so its identity never changes',
  );
});

test('a guest never races a different set from the host', () => {
  assert.match(
    SRC,
    /qs\.length !== qIds\.length/,
    'a partially resolved question set must not start the race',
  );
  assert.doesNotMatch(
    SRC,
    /if \(qs\.length\) \{\s*\n\s*setQuestions\(qs\);/,
    'the old "any question is enough" start is back',
  );
});

test('the subjects offered really do span more than one year', () => {
  // If every race subject belonged to the student's own year the bug could
  // not happen, and these guards would be theatre.
  assert.match(SRC, /SUBJECTS_BY_YEAR\[y\.id\]/, 'the picker still lists every year');
  assert.match(SRC, /useState\('com3'\)/, 'the default subject is still a year-4 one');
});
