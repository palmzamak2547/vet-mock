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

// A shared /app/* link to a year-scoped page (study, review, progress, the
// leaderboard, the reading list) opened by someone who has not picked a year
// shows the front door first, and after the year (and phase) pick the student
// landed on Home, not the page the link named. The front door leaves that page
// here and the pick goes there. A tap inside the app to one of these pages
// leaves it the same way. Same rules as above: sessionStorage, these views only.
export const FRONT_DOOR_RETURN_KEY = 'vmx-front-door-return';
const FRONT_DOOR_VIEWS = new Set(['subject-select', 'sr-session', 'dashboard', 'leaderboard-global', 'reading-checklist']);
// The front door itself: the landing, sign-in and the terms read before it
// (the landing and the sign-in wall link to them), and the two pickers.
const FRONT_DOOR_FLOW = new Set(['landing', 'auth', 'privacy', 'year-select', 'phase-select']);
export const atFrontDoor = (view) => FRONT_DOOR_FLOW.has(view);

export function rememberFrontDoorReturn(view, storage = store()) {
  try { if (FRONT_DOOR_VIEWS.has(view)) storage?.setItem(FRONT_DOOR_RETURN_KEY, view); } catch { /* nicety */ }
}

// App calls this for every page it draws. The page waits only while the
// visitor is still at the front door. Any other page means they left another
// way (a subject card or the Lab on the landing, Back to the library), and a
// phase change made later in the tab must not open that old page instead of
// Home.
export function settleFrontDoorReturn(view, storage = store()) {
  if (atFrontDoor(view)) return;
  try { storage?.removeItem(FRONT_DOOR_RETURN_KEY); } catch { /* nicety */ }
}

export function takeFrontDoorReturn(storage = store()) {
  let view = null;
  try {
    view = storage?.getItem(FRONT_DOOR_RETURN_KEY);
    storage?.removeItem(FRONT_DOOR_RETURN_KEY);
  } catch { /* nicety */ }
  return FRONT_DOOR_VIEWS.has(view) ? view : null;
}
