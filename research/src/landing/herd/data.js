// The simulated herd behind the front door [M1-DESIGN.md 15.2]. Port of
// work/research-studio/design/engine.js (rsHerdData) and herd-seed.mjs (the statistics).
// 728 animals from 49 farms: 48 farms of 15 and one of 8. Each farm's prevalence is drawn from
// N(0.20, 0.089) clipped to [0, 0.6] (0.089 = sqrt(ICC x p x (1 - p)) for ICC 0.05) and each animal is
// positive with its farm's prevalence. Seed 27953 is one whose own dots give the numbers the page
// prints; every one of those numbers is computed here from the dots (herdStats), never typed.
// OWNER: landing role. Pure module: no DOM, importable from node --test.

/** The design the simulation copies: the course's sample-size worked example (bank item 107039,
 * research/tests/fixtures/course/epi-course-2026.json): m = 15 animals per farm, rho = 0.05, n = 728.
 * tests/unit/landing-herd.test.mjs checks these against that fixture. */
export const HERD_DESIGN = Object.freeze({ animals: 728, farms: 49, perFarm: 15, icc: 0.05, courseItem: 107039, courseCode: '3107508' });

/** Seeds: DATA_SEED draws the data; MOVE_SEED only moves dots, so a layout change never changes a number. */
export const DATA_SEED = 27953;
export const MOVE_SEED = 20260925;

/** Mulberry32, as in the design prototype. @param {number} seed @returns {() => number} */
export function mulberry(seed) {
  let s = seed;
  return function next() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Farm sizes: 48 of 15 and one of 8. @returns {number[]} */
export function farmSizes() {
  const { animals, farms, perFarm } = HERD_DESIGN;
  return Array.from({ length: farms }, (_, i) => (i < farms - 1 ? perFarm : animals - (farms - 1) * perFarm));
}

/** Layout of the herd in CSS px (artboard units): farm spacing S, cluster radius R, cloud radii, table step. */
export const HERD_LAYOUTS = Object.freeze({
  desktop: Object.freeze({ S: 86, R: 30, cloud: [640, 330, 380], step: 11 }),
  phone: Object.freeze({ S: 46, R: 16, cloud: [175, 300, 210], step: 7 }),
});

/**
 * @typedef {Object} HerdData
 * @property {number} N
 * @property {number} FARMS
 * @property {Float32Array} scatter  x, y, z per animal (3D cloud)
 * @property {Float32Array} farm     x, y per animal (farm grid, 7 columns)
 * @property {Float32Array} grid     x, y per animal (28-wide table)
 * @property {Float32Array} pos      1 = positive, 0 = negative
 * @property {Float32Array} seed     0..1 per animal (stagger and wobble)
 * @property {Float32Array} centers  x, y per farm
 * @property {number} positives
 * @property {number[]} sizes
 */

/**
 * Port of rsHerdData. Two random streams: `rp` draws the data (identical for every layout), `rnd`
 * only places dots in the cloud.
 * @param {{ S: number, R: number, cloud: number[], step: number }} [layout]
 * @returns {HerdData}
 */
export function herdData(layout = HERD_LAYOUTS.desktop) {
  const rp = mulberry(DATA_SEED);
  const rnd = mulberry(MOVE_SEED);
  const { animals: N, farms: FARMS, perFarm: PER } = HERD_DESIGN;
  const COLS = 7;
  const { S, R } = layout;
  const sizes = farmSizes();
  const scatter = new Float32Array(N * 3);
  const farm = new Float32Array(N * 2);
  const grid = new Float32Array(N * 2);
  const pos = new Float32Array(N);
  const seed = new Float32Array(N);
  const centers = new Float32Array(FARMS * 2);
  let j = 0;
  let positives = 0;
  for (let f = 0; f < FARMS; f++) {
    const cx = ((f % COLS) - 3) * S;
    const cy = (Math.floor(f / COLS) - 3) * S;
    centers[f * 2] = cx;
    centers[f * 2 + 1] = cy;
    let u = 0;
    let w = 0;
    while (u === 0) u = rp();
    while (w === 0) w = rp();
    const pf = Math.min(0.6, Math.max(0, 0.2 + 0.089 * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w)));
    for (let a = 0; a < sizes[f]; a++) {
      const rr = R * Math.sqrt((a + 0.5) / PER);
      const th = a * 2.39996323;
      farm[j * 2] = cx + rr * Math.cos(th);
      farm[j * 2 + 1] = cy + rr * Math.sin(th);
      pos[j] = rp() < pf ? 1 : 0;
      positives += pos[j];
      let x;
      let y;
      let z;
      do {
        x = rnd() * 2 - 1;
        y = rnd() * 2 - 1;
        z = rnd() * 2 - 1;
      } while (x * x + y * y + z * z > 1);
      scatter[j * 3] = x * layout.cloud[0];
      scatter[j * 3 + 1] = y * layout.cloud[1];
      scatter[j * 3 + 2] = z * layout.cloud[2];
      seed[j] = rnd();
      j++;
    }
  }
  for (let g = 0; g < N; g++) {
    grid[g * 2] = (g % 28) * layout.step;
    grid[g * 2 + 1] = Math.floor(g / 28) * layout.step;
  }
  return { N, FARMS, scatter, farm, grid, pos, seed, centers, positives, sizes };
}

