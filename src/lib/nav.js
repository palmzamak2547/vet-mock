// ============================================================
// Canonical top-level navigation — ONE source for both the desktop
// Sidebar and the mobile BottomNav, so the two surfaces can never expose
// different destinations (UX_AUDIT finding 2). Behaviour per item lives in
// runNav() so a click means the same thing everywhere.
//
// 2026-10-12: this file also owns the ORDER of the learn group on every
// navigation surface (the rail's second group on desktop, the quick grid at
// the top of Home on a phone) and the line icon each registry feature draws
// there. One list and one icon map, so the two surfaces cannot drift apart
// the way two hand-listed surfaces did before this file existed.
// ============================================================

import { FEATURES } from './feature-registry.js';

/** id = the `view` (or an action); label = full (sidebar); short = compact
 *  (bottom bar); icon = a NavIcon name (line SVG, not emoji). */
// 2026-10-11 owner feedback: "ย้ายช่อง short cut vet wiki ด้านล่างขวาออก ใส่ profile
// เข้าไปแทน" — the fifth bar slot is the PROFILE hub (streak, recent activity,
// study lists, settings, install app). VetWiki stays reachable from that hub,
// from the desktop rail's "เรียน & ทบทวน" group, from ⌘K and from Home.
//
// `short` is the same word as `label`. The bar used to say ฝึก / สอบ / คืบหน้า
// while the rail said ฝึกข้อสอบ / โหมดสอบ / ความคืบหน้า for the same five
// places: two names for one destination, on the two surfaces a student
// switches between most. The widest full label (ความคืบหน้า) is about 58px at
// 11px, inside the 64px a five-slot bar has at 320px, so the bar can afford
// the rail's words. The field stays so the bar keeps one place to read from.
//
// Two surfaces, one list, two flags. `rail: false` keeps an item off the
// desktop rail; `bar: false` keeps it off the phone bar. The rail follows
// the owner's stars (ความคืบหน้า is one of them); the bar gives that slot to
// ทบทวน, the one study action a student repeats daily (the review queue:
// the practice tab of Duolingo's bar, the habit the app's own due counts
// and quests are built around), because on a phone ความคืบหน้า sat beside
// โปรไฟล์ — two personal pages in a five-slot bar — and the hub now carries
// the progress page as its สถิติ section one tap away. Both surfaces still
// read this one list, so neither can name a destination the other lacks
// without saying so here.
export const NAV_ITEMS = [
  { id: 'home',           label: 'หน้าแรก',       short: 'หน้าแรก',       icon: 'home' },
  { id: 'subject-select', label: 'ฝึกข้อสอบ',     short: 'ฝึกข้อสอบ',     icon: 'practice' },
  { id: 'mock-exam',      label: 'โหมดสอบ',       short: 'โหมดสอบ',       icon: 'exam' },
  { id: 'dashboard',      label: 'ความคืบหน้า',   short: 'ความคืบหน้า',   icon: 'progress', bar: false },
  // The one shortened word: ทบทวนตามรอบ measures 73px at 11px and a 360px
  // bar gives each of five slots 72px (68px inside the padding), so the
  // full term clipped on the most common phone width. ทบทวน is the same
  // term's head, and this item is drawn on the bar alone.
  { id: 'sr-session',     label: 'ทบทวนตามรอบ',   short: 'ทบทวน',         icon: 'repeat',   rail: false },
  { id: 'profile',        label: 'โปรไฟล์',       short: 'โปรไฟล์',       icon: 'user' },
];

// Page titles for the browser tab and history. Built from the labels the
// student already sees (rail/bar, then the feature registry), so a tab never
// names a screen differently from the menu that opened it. 'home' is null
// (the base title is restored); VetWiki and the atlas own their titles.
const TITLE_EXTRAS = Object.freeze({
  'topic-select': 'เลือกหัวข้อ',
  config: 'ตั้งค่าชุดข้อสอบ',
  'mock-exam': 'โหมดสอบ',
  exam: 'ทำข้อสอบ',
  results: 'ผลสอบ',
  'mock-results': 'ผลสอบ',
  review: 'ทบทวนข้อสอบ',
  notes: 'สรุปบทเรียน',
  auth: 'เข้าสู่ระบบ',
  'year-select': 'เลือกชั้นปี',
  'phase-select': 'เลือกช่วงสอบ',
  privacy: 'ความเป็นส่วนตัว',
  wrapup: 'สรุปการเรียน',
  'group-detail': 'กลุ่มติว',
});
const TITLE_OWNED_ELSEWHERE = new Set(['home', 'landing', 'knowledge', 'wiki', 'atlas', 'lab']);

export function viewTitle(view) {
  if (!view || TITLE_OWNED_ELSEWHERE.has(view)) return null;
  const nav = NAV_ITEMS.find((item) => item.id === view);
  if (nav) return nav.label;
  const feature = FEATURES.find((f) => f.invoke?.kind === 'view' && f.invoke.view === view);
  return feature?.label || TITLE_EXTRAS[view] || null;
}

/** The items one surface draws: 'rail' (desktop sidebar) or 'bar' (phone). */
export function navItemsFor(surface) {
  return NAV_ITEMS.filter((item) => (surface === 'bar' ? item.bar !== false : item.rail !== false));
}

