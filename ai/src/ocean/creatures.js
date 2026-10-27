// ============================================================
// creatures.js — Thai-sea animals that swim by the physics of swimming
// ============================================================
// Seen from above, as you would look down into clear water off the Andaman
// coast. Every body is a spine of joints that follows its head like a chain
// (so turns bend the whole animal), plus a travelling body wave on top:
//
//   lateral offset(s, t) = L * A(s) * sin(2 pi (k s - f t))
//   A(s) = 0.02 - 0.0825 s + 0.1625 s^2        carangiform envelope (math.js)
//   f    = U / (0.7 L)                          tail beat from speed, slip 0.7
//
// so a whale shark cruising at 0.12 body lengths a second beats its tail
// once every 5.8 s, an anchovy at 1.6 BL/s 2.3 times a second, and nobody's
// tail slides. Sharks' tails are upright, so from above they read as a line;
// a dugong's fluke and a manta's wings are flat, so they read as shapes.
//
// The school is boids (separation, alignment, cohesion) with predator and
// pointer avoidance; while the assistant thinks it mills, the rotating
// torus real schools form. Names are shown only when a visitor taps an
// animal (the specimen label), so each one has its Thai and scientific name.
// ============================================================

import { TAU, clamp, lerp, smooth, wrapAngle, noise1, oklch, carangiform, tailBeatHz } from './math.js';

export const FLOATS = 11; // x y | s u | r g b | pattern seed depth light

// direction toward the sun in screen space (up and left, unit length)
const SUN = [-0.6, -0.8];

// Palettes: [dark (abyss, lit from above at night), light (specimen ink on paper)].
// Written in OKLCH so lightness steps read evenly; the light set is ink, the
// dark set is the animal's own dorsal colour under blue light.
const P = (dark, light) => ({ dark: oklch(...dark), light: oklch(...light) });

export const SPECIES = {
  whaleShark: {
    th: 'ฉลามวาฬ', sci: 'Rhincodon typus', body: 'fish', pattern: 1,
    lenK: 0.62, speedBL: 0.12, joints: 22, turnK: 1.6, wanderHz: 0.018, depth: [0.2, 0.4],
    profile: { W: 0.1, a: 0.24, b: 1.25 }, amp: 0.55, waves: 0.85,
    pect: { s: 0.25, len: 0.19, w: 0.06, sweep: 0.95 },
    color: P([0.46, 0.035, 245], [0.42, 0.13, 255]),
    spot: P([0.93, 0.01, 230], [0.97, 0.01, 85]),
  },
  hammerhead: {
    th: 'ฉลามหัวค้อน', sci: 'Sphyrna lewini', body: 'fish', pattern: 0,
    lenK: 0.42, speedBL: 0.34, joints: 18, turnK: 1.1, wanderHz: 0.03, depth: [0.2, 0.5],
    profile: { W: 0.068, a: 0.55, b: 1.45 }, amp: 0.85, waves: 0.95, hammer: 0.2,
    pect: { s: 0.3, len: 0.16, w: 0.045, sweep: 1.0 },
    color: P([0.6, 0.03, 220], [0.5, 0.06, 235]),
    spot: P([0.4, 0.02, 230], [0.32, 0.05, 240]),
  },
  zebraShark: {
    th: 'ฉลามเสือดาว', sci: 'Stegostoma tigrinum', body: 'fish', pattern: 2,
    lenK: 0.42, speedBL: 0.24, joints: 20, turnK: 1.0, wanderHz: 0.028, depth: [0.25, 0.5],
    profile: { W: 0.075, a: 0.45, b: 0.95 }, amp: 0.9, waves: 0.9, longTail: true,
    pect: { s: 0.24, len: 0.15, w: 0.055, sweep: 0.9 },
    color: P([0.74, 0.07, 78], [0.7, 0.14, 55]),
    spot: P([0.3, 0.035, 60], [0.33, 0.1, 255]),
  },
  dugong: {
    th: 'พะยูน', sci: 'Dugong dugon', body: 'fish', pattern: 5,
    lenK: 0.38, speedBL: 0.12, joints: 16, turnK: 1.2, wanderHz: 0.02, depth: [0.12, 0.35],
    profile: { W: 0.1, a: 0.5, b: 0.95 }, amp: 0.22, waves: 0.7, fluke: 0.4,
    pect: { s: 0.2, len: 0.11, w: 0.05, sweep: 1.15 },
    color: P([0.62, 0.02, 60], [0.55, 0.03, 60]),
    spot: P([0.7, 0.02, 60], [0.65, 0.03, 60]),
  },
  manta: {
    th: 'กระเบนราหู', sci: 'Mobula birostris', body: 'ray', pattern: 3,
    lenK: 0.25, spanK: 2.2, speedBL: 0.55, turnK: 2.2, wanderHz: 0.022, depth: [0.1, 0.35],
    color: P([0.27, 0.012, 260], [0.27, 0.07, 262]),
    spot: P([0.94, 0.005, 240], [0.97, 0.01, 85]),
  },
  turtle: {
    th: 'เต่าตนุ', sci: 'Chelonia mydas', body: 'turtle', pattern: 4,
    lenK: 0.24, speedBL: 0.32, turnK: 1.0, wanderHz: 0.035, depth: [0.05, 0.25],
    color: P([0.56, 0.07, 110], [0.5, 0.1, 120]),
    spot: P([0.38, 0.05, 80], [0.68, 0.14, 55]),
    skin: P([0.66, 0.04, 100], [0.6, 0.07, 110]),
  },
  jelly: {
    th: 'แมงกะพรุนพระจันทร์', sci: 'Aurelia aurita', body: 'jelly', pattern: 6,
    lenK: 0.1, speedBL: 0.25, turnK: 1.0, wanderHz: 0.04, depth: [0.02, 0.3],
    color: P([0.84, 0.05, 285], [0.62, 0.13, 330]),
    spot: P([0.78, 0.11, 330], [0.5, 0.17, 340]),
  },
  anchovy: {
    th: 'ปลากะตัก', sci: 'Stolephorus', body: 'school', pattern: 8,
    lenK: 0.03, speedBL: 1.6, depth: [0.22, 0.28],
    color: P([0.82, 0.02, 215], [0.46, 0.08, 240]),
    spot: P([0.98, 0.01, 200], [0.3, 0.06, 245]),
  },
};

