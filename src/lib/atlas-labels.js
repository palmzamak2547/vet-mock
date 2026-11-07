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
