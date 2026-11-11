// ============================================================
// slide-figure-shape.mjs: a drawn shape is not a figure
// ============================================================
// A slide puts a photograph on a dark rounded backdrop, points at it with an
// arrow, and stands a triangle or a gradient bar beside the text. A deck saves
// each of those as an image, so the extractor took them for figures: a note
// section of Aquatic fungi showed three black boxes and nothing else, and 33
// of that deck's 89 "figures" were such boxes.
//
// What tells a shape from a picture is in its pixels, and it is measured here.
// The numbers were set on 11 Nov 2026 from all 1,833 deck figures. The rule
// took 75 of them; all 75 and the 38 pictures nearest to it were looked at one
// by one, and none of the 75 was a picture.
//
//   flat     a mask (57). At most MAX_COLOURS colours, its three commonest
//            tones hold FLAT_TONES of it and its two commonest exact colours
//            FLAT_EXACT. The 54 backdrops are #333333 on #000000 and measure
//            7 to 11 colours, 96.4% to 98.4% and 64.5% to 84.0%; two
//            silhouettes cut for a photograph and a white triangle measure
//            the same.
//   smooth   a filled shape or a gradient (18). SMOOTH of its pixels sit
//            within STEP levels of the pixel on their left and the one above,
//            and three tones hold SMOOTH_TONES of it: arrows, triangles, a
//            disc, rounded panels (95.8% to 98.1%, and 94.5% or more). Or
//            GRADIENT of them do, whatever the tones: two dark vignettes and
//            three bars shading from blue to black all measure 100%.
//   blank    one flat colour: BLANK of it is one tone, and it is as smooth as
//            a shape. None on 11 Nov 2026; the fullest picture, a line
//            drawing, is 93.3% paper.
//
// What it must never take, and what keeps each (docs/MEDIA.md names the
// nearest pictures on each side of every number):
//   a photograph, a micrograph   no two exact colours cover much of one (a
//                                green fluorescence field: 12.6%, with 14
//                                colours), and the smoothest of them, a test
//                                tube on a white bench, is 97.1% smooth with
//                                77.8% in three tones
//   a chart, a table, a drawing  it is on paper: a picture PAPER or more white
//                                is kept whatever else it measures (a standard
//                                curve has 8 colours and 98.3% in three tones,
//                                and is 95.5% paper)
//   a dark drawing or scan       16 colours or more and under 95% in three
//                                tones (a dog drawn on black: 25 and 94.3%);
//                                a grey micrograph of 11 colours has 92.9% in
//                                three tones and 40.1% in two exact colours
//
// A real figure the rule would take goes in KEEP_FLAT in
// scripts/extract-slide-figures.mjs, with what it shows.
// ============================================================

import sharp from 'sharp';

export const SHAPE_RULE = {
  /** A pixel within this many levels of a tone, on every channel, belongs to that tone. */
  NEAR: 10,
  /** A pixel within this many levels of its left and upper neighbours, on every channel, is smooth. */
  STEP: 3,
  /** A colour is five bits a channel, and counts when it holds this share of the picture. */
  COLOUR_SHARE: 0.001,
  MAX_COLOURS: 12,
  FLAT_TONES: 0.95,
  FLAT_EXACT: 0.6,
  SMOOTH: 0.95,
  SMOOTH_TONES: 0.93,
  GRADIENT: 0.985,
  BLANK: 0.995,
  /** White is every channel at this level or above; a picture this much white is drawn on paper. */
  WHITE: 235,
  PAPER: 0.5,
  /** About this many pixels are read from a picture, on an even grid. */
  SAMPLES: 200_000,
};

/**
 * What a picture's pixels measure. `data` is RGB, three bytes a pixel, with
 * any transparency already flattened on white.
 *
 * @returns {{ smooth: number, tones: [number, number, number], colours: number, exact: number, paper: number, samples: number }}
 *   smooth   share of pixels within STEP of the pixel on their left and the one above
 *   tones    share within NEAR of the commonest colour, of the two commonest, of the three
 *   colours  five-bit colours that each hold COLOUR_SHARE of the picture
 *   exact    share that is exactly one of the two commonest colours
 *   paper    share that is white
 */
