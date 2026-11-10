// ============================================================
// media-size.js: a question figure's pixel size, before its bytes
// ============================================================
// An <img> with no size is zero high until its file arrives, and then pushes
// the stem and the options down under the student's thumb. The media registry
// (docs/MEDIA.md) knows every figure's size. The question figures' sizes are
// one small generated module that arrives with the question banks
// (data/questions.js), so by the time a card can render, its figure's size is
// in memory and the card reads it without waiting for anything.
//
// An inline SVG figure (data/images-com.js) carries its size in its viewBox.
// A figure a student added to a question of their own has no size here and
// shows as it did before.
// ============================================================

let sizes = null;
let pending = null;

/** Whether the sizes are in memory: after this, an unknown figure is one the registry does not hold. */
export const mediaSizesLoaded = () => sizes !== null;

/** Starts the sizes loading, once. Never rejects: without them a figure still shows. */
export function loadMediaSizes() {
  if (!pending) {
    pending = import('../data/media-sizes.generated.js')
      .then((m) => { sizes = m.QUESTION_MEDIA_SIZES; })
      .catch(() => { pending = null; });
  }
  return pending;
}

// The start of an inline SVG, decoded. A cut that lands inside an escaped
// character is moved back to before it.
function svgHead(src) {
  let head = src.slice(0, 400);
  for (let i = 0; i < 5; i++) {
    try { return decodeURIComponent(head); } catch { head = head.slice(0, head.lastIndexOf('%')); }
  }
  return '';
}

/** { width, height } in pixels for a figure whose size is known, else null. */
export function mediaSize(src) {
  if (typeof src !== 'string' || !src) return null;
  if (src.startsWith('data:')) {
    if (!src.startsWith('data:image/svg+xml')) return null;
    const box = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(svgHead(src));
    const width = box ? Number(box[1]) : 0;
    const height = box ? Number(box[2]) : 0;
    return width > 0 && height > 0 ? { width, height } : null;
  }
  const hit = sizes && sizes[src.split(/[?#]/)[0]];
  return hit ? { width: hit[0], height: hit[1] } : null;
}
