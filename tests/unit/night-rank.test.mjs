// ============================================================
// night-rank.test.mjs — Unit tests for the night-owl rank ladder
// ============================================================
// The ladder is pure (no storage): ranks derive from history entry
// timestamps. Tests build synthetic epoch-ms timestamps at specific
// LOCAL hours and assert counts / rank resolution / promotion logic.

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  NIGHT_RANKS,
  isNightHour,
  countNightAnswers,
  rankForNightCount,
  rankIndex,
  nextRankProgress,
  getNightStats,
  computePromotion,
} = await import('../../src/lib/night-rank.js');

// Local-time epoch ms at a given hour on a fixed date. Uses the same
// local-timezone parsing the app does (`new Date(ms).getHours()`), so
// tests are timezone-agnostic.
function atHour(hour) {
  const d = new Date(2026, 8, 2, hour, 30, 0); // 2 Sep 2026, HH:30 local
  return d.getTime();
}

// ── Ladder shape ────────────────────────────────────────────────

test('Night Rank: ladder is strictly ascending and starts at 0', () => {
  assert.equal(NIGHT_RANKS[0].min, 0);
  for (let i = 1; i < NIGHT_RANKS.length; i++) {
    assert.ok(NIGHT_RANKS[i].min > NIGHT_RANKS[i - 1].min,
      `rank ${i} threshold must exceed rank ${i - 1}`);
  }
  for (const r of NIGHT_RANKS) {
    assert.equal(typeof r.label, 'string');
    assert.ok(r.label.length > 0);
    assert.ok(r.icon.length > 0);
  }
});

test('Night Rank: top rank is พลเอกนอนน้อย, entry rank is สิบเอก at 1 answer', () => {
  const top = NIGHT_RANKS[NIGHT_RANKS.length - 1];
  assert.equal(top.label, 'พลเอกนอนน้อย');
  // First promotion is the cheapest: one late-night answer.
  assert.equal(rankForNightCount(1).label, 'สิบเอกนอนเยอะ');
  // Zero answers = the non-ranked recruit floor.
  assert.equal(rankForNightCount(0).label, 'พลทหารนอนเยอะ');
});

// ── Night-hour window ────────────────────────────────────────────

test('Night Rank: window covers 23:00–04:59, excludes 05:00–22:59', () => {
  for (const h of [23, 0, 1, 2, 3, 4]) assert.equal(isNightHour(h), true, `hour ${h} must be night`);
  for (const h of [5, 6, 12, 17, 21, 22]) assert.equal(isNightHour(h), false, `hour ${h} must NOT be night`);
  // Defensive rejects: NaN never parses to a real hour.
  assert.equal(isNightHour(NaN), false);
  // null/undefined coerce to 0/NaN via Number() — null lands at hour 0
  // (in-window). countNightAnswers guards upstream by requiring a
  // finite positive epoch, so these never reach the hour check from
  // real history; the assertion documents the coercion.
  assert.equal(isNightHour(undefined), false);
  assert.equal(isNightHour('23'), true); // numeric strings still work
});

// ── Counting ─────────────────────────────────────────────────────

test('Night Rank: countNightAnswers counts only in-window timestamps', () => {
  const history = [
    { date: atHour(23), correct: true },   // night ✓
    { date: atHour(0), correct: false },   // night ✓
    { date: atHour(4), correct: true },     // night ✓
    { date: atHour(5), correct: true },     // morning ✗
    { date: atHour(22), correct: false },   // evening ✗
    { date: atHour(13), correct: true },   // afternoon ✗
  ];
  assert.equal(countNightAnswers(history), 3);
});

test('Night Rank: countNightAnswers tolerates malformed rows', () => {
  assert.equal(countNightAnswers(null), 0);
  assert.equal(countNightAnswers(undefined), 0);
  assert.equal(countNightAnswers('nope'), 0);
  assert.equal(countNightAnswers([
    {}, { date: null }, { date: 'abc' }, { date: -5 }, { date: 0 },
  ]), 0);
  // A negative epoch ms parses to year 1969 — countNightAnswers guards
  // with ms <= 0, but a huge bogus number is still skipped by the
  // hour check only if it lands outside the window; assert it never
  // throws.
  assert.doesNotThrow(() => countNightAnswers([{ date: 8640000000000000 }]));
});

