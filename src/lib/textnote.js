// textnote: typed text placed on a page, beside the ink.
//
// Stored as a stroke so it syncs, tombstones, undoes and moves with the lasso:
//   { mode: 'text', points: [[x, y]], text, color, size, w }
// (x, y) is the top-left of the text in normalised page space, `w` the wrap
// width as a share of the page width, `size` the same 1-10 scale as the pen
// (a lasso resize multiplies it, see lasso.transformStroke).
//
// It is painted into the ink canvas, so the exported PDF carries it with no
// extra work; while it is being edited the reader shows a real text box over
// the same spot instead.

const FONT = '"Sarabun", "IBM Plex Sans Thai", system-ui, sans-serif';
export const TEXT_WIDTH = 0.5; // a new note wraps at half the page

export const isTextNote = (stroke) => stroke?.mode === 'text';

/** Font height in canvas px for a note on a canvas `canvasH` px tall. */
export const fontPx = (stroke, canvasH) => Math.max(6, (stroke.size || 3) * 0.008 * canvasH);
export const textFont = (stroke, canvasH) => `500 ${fontPx(stroke, canvasH)}px ${FONT}`;

export function makeTextNote(at, text, { id, color, size = 3, w = TEXT_WIDTH }) {
  const t = String(text || '').replace(/\r/g, '').replace(/\s+$/, '');
  if (!t.trim()) return null;
  const x = Math.min(0.98, Math.max(0, at[0]));
  const y = Math.min(0.98, Math.max(0, at[1]));
  return { id, mode: 'text', points: [[x, y]], text: t.slice(0, 2000), color, size, w: Math.min(w, 1 - x) };
}

// Thai has no spaces between words: break on word boundaries where the
// browser can find them, else between characters.
function units(line) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return [...new Intl.Segmenter('th', { granularity: 'word' }).segment(line)].map((s) => s.segment);
  }
  return line.split(/(\s+)/).filter(Boolean);
}

/** Lines that fit `maxWidth` by `measure(text) -> px`. Pure, given measure. */
export function wrapLines(text, maxWidth, measure) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const u of units(para)) {
      const next = line + u;
      if (line && measure(next) > maxWidth) {
        out.push(line.replace(/\s+$/, ''));
        line = u.replace(/^\s+/, '');
      } else {
        line = next;
      }
      // A unit wider than the whole line (a long English word) is split by
      // characters rather than left to run off the page.
      while (line.length > 1 && measure(line) > maxWidth) {
        let cut = line.length - 1;
        while (cut > 1 && measure(line.slice(0, cut)) > maxWidth) cut -= 1;
        out.push(line.slice(0, cut));
        line = line.slice(cut);
      }
    }
    out.push(line);
  }
  return out;
}

/** The page area a note covers, normalised: { x, y, w, h }. For tap-to-edit. */
export function textNoteBox(stroke, canvasW, canvasH, measure) {
  const px = fontPx(stroke, canvasH);
  const lines = wrapLines(stroke.text, (stroke.w || TEXT_WIDTH) * canvasW, measure);
  const width = Math.max(...lines.map((l) => measure(l)), px);
  const [x, y] = stroke.points[0];
  return { x, y, w: width / canvasW, h: (lines.length * px * 1.45) / canvasH };
}

/** The topmost note under `at` on a page `W` x `H` px, or null. */
export function textNoteAt(list, at, W, H, ctx) {
  const pad = 0.01;
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const st = list[i];
    if (!isTextNote(st)) continue;
    ctx.font = textFont(st, H);
    const b = textNoteBox(st, W, H, (s) => ctx.measureText(s).width);
    if (at[0] >= b.x - pad && at[0] <= b.x + b.w + pad && at[1] >= b.y - pad && at[1] <= b.y + b.h + pad) return st;
  }
  return null;
}

/** Paints a note into a 2D context (the ink canvas or the export). */
export function drawTextNote(ctx, stroke, canvasW, canvasH) {
  const px = fontPx(stroke, canvasH);
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.fillStyle = stroke.color || '#222';
  ctx.font = textFont(stroke, canvasH);
  ctx.textBaseline = 'top';
  const lines = wrapLines(stroke.text, (stroke.w || TEXT_WIDTH) * canvasW, (s) => ctx.measureText(s).width);
  const [x, y] = stroke.points[0];
  // Half the leading above each line, as CSS puts it, so the painted text sits
  // where the editor showed it.
  lines.forEach((line, i) => ctx.fillText(line, x * canvasW, y * canvasH + (i * 1.45 + 0.225) * px));
  ctx.restore();
}