// ── mesh writer ─────────────────────────────────────────────
export class Mesh {
  constructor(maxVerts) {
    this.data = new Float32Array(maxVerts * FLOATS);
    this.max = maxVerts;
    this.n = 0;
  }
  reset(gridW, gridH) { this.n = 0; this.sx = 2 / gridW; this.sy = 2 / gridH; }
  ctx(col, pat, seed, z) { this.col = col; this.pat = pat; this.seed = seed; this.z = z; }
  p(x, y, s, u, light) {
    if (this.n >= this.max) return;
    const d = this.data;
    const o = this.n * FLOATS;
    d[o] = x * this.sx - 1; d[o + 1] = 1 - y * this.sy;
    d[o + 2] = s; d[o + 3] = u;
    d[o + 4] = this.col[0]; d[o + 5] = this.col[1]; d[o + 6] = this.col[2];
    d[o + 7] = this.pat; d[o + 8] = this.seed; d[o + 9] = this.z; d[o + 10] = light;
    this.n++;
  }
  tri(a, b, c, l = 1) { this.p(a[0], a[1], a[2], a[3], l); this.p(b[0], b[1], b[2], b[3], l); this.p(c[0], c[1], c[2], c[3], l); }
  quad(a, b, c, d, l = 1) { this.tri(a, b, c, l); this.tri(a, c, d, l); }
}

const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const themed = (pair, t) => mix3(pair.dark, pair.light, t);

function profileMax({ a, b }) {
  let m = 0;
  for (let i = 1; i < 200; i++) { const s = i / 200; m = Math.max(m, s ** a * (1 - s) ** b); }
  return m;
}

// ── one swimming animal ─────────────────────────────────────
export class Swimmer {
  constructor(key, rand, env, entering = false) {
    const s = SPECIES[key];
    this.key = key;
    this.spec = s;
    this.rand = rand;
    this.seed = Math.floor(rand() * 9973);
    this.z = lerp(s.depth[0], s.depth[1], rand());
    this.scale = 1 - 0.4 * this.z; // perspective: deeper is smaller (f / (f + z D), linearised)
    this.L = s.lenK * env.short * this.scale;
    this.cruise = s.speedBL * this.L;
    this.speed = this.cruise;
    this.burst = 0;
    this.phase = rand() * TAU;
    this.home = rand() * TAU;
    this.homeAt = 0;
    this.out = 0;
    this.curious = 0;
    this.pmax = s.profile ? profileMax(s.profile) : 1;
    this.N = s.joints || 2;
    this.seg = this.L / (this.N - 1);
    this.jx = new Float32Array(this.N);
    this.jy = new Float32Array(this.N);
    this.rx = new Float32Array(this.N);
    this.ry = new Float32Array(this.N);
    this.place(env, entering);
  }

  place(env, entering) {
    const { W, H } = env;
    const r = this.rand;
    let x;
    let y;
    if (entering) {
      // enter from an edge, heading inward
      const side = Math.floor(r() * 4);
      const m = this.L * 1.1;
      if (side === 0) { x = -m; y = r() * H; this.theta = (r() - 0.5) * 1.2; }
      else if (side === 1) { x = W + m; y = r() * H; this.theta = Math.PI + (r() - 0.5) * 1.2; }
      else if (side === 2) { x = r() * W; y = -m; this.theta = Math.PI / 2 + (r() - 0.5) * 1.2; }
      else { x = r() * W; y = H + m; this.theta = -Math.PI / 2 + (r() - 0.5) * 1.2; }
    } else {
      x = W * (0.08 + 0.84 * r());
      y = H * (0.08 + 0.84 * r());
      this.theta = r() * TAU;
    }
    this.home = this.theta;
    this.x = x;
    this.y = y;
    const cx = Math.cos(this.theta);
    const cy = Math.sin(this.theta);
    for (let i = 0; i < this.N; i++) { this.jx[i] = x - cx * this.seg * i; this.jy[i] = y - cy * this.seg * i; }
  }

