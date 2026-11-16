// ============================================================
// hand-policy.js — which pointer marks on a reading surface
// ============================================================
// Used by the case reader only (CasePane, CaseSheet, ink/case-hand.js), so it
// lives apart from handwriting-pad.js: the answer pad sits in the exam's own
// chunk, and a module that both share is split into one more file that Home
// fetches when it warms the exam view up.
// ============================================================

/** The device remembers that it has a pen: one rule for every surface that writes. */
export const PEN_SEEN_KEY = 'vmx-ink-pen-seen';

/**
 * The hand on a reading surface (the case reader design,
 * section 3): a pen always marks with the tool in hand and a finger always
 * moves the page, so there is no mode to switch. A device that never showed
 * a pen gets one switch that lets one finger write. A mouse marks with its
 * left button. Once a pen has been seen on the device a touch never marks:
 * the palm resting beside the nib arrives as a touch.
 * `marks(pointerType, { button, writeSwitch })` is true when that pointer marks.
 */
export function createHandPolicy(storage = null) {
  let penSeen = false;
  try { penSeen = storage?.getItem(PEN_SEEN_KEY) === '1'; } catch { penSeen = false; }
  return {
    marks(pointerType, { button = 0, writeSwitch = false } = {}) {
      if (pointerType === 'pen') {
        if (!penSeen) {
          penSeen = true;
          try { storage?.setItem(PEN_SEEN_KEY, '1'); } catch { /* remembered for this page only */ }
        }
        return true;
      }
      if (pointerType === 'mouse') return button === 0;
      if (pointerType === 'touch') return !penSeen && writeSwitch;
      return false;
    },
    /** The finger-writing switch is offered only where no pen was ever seen. */
    get offersSwitch() { return !penSeen; },
    get penSeen() { return penSeen; },
  };
}
