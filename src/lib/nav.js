// ============================================================
// Canonical top-level navigation — ONE source for both the desktop
// Sidebar and the mobile BottomNav, so the two surfaces can never expose
// different destinations (UX_AUDIT finding 2). Behaviour per item lives in
// runNav() so a click means the same thing everywhere.
// ============================================================

/** id = the `view` (or an action); label = full (sidebar); short = compact
 *  (bottom bar); icon = a NavIcon name (line SVG, not emoji). */
export const NAV_ITEMS = [
  { id: 'home',           label: 'เรียนรู้',      short: 'หน้าแรก',    icon: 'home' },
  { id: 'subject-select', label: 'ฝึกข้อสอบ',     short: 'ฝึก',        icon: 'practice' },
  { id: 'mock-exam',      label: 'Mock Exam',      short: 'สอบ',        icon: 'exam' },
  { id: 'dashboard',      label: 'ความคืบหน้า',    short: 'สถิติ',      icon: 'progress' },
  { id: 'wiki',           label: 'Wiki',           short: 'Wiki',       icon: 'wiki' },
];

/** Run a nav item's behaviour. `h` carries the handlers the app owns.
 *  Mirrors the presets the HomeView cards use so nav is consistent with them. */
export function runNav(id, h) {
  if (id === 'home') { (h.goHome || (() => h.setView('home')))(); return; }
  if (id === 'mock-exam') { h.onMockExam && h.onMockExam(); return; }
  if (id === 'subject-select') {
    h.setSubject && h.setSubject('all');
    h.setPracticeMode && h.setPracticeMode('all');
    h.setMode && h.setMode('quick');
  }
  h.setView(id);
}

/** Is this item the current destination? (Best-effort — 'mock-exam' is an
 *  action that lands on 'config', so it has no persistent active state.) */
export function isNavActive(id, view) {
  if (id === 'subject-select') return view === 'subject-select' || view === 'topic-select';
  return view === id;
}