  update(dt, env) {
    const s = this.spec;
    const { W, H } = env;
    const L = this.L;
    let dx = 0;
    let dy = 0;

    // wander: a heading that drifts like a current (value noise), around a
    // home course that changes every 20 to 40 s so animals cross the water
    if (env.t > this.homeAt) {
      this.home = wrapAngle(this.home + (this.rand() - 0.5) * 2.4);
      this.homeAt = env.t + 20 + this.rand() * 20;
    }
    const wa = this.home + 1.4 * noise1(env.t * s.wanderHz * 6 + this.seed, this.seed);
    dx += Math.cos(wa);
    dy += Math.sin(wa);

    // soft walls a little outside the viewport; the push grows linearly with depth past the wall
    const m = L * 0.35;
    if (this.x < -m) dx += ((-m - this.x) / m) * 2.5;
    if (this.x > W + m) dx -= ((this.x - W - m) / m) * 2.5;
    if (this.y < -m) dy += ((-m - this.y) / m) * 2.5;
    if (this.y > H + m) dy -= ((this.y - H - m) / m) * 2.5;

    // reading column: swim around it, not through the words
    const c = env.content;
    if (c && env.avoid > 0) {
      const pad = L * 0.25;
      if (this.x > c.x - pad && this.x < c.x + c.w + pad && this.y > c.y - pad && this.y < c.y + c.h + pad) {
        const ox = this.x - (c.x + c.w / 2);
        dx += Math.sign(ox || 1) * 1.6 * env.avoid;
      }
    }

    // curiosity: one animal comes to look at the box you are typing in
    let slow = 1;
    if (this.curious > 0 && env.focus) {
      const f = env.focus;
      const tx = f.x + f.w * (this.curiousSide > 0 ? 0.92 : 0.08);
      const ty = f.y + f.h + L * 0.35;
      const ddx = tx - this.x;
      const ddy = ty - this.y;
      const d = Math.hypot(ddx, ddy) || 1;
      dx += (ddx / d) * 2.2;
      dy += (ddy / d) * 2.2;
      if (d < L * 0.8) slow = 0.5;
      this.curious -= dt;
    }

    // thinking: big animals circle the answer at a wide radius (counter-clockwise)
    if (env.mill) {
      const mx = this.x - env.mill.x;
      const my = this.y - env.mill.y;
      const r = Math.hypot(mx, my) || 1;
      const R = env.short * (0.34 + this.z * 0.25);
      dx += (-my / r) * 1.5 + (mx / r) * ((R - r) / R) * 1.2;
      dy += (mx / r) * 1.5 + (my / r) * ((R - r) / R) * 1.2;
    }

    // pointer: a startle (fast-start escape) when a hand comes close to the head
    const p = env.pointer;
    if (p.active) {
      const px = this.x - p.x;
      const py = this.y - p.y;
      const d = Math.hypot(px, py) || 1;
      const R = L * 0.45 + 50;
      if (d < R) {
        dx += (px / d) * 4 * (1 - d / R);
        dy += (py / d) * 4 * (1 - d / R);
        if (this.burst < 0.2) this.burst = 1.4;
      }
    }

    // turn toward the desired course at a rate set by the turning radius:
    // omega_max = U / R_min, with R_min a multiple of body length (big animals turn wide)
    const want = Math.atan2(dy, dx);
    const omega = (this.speed / (s.turnK * L)) * (1 + this.burst * 1.5);
    this.theta = wrapAngle(this.theta + clamp(wrapAngle(want - this.theta), -omega * dt, omega * dt));

    // speed eases toward cruise (tau 0.9 s); a startle adds a burst that decays with tau 0.7 s
    const target = this.cruise * slow * env.pace * (1 + this.burst);
    this.speed += (target - this.speed) * smooth(dt, 0.9);
    this.burst *= Math.exp(-dt / 0.7);
    this.x += Math.cos(this.theta) * this.speed * dt;
    this.y += Math.sin(this.theta) * this.speed * dt;
    this.phase += TAU * tailBeatHz(this.speed, L) * dt;

    // spine follows the head like a chain, each link bend-limited so a turn
    // curves the body instead of folding it
    this.jx[0] = this.x;
    this.jy[0] = this.y;
    let pa = this.theta + Math.PI;
    const maxBend = 0.32;
    for (let i = 1; i < this.N; i++) {
      let a = Math.atan2(this.jy[i] - this.jy[i - 1], this.jx[i] - this.jx[i - 1]);
      const d = wrapAngle(a - pa);
      if (d > maxBend) a = pa + maxBend;
      else if (d < -maxBend) a = pa - maxBend;
      this.jx[i] = this.jx[i - 1] + Math.cos(a) * this.seg;
      this.jy[i] = this.jy[i - 1] + Math.sin(a) * this.seg;
      pa = a;
    }

    // far outside for a while: come back in from another edge
    const far = this.x < -L * 1.6 || this.x > W + L * 1.6 || this.y < -L * 1.6 || this.y > H + L * 1.6;
    this.out = far ? this.out + dt : 0;
    if (this.out > 2.5) { this.out = 0; this.place(env, true); }
  }

