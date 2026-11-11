// ============================================================
// prefs/table.js — every preference a student can change, declared once
// ============================================================
// Palm, 11 Nov 2026: one place for customization, play and never
// configuration. Each row says, once:
//   id        what the studio and the account copy call it
//   key       the storage key it already had (never renamed: no student may
//             lose a setting they have today)
//   owner     the module that owns that key; the row reads and writes through
//             it, so a value means what it meant before
//   choices   the values a student can pick (the studio draws its samples
//             from these; the account copy accepts nothing else)
//   def(s)    the default, from signals the screen hands in (device, student)
//   account   true when the value follows the account to another device
//   exam      what it does inside a running set or exam ('as-today': the exam
//             reads it exactly as before this table existed; no row is
//             reachable from an exam screen)
//
// Inventory of what the app stores (11 Nov 2026) and why a key is not here:
// the study setup (vmx-decide:*, vmx-instant-feedback, vmx-reveal-timing,
// vmx-sr-*, vmx-selected-year, the phase pick) belongs to src/lib/decide.js
// and the screens that decide it; vmx-pomodoro-config lives on the timer it
// sets; vmx-consent stays an explicit, separate choice; vmx-wiki-layout,
// vmx-fullscreen and vmx-clip-skip are a screen's remembered state, not taste;
// vmx-landing-lang is the signed-out page only; reminders are notifications,
// asked for on their own; text size, a global sound switch and the order of
// the home grid do not exist as preferences (browser zoom, nav.js order).
// docs/releases/pending/custom-studio.md has the full count.
//
// The guards: tests/unit/prefs-table.test.mjs (every old key seeded gives the
// same resolved state; no file outside an owner touches a key; the table's
// palettes pass WCAG AA in light and dark).
// ============================================================

import {
  readMotionPreferences, saveMotionPreferences, MOTION_DEFAULTS,
  LOADER_CHOICES, CELEBRATION_CHOICES, READING_POINTER_CHOICES,
} from '../motion-preferences.js';
import { THEME_KEY, PALETTE_KEY } from '../theme-pref.js';
import { SELECTED_BUDDY_KEY, getPickedBuddy, setSelectedBuddy } from '../buddy-stats.js';
import { ACCENT_KEY, ACCENT_CSS_KEY, accentCss, parseHue } from './accent.js';
import { CARD_KEY, parseCardToken, encodeCard, DEFAULT_CARD } from './card-token.js';

export const PREF_CHANGE_EVENT = 'vmx-pref-change';

// 'custom' is "สีของฉัน": its colours come from the hue row (prefs/accent.js).
export const PALETTE_IDS = Object.freeze(['default', 'forest', 'ocean', 'plum', 'cherry', 'mono', 'custom']);
export const BUDDY_IDS = Object.freeze(['mochi', 'moocha', 'glidy', 'porky', 'oto', 'clover', 'chicky', 'pawsy', 'mimi', 'hootie']);
export const RATE_CHOICES = Object.freeze([0.75, 1, 1.25, 1.5, 2]);
export const READ_RATE_KEY = 'vmx-read-aloud-rate';

// ── Storage, wrapped: a blocked store means the default is used ─────────────
const ls = () => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } };
function rawGet(key) { try { return ls()?.getItem(key) ?? null; } catch { return null; } }
function rawSet(key, value) {
  try {
    if (value == null) ls()?.removeItem(key); else ls()?.setItem(key, value);
    return true;
  } catch { return false; } finally { announce(key); }
}
function jsonGet(key) { const raw = rawGet(key); if (raw == null) return undefined; try { return JSON.parse(raw); } catch { return undefined; } }
/** Tell same-tab readers (useLocalStorage, App's theme and palette) a key moved. */
function announce(key) {
  try { window.dispatchEvent(new CustomEvent(PREF_CHANGE_EVENT, { detail: { key } })); } catch { /* not a browser */ }
}

/** Put the derived "สีของฉัน" sheet on the page (index.html does it at load). */
export function applyAccentStyle(css) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById('vmx-accent-sheet');
  if (!el) { el = document.createElement('style'); el.id = 'vmx-accent-sheet'; document.head.appendChild(el); }
  el.textContent = css;
}

/** Recompute and apply "สีของฉัน" from the stored hue (App calls it when the
 *  palette is custom: the cached sheet may be missing or from an older rule). */
export function ensureAccentStyle() {
  const hue = parseHue(rawGet(ACCENT_KEY)) ?? 155;
  const css = accentCss(hue);
  try { ls()?.setItem(ACCENT_CSS_KEY, css); } catch { /* the sheet still applies now */ }
  applyAccentStyle(css);
}

const motionRow = (field, choices, account, label) => ({
  id: `motion.${field}`, key: 'vmx-motion-settings', field, owner: 'src/lib/motion-preferences.js',
  choices, account, exam: 'as-today', label,
  def: () => MOTION_DEFAULTS[field],
  read: () => readMotionPreferences()[field],
  write: (v) => saveMotionPreferences({ [field]: v }),
  stored: () => { const o = jsonGet('vmx-motion-settings'); return o && typeof o === 'object' && Object.hasOwn(o, field); },
});

