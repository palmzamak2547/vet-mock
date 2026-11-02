// The skip list (docs/VIDEO-LIBRARY.md section 11): the player may jump only a
// stretch with no caption, measured silent on our copy, on a slide that does
// not move, and long enough to be worth it. Speech is never inside one.

import test from 'node:test';
import assert from 'node:assert/strict';
import { skipSpans } from '../../scripts/video-analyse.mjs';

// Speech 0-100 s and 160-300 s; the recording runs to 400 s.
const lines = [{ t: 10, end: 100, text: 'สวัสดีครับ' }, { t: 160, end: 300, text: 'ต่อเรื่อง endometritis' }];
const silent = [[0, 10], [100, 160], [300, 400]];

test('a silent, captionless stretch on one slide is skipped, with speech kept at both edges', () => {
  const out = skipSpans(lines, 400, { silence: silent, slides: [5, 200], min: 20 });
  assert.deepEqual(out.map((k) => k.kind), ['pause', 'after']);
  const [pause, after] = out;
  assert.deepEqual([pause.start, pause.end], [101.5, 158.5]);
  assert.deepEqual([after.start, after.end], [301.5, 400]);
  for (const k of out) for (const l of lines) assert.ok(k.end <= l.t || k.start >= l.end, `${k.kind} overlaps speech`);
});

test('the wait before the lecture starts is skipped from zero when it is long enough', () => {
  const late = [{ t: 90, end: 200, text: 'เริ่มนะครับ' }];
  // The screen share starting moves the picture without teaching anything.
  const out = skipSpans(late, 200, { silence: [[0, 90]], slides: [30, 60], min: 20 });
  assert.deepEqual(out, [{ start: 0, end: 88.5, kind: 'before' }]);
});

test('sound the captions missed, a moving slide, a short pause or no measurement: nothing is skipped', () => {
  // Only half of the gap is silent: there may be speech the recogniser missed.
  assert.equal(skipSpans(lines, 300, { silence: [[100, 130]], min: 20 }).length, 0);
  // The slide changes inside the gap: a silent clip played in class.
  assert.equal(skipSpans(lines, 300, { silence: silent, slides: [130], min: 20 }).length, 0);
  // Shorter than the minimum once the edges are kept.
  assert.equal(skipSpans(lines, 300, { silence: silent, min: 60 }).length, 0);
  // No silence measurement: missing captions alone never skip.
  assert.deepEqual(skipSpans(lines, 400, { min: 20 }), []);
});
