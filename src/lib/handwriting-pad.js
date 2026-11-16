// ============================================================
// handwriting-pad.js — the pure parts of the handwriting pad
// ============================================================
// HandwritingInput.jsx draws; these decide what gets drawn and how the
// drawing leaves the device. Kept apart so they can be tested without a
// canvas: which pointers count once an Apple Pencil is in play, how wide a
// stroke is at a given pressure, where the ink is, and how large the model
// should see it — Thai tone marks and short vowels are the first thing a
// small image loses, and they change the word.
// ============================================================

/** Pointer policy: once a pen has touched the pad, fingers are ignored until
 *  the pad is cleared. The palm resting beside an Apple Pencil arrives as a
 *  touch pointer, and it used to scribble across the writing. */
export function createPointerPolicy() {
  let penSeen = false;
  return {
    accept(pointerType) {
      if (pointerType === 'pen') { penSeen = true; return true; }
      if (pointerType === 'touch') return !penSeen;
      return true;
    },
    reset() { penSeen = false; },
    get penSeen() { return penSeen; },
  };
}

/** Stroke width in CSS px. A pen varies with pressure (light 1.6, firm 4.2);
 *  a finger or a mouse, which report no real pressure, draws a steady 3. */
export function strokeWidth(pointerType, pressure) {
  if (pointerType !== 'pen' || !(pressure > 0)) return 3;
  return 1.6 + Math.min(1, pressure) * 2.6;
}

/** Pad height in CSS px: room for two or three lines of Thai on a phone,
 *  more on a tablet where the pen is. */
export function padHeight(viewportWidth) {
  return viewportWidth >= 768 ? 380 : 300;
}

/** The box around every stroke point (each point is [x, y, width]), grown by
 *  `margin` and clamped to the pad. Null when nothing was drawn. */
export function inkBounds(strokes, { margin = 24, width = Infinity, height = Infinity } = {}) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const pts of strokes) {
    for (const [x, y, w = 3] of pts) {
      const r = w / 2;
      if (x - r < minX) minX = x - r;
      if (y - r < minY) minY = y - r;
      if (x + r > maxX) maxX = x + r;
      if (y + r > maxY) maxY = y + r;
    }
  }
  if (!(minX <= maxX)) return null;
  const x0 = Math.max(0, Math.floor(minX - margin));
  const y0 = Math.max(0, Math.floor(minY - margin));
  const x1 = Math.min(width, Math.ceil(maxX + margin));
  const y1 = Math.min(height, Math.ceil(maxY + margin));
  return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}

/** Scale that fits a w x h image to what the model reads at full detail:
 *  at most `long` px on the long side and `pixels` in all (Anthropic resizes
 *  anything larger, so pixels past that are lost, not read). The pad's ink
 *  is enlarged up to `max`; a photo is only ever shrunk (max 1, min 0). */
export function fitScale(w, h, { long = 1568, pixels = 1_150_000, min = 1, max = 4 } = {}) {
  const W = Math.max(1, w), H = Math.max(1, h);
  let s = Math.min(max, long / Math.max(W, H));
  if (W * H * s * s > pixels) s = Math.sqrt(pixels / (W * H));
  return Math.max(min, s);
}
