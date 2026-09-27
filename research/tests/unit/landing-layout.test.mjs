// The scroll story's layout function and its CSS twin [M1-DESIGN.md 3, 15.1]: only opacity,
// visibility and transform are written; heavy layers never drop below opacity 0.002; the CSS
// keyframes are samples of the same function; the widened CI bar ends where the adjusted interval
// ends; and the entrance's dots settle on the border they aim at. OWNER: landing role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HEAVY, LAYER_KEYS, MIN_OPACITY, VARIANTS, chapterAt, layoutValues, pickVariant, scene, smooth, stageScale } from '../../src/landing/story/layout.js';
import { KEYFRAME_STEPS, keyframesCss } from '../../src/landing/story/keyframes.js';
import { herdFacts } from '../../src/landing/herd/data.js';
import { gatherToBorders, perimeterLength, perimeterPoint } from '../../src/entrance/gather.js';
import { ENTRANCE_MS, skipOpacity } from '../../src/entrance/entrance-timing.js';

const widen = herdFacts().stats.widen;
const SAMPLES = Array.from({ length: 401 }, (_, i) => i / 400);

for (const v of Object.values(VARIANTS)) {
  test(`${v.id}: only transform and opacity animate, heavy layers stay rasterised`, () => {
    for (const t of SAMPLES) {
      const vals = layoutValues(t, v, false, widen);
      assert.deepEqual(Object.keys(vals).sort(), [...LAYER_KEYS].sort());
      for (const [k, r] of Object.entries(vals)) {
        for (const prop of Object.keys(r)) assert.ok(['opacity', 'visibility', 'transform'].includes(prop), `${k}.${prop}`);
        if (r.transform) assert.doesNotMatch(r.transform, /clip|NaN|undefined/);
        if (HEAVY[k]) assert.ok(r.opacity >= MIN_OPACITY, `${k} at t=${t}: ${r.opacity}`);
        if (r.opacity !== undefined) assert.ok(r.opacity >= 0 && r.opacity <= 1);
      }
    }
  });

  test(`${v.id}: CSS keyframes are samples of the same layout function`, () => {
    const css = keyframesCss(v, widen);
    for (const k of LAYER_KEYS) assert.match(css, new RegExp(`@keyframes rs-${v.id}-${k}\\{`), k);
    for (const step of [0, 37, KEYFRAME_STEPS]) {
      const vals = layoutValues(step / KEYFRAME_STEPS, v, false, widen);
      const pct = String(Number(((step * 100) / KEYFRAME_STEPS).toFixed(1)));
      const r = vals.hero;
      const frame = `${pct}%{opacity:${r.opacity};visibility:${r.visibility};transform:${r.transform}}`;
      const block = css.split('\n').find((l) => l.startsWith(`@keyframes rs-${v.id}-hero{`));
      assert.ok(block, 'hero keyframes line');
      const kept = step === 0 || step === KEYFRAME_STEPS || block.includes(`{${pct}%{`) || block.includes(`}${pct}%{`);
      if (kept) assert.ok(block.includes(frame), `hero frame at ${pct}%: ${frame}`);
    }
    assert.match(css, new RegExp(`animation-timeline:--rs-story-${v.id}`));
    assert.match(css, /animation-range:contain 0% contain 100%/);
  });

  test(`${v.id}: the widened bar ends at the adjusted interval`, () => {
    const end = layoutValues(1, v, false, widen).ciBar.transform;
    const scale = Number(/scaleX\(([\d.]+)\)/.exec(end)[1]);
    assert.ok(Math.abs(scale - widen) < 1e-4, `${scale} vs sqrt(DEFF) ${widen}`);
    const start = layoutValues(0, v, false, widen).ciBar.transform;
    assert.equal(start, 'scaleX(1.0000)');
  });
}

