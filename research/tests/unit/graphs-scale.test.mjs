// Ticks that never collide [M2-DESIGN.md 8.1; carried item 7]: niceTicks keeps labels at least minGapPx
// apart at every width, stays inside the axis, picks round values, and includes 1 on a ratio axis that
// holds 1. OWNER: graphs role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { niceTicks, paddedDomain, thinLabels, textWidth } from '../../src/workspace/charts/scale.js';

const ROUND = (v) => {
  if (v === 0) return true;
  const m = Math.abs(v) / 10 ** Math.floor(Math.log10(Math.abs(v)));
  return [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 7.5, 8].some((k) => Math.abs(m - k) < 1e-9);
};

test('linear ticks: round, inside the axis, at least the gap apart, at every width', () => {
  const domains = [[0, 1], [-0.37, 1.84], [21.5, 33.8], [0.00012, 0.00094], [-120, 115], [1995, 2026], [4.95, 6.3]];
  for (const [lo, hi] of domains) {
    for (const px of [80, 120, 200, 320, 560, 900]) {
      for (const gap of [24, 36, 50]) {
        const ticks = niceTicks(lo, hi, { pixels: px, minGapPx: gap });
        assert.ok(ticks.length >= 1, `${lo}..${hi} at ${px}`);
        for (const v of ticks) assert.ok(v >= lo - 1e-9 * Math.abs(hi - lo) && v <= hi + 1e-9 * Math.abs(hi - lo), `${v} outside ${lo}..${hi}`);
        if (ticks.length > 1) {
          // one step, 1, 2, 2.5 or 5 times a power of ten, and every tick a whole number of steps
          const step = Number((ticks[1] - ticks[0]).toPrecision(10));
          assert.ok(ROUND(step), `step ${step}`);
          for (let i = 1; i < ticks.length; i += 1) assert.ok(Math.abs(ticks[i] - ticks[i - 1] - step) < 1e-9 * step, 'equal steps');
          for (const v of ticks) assert.ok(Math.abs(v / step - Math.round(v / step)) < 1e-6, `${v} not on the ${step} grid`);
        }
        const x = (v) => ((v - lo) / (hi - lo)) * px;
        for (let i = 1; i < ticks.length; i += 1) assert.ok(x(ticks[i]) - x(ticks[i - 1]) >= gap - 1e-6, `${lo}..${hi} at ${px}px gap ${gap}: ${ticks.join(' ')}`);
      }
    }
  }
});

test('log ticks: 1-2-5 or finer inside a decade, thinned to decades on a narrow or wide axis, never crowded', () => {
  const domains = [[0.39, 1.47], [0.5, 2], [1.2, 6.1], [0.01, 100], [1e-4, 1e4], [0.8, 1.25], [0.2, 40]];
  for (const [lo, hi] of domains) {
    for (const px of [60, 120, 200, 360, 700]) {
      const ticks = niceTicks(lo, hi, { pixels: px, minGapPx: 36, log: true });
      assert.ok(ticks.length >= 1);
      const x = (v) => ((Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * px;
      for (const v of ticks) assert.ok(v >= lo * (1 - 1e-9) && v <= hi * (1 + 1e-9) && ROUND(v), `${v} in ${lo}..${hi}`);
      for (let i = 1; i < ticks.length; i += 1) assert.ok(x(ticks[i]) - x(ticks[i - 1]) >= 36 - 1e-6, `${lo}..${hi} at ${px}: ${ticks.join(' ')}`);
      if (lo < 1 && hi > 1 && ticks.length > 1 && px >= 200) assert.ok(ticks.includes(1), `1 labelled on ${lo}..${hi}`);
    }
  }
  // the reviewed interval 0.43 to 1.34: finer values when 1-2-5 would leave one label
  assert.deepEqual(niceTicks(0.3926, 1.4676, { pixels: 370, minGapPx: 36, log: true }), [0.5, 0.7, 1]);
});

test('padded domains and label thinning', () => {
  assert.deepEqual(paddedDomain([], {}), [0, 1]);
  const [a, b] = paddedDomain([2, 12], { pad: 0.1 });
  assert.ok(Math.abs(a - 1) < 1e-12 && Math.abs(b - 13) < 1e-12);
  const [c, d] = paddedDomain([1, 100], { log: true, pad: 0 });
  assert.ok(Math.abs(c - 1) < 1e-12 && Math.abs(d - 100) < 1e-9);
  const labels = Array.from({ length: 30 }, (_v, i) => ({ pos: i * 10, width: 24 }));
  const keep = thinLabels(labels, 6);
  for (let i = 1; i < keep.length; i += 1) assert.ok(labels[keep[i]].pos - labels[keep[i - 1]].pos >= 30);
  assert.ok(textWidth('สัปดาห์', 12) < textWidth('abcdefg', 12), 'Thai vowels above and below take no width');
});