/** Home's menu policy (tonight's vision 4.3, with the owner's cross-outs):
 *  what Home does not list, so the menu is a working set and not a site
 *  map. Every one of these stays registered and reachable from search, the
 *  rail's ทั้งหมด, or its subject page; nothing here deletes a feature.
 *    HOME_MENU_HIDDEN      the faculty index opens from each subject's
 *                          page; score weights live in the profile hub.
 *                          The clips stay: Home's global clips entry is a
 *                          student path the connected-study flow walks
 *                          (subject clips, back, all clips), and 400
 *                          summaries deserve a door on the home screen.
 *                          The focus timer and the game open from the
 *                          พักใจ page (its two doors), so Home lists that
 *                          one place (vision 4.3, owner 2026-10-12:
 *                          "รวมเมนูพักใจ"). The timer keeps the desktop
 *                          tools button, the game the offline notice; both
 *                          stay in search
 *    HOME_MENU_ADMIN_ONLY  not a student's task
 *    HOME_MENU_GROUP       where Home files a feature when its registry
 *                          category is not where a student looks for it
 *  These belong in feature-registry.js as flags; they sit here until that
 *  file's owner moves them, so Home has one policy and not three. */
export const HOME_MENU_HIDDEN = Object.freeze(['faculty', 'scores', 'pomodoro', 'offline-game']);
export const HOME_MENU_ADMIN_ONLY = Object.freeze(['ig-cards']);
export const HOME_MENU_GROUP = Object.freeze({ atlas: 'tools' });

export function homeMenuGroup(feature) {
  return HOME_MENU_GROUP[feature?.id] || feature?.category;
}

export function homeMenuVisible(feature, { isAdmin = false } = {}) {
  if (!feature) return false;
  if (HOME_MENU_HIDDEN.includes(feature.id)) return false;
  if (HOME_MENU_ADMIN_ONLY.includes(feature.id) && !isAdmin) return false;
  return true;
}

/** The learn features the owner starred for the first level of the rail
 *  (review of 5.141.6, 2026-10-11), in that order. The rest of the group
 *  stays reachable: behind "ทั้งหมด" (the palette) on desktop and behind
 *  "ดูอีก" in the phone quick grid. Atlas, the clips and the faculty index
 *  were crossed out of the first level, not out of the app. */
export const RAIL_LEARN_IDS = Object.freeze(['vetwiki', 'library', 'reading-checklist', 'schedule']);

/** The whole learn group in the owner's order: the starred four, then the
 *  notes and the pinboard (the review marked the pinboard "either way", so
 *  it stays in reach), then the three crossed out of the first level. A
 *  feature registered later and not listed here follows in registry order,
 *  so a new learn feature still appears instead of vanishing. */
export const LEARN_OWNER_ORDER = Object.freeze([
  ...RAIL_LEARN_IDS, 'notes', 'pinboard', 'videos', 'atlas', 'faculty',
]);

/** Line icons (NavIcon names) for registry features on navigation surfaces.
 *  Anything unmapped falls back to the registry's emoji, so a newly
 *  registered feature still appears instead of vanishing. */
export const FEATURE_LINE_ICON = Object.freeze({
  videos: 'video',
  faculty: 'users',
  'reading-checklist': 'bookmark',
  schedule: 'calendar',
  pinboard: 'pin',
  library: 'files',
  vetwiki: 'wiki',
  atlas: 'atlas',
  bench: 'target',
  notes: 'note',
  'external-docs': 'files',
  'panic-mode': 'lightning',
  'sr-session': 'repeat',
});

export function featureLineIcon(id) {
  return FEATURE_LINE_ICON[id] || null;
}

/** Owner order: LEARN_OWNER_ORDER first, in that order, then anything
 *  unlisted in the order it was given (registry order). Pure, stable. */
export function learnInOwnerOrder(features) {
  const rank = (f) => {
    const i = LEARN_OWNER_ORDER.indexOf(f?.id);
    return i === -1 ? LEARN_OWNER_ORDER.length : i;
  };
  return (features || [])
    .map((f, i) => ({ f, i, r: rank(f) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.f);
}

/** What the desktop rail draws as its second group: the starred features
 *  that survived gating, and the rest for the "ทั้งหมด" overflow row. */
export function splitLearnForRail(features) {
  const ordered = learnInOwnerOrder(features);
  return {
    visible: ordered.filter((f) => RAIL_LEARN_IDS.includes(f.id)),
    rest: ordered.filter((f) => !RAIL_LEARN_IDS.includes(f.id)),
  };
}

/** What the phone quick grid draws: the first `limit` features in owner
 *  order, and the rest behind one "ดูอีก" tile. One hidden feature is not
 *  worth a tile that says "1 more" — it would cost exactly what it saves —
 *  so it is shown instead (the same rule the old rail split used). Eight is
 *  two rows of four at phone width, the shape of the CUNEX and Trip.com
 *  grids the owner pointed at. */
export function splitForQuickGrid(features, limit = 8) {
  const ordered = learnInOwnerOrder(features);
  if (ordered.length <= limit + 1) return { visible: ordered, rest: [] };
  return { visible: ordered.slice(0, limit), rest: ordered.slice(limit) };
}

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
  // The review queue is one screen (the planner and the session share it).
  return view === id;
}