// ── The table ───────────────────────────────────────────────────────────────
export const PREFS = Object.freeze([
  {
    id: 'theme', key: THEME_KEY, owner: 'src/lib/theme-pref.js', label: 'สว่างหรือมืด',
    choices: ['system', 'light', 'dark'], account: false, exam: 'as-today',
    // The phone knows when it is night; a laptop and a phone differ, so the
    // pick stays on each device (lib/theme-pref.js).
    def: () => 'system',
    read() { const v = jsonGet(THEME_KEY); return v === 'light' || v === 'dark' ? v : 'system'; },
    write: (v) => rawSet(THEME_KEY, JSON.stringify(v)),
    stored: () => rawGet(THEME_KEY) != null,
  },
  {
    id: 'palette', key: PALETTE_KEY, owner: 'src/lib/theme-pref.js', label: 'จานสี',
    choices: PALETTE_IDS, account: true, exam: 'as-today',
    def: () => 'default',
    read() { const v = jsonGet(PALETTE_KEY); return PALETTE_IDS.includes(v) ? v : 'default'; },
    write(v) {
      // "สีของฉัน" needs its sheet before the attribute names it.
      if (v === 'custom') prefRow('accentHue').write(prefRow('accentHue').read());
      return rawSet(PALETTE_KEY, JSON.stringify(v));
    },
    stored: () => rawGet(PALETTE_KEY) != null,
  },
  {
    // "สีของฉัน": a hue; the whole palette is derived and checked in
    // prefs/accent.js. The derived stylesheet is cached beside it so the
    // pre-paint script in index.html applies it before React.
    id: 'accentHue', key: ACCENT_KEY, owner: 'src/lib/prefs/accent.js', label: 'สีของฉัน',
    choices: null, valid: (v) => parseHue(v) === v, account: true, exam: 'as-today',
    def: () => 155,
    read() { const v = parseHue(rawGet(ACCENT_KEY)); return v ?? 155; },
    write(v) {
      const css = accentCss(v);
      rawSet(ACCENT_CSS_KEY, css);
      applyAccentStyle(css);
      return rawSet(ACCENT_KEY, String(v));
    },
    stored: () => rawGet(ACCENT_KEY) != null,
  },
  // ── ตัวอักษร: reserved ──────────────────────────────────────────────────
  // The font row (key vmx-font, optional vmx-font-display) delegates to
  // src/lib/typography/fonts.js (readFontChoice, applyFontChoice, FONT_SETS),
  // which another branch adds. It follows the account and applies in exams.
  // It is added here when that branch is merged; until then no font logic.
  motionRow('mode', ['auto', 'quiet', 'off'], false, 'การเคลื่อนไหว'),
  motionRow('companion', [true, false], true, 'เพื่อนติวในหน้าต่าง ๆ'),
  motionRow('loader', LOADER_CHOICES, true, 'ระหว่างรอโหลด'),
  motionRow('celebration', CELEBRATION_CHOICES, true, 'เมื่อทำชุดสำเร็จ'),
  motionRow('readingPointer', READING_POINTER_CHOICES, true, 'ตัวชี้ตอนอ่าน'),
  { ...motionRow('haptics', [true, false], false, 'สั่นเบา ๆ เมื่อรู้ผล'), def: (s = {}) => s.canVibrate !== false },
  {
    id: 'buddy', key: SELECTED_BUDDY_KEY, owner: 'src/lib/buddy-stats.js', label: 'เพื่อนติว',
    choices: BUDDY_IDS, account: true, exam: 'as-today',
    // No pick reads as Mochi everywhere (lib/buddy.js); the raw key is kept.
    def: () => 'mochi',
    read() { const v = getPickedBuddy(); return BUDDY_IDS.includes(v) ? v : 'mochi'; },
    write: (v) => { setSelectedBuddy(v); announce(SELECTED_BUDDY_KEY); return true; },
    stored: () => rawGet(SELECTED_BUDDY_KEY) != null,
  },
  {
    id: 'readAloudRate', key: READ_RATE_KEY, owner: 'src/lib/read-aloud.js', label: 'ความเร็วเสียงอ่าน',
    choices: RATE_CHOICES, account: true, exam: 'as-today',
    def: () => 1,
    read() { const n = Number(rawGet(READ_RATE_KEY)); return RATE_CHOICES.includes(n) ? n : 1; },
    write: (v) => rawSet(READ_RATE_KEY, String(v)),
    stored: () => rawGet(READ_RATE_KEY) != null,
  },
  {
    id: 'card', key: CARD_KEY, owner: 'src/lib/prefs/card-token.js', label: 'การ์ดของฉัน',
    choices: null, valid: (v) => parseCardToken(v) !== null, account: true, exam: 'as-today',
    def: () => encodeCard(DEFAULT_CARD),
    read() { const raw = rawGet(CARD_KEY); return parseCardToken(raw) ? raw : encodeCard(DEFAULT_CARD); },
    write: (v) => rawSet(CARD_KEY, v),
    stored: () => rawGet(CARD_KEY) != null,
  },
  // The read-aloud voice of the device's own speech engine (VoiceSettings).
  // One row per slider; the voice differs per device, so none follows the
  // account. Read and written through lib/tts.js, loaded with the modal.
  ...[
    ['speed', 'ความเร็วเสียงพูด', 0.8, 1.2, 0.05, 1],
    ['afterStem', 'พักหลังโจทย์', 0, 800, 10, 90],
    ['betweenOpts', 'ช่องว่างระหว่างตัวเลือก', 0, 800, 10, 40],
    ['afterLast', 'พักท้ายข้อ', 0, 800, 10, 20],
  ].map(([field, label, min, max, step, dflt]) => ({
    id: `voice.${field}`, key: 'vmx-tts-prefs', field, owner: 'src/lib/tts.js', label,
    range: Object.freeze({ min, max, step }), choices: null, account: false, exam: 'as-today',
    valid: (v) => typeof v === 'number' && v >= min && v <= max,
    def: () => dflt,
    // Clamped as lib/tts.js clamps it, so the value read is the one spoken.
    read() { const o = jsonGet('vmx-tts-prefs'); const n = Number(o?.[field]); return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : dflt; },
    write: async (v) => { const { setTtsPrefs } = await import('../tts.js'); setTtsPrefs({ [field]: v }); announce('vmx-tts-prefs'); return true; },
    stored: () => { const o = jsonGet('vmx-tts-prefs'); return Boolean(o && Object.hasOwn(o, field)); },
  })),
].map((row) => Object.freeze(row)));