// ── Rank resolution + progress ───────────────────────────────────

test('Night Rank: rankForNightCount resolves thresholds exactly', () => {
  assert.equal(rankForNightCount(0).id, 'recruit');
  assert.equal(rankForNightCount(1).id, 'sgt');
  assert.equal(rankForNightCount(4).id, 'sgt');      // below the 5 threshold
  assert.equal(rankForNightCount(5).id, '2lt');
  assert.equal(rankForNightCount(15).id, '1lt');
  assert.equal(rankForNightCount(30).id, 'cpt');
  assert.equal(rankForNightCount(50).id, 'maj');
  assert.equal(rankForNightCount(75).id, 'ltcol');
  assert.equal(rankForNightCount(105).id, 'col');
  assert.equal(rankForNightCount(140).id, 'majgen');
  assert.equal(rankForNightCount(180).id, 'ltgen');
  assert.equal(rankForNightCount(230).id, 'gen');
  assert.equal(rankForNightCount(99999).id, 'gen');
  // Defensive: garbage input clamps to the floor rank.
  assert.equal(rankForNightCount(NaN).id, 'recruit');
  assert.equal(rankForNightCount(-7).id, 'recruit');
});

test('Night Rank: nextRankProgress math at boundaries', () => {
  // recruit (0) → sgt (1): one answer left.
  let p = nextRankProgress(0);
  assert.equal(p.hasNext, true);
  assert.equal(p.needed, 1);
  assert.equal(p.next.id, 'sgt');

  // At the top: no next rank.
  p = nextRankProgress(230);
  assert.equal(p.hasNext, false);
  assert.equal(p.pct, 100);

  // Just below the top: ltgen floor is 180, gen needs 50 more from 229.
  p = nextRankProgress(229);
  assert.equal(p.hasNext, true);
  assert.equal(p.needed, 1);
  assert.equal(p.pct, 98);
});

test('Night Rank: getNightStats bundles count + rank + progress', () => {
  const history = Array.from({ length: 5 }, () => ({ date: atHour(1) }));
  const stats = getNightStats(history);
  assert.equal(stats.nightCount, 5);
  assert.equal(stats.rank.id, '2lt');
  assert.equal(stats.progress.hasNext, true);
  assert.equal(stats.progress.next.id, '1lt');
});

// ── Promotion detection (finishExam hook) ─────────────────────────

test('Night Rank: computePromotion detects an upward move', () => {
  // 0 existing night answers + a 5-answer late-night session (all
  // stamped inside the window) → recruit → sgt... wait, 5 crosses two
  // thresholds (1 then 5); the AFTER rank is the highest crossed.
  const before = [];
  const newEntries = Array.from({ length: 2 }, (_, i) => ({ date: atHour(2) + i }));
  const promo = computePromotion(before, newEntries);
  assert.equal(promo.promoted, true);
  assert.equal(promo.before.id, 'recruit');
  assert.equal(promo.after.id, 'sgt');
});

test('Night Rank: computePromotion skips promotion for daytime sessions', () => {
  const before = [{ date: atHour(1) }]; // 1 night answer → sgt
  const newEntries = Array.from({ length: 10 }, (_, i) => ({ date: atHour(14) + i * 3600_000 }));
  const promo = computePromotion(before, newEntries);
  assert.equal(promo.promoted, false);
  assert.equal(promo.after.id, 'sgt');
});

test('Night Rank: computePromotion fires once per threshold crossing', () => {
  // Already sgt (1 night answer). A session adding 4 more (total 5)
  // crosses exactly one threshold → 2lt.
  const before = [{ date: atHour(23) }];
  const newEntries = Array.from({ length: 4 }, (_, i) => ({ date: atHour(3) + i }));
  const promo = computePromotion(before, newEntries);
  assert.equal(promo.promoted, true);
  assert.equal(promo.before.id, 'sgt');
  assert.equal(promo.after.id, '2lt');
});
