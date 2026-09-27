// The CI plot's log axis labels a value near each interval end it would otherwise run past (review
// round 3: the association interval ran to 1.34 on an axis labelled up to 1). Tests
// src/workspace/components/ci-ticks.js on ciPlotLayout's own output. OWNER: landing role (art fix).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ciPlotLayout } from '../../src/workspace/lib/ci-plot.js';
import { MIN_TICK_GAP, ticksWithEnds } from '../../src/workspace/components/ci-ticks.js';

const layout = (rows, width = 560, log = true) => ciPlotLayout(rows, { width, labelW: Math.round(Math.min(170, width * 0.36)), log, ref: log ? 1 : 0 });

test('the reviewed case: 0.43 to 1.34 gets a label past 1', () => {
  const L = layout([{ label: 'PR', est: 0.76, lo: 0.43, hi: 1.34 }]);
  assert.equal(L.ticks[L.ticks.length - 1].v, 1, 'ci-plot.js alone stops at 1');
  const ticks = ticksWithEnds(L);
  const top = ticks[ticks.length - 1].v;
  assert.ok(top > 1 && top <= L.domain[1], `a label past 1 inside the axis, got ${top}`);
  assert.equal(top, 1.4);
});

test('added labels sit on the axis where the plot draws that value, in order, and never crowd', () => {
  const cases = [
    [{ label: 'PR', est: 0.76, lo: 0.43, hi: 1.34 }],
    [{ label: 'OR', est: 0.9, lo: 0.8, hi: 1.05 }],
    [{ label: 'crude', est: 0.72, lo: 0.4, hi: 1.3 }, { label: 'MH', est: 0.81, lo: 0.47, hi: 1.39 }],
    [{ label: 'OR', est: 3.1, lo: 1.449, hi: Infinity }],
    [{ label: 'RR', est: 1.8, lo: 1.1, hi: 2.95 }],
  ];
  for (const width of [720, 560, 360, 200]) {
    for (const rows of cases) {
      const L = layout(rows, width);
      const ticks = ticksWithEnds(L);
      const base = new Set(L.ticks.map((tk) => tk.v));
      for (let i = 1; i < ticks.length; i++) assert.ok(ticks[i].v > ticks[i - 1].v, 'ascending');
      for (const tk of ticks) {
        assert.ok(tk.v >= L.domain[0] && tk.v <= L.domain[1], `${tk.v} inside the axis`);
        assert.ok(tk.x >= L.plotLeft - 0.5 && tk.x <= L.plotRight + 0.5, `${tk.v} drawn on the plot`);
        if (base.has(tk.v)) continue;
        // an added label is clear of every other label
        for (const other of ticks) if (other !== tk) assert.ok(Math.abs(other.x - tk.x) >= MIN_TICK_GAP, `${tk.v} crowds ${other.v} at width ${width}`);
        // and placed on the same log scale the plot draws its rows and ticks on
        const refs = [...L.ticks.map((b) => [b.v, b.x])];
        for (const r of L.rows) {
          if (Number.isFinite(r.est) && r.xEst !== null) refs.push([r.est, r.xEst]);
          if (Number.isFinite(r.lo) && r.lo > 0 && !r.openLo) refs.push([r.lo, r.xLo]);
          if (Number.isFinite(r.hi) && !r.openHi) refs.push([r.hi, r.xHi]);
        }
        const [p, q] = [refs[0], refs.find((r) => Math.abs(r[0] - refs[0][0]) > 1e-9)];
        const expect = p[1] + ((Math.log(tk.v) - Math.log(p[0])) / (Math.log(q[0]) - Math.log(p[0]))) * (q[1] - p[1]);
        assert.ok(Math.abs(expect - tk.x) < 0.5, `${tk.v} placed at ${tk.x}, the plot's scale puts it at ${expect}`);
      }
    }
  }
});

test('nothing changes on a linear axis or when the labels already reach the interval ends', () => {
  const lin = layout([{ label: 'diff', est: 0.2, lo: 0.163, hi: 0.238 }], 560, false);
  assert.deepEqual(ticksWithEnds(lin), lin.ticks);
  const wide = layout([{ label: 'OR', est: 2.5, lo: 1.2, hi: 5.1 }]);
  assert.deepEqual(ticksWithEnds(wide).map((tk) => tk.v), wide.ticks.map((tk) => tk.v));
});
