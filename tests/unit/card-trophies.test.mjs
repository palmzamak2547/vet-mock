// What the card may wear comes from earnedBadges() over the synced history,
// never from the device-only XP counter; everything else is free.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cardAllowance, wearable, nextTrophy, FRAME_EARNED_BY } from '../../src/lib/card-trophies.js';
import { CARD_FRAMES } from '../../src/lib/prefs/card-token.js';

const DAY = 86400000;
const NOW = Date.parse('2026-11-11T12:00:00+07:00');
const history = (days, perDay) => Array.from({ length: days * perDay }, (_, i) => ({
  date: NOW - Math.floor(i / perDay) * DAY - (i % perDay) * 60000, correct: true, subject: 's', questionId: `q${i}`,
}));

test('a new student wears the free frame and nothing earned', () => {
  const a = cardAllowance({ history: [] });
  assert.deepEqual(a.frames, ['plain']);
  const card = wearable({ backdrop: 'field', frame: 'foil', title: 'streak-30', trophies: ['streak-30'], picture: null }, a);
  assert.deepEqual({ frame: card.frame, title: card.title, trophies: card.trophies, backdrop: card.backdrop }, { frame: 'plain', title: null, trophies: [], backdrop: 'field' });
});

test('frames follow their badges', () => {
  const a = cardAllowance({ history: history(8, 14) });
  assert.ok(a.earned.has('streak-7') && a.earned.has('questions-100'));
  assert.deepEqual(a.frames, ['plain', 'ledger', 'gilt']);
  for (const f of CARD_FRAMES) assert.ok(f in FRAME_EARNED_BY, f);
});

test('the next trophy is named with its distance, and none once all measured ones are held', () => {
  const five = nextTrophy({ history: history(5, 2) });
  assert.equal(five.id, 'streak-7');
  assert.equal(five.left, 2);
  assert.equal(five.frame, 'gilt');
  const n = nextTrophy({ history: history(8, 14) });
  assert.equal(n.id, 'streak-30');
  assert.equal(n.left, 22);
});

test('trophies never read the device-only XP counter', () => {
  for (const f of ['src/lib/card-trophies.js', 'src/lib/badges.js', 'src/views/StudioView.jsx', 'src/components/StudentCard.jsx']) {
    const text = readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(text, /from '[./]*(lib\/)?xp\.js'|vmx-xp/, f);
  }
});

test('the card counts with the hub\'s own readers', async () => {
  const { studentNumbers } = await import('../../src/lib/student-numbers.js');
  const { streakShown } = await import('../../src/hooks/utils.js');
  const h = history(3, 4);
  const streakData = { streak: 3, lastDate: new Date(NOW).toISOString().slice(0, 10), freezeUsedAt: null };
  const n = studentNumbers({ history: h, streakData, now: NOW });
  assert.equal(n.answered, h.length);
  assert.equal(n.streak, streakShown(streakData, NOW));
  assert.equal(n.trophies, cardAllowance({ history: h }).badges.length);
  const text = readFileSync(new URL('../../src/lib/student-numbers.js', import.meta.url), 'utf8');
  assert.doesNotMatch(text, /xp\.js|vmx-xp/);
});
