// Pure label-layer helpers. No three.js import anywhere in this module, so the
// node --test suite can exercise every rule without a browser.

// Collapse labels to anchor dots below this stage size (owner decision 3). The
// number is measured on the real 320 px layout and pinned by test; the tests
// assert behavior relative to the constant so the measured value can move.
export const DENSITY_THRESHOLD_PX = 480;

/**
 * Presentation state machine for the label layer.
 * Returns 'hidden' | 'dots' | 'text'.
 *  - Explore only: any other mode (compare, recall, unknown) is off entirely.
 *  - Static/error/loading scenes hide the layer (the scene unmounts in static mode).
 *  - Exploded models hide labels for v1: anchors ride the group matrix and would
 *    detach from their per-mesh explode offsets (design B-1).
 *  - Below the density threshold every label is a dot; the hidden toggle state
 *    also keeps dots, so self-testing still has anchors to select (reveal =
 *    selection; no revealedIds state exists).
 */
export function labelPresentation({ mode, labelsVisible = true, stageSize = Infinity, exploded = 0, sceneReady = true }) {
  if (mode !== 'explore') return 'hidden';
  if (!sceneReady) return 'hidden';
  if (Number.isFinite(exploded) && exploded > 0) return 'hidden';
  if (stageSize < DENSITY_THRESHOLD_PX) return 'dots';
  return labelsVisible ? 'text' : 'dots';
}

/** Per-anchor visibility: the caller resolves clipping/frustum; this is the rule. */
export function anchorVisible({ visible = true, clipped = false, behindCamera = false, offFrustum = false }) {
  return Boolean(visible) && !clipped && !behindCamera && !offFrustum;
}

/**
 * World → NDC → CSS pixels. `matrix` is the 16-number column-major
 * view-projection matrix (three.js order). Returns {x, y} in CSS pixels, or
 * {behind: true} when the point is at or behind the camera.
 */
export function projectToScreen([x, y, z], matrix, width, height) {
  const cx = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
  const cy = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
  const cw = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  if (!(cw > 0)) return { behind: true };
  return { x: (cx / cw * 0.5 + 0.5) * width, y: (-cy / cw * 0.5 + 0.5) * height, behind: false };
}

const hit = (a, b, pad) => a.left < b.left + b.w + pad && b.left < a.left + a.w + pad && a.top < b.top + b.h + pad && b.top < a.top + a.h + pad;

// Whether the segment from (x1, y1) to (x2, y2) passes through the box (Liang-Barsky).
function segmentHits(box, { x1, y1, x2, y2 }, pad) {
  let t0 = 0;
  let t1 = 1;
  for (const [p, q] of [[x1 - x2, x1 - box.left + pad], [x2 - x1, box.left + box.w + pad - x1], [y1 - y2, y1 - box.top + pad], [y2 - y1, box.top + box.h + pad - y1]]) {
    if (!p) { if (q < 0) return false; continue; }
    const t = q / p;
    if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    if (t0 > t1) return false;
  }
  return t1 - t0 > 1e-6;
}

// Turns tried round a crowded name's own direction, in degrees.
const TURNS = [0, 12, -12, 24, -24, 36, -36, 48, -48, 60, -60, 75, -75, 90, -90, 120, -120, 150, -150, 180];

/**
 * Places every name so no two cross, and every name stays text. Each item is
 * {id, x, y, w, h}: the anchor point and the label's size, in stage pixels;
 * an item with `first: true` (the selected part) is placed before the rest.
 * A name with room sits straight above its point, else below, right or left
 * of it, clear of the other points. The names of a crowded cluster go out from
 * the cluster's middle, each along its own point's direction, with a leader
 * line back to the point that runs under no name where the stage allows it.
 * Returns {id, left, top, leader} per item; leader is null for a name straight
 * above its point, otherwise {x1, y1, x2, y2} from the point to the name's
 * nearest edge.
 */
export function placeLabels(items, { width = Infinity, height = Infinity, gap = 6, pad = 2, clearance = 10 } = {}) {
  const fit = (left, top, w, h) => ({
    left: Math.min(Math.max(left, 0), Math.max(width - w, 0)),
    top: Math.min(Math.max(top, 0), Math.max(height - h, 0)),
    w,
    h,
  });
  const placed = [];
  const leaders = [];
  const spot = new Map();
  const lineOf = (box, { x, y }) => ({ x1: x, y1: y, x2: Math.min(Math.max(x, box.left), box.left + box.w), y2: Math.min(Math.max(y, box.top), box.top + box.h) });
  const free = (box) => !placed.some((other) => hit(box, other, pad));
  const clear = (box, item) => items.every((o) => o === item || !hit(box, { left: o.x, top: o.y, w: 0, h: 0 }, clearance));
  const clean = (box, item) => free(box)
    && !leaders.some((line) => segmentHits(box, line, pad))
    && !placed.some((other) => segmentHits(other, lineOf(box, item), 0));
  const put = (item, box, above) => {
    placed.push(box);
    const leader = above ? null : lineOf(box, item);
    if (leader) leaders.push(leader);
    spot.set(item.id, { id: item.id, left: box.left, top: box.top, leader });
  };

  // First the names with room beside their own point.
  const crowded = [];
  for (const item of [...items].sort((a, b) => (b.first ? 1 : 0) - (a.first ? 1 : 0) || a.y - b.y || a.x - b.x)) {
    const { x, y, w, h } = item;
    const near = [[x - w / 2, y - gap - h], [x - w / 2, y + gap], [x + gap, y - h / 2], [x - gap - w, y - h / 2]];
    const index = near.findIndex(([left, top]) => {
      const box = fit(left, top, w, h);
      return (item.first || clear(box, item)) && clean(box, item);
    });
    if (index < 0) crowded.push(item);
    else {
      const box = fit(near[index][0], near[index][1], w, h);
      put(item, box, !index && box.left === near[0][0] && box.top === near[0][1]);
    }
  }

  // Then the crowded ones, outside the circle round the crowd's points, in
  // turn round it, so their lines fan out instead of crossing names.
  const n = crowded.length || 1;
  const cx = crowded.reduce((sum, item) => sum + item.x, 0) / n;
  const cy = crowded.reduce((sum, item) => sum + item.y, 0) / n;
  const angleOf = (item) => Math.atan2(item.y - cy, item.x - cx);
  const ring = Math.max(0, ...crowded.map((item) => Math.hypot(item.x - cx, item.y - cy)));
  const reach = Math.min(Math.max(width, height), 2000);
  for (const item of crowded.sort((a, b) => angleOf(a) - angleOf(b))) {
    const { w, h } = item;
    const candidates = [];
    for (let r = gap + 18; r <= reach; r += 14) {
      for (const turn of TURNS) {
        const a = angleOf(item) + (turn * Math.PI) / 180;
        const dx = Math.cos(a);
        const dy = Math.sin(a);
        const half = Math.min(w / 2 / Math.abs(dx), h / 2 / Math.abs(dy));
        candidates.push(fit(cx + dx * (ring + r + half) - w / 2, cy + dy * (ring + r + half) - h / 2, w, h));
      }
    }
    // A stage too full for every name keeps the name above its point.
    put(item, candidates.find((box) => clear(box, item) && clean(box, item))
      || candidates.find((box) => clean(box, item))
      || candidates.find(free)
      || fit(item.x - w / 2, item.y - gap - h, w, h), false);
  }
  return items.map((item) => spot.get(item.id));
}
