// ============================================================
// phase-return.js — where the phase picker sends a student after a pick
// ============================================================
// The topic screen sends a student to the phase picker when the subject has
// nothing on the paper in scope ("เปลี่ยนช่วงสอบ"). Landing them on Home
// afterwards threw away the subject they had just opened. The origin leaves
// its name here, the picker takes it on the pick and goes back there.
// sessionStorage, so a closed tab forgets it; a view that is not on the list
// is never stored, so a stale or forged value cannot route anywhere odd.
// ============================================================

export const PHASE_RETURN_KEY = 'vmx-phase-return';
const RETURN_VIEWS = new Set(['topic-select']);

const store = () => (typeof sessionStorage !== 'undefined' ? sessionStorage : null);

export function rememberPhaseReturn(view, storage = store()) {
  try { if (RETURN_VIEWS.has(view)) storage?.setItem(PHASE_RETURN_KEY, view); } catch { /* nicety */ }
}

export function peekPhaseReturn(storage = store()) {
  try {
    const view = storage?.getItem(PHASE_RETURN_KEY);
    return RETURN_VIEWS.has(view) ? view : null;
  } catch { return null; }
}

export function takePhaseReturn(storage = store()) {
  const view = peekPhaseReturn(storage);
  try { storage?.removeItem(PHASE_RETURN_KEY); } catch { /* nicety */ }
  return view;
}
