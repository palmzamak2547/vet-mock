// tape: strips laid over a page to hide an answer until it is tapped.
//
// A tape is stored as a stroke ({ mode: 'tape', points: [[x0, y0], [x1, y1]] },
// normalised page space), so it syncs, tombstones, undoes and moves with the
// lasso exactly like ink. It is never painted into the ink canvas or the
// exported PDF: the reader draws it as its own layer, and whether it is
// peeled is the student's state for this sitting only, so every visit to a
// deck starts with every answer covered again.

// Washi colours, light enough to read as tape and opaque enough to hide text.
// Real colour values, not theme tokens: like PEN_COLORS they are stored in the
// stroke and must paint the same on every device (hex-budget baseline: 4).
export const TAPE_COLORS = [
  { id: 'butter', rgb: '#f3d77a', name: 'เหลือง' },
  { id: 'mint', rgb: '#a9dcc4', name: 'เขียว' },
  { id: 'rose', rgb: '#f2b4c4', name: 'ชมพู' },
  { id: 'sky', rgb: '#a9c9ec', name: 'ฟ้า' },
];

// Smaller than this (a share of the page) is a tap, not a strip.
const MIN_SIDE = 0.012;

export const isTape = (stroke) => stroke?.mode === 'tape';

/** The rectangle a tape covers, { x, y, w, h } in page space. */
export function tapeRect(stroke) {
  const [[ax, ay], [bx, by]] = stroke.points;
  const x = Math.min(ax, bx); const y = Math.min(ay, by);
  return { x, y, w: Math.abs(bx - ax), h: Math.abs(by - ay) };
}

/** A new tape from two corners, or null when it is too small to be meant. */
export function makeTape(a, b, { id, color }) {
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const x0 = clamp(Math.min(a[0], b[0])); const x1 = clamp(Math.max(a[0], b[0]));
  const y0 = clamp(Math.min(a[1], b[1])); const y1 = clamp(Math.max(a[1], b[1]));
  if (x1 - x0 < MIN_SIDE || y1 - y0 < MIN_SIDE) return null;
  return { id, mode: 'tape', color, size: 1, points: [[x0, y0], [x1, y1]] };
}
