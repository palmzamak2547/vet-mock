// ============================================================
// atlas.js — glyphs measured, not guessed
// ============================================================
// A density ramp is only as smooth as its glyphs' real ink. Each candidate is
// drawn at the exact device cell size and its covered fraction measured; the
// ramp keeps the glyphs closest to evenly spaced coverage targets, so a step
// in light is a step in ink on every font a device happens to ship.
//
// Layout of the single-row texture (index = column):
//   0                 empty
//   1 .. K            density ramp, least ink first
//   K+1 .. K+4        edge strokes: - / | \  (line at 0, 45, 90, 135 degrees)
//   K+5 .. K+7        water light: . : +
//   K+8               spark (bioluminescence)
//   K+9               mote (marine snow)

const CANDIDATES = [".", "'", ',', ':', ';', '-', '~', '=', '+', '^', 'c', 'o', 'x', 's', 'a', 'e', 'z', 'v', '*', '%', '#', '@', '&', '8', 'B', 'N', 'M', 'W', 'X', 'H'];
const EDGES = ['-', '/', '|', '\\'];
const WATER = ['.', ':', '+'];
const SPARK = '*';
const MOTE = '.';
export const RAMP_SIZE = 14;

export function glyphLayout() {
  const K = RAMP_SIZE;
  return { K, edge0: K + 1, water0: K + 5, spark: K + 8, count: K + 10 };
}

function measure(ctx, ch, cp) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cp, cp);
  ctx.fillStyle = '#fff';
  drawCentered(ctx, ch, 0, cp);
  const d = ctx.getImageData(0, 0, cp, cp).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) sum += d[i];
  return sum / (255 * cp * cp);
}

function drawCentered(ctx, ch, x0, cp) {
  const m = ctx.measureText(ch);
  const asc = m.actualBoundingBoxAscent || cp * 0.5;
  const desc = m.actualBoundingBoxDescent || 0;
  const left = m.actualBoundingBoxLeft || 0;
  const right = m.actualBoundingBoxRight || m.width;
  // centre the INK box, not the advance box: a '.' sits mid-tile like a '#'
  const x = x0 + cp / 2 - (right - left) / 2 + left;
  const y = cp / 2 + (asc - desc) / 2;
  ctx.fillText(ch, x, y);
}

/**
 * @param {number} cp  cell size in device pixels
 * @param {string} family  CSS font family for the glyphs
 * @returns {{ canvas: HTMLCanvasElement, layout: ReturnType<typeof glyphLayout>, coverage: number[] }}
 */
export function buildAtlas(cp, family) {
  const layout = glyphLayout();
  const work = document.createElement('canvas');
  work.width = cp;
  work.height = cp;
  const wctx = work.getContext('2d', { willReadFrequently: true });
  const font = `500 ${Math.max(6, Math.round(cp * 0.82))}px ${family}`;
  wctx.font = font;
  wctx.textBaseline = 'alphabetic';
  const measured = CANDIDATES.map((ch) => ({ ch, c: measure(wctx, ch, cp) })).filter((g) => g.c > 0.004);
  measured.sort((a, b) => a.c - b.c);
  const lo = measured[0].c;
  const hi = measured[measured.length - 1].c;
  const ramp = [];
  const used = new Set();
  for (let i = 0; i < layout.K; i++) {
    const target = lo + ((hi - lo) * i) / (layout.K - 1);
    let best = null;
    for (const g of measured) {
      if (used.has(g.ch)) continue;
      if (!best || Math.abs(g.c - target) < Math.abs(best.c - target)) best = g;
    }
    if (!best) break;
    used.add(best.ch);
    ramp.push(best);
  }
  ramp.sort((a, b) => a.c - b.c);
  while (ramp.length < layout.K) ramp.push(ramp[ramp.length - 1]);

  const glyphs = [' ', ...ramp.map((g) => g.ch), ...EDGES, ...WATER, SPARK, MOTE];
  const canvas = document.createElement('canvas');
  canvas.width = cp * glyphs.length;
  canvas.height = cp;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, cp);
  ctx.fillStyle = '#fff';
  ctx.font = font;
  ctx.textBaseline = 'alphabetic';
  glyphs.forEach((ch, i) => { if (ch !== ' ') drawCentered(ctx, ch, i * cp, cp); });
  return { canvas, layout, coverage: ramp.map((g) => g.c) };
}