/** z for a two-sided 95% interval, as in herd-seed.mjs. */
export const Z95 = 1.959964;

/**
 * The statistics the page prints, computed from the dots (port of herd-seed.mjs stats()).
 * ANOVA ICC with unequal cluster sizes (n0), DEFF = 1 + (mean farm size - 1) x ICC, Wald CIs.
 * @param {ArrayLike<number>} pos  one entry per animal, farms in order
 * @param {number[]} [sizes]
 */
export function herdStats(pos, sizes = farmSizes()) {
  const k = sizes.length;
  const N = sizes.reduce((a, b) => a + b, 0);
  const y = [];
  let j = 0;
  for (const n of sizes) {
    let s = 0;
    for (let a = 0; a < n; a++) s += pos[j++];
    y.push(s);
  }
  const tot = y.reduce((a, b) => a + b, 0);
  const p = tot / N;
  let msb = 0;
  let msw = 0;
  for (let f = 0; f < k; f++) {
    const pf = y[f] / sizes[f];
    msb += sizes[f] * (pf - p) ** 2;
    msw += sizes[f] * pf * (1 - pf);
  }
  msb /= k - 1;
  msw /= N - k;
  const n0 = (N - sizes.reduce((a, n) => a + n * n, 0) / N) / (k - 1);
  const icc = (msb - msw) / (msb + (n0 - 1) * msw);
  const meanSize = N / k;
  const deff = 1 + (meanSize - 1) * icc;
  const se = Math.sqrt((p * (1 - p)) / N);
  const widen = Math.sqrt(deff);
  return {
    n: N,
    farms: k,
    positives: tot,
    farmPositives: y,
    p,
    icc,
    meanSize,
    deff,
    widen,
    effN: N / deff,
    se,
    ci: [p - Z95 * se * widen, p + Z95 * se * widen],
    ciIndependent: [p - Z95 * se, p + Z95 * se],
  };
}

/**
 * Every number the front door prints about the herd, as display strings, from herdStats. The
 * formula line is written from the digits it shows and checked to reproduce the DEFF it prints
 * (tests/unit/landing-herd.test.mjs), so the page never shows arithmetic that does not add up.
 * @param {ReturnType<typeof herdStats>} s
 */
export function herdDisplay(s) {
  const pct = (x) => (x * 100).toFixed(1);
  const iccShown = s.icc.toFixed(4);
  const mShown = s.meanSize.toFixed(2);
  return {
    n: String(s.n),
    farms: String(s.farms),
    positives: String(s.positives),
    prevalence: pct(s.p),
    icc: s.icc.toFixed(2),
    iccFormula: iccShown,
    meanSize: mShown,
    meanSize1: s.meanSize.toFixed(1),
    perFarmRounded: String(Math.round(s.meanSize)),
    deff: s.deff.toFixed(2),
    deffFromShown: (1 + (Number(mShown) - 1) * Number(iccShown)).toFixed(2),
    widen: s.widen.toFixed(2),
    effN: String(Math.round(s.effN)),
    ciLo: pct(s.ci[0]),
    ciHi: pct(s.ci[1]),
    indLo: pct(s.ciIndependent[0]),
    indHi: pct(s.ciIndependent[1]),
  };
}

let cached = null;
/** The desktop herd and its statistics, computed once. The data (not the positions) are the same for every layout. */
export function herdFacts() {
  if (!cached) {
    const d = herdData(HERD_LAYOUTS.desktop);
    const s = herdStats(d.pos, d.sizes);
    cached = { stats: s, display: herdDisplay(s) };
  }
  return cached;
}
