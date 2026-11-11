// ============================================================
// prefs/accent.js — "สีของฉัน": any hue, a whole palette that always reads
// ============================================================
// The student picks a hue (0-359). Everything else is computed here, in OKLCH,
// so no pick can give an unreadable screen: for each theme the function walks
// a grid of lightness and chroma outward from the target until every rule
// below holds, and returns the nearest candidate that does. The student never
// sees a refusal; a hue that cannot hold the target is bent, not rejected.
//
// Rules (WCAG 2.x contrast; tests/unit/accent-palette.test.mjs runs all 360
// hues in light and dark):
//   accent text (-text roles) >= 4.5 on bg, surface, surface-2 and on a chip
//     tinted with 12% of the accent (where the old palettes failed, see
//     scripts/lint-accent-tokens.mjs)
//   the primary button's label on its fill >= 4.5
//   the accent itself (focus ring, borders) >= 3 against bg and surface
//   the accent is not the colour of a verdict: OKLab distance >= 0.09 from
//     the correct-answer sage and the wrong-answer rose of that theme
// The page's own ink and paper are not touched, so body and muted text keep
// their contrast by construction (the test checks them anyway).
// ============================================================

export const ACCENT_KEY = 'vmx-accent';
export const ACCENT_CSS_KEY = 'vmx-accent-css';

export const BASE = Object.freeze({
  light: { bg: '#f6efe4', surface: '#fdf8ef', surface2: '#f0e6d2', ink: '#2b2419', inkSoft: '#5c4f3d', correct: '#4a6b4a', wrong: '#b05555' },
  dark: { bg: '#1a1612', surface: '#2b2419', surface2: '#3a3126', ink: '#f0e6d2', inkSoft: '#b8a890', correct: '#7ba87b', wrong: '#d89090' },
});
const MIN_TEXT = 4.5;
const MIN_UI = 3;
const MIN_VERDICT_DISTANCE = 0.09;

// ── Colour math ─────────────────────────────────────────────────────────────
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex(rgb) {
  return `#${rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;
}
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => toLin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function mix(a, b, f) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v * f + B[i] * (1 - f)));
}

/** OKLCH -> linear sRGB (Björn Ottosson's matrices). */
function oklchToLinear(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
/** The hex of an OKLCH colour, or null when it lies outside sRGB. */
export function oklchToHex(L, C, h) {
  const lin = oklchToLinear(L, C, h);
  if (lin.some((v) => v < -1e-4 || v > 1 + 1e-4)) return null;
  return rgbToHex(lin.map((v) => fromLin(Math.min(1, Math.max(0, v))) * 255));
}
export function hexToOklab(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => toLin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function oklabDistance(a, b) {
  const A = hexToOklab(a);
  const B = hexToOklab(b);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
}

// ── The search ──────────────────────────────────────────────────────────────
// Candidates ordered by how far they bend from the target (lightness first,
// then chroma), so the result is the closest colour that keeps every rule.
function nearest(h, target, test) {
  const cands = [];
  for (let dl = -0.3; dl <= 0.3001; dl += 0.01) {
    for (let c = target.C; c >= 0; c -= 0.01) {
      const L = target.L + dl;
      if (L <= 0.05 || L >= 0.98) continue;
      cands.push({ L, C: Math.max(0, c), cost: Math.abs(dl) + (target.C - c) * 3 });
    }
  }
  cands.sort((x, y) => x.cost - y.cost);
  for (const k of cands) {
    const hex = oklchToHex(k.L, k.C, h);
    if (hex && test(hex)) return hex;
  }
  return null;
}

// Text roles must hold on the plain surfaces and on chips tinted with 12% of
// either accent (a sage chip can carry gold text and the other way round).
const textOK = (hex, base, accents) => [base.bg, base.surface, base.surface2, ...accents.flatMap((a) => [mix(a, base.surface2, 0.12), mix(a, base.surface, 0.12)])]
  .every((s) => contrast(hex, s) >= MIN_TEXT);

/** One theme's accent roles for hue `h` (degrees). */
export function deriveTheme(h, theme) {
  const base = BASE[theme];
  const dark = theme === 'dark';
  const hue = ((Math.round(Number(h)) % 360) + 360) % 360;
  const farFromVerdicts = (hex) => oklabDistance(hex, base.correct) >= MIN_VERDICT_DISTANCE && oklabDistance(hex, base.wrong) >= MIN_VERDICT_DISTANCE;
  const onFill = dark ? base.bg : '#ffffff';
  // The accent: a fill for the primary button and the focus ring.
  const sage = nearest(hue, dark ? { L: 0.74, C: 0.11 } : { L: 0.5, C: 0.11 }, (hex) => (
    contrast(hex, base.bg) >= MIN_UI && contrast(hex, base.surface) >= MIN_UI
    && contrast(onFill, hex) >= MIN_TEXT && farFromVerdicts(hex)
  ));
  // The second accent sits 40 degrees round the wheel, softer. A fill too: a
  // label sits on it (chips, the streak flame), so it carries the same
  // on-colour as the accent.
  const goldHue = (hue + 40) % 360;
  const gold = nearest(goldHue, dark ? { L: 0.78, C: 0.09 } : { L: 0.56, C: 0.09 }, (hex) => contrast(hex, base.bg) >= MIN_UI && contrast(onFill, hex) >= MIN_TEXT);
  const sageText = nearest(hue, dark ? { L: 0.8, C: 0.1 } : { L: 0.46, C: 0.1 }, (hex) => textOK(hex, base, [sage, gold]));
  const goldText = nearest(goldHue, dark ? { L: 0.82, C: 0.08 } : { L: 0.45, C: 0.08 }, (hex) => textOK(hex, base, [sage, gold]));
  const sageSoft = oklchToHex(dark ? 0.38 : 0.82, 0.05, hue) || mix(sage, base.bg, 0.4);
  const goldSoft = oklchToHex(dark ? 0.4 : 0.87, 0.05, goldHue) || mix(gold, base.bg, 0.4);
  return {
    '--clr-sage': sage,
    '--clr-sage-text': sageText,
    '--clr-sage-soft': sageSoft,
    '--clr-sage-on': onFill,
    '--clr-gold': gold,
    '--clr-gold-text': goldText,
    '--clr-gold-soft': goldSoft,
    '--clr-gold-on': onFill,
    '--vmx-color-learning': sage,
    '--vmx-color-learning-on': onFill,
  };
}

export function deriveAccent(h) {
  return { hue: ((Math.round(Number(h)) % 360) + 360) % 360, light: deriveTheme(h, 'light'), dark: deriveTheme(h, 'dark') };
}

/** The stylesheet text for [data-palette="custom"], for both themes. */
export function accentCss(h) {
  const { light, dark } = deriveAccent(h);
  const body = (vars) => Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
  return `[data-palette="custom"]{${body(light)}}[data-theme="dark"][data-palette="custom"]{${body(dark)}}`;
}

/** The hue stored for "สีของฉัน", or null. Strict: an integer 0-359 only. */
export function parseHue(raw) {
  if (raw == null) return null;
  const s = String(raw);
  if (!/^\d{1,3}$/.test(s)) return null;
  const n = Number(s);
  return n >= 0 && n < 360 ? n : null;
}