test('chapters, variants and stage scale', () => {
  assert.deepEqual([0, 0.1, 0.5, 0.75, 0.9].map(chapterAt), [0, 1, 2, 3, 4]);
  assert.equal(pickVariant(390, 844).id, 'phone');
  assert.equal(pickVariant(1440, 900).id, 'desktop');
  assert.equal(pickVariant(1024, 1366).id, 'phone');
  assert.equal(stageScale(VARIANTS.desktop, 1440, 900), 1);
  assert.ok(stageScale(VARIANTS.desktop, 5000, 3000) <= 1.35);
  const s = scene(0);
  assert.equal(s.halo, 1);
  assert.equal(scene(1).grid, 1);
});

test('entrance: dots settle on the border of the target, evenly', () => {
  const rect = { x: 120, y: 300, w: 560, h: 240 };
  const plan = gatherToBorders([rect], { total: 728, pitch: 8, radius: 14, pointPx: 5 });
  assert.ok(plan.used > 100 && plan.used <= 728);
  const r = 14;
  for (let k = 0; k < plan.used; k++) {
    const x = plan.grid[k * 2];
    const y = plan.grid[k * 2 + 1];
    // distance to the rounded rectangle's outline
    const qx = Math.abs(x - (rect.x + rect.w / 2)) - (rect.w / 2 - r);
    const qy = Math.abs(y - (rect.y + rect.h / 2)) - (rect.h / 2 - r);
    const out = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
    assert.ok(Math.abs(out) < 1e-3, `dot ${k} off the border by ${out}`);
  }
  const L = perimeterLength(rect, r);
  assert.ok(Math.abs(plan.used - Math.floor(L / 8)) <= 1);
  assert.deepEqual(perimeterPoint(rect, r, 0).map((n) => Math.round(n)), [134, 300]);
  for (let k = plan.used; k < 728; k++) assert.equal(plan.use[k], 0);
});

test('entrance: under 2.5 s, veil lifts after the dots start gathering', () => {
  assert.ok(ENTRANCE_MS.end < 2500);
  assert.ok(ENTRANCE_MS.gatherStart < ENTRANCE_MS.veilStart && ENTRANCE_MS.veilEnd < ENTRANCE_MS.end);
});

test('entrance: the skip button comes in with the greeting and is gone once the dots have gathered', () => {
  assert.equal(skipOpacity(0), 0, 'never alone on the blank veil before the first frame');
  assert.ok(skipOpacity(ENTRANCE_MS.inEnd) > 0.99, 'there as soon as the greeting is');
  assert.ok(skipOpacity(ENTRANCE_MS.gatherEnd - ENTRANCE_MS.skipOut - 1) > 0.99, 'there while the dots gather');
  for (let e = ENTRANCE_MS.gatherEnd; e <= ENTRANCE_MS.end; e += 10) assert.equal(skipOpacity(e), 0, `gone at ${e} ms`);
  assert.ok(ENTRANCE_MS.inEnd <= 120, 'greeting and herd up within about 100 ms (review round 3: 200 ms of blank paper)');
});

// ---- Hand-offs (review round 3: the crossfades between chapters were the muddiest frames) ----

const FINE = Array.from({ length: 4001 }, (_, i) => i / 4000);
/** Board px of the stack's width (landing.css): a panel that has slid this far is clear of the next. */
const STACK_W = { desktop: 600, phone: 340 };
/** Layers that share a place on the board, from one chapter and the next. */
const SHARED = [
  ['hero', 'c0'], ['hero', 'p0'],
  ['c3', 'fold'], ['p3', 'fold'],
  ['fold', 'rcap'], ['fold', 'rcard'],
  ['rcap', 'dcap'], ['rcard', 'dcap'], ['rcap', 'device'], ['rcard', 'device'],
];
const seen = (op) => (op ?? 0) > 0.02;