  /** Rendered spine: the chain plus the travelling wave along its normals. */
  wave() {
    const s = this.spec;
    const N = this.N;
    const L = this.L;
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(N - 1, i + 1);
      const tx = this.jx[i0] - this.jx[i1];
      const ty = this.jy[i0] - this.jy[i1];
      const tl = Math.hypot(tx, ty) || 1;
      const off = L * carangiform(u) * s.amp * Math.sin(TAU * s.waves * u - this.phase);
      this.rx[i] = this.jx[i] + (-ty / tl) * off;
      this.ry[i] = this.jy[i] + (tx / tl) * off;
    }
  }

  halfWidth(u) {
    const pr = this.spec.profile;
    let w = (u ** pr.a * (1 - u) ** pr.b) / this.pmax;
    if (this.spec.longTail && u > 0.55) w = Math.max(w, 0.22 * (1 - u) + 0.05);
    return Math.max(pr.W * this.L * w, this.L * 0.006);
  }

  write(mesh, theme) {
    const s = this.spec;
    if (s.body === 'fish') return this.writeFish(mesh, theme);
    if (s.body === 'ray') return this.writeRay(mesh, theme);
    if (s.body === 'turtle') return this.writeTurtle(mesh, theme);
    if (s.body === 'jelly') return this.writeJelly(mesh, theme);
    return undefined;
  }

  writeFish(mesh, theme) {
    const s = this.spec;
    const N = this.N;
    const L = this.L;
    this.wave();
    const col = themed(s.color, theme);
    mesh.ctx(col, s.pattern, this.seed, this.z);
    const nx = new Float32Array(N);
    const ny = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(N - 1, i + 1);
      const tx = this.rx[i0] - this.rx[i1];
      const ty = this.ry[i0] - this.ry[i1];
      const tl = Math.hypot(tx, ty) || 1;
      nx[i] = -ty / tl;
      ny[i] = tx / tl;
    }
    // fins first so the body draws over their roots
    const fin = (pf, side) => {
      const i = Math.round(pf.s * (N - 1));
      const w = this.halfWidth(pf.s);
      const tx = this.rx[Math.max(0, i - 1)] - this.rx[Math.min(N - 1, i + 1)];
      const ty = this.ry[Math.max(0, i - 1)] - this.ry[Math.min(N - 1, i + 1)];
      const tl = Math.hypot(tx, ty) || 1;
      const fx = tx / tl;
      const fy = ty / tl;
      const flap = 0.08 * Math.sin(this.phase * 0.5 + side);
      const sw = pf.sweep + flap;
      const len = pf.len * L;
      const bx = this.rx[i] + nx[i] * w * 0.7 * side;
      const by = this.ry[i] + ny[i] * w * 0.7 * side;
      const ox = nx[i] * side * Math.cos(sw) - fx * Math.sin(sw);
      const oy = ny[i] * side * Math.cos(sw) - fy * Math.sin(sw);
      const tipx = bx + ox * len;
      const tipy = by + oy * len;
      const rootF = [bx + fx * pf.w * L, by + fy * pf.w * L, pf.s - 0.03, 1.3 * side];
      const rootB = [bx - fx * pf.w * L, by - fy * pf.w * L, pf.s + 0.04, 1.3 * side];
      mesh.tri(rootF, [tipx, tipy, pf.s + 0.06, 1.9 * side], rootB, 0.82);
    };
    if (s.pect) { fin(s.pect, 1); fin(s.pect, -1); }
    // a dugong's fluke is horizontal, so from above it is a broad crescent
    if (s.fluke) {
      const i = N - 1;
      const tx = this.rx[i - 1] - this.rx[i];
      const ty = this.ry[i - 1] - this.ry[i];
      const tl = Math.hypot(tx, ty) || 1;
      const fx = tx / tl;
      const fy = ty / tl;
      const half = (s.fluke * L) / 2;
      const ex = this.rx[i];
      const ey = this.ry[i];
      const back = L * 0.06;
      const pulse = 0.85 + 0.15 * Math.sin(this.phase); // fluke beats up and down: its outline breathes
      for (const side of [1, -1]) {
        const tip = [ex + nx[i] * half * side * pulse - fx * back, ey + ny[i] * half * side * pulse - fy * back, 1.02, 1.6 * side];
        mesh.tri([ex + fx * L * 0.03, ey + fy * L * 0.03, 0.97, 0], tip, [ex - fx * back * 0.4, ey - fy * back * 0.4, 1.0, 0], 0.9);
      }
    }
    // body ribbon. One sun, up and to the upper left: the flank whose outward
    // normal faces it is lit (Lambert on the horizontal part of the normal),
    // the other falls into shade, so every animal reads as round and lit alike.
    const lit = (i, side) => 1 + 0.32 * side * (nx[i] * SUN[0] + ny[i] * SUN[1]);
    for (let i = 0; i < N - 1; i++) {
      const u0 = i / (N - 1);
      const u1 = (i + 1) / (N - 1);
      const w0 = this.halfWidth(u0);
      const w1 = this.halfWidth(u1);
      const ax = this.rx[i] + nx[i] * w0;
      const ay = this.ry[i] + ny[i] * w0;
      const bx = this.rx[i] - nx[i] * w0;
      const by = this.ry[i] - ny[i] * w0;
      const cx = this.rx[i + 1] - nx[i + 1] * w1;
      const cy = this.ry[i + 1] - ny[i + 1] * w1;
      const dx = this.rx[i + 1] + nx[i + 1] * w1;
      const dy = this.ry[i + 1] + ny[i + 1] * w1;
      const la = lit(i, 1);
      const lb = lit(i, -1);
      const lc = lit(i + 1, -1);
      const ld = lit(i + 1, 1);
      mesh.p(ax, ay, u0, 1, la); mesh.p(bx, by, u0, -1, lb); mesh.p(cx, cy, u1, -1, lc);
      mesh.p(ax, ay, u0, 1, la); mesh.p(cx, cy, u1, -1, lc); mesh.p(dx, dy, u1, 1, ld);
    }
    // hammerhead: the cephalofoil, a flat blade across the head
    if (s.hammer) {
      const half = (s.hammer * L) / 2;
      const depth = L * 0.05;
      const fx = Math.cos(this.theta);
      const fy = Math.sin(this.theta);
      const hx = this.rx[0] - fx * L * 0.02;
      const hy = this.ry[0] - fy * L * 0.02;
      const q = (side, along) => [hx + nx[0] * half * side + fx * along, hy + ny[0] * half * side + fy * along, 0.02, 0.9 * side];
      mesh.quad(q(1, depth * 0.5), q(-1, depth * 0.5), q(-1, -depth), q(1, -depth), 0.95);
    }
    // first dorsal fin is upright: from above, a dark ridge along the spine
    const d0 = Math.round(0.34 * (N - 1));
    const d1 = Math.round(0.47 * (N - 1));
    const rw = L * 0.011;
    for (let i = d0; i < d1; i++) {
      const u0 = i / (N - 1);
      const u1 = (i + 1) / (N - 1);
      mesh.quad(
        [this.rx[i] + nx[i] * rw, this.ry[i] + ny[i] * rw, u0, 0.05],
        [this.rx[i] - nx[i] * rw, this.ry[i] - ny[i] * rw, u0, -0.05],
        [this.rx[i + 1] - nx[i + 1] * rw, this.ry[i + 1] - ny[i + 1] * rw, u1, -0.05],
        [this.rx[i + 1] + nx[i + 1] * rw, this.ry[i + 1] + ny[i + 1] * rw, u1, 0.05],
        0.55,
      );
    }
  }

  writeRay(mesh, theme) {
    const s = this.spec;
    const Lb = this.L;
    const Sh = (s.spanK * Lb) / 2;
    const fx = Math.cos(this.theta);
    const fy = Math.sin(this.theta);
    const nx = -fy;
    const ny = fx;
    const col = themed(s.color, theme);
    mesh.ctx(col, s.pattern, this.seed, this.z);
    // planform: a beta curve in body length, widest just ahead of centre
    const span = (xn) => {
      const f = xn ** 1.35 * (1 - xn) ** 0.75;
      return f / 0.2915; // max of x^1.35 (1-x)^0.75 is 0.2915 at x = 0.643
    };
    const stations = 9;
    const rows = 6;
    const flapHz = tailBeatHz(this.speed, Lb * 3.2); // wings beat slower than a tail: wave length ~3 bodies
    const ph = this.phase * 0.4 + 0; // reuse phase clock, slowed
    void flapHz;
    const pt = (xi, yi) => {
      const xn = xi / (stations - 1); // 0 tail end of disc -> 1 nose
      const yn = yi / rows; // -1 .. 1
      const along = (xn - 0.5) * Lb;
      const half = Sh * span(clamp(xn, 0.02, 0.98)) + Lb * 0.06;
      // mobuliform flapping: a wave runs nose to tail; tips move most (|y|^1.6)
      const h = Math.abs(yn) ** 1.6 * Math.sin(ph - 2.2 * (1 - xn));
      const yScreen = yn * half * (1 - 0.18 * Math.abs(h));
      return [this.x + fx * along + nx * yScreen, this.y + fy * along + ny * yScreen, 1 - xn, yn, 0.82 + 0.28 * h];
    };
    for (let xi = 0; xi < stations - 1; xi++) {
      for (let yi = -rows; yi < rows; yi++) {
        const a = pt(xi, yi);
        const b = pt(xi + 1, yi);
        const c = pt(xi + 1, yi + 1);
        const d = pt(xi, yi + 1);
        const l = (a[4] + b[4] + c[4] + d[4]) / 4;
        mesh.quad(a, b, c, d, l);
      }
    }
    // cephalic fins: two lobes at the mouth
    const nose = 0.5 * Lb;
    for (const side of [1, -1]) {
      const bx = this.x + fx * nose + nx * Lb * 0.09 * side;
      const by = this.y + fy * nose + ny * Lb * 0.09 * side;
      const tipx = bx + fx * Lb * 0.16 - nx * Lb * 0.02 * side;
      const tipy = by + fy * Lb * 0.16 - ny * Lb * 0.02 * side;
      mesh.tri([bx - nx * Lb * 0.03 * side, by - ny * Lb * 0.03 * side, 0, 0.3 * side], [tipx, tipy, -0.05, 0.4 * side], [bx + nx * Lb * 0.025 * side, by + ny * Lb * 0.025 * side, 0, 0.5 * side], 0.7);
    }
    // whip tail
    const tw = Lb * 0.014;
    const tl = Lb * 0.7;
    const wag = Math.sin(this.phase * 0.4) * Lb * 0.05;
    const t0x = this.x - fx * Lb * 0.48;
    const t0y = this.y - fy * Lb * 0.48;
    const t1x = t0x - fx * tl + nx * wag;
    const t1y = t0y - fy * tl + ny * wag;
    mesh.quad([t0x + nx * tw, t0y + ny * tw, 1, 0.05], [t0x - nx * tw, t0y - ny * tw, 1, -0.05], [t1x, t1y, 1.2, 0], [t1x, t1y, 1.2, 0], 0.6);
  }

  writeTurtle(mesh, theme) {
    const s = this.spec;
    const L = this.L;
    const fx = Math.cos(this.theta);
    const fy = Math.sin(this.theta);
    const nx = -fy;
    const ny = fx;
    const at = (along, side) => [this.x + fx * along + nx * side, this.y + fy * along + ny * side];
    const skin = themed(s.skin, theme);
    // power stroke of the fore flippers: an underwater flight, ~0.4 Hz scaled by speed
    const stroke = Math.sin(this.phase * 0.55);
    mesh.ctx(skin, 7, this.seed, this.z);
    for (const side of [1, -1]) {
      // fore flipper: long blade, swept back, angle oscillating +-0.7 rad
      const ang = 0.55 + 0.7 * stroke;
      const root = at(L * 0.14, L * 0.19 * side);
      const dirx = nx * side * Math.cos(ang) - fx * Math.sin(ang);
      const diry = ny * side * Math.cos(ang) - fy * Math.sin(ang);
      const len = L * 0.38;
      const wr = L * 0.06;
      const tip = [root[0] + dirx * len, root[1] + diry * len];
      const r1 = [root[0] + fx * wr, root[1] + fy * wr];
      const r2 = [root[0] - fx * wr, root[1] - fy * wr];
      const mid = [root[0] + dirx * len * 0.55 - fx * wr * 0.9, root[1] + diry * len * 0.55 - fy * wr * 0.9];
      const lt = 0.85 + 0.2 * stroke * side;
      mesh.tri([r1[0], r1[1], 0.2, 1.2 * side], [tip[0], tip[1], 0.5, 2 * side], [mid[0], mid[1], 0.45, 1.6 * side], lt);
      mesh.tri([r1[0], r1[1], 0.2, 1.2 * side], [mid[0], mid[1], 0.45, 1.6 * side], [r2[0], r2[1], 0.3, 1.2 * side], lt);
      // hind flipper: a small rudder
      const hr = at(-L * 0.24, L * 0.13 * side);
      const ha = 0.9 + 0.15 * Math.sin(this.phase * 0.55 + 1.2);
      const hdx = nx * side * Math.cos(ha) - fx * Math.sin(ha);
      const hdy = ny * side * Math.cos(ha) - fy * Math.sin(ha);
      mesh.tri([hr[0] + fx * L * 0.03, hr[1] + fy * L * 0.03, 0.8, 1.1 * side], [hr[0] + hdx * L * 0.14, hr[1] + hdy * L * 0.14, 0.9, 1.5 * side], [hr[0] - fx * L * 0.04, hr[1] - fy * L * 0.04, 0.85, 1.1 * side], 0.8);
    }
    // head and neck
    const bob = Math.sin(this.phase * 0.55 + 0.6) * L * 0.01;
    const hc = at(L * 0.4, bob);
    const hr = L * 0.075;
    const seg = 12;
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * TAU;
      const a1 = ((k + 1) / seg) * TAU;
      const p0 = [hc[0] + (fx * Math.cos(a0) * 1.25 + nx * Math.sin(a0)) * hr, hc[1] + (fy * Math.cos(a0) * 1.25 + ny * Math.sin(a0)) * hr];
      const p1 = [hc[0] + (fx * Math.cos(a1) * 1.25 + nx * Math.sin(a1)) * hr, hc[1] + (fy * Math.cos(a1) * 1.25 + ny * Math.sin(a1)) * hr];
      mesh.tri([hc[0], hc[1], 0.05, 0], [p0[0], p0[1], 0.05, Math.sin(a0)], [p1[0], p1[1], 0.05, Math.sin(a1)], 1.05);
    }
    const neck0 = at(L * 0.26, 0);
    mesh.quad([neck0[0] + nx * L * 0.06, neck0[1] + ny * L * 0.06, 0.15, 1], [neck0[0] - nx * L * 0.06, neck0[1] - ny * L * 0.06, 0.15, -1], [hc[0] - nx * hr * 0.7, hc[1] - ny * hr * 0.7, 0.08, -1], [hc[0] + nx * hr * 0.7, hc[1] + ny * hr * 0.7, 0.08, 1], 0.95);
    // carapace: an ellipse fan, uv = (front->back, left->right) for the scute pattern
    mesh.ctx(themed(s.color, theme), s.pattern, this.seed, this.z);
    const a = L * 0.31;
    const b = L * 0.25;
    const cseg = 22;
    for (let k = 0; k < cseg; k++) {
      const a0 = (k / cseg) * TAU;
      const a1 = ((k + 1) / cseg) * TAU;
      const e = (an) => {
        const ca = Math.cos(an);
        const sa = Math.sin(an);
        // slightly pointed at the back (a turtle shell is not a perfect ellipse)
        const back = ca < 0 ? 1 + 0.12 * ca * ca : 1;
        return [this.x + (fx * ca * a * back + nx * sa * b), this.y + (fy * ca * a * back + ny * sa * b), 0.5 - 0.5 * ca, sa];
      };
      mesh.tri([this.x, this.y, 0.5, 0], e(a0), e(a1), 1);
    }
  }

  writeJelly(mesh, theme) {
    const s = this.spec;
    const r0 = this.L / 2;
    // bell pulse: quick contraction (30% of the cycle), slow relaxation
    const cyc = (this.phase / TAU) % 1;
    const p = cyc < 0.3 ? Math.sin((cyc / 0.3) * (Math.PI / 2)) : 1 - (cyc - 0.3) / 0.7;
    const r = r0 * (1 - 0.17 * p);
    const col = themed(s.color, theme);
    mesh.ctx(col, s.pattern, this.seed, this.z);
    // tentacles trail behind the drift, waving
    const bx = -Math.cos(this.theta);
    const by = -Math.sin(this.theta);
    const tw = Math.max(1, r0 * 0.04);
    for (let k = 0; k < 10; k++) {
      const an = (k / 10) * TAU;
      const sx = this.x + Math.cos(an) * r * 0.9;
      const sy = this.y + Math.sin(an) * r * 0.9;
      const wv = Math.sin(this.phase * 0.7 + k) * r0 * 0.3;
      const ex = sx + bx * r0 * 1.1 - by * wv;
      const ey = sy + by * r0 * 1.1 + bx * wv;
      mesh.quad([sx - by * tw, sy + bx * tw, 1.1, 0.1], [sx + by * tw, sy - bx * tw, 1.1, -0.1], [ex, ey, 1.4, 0], [ex, ey, 1.4, 0], 0.55);
    }
    const seg = 18;
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * TAU;
      const a1 = ((k + 1) / seg) * TAU;
      mesh.tri(
        [this.x, this.y, 0, 0],
        [this.x + Math.cos(a0) * r, this.y + Math.sin(a0) * r, 1, a0 / Math.PI - 1],
        [this.x + Math.cos(a1) * r, this.y + Math.sin(a1) * r, 1, a1 / Math.PI - 1],
        0.9 + 0.2 * p,
      );
    }
  }

  /** Distance from (x, y) to this animal, in units of its half-width (< 1 = on it). */
  hit(x, y) {
    if (this.spec.body === 'fish') {
      let best = Infinity;
      for (let i = 0; i < this.N; i++) {
        const d = Math.hypot(x - this.rx[i], y - this.ry[i]) / Math.max(12, this.halfWidth(i / (this.N - 1)) * 1.4);
        if (d < best) best = d;
      }
      return best;
    }
    const R = this.spec.body === 'ray' ? this.L * 0.9 : this.spec.body === 'turtle' ? this.L * 0.4 : this.L * 0.6;
    return Math.hypot(x - this.x, y - this.y) / Math.max(14, R);
  }
}

