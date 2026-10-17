// The top bar's liquid outline: pills that stand apart stay apart, pills that close in grow a
// neck between them, and pills that touch read as one capsule.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { liquidPath, joinedLefts } from '../../src/lib/liquid.js';

const subpaths = (d) => d.split('M').filter(Boolean);
const H = 54;
const cy = 31;
const pill = (x, w, h = H) => ({ x, w, h });

test('pills far apart are drawn on their own, with no neck between them', () => {
  const d = liquidPath([pill(0, 180), pill(400, 520), pill(1100, 170)], { cy, reach: 72 });
  assert.equal(subpaths(d).length, 3);
});

test('with no reach, even touching pills are only placed side by side', () => {
  const d = liquidPath([pill(0, 100), pill(100, 200)], { cy, reach: 0 });
  assert.equal(subpaths(d).length, 2);
});

test('touching pills are joined at their full height: one capsule', () => {
  const d = liquidPath([pill(0, 100), pill(100, 200)], { cy, reach: 72 });
  const [, , neck] = subpaths(d);
  assert.ok(neck, 'a neck is drawn');
  // The neck's waist sits on the pills' own top edge, so the outline runs straight across.
  assert.match(neck, new RegExp(`100,${cy - H / 2}C`));
  assert.match(neck, new RegExp(`100,${cy + H / 2}C`));
});

test('a neck thins as the gap opens, and is gone before the pills are out of reach', () => {
  const waist = (gap) => {
    const neck = subpaths(liquidPath([pill(0, 100), pill(100 + gap, 200)], { cy, reach: 72 }))[2];
    if (!neck) return 0;
    const top = Number(neck.split('C')[1].split(' ')[2].split(',')[1]);
    return cy - top;
  };
  const near = waist(10);
  const mid = waist(36);
  const far = waist(70);
  assert.ok(near > mid && mid > far, `${near} > ${mid} > ${far}`);
  assert.ok(Math.abs(mid - (H / 2) * 0.5 ** 1.8) < 0.02, 'half the reach leaves the waist a little under a third');
  assert.equal(waist(72), 0, 'at the reach there is no neck');
});

test('an inset copy follows the same outline a pixel inside it', () => {
  const edge = liquidPath([pill(0, 200)], { cy, reach: 72 });
  const inner = liquidPath([pill(0, 200)], { cy, reach: 72, inset: 1 });
  assert.match(edge, new RegExp(`A${H / 2},${H / 2} `));
  assert.match(inner, new RegExp(`A${H / 2 - 1},${H / 2 - 1} `));
  assert.match(inner, new RegExp(`M${H / 2},${cy - H / 2 + 1}H`), 'the caps keep their centres');
});

test('a joined neck stays whole in its inset copy, so a rim shows no notch at the seam', () => {
  const inner = liquidPath([pill(0, 100), pill(100, 200)], { cy, reach: 72, inset: 1 });
  const neck = subpaths(inner)[2];
  assert.match(neck, new RegExp(`100,${cy - H / 2 + 1}C`));
});

test('empty or flat pills draw nothing', () => {
  assert.equal(liquidPath([], { cy, reach: 72 }), '');
  assert.equal(liquidPath([pill(0, 0), pill(10, 100, 0)], { cy, reach: 72 }), '');
});

test('joined pieces sit side by side, centred in the bar', () => {
  assert.deepEqual(joinedLefts(1000, [100, 500, 200]), [100, 200, 700]);
  assert.deepEqual(joinedLefts(300, [100, 200]), [0, 100]);
});