const BY_ID = new Map(PREFS.map((p) => [p.id, p]));
export const prefRow = (id) => BY_ID.get(id) || null;
export const ACCOUNT_PREFS = Object.freeze(PREFS.filter((p) => p.account).map((p) => p.id));

/** Is `v` a value this row accepts? */
export function validFor(id, v) {
  const row = prefRow(id);
  if (!row) return false;
  if (row.choices) return row.choices.includes(v);
  try { return Boolean(row.valid?.(v)); } catch { return false; }
}

export const readPref = (id) => prefRow(id)?.read();
/** Every row's value as the app reads it now. */
export function resolvedState() {
  return Object.fromEntries(PREFS.map((p) => [p.id, p.read()]));
}

/** Write one value through its owner; invalid values are ignored. */
export const LOCAL_STAMP_KEY = 'vmx-prefs-stamp';
/** When a row that follows the account last changed on this device (ms), or 0. */
export function localStamp() { const n = Number(rawGet(LOCAL_STAMP_KEY)); return Number.isFinite(n) && n > 0 ? n : 0; }
/** Write one value through its owner; invalid values are ignored. A change to
 *  a row that follows the account is stamped (newest wins across devices),
 *  except when the account copy itself is being applied (`quiet`). */
export function writePref(id, value, { quiet = false } = {}) {
  const row = prefRow(id);
  if (!row || !validFor(id, value)) return false;
  if (row.account && !quiet && row.read() !== value) rawSet(LOCAL_STAMP_KEY, String(Date.now()));
  return row.write(value);
}

// ── Ready-made sets: several rows in one tap ────────────────────────────────
// A set never touches the palette, the buddy or the card: those are the
// student's identity; a set is how the app behaves.
export const PRESETS = Object.freeze([
  { id: 'phone', label: 'ตามเครื่อง', values: { theme: 'system', 'motion.mode': 'auto', 'motion.companion': true, 'motion.celebration': 'contextual', 'motion.loader': 'pages', 'motion.readingPointer': 'auto' } },
  { id: 'calm', label: 'สงบนิ่ง', values: { 'motion.mode': 'quiet', 'motion.companion': false, 'motion.celebration': 'contextual', 'motion.loader': 'skeleton', 'motion.readingPointer': 'none' } },
  { id: 'lively', label: 'สดใส', values: { 'motion.mode': 'auto', 'motion.companion': true, 'motion.celebration': 'confetti', 'motion.loader': 'pawsteps', 'motion.readingPointer': 'paw' } },
  { id: 'night', label: 'อ่านดึก', values: { theme: 'dark', 'motion.mode': 'quiet', 'motion.companion': true, 'motion.celebration': 'fireflies', 'motion.loader': 'dots', 'motion.readingPointer': 'none' } },
].map((p) => Object.freeze({ ...p, values: Object.freeze(p.values) })));

/** The set the current values match exactly, or null ("ปรับเอง"). */
export function matchingPreset(state = resolvedState()) {
  return PRESETS.find((p) => Object.entries(p.values).every(([id, v]) => state[id] === v))?.id || null;
}

// ── One step back ───────────────────────────────────────────────────────────
/** What `values` would overwrite, to put back with restoreSnapshot. */
export function snapshotFor(ids) {
  return Object.fromEntries(ids.map((id) => [id, readPref(id)]));
}
export function applyValues(values, options) {
  for (const [id, v] of Object.entries(values || {})) writePref(id, v, options);
}