export function pictureStats({ data, width, height }, rule = SHAPE_RULE) {
  const stride = Math.max(1, Math.ceil(Math.sqrt((width * height) / rule.SAMPLES)));
  const row = width * 3;
  // The sampled pixels, each with its own left and upper neighbour in the full picture.
  const at = [];
  for (let y = 1; y < height; y += stride) for (let x = 1; x < width; x += stride) at.push((y * width + x) * 3);
  const n = at.length;
  if (!n) return { smooth: 1, tones: [1, 1, 1], colours: 1, exact: 1, paper: 0, samples: 0 };

  let smooth = 0;
  let paper = 0;
  const bins = new Uint32Array(32768);
  const exactCount = new Map();
  for (let s = 0; s < n; s++) {
    const i = at[s];
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const l = i - 3;
    const u = i - row;
    if (Math.abs(r - data[l]) <= rule.STEP && Math.abs(g - data[l + 1]) <= rule.STEP && Math.abs(b - data[l + 2]) <= rule.STEP
      && Math.abs(r - data[u]) <= rule.STEP && Math.abs(g - data[u + 1]) <= rule.STEP && Math.abs(b - data[u + 2]) <= rule.STEP) smooth++;
    if (r >= rule.WHITE && g >= rule.WHITE && b >= rule.WHITE) paper++;
    bins[((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)]++;
    const key = (r << 16) | (g << 8) | b;
    exactCount.set(key, (exactCount.get(key) || 0) + 1);
  }

  let colours = 0;
  for (let k = 0; k < bins.length; k++) if (bins[k] / n >= rule.COLOUR_SHARE) colours++;

  let first = 0;
  let second = 0;
  for (const c of exactCount.values()) {
    if (c > first) { second = first; first = c; } else if (c > second) second = c;
  }

  // The commonest five-bit colour, and every pixel near its centre; then the same among the rest, twice.
  const taken = new Uint8Array(n);
  const tones = [];
  let held = 0;
  for (let t = 0; t < 3; t++) {
    const left = new Uint32Array(32768);
    for (let s = 0; s < n; s++) {
      if (taken[s]) continue;
      const i = at[s];
      left[((data[i] >> 3) << 10) | ((data[i + 1] >> 3) << 5) | (data[i + 2] >> 3)]++;
    }
    let best = 0;
    for (let k = 1; k < left.length; k++) if (left[k] > left[best]) best = k;
    if (left[best] > 0) {
      const r = ((best >> 10) & 31) * 8 + 4;
      const g = ((best >> 5) & 31) * 8 + 4;
      const b = (best & 31) * 8 + 4;
      for (let s = 0; s < n; s++) {
        if (taken[s]) continue;
        const i = at[s];
        if (Math.abs(data[i] - r) <= rule.NEAR && Math.abs(data[i + 1] - g) <= rule.NEAR && Math.abs(data[i + 2] - b) <= rule.NEAR) { taken[s] = 1; held++; }
      }
    }
    tones.push(held / n);
  }
  return { smooth: smooth / n, tones, colours, exact: (first + second) / n, paper: paper / n, samples: n };
}

/**
 * What kind of shape the measures describe: 'blank', 'flat' or 'smooth'; null
 * for a picture. A picture on paper is never a flat or a smooth shape; a blank
 * sheet is blank.
 */
export function shapeKind(stats, rule = SHAPE_RULE) {
  // One tone and nothing in it. A dark field with grain and a few bright cells
  // is one tone too, and is a micrograph: its grain is what tells it apart.
  if (stats.tones[0] >= rule.BLANK && stats.smooth >= rule.SMOOTH) return 'blank';
  if (stats.paper >= rule.PAPER) return null;
  if (stats.colours <= rule.MAX_COLOURS && stats.tones[2] >= rule.FLAT_TONES && stats.exact >= rule.FLAT_EXACT) return 'flat';
  if (stats.smooth >= rule.GRADIENT || (stats.smooth >= rule.SMOOTH && stats.tones[2] >= rule.SMOOTH_TONES)) return 'smooth';
  return null;
}

/** One line of a shape's measures, for a report. */
export function describeShape(kind, stats) {
  const pct = (x) => `${(x * 100).toFixed(1)}%`;
  if (kind === 'blank') return `one flat colour: ${pct(stats.tones[0])} of it is one tone`;
  if (kind === 'flat') return `a flat mask: ${stats.colours} colours, ${pct(stats.tones[2])} in three tones, ${pct(stats.exact)} in two exact colours`;
  return `a smooth shape: ${pct(stats.smooth)} of it shades into its neighbours, ${pct(stats.tones[2])} in three tones`;
}

/** The measures and the verdict for an image file or buffer. */
export async function measureShape(input, rule = SHAPE_RULE) {
  const { data, info } = await sharp(input).rotate().flatten({ background: '#ffffff' }).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 3) throw new Error(`expected three channels, got ${info.channels}`);
  const stats = pictureStats({ data, width: info.width, height: info.height }, rule);
  return { kind: shapeKind(stats, rule), stats };
}
