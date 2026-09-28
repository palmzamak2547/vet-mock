// Colours, shapes and type for the chart kit [M2-DESIGN.md 8.1]. Groups get an Okabe-Ito colour AND a
// shape, so a chart reads without colour (colour-blind readers, a black-and-white print). The theme
// colours repeat the tokens' ink and paper (styles/tokens.css) for the standalone SVG, where no CSS
// variable survives; tests/unit/graphs-palette.test.mjs keeps the two in step. On screen the renderer
// uses the CSS variables instead, so the chart follows the light or dark theme without a rebuild.
// OWNER: graphs role.

/**
 * Okabe and Ito (2008), "Color Universal Design", in the order groups receive them. Black is left out
 * of the group colours (it is the ink); the eighth group uses the ink colour.
 */
export const OKABE_ITO = Object.freeze({
  blue: '#0072B2',
  vermillion: '#D55E00',
  bluishGreen: '#009E73',
  reddishPurple: '#CC79A7',
  orange: '#E69F00',
  skyBlue: '#56B4E9',
  yellow: '#F0E442',
  black: '#000000',
});

/** Series colours by group index (token 's0'..'s7'); 's7' is the ink of the theme. */
export const SERIES = Object.freeze([
  OKABE_ITO.blue, OKABE_ITO.vermillion, OKABE_ITO.bluishGreen, OKABE_ITO.reddishPurple,
  OKABE_ITO.orange, OKABE_ITO.skyBlue, OKABE_ITO.yellow, null,
]);

/** Marker shapes by group index, in the same order as the colours. */
export const SHAPES = Object.freeze(['circle', 'square', 'triangle', 'diamond', 'triangleDown', 'hexagon', 'plus', 'pentagon']);

/**
 * Theme colours for standalone SVG. light and dark repeat tokens.css (--rs-surface, --rs-ink,
 * --rs-ink-soft, --rs-line); print is white paper and black ink, what a journal expects.
 */
export const THEMES = Object.freeze({
  light: Object.freeze({ paper: '#fdf8ef', ink: '#2b2419', soft: '#5c4f3d', line: '#d8c9a8' }),
  dark: Object.freeze({ paper: '#2b2419', ink: '#f0e6d2', soft: '#b8a890', line: '#524332' }),
  print: Object.freeze({ paper: '#ffffff', ink: '#000000', soft: '#444444', line: '#bdbdbd' }),
});

/** CSS variables the on-screen renderer uses for each colour token. */
export const CSS_VARS = Object.freeze({
  paper: 'var(--rs-surface)',
  ink: 'var(--rs-ink)',
  soft: 'var(--rs-ink-soft)',
  line: 'var(--rs-line)',
  s0: 'var(--rs-chart-s0)',
  s1: 'var(--rs-chart-s1)',
  s2: 'var(--rs-chart-s2)',
  s3: 'var(--rs-chart-s3)',
  s4: 'var(--rs-chart-s4)',
  s5: 'var(--rs-chart-s5)',
  s6: 'var(--rs-chart-s6)',
  s7: 'var(--rs-ink)',
});

/** The font stack of every chart (Sarabun is the site's font; the rest keep Thai readable without it). */
export const FONT = "Sarabun, 'TH Sarabun New', Tahoma, 'Leelawadee UI', sans-serif";

/** Colour token of group i (wraps after eight; the shape repeats with it, which the legend shows). */
export function seriesToken(i) {
  return `s${((i % 8) + 8) % 8}`;
}

/** Shape of group i. */
export function seriesShape(i) {
  return SHAPES[((i % 8) + 8) % 8];
}

/**
 * Resolve a colour token for a theme: 'paper', 'ink', 'soft', 'line', 's0'..'s7', or 'none'.
 * Anything else passes through unchanged (a literal such as 'none').
 * @param {string} token
 * @param {'light'|'dark'|'print'|'screen'} theme  'screen' gives CSS variables
 */
export function resolveColor(token, theme) {
  if (token === undefined || token === null) return undefined;
  if (theme === 'screen') return CSS_VARS[token] ?? token;
  const th = THEMES[theme] || THEMES.light;
  if (token in th) return th[token];
  const m = /^s([0-7])$/.exec(token);
  if (m) return SERIES[Number(m[1])] ?? th.ink;
  return token;
}

/**
 * SVG path of a marker centred on (x, y) with radius r (the circle's radius; the other shapes have the
 * same area within a few per cent, so no group looks larger than another).
 * @returns {{ t: 'circle', a: object }|{ t: 'path', a: object }}
 */
export function markerNode(shape, x, y, r, attrs = {}) {
  const f = (v) => Math.round(v * 100) / 100;
  if (shape === 'circle') return { t: 'circle', a: { cx: f(x), cy: f(y), r: f(r), ...attrs } };
  const poly = (pts) => ({ t: 'path', a: { d: `M${pts.map(([px, py]) => `${f(x + px)} ${f(y + py)}`).join('L')}Z`, ...attrs } });
  const regular = (n, rot, rad) => Array.from({ length: n }, (_v, k) => {
    const ang = rot + (2 * Math.PI * k) / n;
    return [rad * Math.cos(ang), rad * Math.sin(ang)];
  });
  switch (shape) {
    case 'square': {
      const s = r * 0.886;
      return poly([[-s, -s], [s, -s], [s, s], [-s, s]]);
    }
    case 'diamond': {
      const s = r * 1.253;
      return poly([[0, -s], [s, 0], [0, s], [-s, 0]]);
    }
    case 'triangle':
      return poly(regular(3, -Math.PI / 2, r * 1.555));
    case 'triangleDown':
      return poly(regular(3, Math.PI / 2, r * 1.555));
    case 'hexagon':
      return poly(regular(6, 0, r * 1.1));
    case 'pentagon':
      return poly(regular(5, -Math.PI / 2, r * 1.15));
    case 'plus': {
      const a = r * 1.2;
      const b = r * 0.395;
      return poly([[-b, -a], [b, -a], [b, -b], [a, -b], [a, b], [b, b], [b, a], [-b, a], [-b, b], [-a, b], [-a, -b], [-b, -b]]);
    }
    default:
      return { t: 'circle', a: { cx: f(x), cy: f(y), r: f(r), ...attrs } };
  }
}
