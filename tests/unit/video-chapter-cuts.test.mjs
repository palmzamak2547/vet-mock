// Chapters cut by time: a lecture without a deck, and what a deck leaves long
// (scripts/video-analyse.mjs speechCuts). Three Year-5 lectures had one chapter
// of 83 to 134 minutes once their decks were found: the slides were all taught
// early and the rest of the lecture had no page to split at.
import test from 'node:test';
import assert from 'node:assert/strict';
import { speechCuts } from '../../scripts/video-analyse.mjs';

// A line every ten seconds for an hour, with a 40-second pause before 8:20.
const speech = Array.from({ length: 360 }, (_, i) => ({ t: i * 10 })).filter((l) => l.t <= 460 || l.t >= 500);

test('cuts at the longest pause near each eight-minute mark, and at a topic change', () => {
  const cuts = speechCuts(speech, [1000]);
  assert.equal(cuts[0], 0, 'the first cut is the first line');
  assert.equal(cuts[1], 500, 'the 40-second pause near 8:00');
  assert.equal(cuts[2], 1000, 'the topic change two minutes past the next mark');
  for (let i = 1; i < cuts.length; i++) assert.ok(cuts[i] - cuts[i - 1] >= 120 && cuts[i] - cuts[i - 1] <= 600, `stretch ${i} is two to ten minutes`);
  assert.ok(cuts[cuts.length - 1] < 3590 - 180, 'no stretch shorter than three minutes at the end');
});

test('a window is cut inside itself only', () => {
  const cuts = speechCuts(speech, [1000, 3000], 1800, 3000);
  assert.equal(cuts[0], 1800);
  assert.ok(cuts.every((t) => t >= 1800 && t < 3000));
  assert.ok(!cuts.includes(3000), 'a topic change at the window end is the next chapter');
  assert.deepEqual(speechCuts(speech, [], 1800, 2400), [1800], 'ten minutes stay whole');
  assert.deepEqual(speechCuts([], [500]), []);
});

test('a mark inside a long break cuts where speech resumes, never in the silence', () => {
  const talk = [...Array.from({ length: 100 }, (_, i) => ({ t: i * 10 })), ...Array.from({ length: 100 }, (_, i) => ({ t: 3000 + i * 10 }))];
  const cuts = speechCuts(talk, []);
  assert.ok(cuts.every((t) => t < 1000 || t >= 3000), `a cut in the break: ${cuts}`);
  assert.ok(cuts.includes(3000), 'the chapter after the break starts when speech resumes');
});
