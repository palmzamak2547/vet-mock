// ============================================================
// math.js — the physics and colour the ocean is built from
// ============================================================
// Pure functions, no DOM. Every constant the scene uses comes from one of
// these models, and the formula sits beside the number it produced.

export const TAU = Math.PI * 2;
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Frame-rate-independent smoothing factor: x += (target - x) * smooth(dt, tau).
 *  A per-frame constant (x += d * 0.1) runs twice as fast at 120 Hz; a time
 *  constant does not. */
export const smooth = (dt, tau) => 1 - Math.exp(-dt / tau);

export function wrapAngle(a) {
  a %= TAU;
  if (a > Math.PI) a -= TAU;
  if (a < -Math.PI) a += TAU;
  return a;
}

/** FNV-1a: a stable seed from a string (the same creature looks the same every visit). */
export function hash32(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Small, fast, seedable PRNG (mulberry32). */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lattice = (i, seed) => {
  let h = Math.imul(i ^ seed, 0x27d4eb2d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
};

/** 1D value noise in [-1, 1], C1-smooth (smoothstep fade). Drives wander so a
 *  creature's course bends like a current, never like a random walk. */
export function noise1(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (lattice(i, seed) + (lattice(i + 1, seed) - lattice(i, seed)) * u) * 2 - 1;
}

/** OKLCH -> sRGB (0..1), clipped into gamut. Palettes are written in OKLCH
 *  because equal steps of L look equal; sRGB steps do not. (Ottosson 2020.) */
export function oklch(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((x) => {
    const c = clamp(x, 0, 1);
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  });
}

/** WCAG 2 relative luminance of an sRGB triple (0..1). */
export function luminance([r, g, b]) {
  const f = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** Carangiform lateral amplitude along the body, in body lengths (s = 0 head,
 *  1 tail tip): A(s) = 0.02 - 0.0825 s + 0.1625 s^2. The quadratic envelope
 *  fitted to swimming mackerel/saithe and used for robotic tuna; it gives
 *  A(1) = 0.10 L at the tail and a near-still head (min 0.0095 L at s = 0.25). */
export const carangiform = (s) => 0.02 - 0.0825 * s + 0.1625 * s * s;

/** Tail-beat frequency from swimming speed. A fish's body wave travels faster
 *  than the fish (slip ratio U/c of about 0.7, Lighthill); with one wavelength
 *  per body length, f = U / (0.7 L). Speeds in px/s, length in px. */
export const tailBeatHz = (speed, length, slip = 0.7) => speed / (slip * length);

/** sqrt-distance duration (object accelerating from rest, t = sqrt(2d/a)). */
export const durationFor = (distancePx, a = 9600) =>
  Math.min(450, Math.max(120, Math.round(Math.sqrt((2 * Math.abs(distancePx)) / a) * 1000)));

/** Damped spring step (semi-implicit Euler, substepped): identical at 60 Hz,
 *  120 Hz and after a hitch. response = undamped period (s), zeta = damping ratio. */
export function stepSpring(s, target, response, zeta, dt) {
  const k = (TAU / response) ** 2;
  const c = (2 * TAU * zeta) / response;
  let rest = Math.min(dt, 0.1);
  while (rest > 0) {
    const h = Math.min(rest, 1 / 240);
    s.v += (-k * (s.x - target) - c * s.v) * h;
    s.x += s.v * h;
    rest -= h;
  }
  return s;
}

/** 4x4 Bayer threshold in [0, 1): ordered dithering so a density ramp never bands. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayer4 = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
