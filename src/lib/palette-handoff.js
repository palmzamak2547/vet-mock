// ============================================================
// palette-handoff — what the search frame passes to the real palette
// ============================================================
// The search palette is a lazy chunk. On a cold phone it can take seconds to
// arrive, so a tap or Ctrl+K puts PaletteFrame (in the entry chunk) on screen
// at once with a focused box. What the student types there, and the control
// focus returns to on close, wait here until CommandPalette mounts and takes
// them. Pure module state: one palette, one frame, at most one handoff.
// ============================================================

let handoff = null;

/** The frame opened: remember where focus goes back to. Kept across a retry. */
export function beginPaletteHandoff(returnTarget) {
  if (handoff) return handoff;
  handoff = { text: '', returnTarget: returnTarget || null };
  return handoff;
}

/** The frame's box changed. */
export function setPaletteHandoffText(text) {
  if (handoff) handoff.text = String(text ?? '');
}

/** Read without clearing: a render may run twice (StrictMode), the clear is
 *  the mount effect's job. */
export function peekPaletteHandoff() {
  return handoff;
}

/** The palette mounted, or the frame closed: nothing waits any more. */
export function clearPaletteHandoff() {
  handoff = null;
}