for (const v of Object.values(VARIANTS)) {
  test(`${v.id}: a layer is gone before the next one in its place arrives (no double exposure)`, () => {
    for (const t of FINE) {
      const vals = layoutValues(t, v, false, widen);
      for (const [a, b] of SHARED) {
        assert.ok(!(seen(vals[a].opacity) && seen(vals[b].opacity)), `${a} ${vals[a].opacity} and ${b} ${vals[b].opacity} both show at t=${t}`);
      }
    }
  });

  test(`${v.id}: a panel that has been read slides clear of the next before it fades`, () => {
    let checked = 0;
    for (const t of FINE) {
      const vals = layoutValues(t, v, false, widen);
      const a = 3 * smooth(0.15, 0.37, t);
      for (let i = 0; i < 4; i++) {
        const r = vals[`p${i}`];
        if (i - a >= 0 || r.opacity <= 0.02 || r.opacity >= 0.98) continue; // only a panel on its way out
        const x = Number(/translate3d\(([-\d.]+)px/.exec(r.transform)[1]);
        assert.ok(x >= STACK_W[v.id] - 1, `p${i} at opacity ${r.opacity} is only ${x} px out at t=${t}`);
        checked++;
      }
    }
    assert.ok(checked > 0, 'the fades were sampled');
  });

  test(`${v.id}: the deck arrives front panel first, so no table shows through another`, () => {
    for (const t of FINE.filter((x) => x < 0.16)) {
      const vals = layoutValues(t, v, false, widen);
      if (vals.p0.opacity < 0.98) for (const k of ['p1', 'p2', 'p3']) assert.ok(vals[k].opacity <= 0.02, `${k} ${vals[k].opacity} behind p0 ${vals.p0.opacity} at t=${t}`);
    }
  });

  test(`${v.id}: every chapter link lands where its chapter is fully shown`, () => {
    const at = (px) => layoutValues(px / (v.trackH - v.H), v, false, widen);
    assert.equal(at(v.anchors.how).p0.opacity, 1);
    assert.ok(at(v.anchors.how).c0.opacity > 0.8);
    assert.equal(at(v.anchors.acc).fold.opacity, 1);
    assert.equal(at(v.anchors.res).rcap.opacity, 1);
    assert.equal(at(v.anchors.res).rcard.opacity, 1);
    assert.equal(at(v.anchors.priv).dcap.opacity, 1);
  });

  test(`${v.id}: the CSS keyframes follow the layout between their samples (no smeared fades)`, () => {
    const css = keyframesCss(v, widen);
    const head = `@keyframes rs-${v.id}-`;
    const frames = {};
    for (const line of css.split('\n')) {
      if (!line.startsWith(head)) continue;
      const key = line.slice(head.length, line.indexOf('{'));
      frames[key] = [...line.slice(line.indexOf('{') + 1, -1).matchAll(/([\d.]+)%\{([^}]*)\}/g)]
        .map((m) => [Number(m[1]) / 100, /opacity:([\d.]+)/.exec(m[2])])
        .filter(([, o]) => o)
        .map(([p, o]) => [p, Number(o[1])]);
    }
    const css01 = (key, t) => {
      const f = frames[key];
      for (let i = 0; i < f.length - 1; i++) {
        if (t >= f[i][0] && t <= f[i + 1][0]) return f[i + 1][0] === f[i][0] ? f[i + 1][1] : f[i][1] + ((f[i + 1][1] - f[i][1]) * (t - f[i][0])) / (f[i + 1][0] - f[i][0]);
      }
      return f[f.length - 1][1];
    };
    for (const t of FINE) {
      const vals = layoutValues(t, v, false, widen);
      for (const [k, r] of Object.entries(vals)) {
        if (r.opacity === undefined || !frames[k]?.length) continue;
        assert.ok(Math.abs(css01(k, t) - r.opacity) < 0.15, `${k} at t=${t}: css ${css01(k, t)} vs ${r.opacity}`);
      }
      for (const [a, b] of SHARED) {
        assert.ok(Math.min(css01(a, t), css01(b, t)) <= 0.03, `CSS mode: ${a} and ${b} both show at t=${t}`);
      }
    }
  });
}