// ── the school ──────────────────────────────────────────────
export class School {
  constructor(n, rand, env) {
    this.spec = SPECIES.anchovy;
    this.n = n;
    this.rand = rand;
    this.z = 0.25;
    this.l = this.spec.lenK * env.short * (1 - 0.4 * this.z);
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.ph = new Float32Array(n);
    const cx = env.W * (0.25 + 0.5 * rand());
    const cy = env.H * (0.25 + 0.5 * rand());
    const v = this.spec.speedBL * this.l;
    const a0 = rand() * TAU;
    for (let i = 0; i < n; i++) {
      const a = rand() * TAU;
      const r = Math.sqrt(rand()) * env.short * 0.12;
      this.x[i] = cx + Math.cos(a) * r;
      this.y[i] = cy + Math.sin(a) * r;
      this.vx[i] = Math.cos(a0) * v;
      this.vy[i] = Math.sin(a0) * v;
      this.ph[i] = rand() * TAU;
    }
    this.goalA = a0;
    this.goalAt = 0;
  }

  update(dt, env, predators) {
    const n = this.n;
    const l = this.l;
    const cruise = this.spec.speedBL * l * env.pace;
    const vmax = cruise * 2.6;
    const rSep = l * 1.3; // personal space ~1 body length
    const rNb = l * 6; // neighbours within ~6 body lengths
    if (env.t > this.goalAt) {
      this.goalA = wrapAngle(this.goalA + (this.rand() - 0.5) * 2.2);
      this.goalAt = env.t + 6 + this.rand() * 8;
    }
    const gx = Math.cos(this.goalA);
    const gy = Math.sin(this.goalA);
    for (let i = 0; i < n; i++) {
      let sx = 0;
      let sy = 0;
      let ax = 0;
      let ay = 0;
      let cx = 0;
      let cy = 0;
      let k = 0;
      const xi = this.x[i];
      const yi = this.y[i];
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const dx = this.x[j] - xi;
        const dy = this.y[j] - yi;
        const d2 = dx * dx + dy * dy;
        if (d2 > rNb * rNb) continue;
        const d = Math.sqrt(d2) || 1;
        if (d < rSep) { sx -= (dx / d) * (rSep - d); sy -= (dy / d) * (rSep - d); }
        ax += this.vx[j];
        ay += this.vy[j];
        cx += dx;
        cy += dy;
        k++;
      }
      let fx = gx * cruise * 0.6;
      let fy = gy * cruise * 0.6;
      if (k) {
        fx += (ax / k - this.vx[i]) * 1.1 + (cx / k) * 0.9 + sx * 6;
        fy += (ay / k - this.vy[i]) * 1.1 + (cy / k) * 0.9 + sy * 6;
      }
      // walls
      const m = l * 4;
      if (xi < m) fx += (m - xi) * 2;
      if (xi > env.W - m) fx -= (xi - env.W + m) * 2;
      if (yi < m) fy += (m - yi) * 2;
      if (yi > env.H - m) fy -= (yi - env.H + m) * 2;
      // predators and the pointer: flee radially
      for (const pr of predators) {
        const dx = xi - pr.x;
        const dy = yi - pr.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < pr.r) { fx += (dx / d) * vmax * 3 * (1 - d / pr.r); fy += (dy / d) * vmax * 3 * (1 - d / pr.r); }
      }
      // mill: a rotating torus around the answer while thinking
      if (env.millSchool) {
        const mx = xi - env.millSchool.x;
        const my = yi - env.millSchool.y;
        const r = Math.hypot(mx, my) || 1;
        const R = env.millSchool.r;
        fx += (-my / r) * cruise * 1.6 + (mx / r) * (R - r) * 1.4;
        fy += (mx / r) * cruise * 1.6 + (my / r) * (R - r) * 1.4;
      }
      // curiosity toward the composer while typing
      if (env.schoolPull) {
        fx += (env.schoolPull.x - xi) * 0.25;
        fy += (env.schoolPull.y - yi) * 0.25;
      }
      this.vx[i] += fx * dt;
      this.vy[i] += fy * dt;
      const sp = Math.hypot(this.vx[i], this.vy[i]) || 1;
      const lim = clamp(sp, cruise * 0.55, vmax);
      this.vx[i] = (this.vx[i] / sp) * lim;
      this.vy[i] = (this.vy[i] / sp) * lim;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;
      this.ph[i] += TAU * tailBeatHz(lim, l) * dt;
    }
  }

  write(mesh, theme, lightAngle) {
    const s = this.spec;
    const l = this.l;
    const base = themed(s.color, theme);
    for (let i = 0; i < this.n; i++) {
      const sp = Math.hypot(this.vx[i], this.vy[i]) || 1;
      const fx = this.vx[i] / sp;
      const fy = this.vy[i] / sp;
      const nx = -fy;
      const ny = fx;
      const head = [this.x[i] + fx * l * 0.5, this.y[i] + fy * l * 0.5];
      const mid = [this.x[i], this.y[i]];
      const wig = Math.sin(this.ph[i]) * l * 0.16;
      const tail = [this.x[i] - fx * l * 0.55 + nx * wig, this.y[i] - fy * l * 0.55 + ny * wig];
      const w = l * 0.12;
      // a silver flank flashes when the body turns broadside to the light
      const glint = 0.55 + 0.75 * Math.abs(Math.sin(Math.atan2(fy, fx) - lightAngle)) ** 12;
      mesh.ctx(base, s.pattern, i, this.z);
      mesh.quad([head[0], head[1], 0, 0], [mid[0] + nx * w, mid[1] + ny * w, 0.45, 1], [tail[0], tail[1], 1, 0], [mid[0] - nx * w, mid[1] - ny * w, 0.45, -1], glint);
    }
  }
}

/** Who lives in this viewport: fewer, smaller animals on a phone. */
export function population(env) {
  const area = env.W * env.H;
  const big = area > 900_000;
  const mid = area > 420_000;
  const list = ['whaleShark', 'manta', 'turtle', 'hammerhead', 'jelly', 'jelly'];
  if (mid) list.push('zebraShark', 'jelly', 'turtle');
  if (big) list.push('dugong', 'hammerhead', 'jelly');
  return { list, school: big ? 90 : mid ? 64 : 42 };
}
