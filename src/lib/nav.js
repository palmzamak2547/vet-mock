// ============================================================
// Canonical top-level navigation — ONE source for both the desktop
// Sidebar and the mobile BottomNav, so the two surfaces can never expose
// different destinations (UX_AUDIT finding 2). Behaviour per item lives in
// runNav() so a click means the same thing everywhere.
// ============================================================

/** id = the `view` (or an action); label = full (sidebar); short = compact
 *  (bottom bar); icon = a NavIcon name (line SVG, not emoji). */
// 2026-10-11 owner feedback: "ย้ายช่อง short cut vet wiki ด้านล่างขวาออก ใส่ profile
// เข้าไปแทน" — the fifth bar slot is the PROFILE hub (streak, recent activity,
// study lists, settings, install app). VetWiki stays reachable from that hub,
// from the desktop rail's "เรียน & ทบทวน" group, from ⌘K and from Home.
export const NAV_ITEMS = [
  { id: 'home',           label: 'หน้าแรก',       short: 'หน้าแรก',    icon: 'home' },
  { id: 'subject-select', label: 'ฝึกข้อสอบ',     short: 'ฝึก',        icon: 'practice' },
  { id: 'mock-exam',      label: 'โหมดสอบ',       short: 'สอบ',        icon: 'exam' },
  { id: 'dashboard',      label: 'ความคืบหน้า',   short: 'คืบหน้า',    icon: 'progress' },
  { id: 'profile',        label: 'โปรไฟล์',       short: 'โปรไฟล์',    icon: 'user' },
];

/** Platform-aware command-menu hint. Safe during SSR/build evaluation. */
export function commandShortcutLabel(nav = typeof navigator !== 'undefined' ? navigator : null) {
  const platform = nav?.userAgentData?.platform || nav?.platform || nav?.userAgent || '';
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? '⌘K' : 'Ctrl K';
}

/** Run a nav item's behaviour. `h` carries the handlers the app owns.
 *  Mirrors the presets the HomeView cards use so nav is consistent with them. */
export function runNav(id, h) {
  if (id === 'home') { (h.goHome || (() => h.setView('home')))(); return; }
  if (id === 'mock-exam') { h.onMockExam && h.onMockExam(); return; }
  // The profile hub is a real destination.
  if (id === 'profile') { h.setView('profile'); return; }
  if (id === 'subject-select') {
    h.setSubject && h.setSubject('all');
    h.setPracticeMode && h.setPracticeMode('all');
    h.setMode && h.setMode('quick');
  }
  h.setView(id);
}

/** Is this item the current destination? (Best-effort — 'mock-exam' is an
 *  action that lands on 'config', so it has no persistent active state.)
 *  Callers pass ids from NAV_ITEMS; 'subject-select' also covers the topic
 *  step its flow lands on. */
export function isNavActive(id, view) {
  if (id === 'subject-select') return view === 'subject-select' || view === 'topic-select';
  if (id === 'profile') return view === 'profile';
  return view === id;
}
