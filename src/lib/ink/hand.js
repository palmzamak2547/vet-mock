// ============================================================
// ink/hand.js — which pointers count once a pen is in play
// ============================================================
// Kept apart from the engine so the handwriting pad's pure helpers can
// re-export it without pulling the whole pointer loop into the exam card.
// ============================================================

/** Pointer policy: once a pen has touched the surface, fingers are ignored
 *  until it is reset. The palm resting beside an Apple Pencil arrives as a
 *  touch pointer, and it used to scribble across the writing. A mouse always
 *  counts. */
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
