// The scroll story's one layout function [M1-DESIGN.md 15.1]. Port of
// work/research-studio/design/story.js: rsLayoutValues(t) maps scroll progress t (0..1 over the
// pinned track) to every animated layer's opacity and transform; the WebGL scene reads the same t.
// JS mode writes these values each frame through refs; CSS mode samples the same function into
// @keyframes on a scroll view timeline (keyframes.js), so the two cannot drift apart.
// Only transform and opacity are animated. OWNER: landing role. Pure module (no DOM).

/** Smoothstep between a and b. */
export function smooth(a, b, t) {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

/**
 * Geometry per artboard. Origins are CSS px from the stage centre, y down. pd: offset per panel still
 * ahead in the stack; pp: offset per panel already passed (x, y, z). `anchors` are the chapter starts
 * in track px (the design's #rs-how, #rs-acc, #rs-res, #rs-priv).
 */
export const VARIANTS = Object.freeze({
  desktop: Object.freeze({
    id: 'desktop', W: 1440, H: 900, trackH: 7200, pointPx: 7, ringPx: 74,
    layout: 'desktop',
    scatterOrigin: [0, 10], farmOrigin: [-230, 30], gridOrigin: [101.5, -127.5],
    heroLift: 60, stackEnter: 140, stackExit: 170, rot: 'rotateY(-20deg) rotateX(7deg)',
    pd: [54, -34, -170], pp: [30, 280, -220], capShift: 26, cardShift: 48, wide: true, capRise: 24, fade: 2.6,
    halo: [0, -25, 480, 250],
    anchors: { how: 1071, acc: 3906, res: 5166, priv: 5985 },
  }),
  phone: Object.freeze({
    id: 'phone', W: 390, H: 844, trackH: 5800, pointPx: 4.5, ringPx: 40,
    layout: 'phone',
    scatterOrigin: [0, 30], farmOrigin: [0, -172], gridOrigin: [-94.5, 50.5],
    heroLift: 40, stackEnter: 90, stackExit: 110, rot: 'rotateY(-14deg) rotateX(8deg)',
    pd: [24, -20, -110], pp: [16, 190, -150], capShift: 18, cardShift: 36, wide: false, capRise: 18, fade: 4,
    halo: [0, -92, 205, 225],
    anchors: { how: 843, acc: 3073, res: 4064, priv: 4708 },
  }),
});

/** Pick the artboard for a viewport: the phone board below 820 CSS px wide or on a portrait screen. */
export function pickVariant(width, height) {
  return width < 820 || height > width * 1.15 ? VARIANTS.phone : VARIANTS.desktop;
}

/**
 * Scale that fits the artboard inside the stage, never above 1.35 (so a large screen does not blow the
 * type up) and never below 0.5.
 */
export function stageScale(v, width, height) {
  return Math.max(0.5, Math.min(1.35, width / v.W, height / v.H));
}

/**
 * Heavy layers never go below opacity 0.002 so they rasterise during load and stay rasterised: a layer
 * at opacity 0 is not drawn, and its first raster stalls a frame when it appears (77 ms for the
 * panels, 97 ms for the device, traced 2026-09-25).
 */
export const HEAVY = Object.freeze({ p0: 1, p1: 1, p2: 1, p3: 1, fold: 1, rcard: 1, device: 1 });
export const MIN_OPACITY = 0.002;

/** Every key the layout writes. */
export const LAYER_KEYS = Object.freeze(['hero', 'heroNote', 'cue', 'stack', 'p0', 'c0', 'p1', 'c1', 'p2', 'c2', 'p3', 'c3', 'fold', 'ciBar', 'ciRow2', 'n1', 'n2', 'rcap', 'rcard', 'provWin', 'prov', 'dcap', 'device']);

/**
 * @param {number} t          scroll progress 0..1
 * @param {typeof VARIANTS.desktop} v
 * @param {boolean} reduce    no transforms (the still layout does not use this; kept for parity)
 * @param {number} widen      sqrt(DEFF) from the herd: the adjusted CI bar is this many times wider
 * @returns {Record<string, { opacity?: number, visibility?: string, transform?: string }>}
 */
export function layoutValues(t, v, reduce, widen) {
  const S = smooth;
  const out = {};
  const m = reduce ? 0 : 1;
  function put(key, op, tf) {
    const r = { opacity: Math.round(op * 1000) / 1000 };
    if (HEAVY[key]) r.opacity = Math.max(MIN_OPACITY, r.opacity);
    else if (key === 'hero' || key === 'cue') r.visibility = op < 0.01 ? 'hidden' : 'visible';
    if (tf !== undefined) r.transform = tf;
    out[key] = r;
  }
  const hero = 1 - S(0.03, 0.1, t);
  put('hero', hero, `translateY(${(-v.heroLift * (1 - hero) * m).toFixed(1)}px)`);
  put('heroNote', hero);
  put('cue', 1 - S(0, 0.04, t));

  const enter = S(0.08, 0.15, t);
  const exit = S(0.38, 0.45, t);
  const vis = enter * (1 - exit);
  const a = 3 * S(0.15, 0.37, t);
  out.stack = {
    transform: reduce ? 'none' : `translateY(${((1 - enter) * v.stackEnter - exit * v.stackExit).toFixed(1)}px) ${v.rot}`,
  };
  for (let i = 0; i < 4; i++) {
    const d = i - a;
    let x = 0;
    let y = 0;
    let z = 0;
    let op;
    if (reduce) op = Math.max(0, 1 - Math.abs(d) * 1.8);
    else if (d >= 0) {
      x = d * v.pd[0];
      y = d * v.pd[1];
      z = d * v.pd[2];
      op = 1 - Math.max(0, d - 2.2) * 0.8;
    } else {
      x = d * v.pp[0];
      y = d * v.pp[1];
      z = d * v.pp[2];
      // The panel being read stays fully opaque until it is well on its way out: at 0.96 the panels
      // behind it showed through its cells (review round 1).
      op = Math.max(0, 1 + Math.min(0, d + 0.3) * v.fade);
    }
    put(`p${i}`, Math.max(0, op) * vis, `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`);
    put(`c${i}`, Math.max(0, 1 - Math.abs(a - i) * 1.8) * vis, `translateY(${((i - a) * v.capShift * m).toFixed(1)}px)`);
  }

  const foldIn = S(0.46, 0.53, t);
  const shift = ((1 - foldIn) * v.cardShift * m).toFixed(1);
  put('fold', foldIn * (1 - S(0.68, 0.72, t)), v.wide ? `translateX(${shift}px)` : `translateY(${shift}px)`);
  const w = S(0.5, 0.6, t);
  out.ciBar = { transform: `scaleX(${(1 + (widen - 1) * w).toFixed(4)})` };
  put('ciRow2', 0.35 + 0.65 * w);
  put('n1', 1 - w);
  put('n2', w);

  const resIn = S(0.71, 0.77, t);
  const resOut = S(0.84, 0.88, t);
  const settle = (1 - S(0.71, 0.78, t)) * m;
  put('rcap', resIn * (1 - resOut), `translateY(${((1 - resIn) * v.capRise * m).toFixed(1)}px)`);
  // 2D slide: a rotateY settling to 0 re-rasterised the card (49 ms in the traces).
  put('rcard', resIn * (1 - resOut), v.wide ? `translateX(${(settle * 60).toFixed(1)}px)` : `translateY(${(settle * 30).toFixed(1)}px)`);
  // The source line is revealed by a counter-translated wipe (two compositor-only transforms), not an
  // animated clip-path, which repaints every frame.
  const wipe = ((1 - S(0.75, 0.81, t)) * 100).toFixed(1);
  out.provWin = { transform: `translateX(-${wipe}%)` };
  out.prov = { transform: `translateX(${wipe}%)` };

  const dev = S(0.85, 0.91, t);
  put('dcap', dev, `translateY(${((1 - dev) * v.capRise * m).toFixed(1)}px)`);
  put('device', dev * (0.3 + 0.7 * S(0.88, 0.97, t)));
  return out;
}

/** Scroll progress t -> what the particle layer does. */
export function scene(t) {
  const panelsIn = smooth(0.08, 0.14, t) * (1 - smooth(0.38, 0.46, t));
  // The herd steps back before a caption rises over it (review round 1: the farm rings sat on the
  // results and privacy captions at full strength). Results: dimmed from 0.66, before rcap at 0.71.
  // Privacy: rings gone by 0.84 and the moving dots dimmed from 0.82 until they settle into the device
  // at 0.97, while dcap rises from 0.85.
  const resultIn = smooth(0.66, 0.71, t) * (1 - smooth(0.84, 0.9, t));
  const crossing = smooth(0.82, 0.86, t) * (1 - smooth(0.93, 0.975, t));
  return {
    fold: smooth(0.44, 0.58, t),
    grid: smooth(0.86, 0.97, t),
    halo: 1 - smooth(0.03, 0.1, t),
    dim: ((1 - 0.72 * panelsIn) * (1 - 0.6 * resultIn) * (1 - 0.8 * crossing)) ** 2,
    posMix: 0.35 + 0.65 * smooth(0.46, 0.56, t),
    ringAlpha: 0.55 * smooth(0.5, 0.62, t) * (1 - smooth(0.79, 0.84, t)) * (1 - 0.9 * resultIn),
  };
}

/** Which chapter the nav highlights: 0 hero, 1 how, 2 accuracy, 3 results, 4 anywhere. */
export function chapterAt(t) {
  if (t < 0.08) return 0;
  if (t < 0.44) return 1;
  if (t < 0.69) return 2;
  if (t < 0.845) return 3;
  return 4;
}

/**
 * Write layout values into elements. Discrete to the keys given; never touches layout properties.
 * @param {ReturnType<typeof layoutValues>} vals
 * @param {(key: string) => HTMLElement | null | undefined} get
 */
export function applyValues(vals, get) {
  for (const k of Object.keys(vals)) {
    const e = get(k);
    if (!e) continue;
    const r = vals[k];
    const s = e.style;
    if (r.opacity !== undefined) s.opacity = String(r.opacity);
    if (r.visibility) s.visibility = r.visibility;
    if (r.transform) s.transform = r.transform;
  }
}
