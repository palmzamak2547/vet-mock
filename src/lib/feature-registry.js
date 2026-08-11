// ============================================================
// feature-registry.js — single source of truth for app features
// ============================================================
// One list → consumed by BOTH:
//   • HomeView      — renders the feature grid grouped by category
//   • CommandPalette — fuzzy-search "Quick Actions" section
//
// Why a registry (2026-05-31): features had sprawled to ~30 entry
// points scattered across 6 surfaces (mode cards, a "เครื่องมือปีX"
// row, social cards, footer links, a floating ToolsFAB, ⌘K) with no
// shared categorization. Palm: "พอวิชาเยอะ เริ่มรก จัดเป็นหมวดหมู่".
// Adding a feature in two hand-synced places drifted (⌘K was missing
// 7 navigable features). Now: add ONE entry here → it appears on the
// home grid AND in search, in the right category, automatically.
//
// Each entry is PURE DATA. How to invoke is described by `invoke`,
// which each consumer interprets with a tiny dispatcher (so the
// registry stays serializable / testable and doesn't capture React
// setState closures):
//
//   invoke shapes:
//     { kind: 'view',     view: 'dashboard' }              setView(view)
//     { kind: 'practice', mode, subject, practiceMode,     start a config flow
//                         numQuestions?, useTimer?, timePerQ? }
//     { kind: 'event',    event: 'vmx-open-vetcalc' }      window event (calc)
//     { kind: 'sketch' }                                   onSketch() callback
//     { kind: 'voice' }                                    open voice overlay
//
// Flags:
//   auth: true            → only meaningful when signed in
//   hideOnScaffold: true  → hide on scaffold (no-Q) years
//   years: [4]            → only meaningful for the listed curriculum years
//   primary: true         → big hero card on home (the 3 study modes)
//
// Categories (the 4 Palm approved):
//   practice  📝 ฝึก & สอบ
//   learn     📚 เรียน & ทบทวน
//   progress  📊 ความคืบหน้า
//   tools     🛠 เครื่องมือ & อื่นๆ
// ============================================================

// Feature flags — a one-line rollback for in-progress features. An entry with
// `flag: 'X'` is hidden from home + ⌘K (and thus unreachable, since there is
// no direct URL routing) when FEATURE_FLAGS.X === false.
export const FEATURE_FLAGS = {
  VETWIKI_ENABLED: true,
};

export const IMAGING_URL = 'https://imaging.cuvetsmo.com';

export const FEATURE_CATEGORIES = [
  { id: 'practice', label: 'ฝึก & สอบ',        labelEn: 'Practice & Exam', icon: '📝' },
  { id: 'learn',    label: 'เรียน & ทบทวน',     labelEn: 'Learn & Review',  icon: '📚' },
  { id: 'progress', label: 'ความคืบหน้า',       labelEn: 'Progress',        icon: '📊' },
  { id: 'tools',    label: 'เครื่องมือ & อื่นๆ', labelEn: 'Tools & More',    icon: '🛠' },
];

export const FEATURES = [
  // ── 📝 Practice & Exam ───────────────────────────────────
  {
    id: 'quick-practice', category: 'practice', primary: true,
    label: 'ฝึกข้อสอบ', labelEn: 'Quick Practice', icon: '📝',
    hint: 'สุ่มข้อทุกวิชา 5-50 ข้อ',
    kw: 'quick practice ฝึก สุ่ม random ซ้อม ทำข้อ',
    hideOnScaffold: true,
    invoke: { kind: 'practice', mode: 'quick', subject: 'all', practiceMode: 'all' },
  },
  {
    id: 'exam-mode', category: 'practice', primary: true,
    label: 'โหมดสอบ', labelEn: 'Exam Mode', icon: '🎓',
    hint: '50 ข้อ × 60 วิ จับเวลาเหมือนสนามจริง',
    kw: 'exam mode สอบ จับเวลา timed mock จำลอง สนามจริง',
    hideOnScaffold: true,
    invoke: { kind: 'practice', mode: 'exam', subject: 'all', practiceMode: 'all', numQuestions: 50, useTimer: true, timePerQ: 60 },
  },
  {
    id: 'sr-session', category: 'practice', primary: true,
    label: 'Spaced Repetition', labelEn: 'Spaced Repetition', icon: '🧠',
    hint: 'ทบทวนแบบ Anki — ตอบผิดแล้วระบบนำมา review',
    kw: 'sr spaced repetition anki flashcard ทบทวน review จำ',
    invoke: { kind: 'view', view: 'sr-session' },
  },
  {
    id: 'race', category: 'practice',
    label: 'Race Mode', labelEn: 'Race with friends', icon: '🏁',
    hint: 'แข่งทำข้อสอบกับเพื่อน',
    kw: 'race แข่ง เพื่อน multiplayer compete versus',
    auth: true,
    invoke: { kind: 'view', view: 'race' },
  },
  {
    id: 'review-queue', category: 'practice',
    label: 'Review Queue', labelEn: 'Review Queue', icon: '📋',
    hint: 'คิวข้อที่ขอให้ตรวจ',
    kw: 'review queue คิว ตรวจ moderate รอตรวจ',
    auth: true,
    invoke: { kind: 'view', view: 'review-queue' },
  },

  // ── 📚 Learn & Review ────────────────────────────────────
  {
    id: 'videos', category: 'learn',
    label: 'คลิปย้อนหลัง', labelEn: 'Video summaries', icon: '🎬',
    hint: 'สรุปคลิป + YouTube playlist',
    kw: 'video คลิป ย้อนหลัง summary สรุป youtube playlist',
    invoke: { kind: 'view', view: 'videos' },
  },
  {
    // VetWiki — governed knowledge with traceable sources. Flagged so it's a
    // one-line rollback: set VETWIKI_ENABLED=false to hide it from home + ⌘K.
    id: 'vetwiki', category: 'learn',
    label: 'VetWiki', labelEn: 'VetWiki', icon: '🧬',
    hint: 'คลังความรู้ที่ตรวจสอบได้, บอกที่มาของทุกหัวข้อ',
    kw: 'vetwiki wiki ความรู้ knowledge อ้างอิง source ตรวจสอบ verified rabies พิษสุนัขบ้า',
    flag: 'VETWIKI_ENABLED',
    invoke: { kind: 'view', view: 'knowledge' },
  },
  {
    id: 'faculty', category: 'learn',
    label: 'อาจารย์ผู้สอน', labelEn: 'Faculty index', icon: '👨‍🏫',
    hint: 'รวมโปรไฟล์อาจารย์ + งานวิจัย',
    kw: 'faculty instructor อาจารย์ ผู้สอน lecturer professor วิจัย',
    invoke: { kind: 'view', view: 'faculty' },
  },
  {
    id: 'reading-checklist', category: 'learn',
    label: 'Reading Checklist', labelEn: 'Reading Checklist', icon: '📖',
    hint: 'เช็กหัวข้อที่อ่านแล้ว',
    kw: 'reading checklist อ่าน หัวข้อ เช็ก progress',
    hideOnScaffold: true,
    invoke: { kind: 'view', view: 'reading-checklist' },
  },
  {
    id: 'schedule', category: 'learn',
    label: 'ตารางเรียน & สอบ', labelEn: 'Class & exam schedule', icon: '📅',
    hint: 'ตารางเรียน, Countdown, เนื้อหาออกสอบ',
    kw: 'schedule class exam ตาราง เรียน สอบ countdown ปฏิทิน calendar',
    hideOnScaffold: true,
    invoke: { kind: 'view', view: 'schedule' },
  },
  {
    id: 'pinboard', category: 'learn',
    label: 'Pinboard', labelEn: 'Pinboard', icon: '📌',
    hint: 'รวมข้อ/โน้ตที่ pin ไว้',
    kw: 'pinboard pin หมุด รวบรวม board collect saved',
    invoke: { kind: 'view', view: 'pinboard' },
  },
  {
    id: 'notes', category: 'learn',
    label: 'Notes / สรุป', labelEn: 'Lecture notes', icon: '📓',
    hint: 'สรุปอ่าน อ้างอิง slide จริง — เลือกวิชาก่อน',
    kw: 'notes สรุป โน้ต อ่าน slide สไลด์ lecture',
    invoke: { kind: 'view', view: 'subject-select' },
  },

  // ── 📊 Progress ──────────────────────────────────────────
  {
    id: 'dashboard', category: 'progress',
    label: 'ความคืบหน้า', labelEn: 'Progress', icon: '📊',
    hint: 'analytics + จุดอ่อน + backup',
    kw: 'dashboard stats สถิติ analytics จุดอ่อน weak backup',
    invoke: { kind: 'view', view: 'dashboard' },
  },
  {
    id: 'scores', category: 'progress',
    label: 'สัดส่วนคะแนนรายวิชา', labelEn: 'Course score weights', icon: '🏆',
    hint: 'โครงสร้างคะแนน ปี 4 เทอม 2',
    kw: 'score คะแนน weight สัดส่วน โครงสร้าง รายวิชา',
    hideOnScaffold: true,
    years: [4],
    invoke: { kind: 'view', view: 'scores' },
  },
  {
    id: 'leaderboard-global', category: 'progress',
    label: 'Leaderboard', labelEn: 'Global leaderboard', icon: '🥇',
    hint: 'อันดับคะแนนรวม',
    kw: 'leaderboard อันดับ ranking คะแนนรวม แข่ง top',
    auth: true,
    invoke: { kind: 'view', view: 'leaderboard-global' },
  },
  {
    id: 'phase-wrapped', category: 'progress',
    label: 'Phase Wrapped', labelEn: 'Phase Wrapped', icon: '🎉',
    hint: 'สรุปการเรียนทั้งเทอม (Spotify-style)',
    kw: 'wrapped phase summary สรุป recap year-in-review เทอม สอบจบ',
    invoke: { kind: 'view', view: 'phase-wrapped' },
  },

  // ── 🛠 Tools & More ──────────────────────────────────────
  {
    id: 'vetcalc', category: 'tools', fab: true, fabHint: 'RER, Fluid, CRI',
    label: 'เครื่องคิดเลข', labelEn: 'Vet Calculator', icon: '🧮',
    hint: 'RER, Fluid, CRI, dose',
    kw: 'calculator เครื่องคิดเลข rer fluid cri dose ขนาดยา คำนวณ',
    invoke: { kind: 'event', event: 'vmx-open-vetcalc' },
  },
  {
    id: 'sketch', category: 'tools', fab: true, fabHint: 'sketch, diagram',
    label: 'กระดานวาด', labelEn: 'Sketchpad', icon: '🎨',
    hint: 'วาด diagram, sketch',
    kw: 'sketch กระดาน วาด draw diagram จด',
    invoke: { kind: 'sketch' },
  },
  {
    id: 'lab', category: 'tools', fab: true, fabHint: 'DICOM, Norberg, VHS',
    label: 'Imaging Lab', labelEn: 'Imaging Lab', icon: '🔬',
    hint: 'DICOM, Norberg, VHS · imaging.cuvetsmo.com',
    kw: 'lab imaging dicom norberg vhs xray รังสี ภาพ ฝึกอ่าน',
    invoke: { kind: 'external', url: IMAGING_URL },
  },
  {
    id: 'image-occlusion', category: 'tools',
    label: 'Image Occlusion', labelEn: 'Image Occlusion', icon: '🖼',
    hint: 'ทำ flashcard จากรูป (ปกปิด)',
    kw: 'image occlusion mask anatomy รูป ปกปิด anki flashcard',
    invoke: { kind: 'view', view: 'image-occlusion' },
  },
  {
    id: 'pdf-annotate', category: 'tools',
    label: 'PDF + Annotate', labelEn: 'PDF annotate', icon: '📑',
    hint: 'อัปโหลด lecture PDF แล้วเขียนทับ',
    kw: 'pdf annotate lecture slide สไลด์ เขียนทับ มาร์ก',
    invoke: { kind: 'view', view: 'pdf-annotate' },
  },
  {
    id: 'pomodoro', category: 'tools', fab: true, fabHint: 'focus timer',
    label: 'Pomodoro 🐤', labelEn: 'Pomodoro', icon: '🍅',
    hint: 'จับเวลา focus 25 นาที + ลูกไก่ฟัก',
    kw: 'pomodoro focus timer 25 chick ลูกไก่ จับเวลา โฟกัส',
    invoke: { kind: 'view', view: 'pomodoro' },
  },
  {
    id: 'groups', category: 'tools',
    label: 'กลุ่มติว', labelEn: 'Study groups', icon: '👥',
    hint: 'แชร์ข้อสอบ + leaderboard กลุ่ม',
    kw: 'group กลุ่ม ติว study room แชร์ share เพื่อน',
    auth: true,
    invoke: { kind: 'view', view: 'groups' },
  },
  {
    id: 'contribute', category: 'tools',
    label: 'ช่วยเติมเนื้อหา', labelEn: 'Contribute', icon: '🤝',
    hint: 'ส่ง slide / notes / past paper',
    kw: 'contribute ช่วย เติม เนื้อหา ส่ง slide donate บริจาค',
    invoke: { kind: 'view', view: 'contribute' },
  },
  {
    id: 'question-manager', category: 'tools',
    label: 'เพิ่ม/แก้ข้อสอบเอง', labelEn: 'Question Manager', icon: '✏️',
    hint: 'สร้างข้อสอบ custom',
    kw: 'manage edit custom question จัดการ เพิ่ม แก้ ข้อสอบ สร้าง',
    invoke: { kind: 'view', view: 'question-manager' },
  },
  {
    id: 'ig-cards', category: 'tools',
    label: 'IG Card Studio', labelEn: 'IG Card Studio', icon: '📷',
    hint: 'สร้างโพสต์ @vetmock.cu',
    kw: 'ig instagram card studio post export admin',
    invoke: { kind: 'view', view: 'ig-cards' },
  },
  {
    id: 'voice-settings', category: 'tools',
    label: 'Voice Settings', labelEn: 'Voice settings', icon: '🎚',
    hint: 'ปรับเสียงพูดข้อสอบ',
    kw: 'voice tts เสียง อ่าน พูด ความเร็ว pace speed',
    invoke: { kind: 'voice' },
  },
  {
    id: 'offline-game', category: 'tools',
    label: 'มินิเกม 🐤', labelEn: 'Mini game', icon: '🎮',
    hint: 'ลูกไก่หนีเชื้อโรค (เล่นตอนออฟไลน์ได้)',
    kw: 'game เกม มินิเกม ลูกไก่ offline เล่น สนุก',
    invoke: { kind: 'view', view: 'offline-game' },
  },
  {
    id: 'account-settings', category: 'tools',
    label: 'Account Settings', labelEn: 'Account settings', icon: '⚙️',
    hint: 'จัดการ account, password, ลบบัญชี',
    kw: 'account settings password email logout delete รหัสผ่าน อีเมล ลบ บัญชี',
    auth: true,
    invoke: { kind: 'view', view: 'account-settings' },
  },
  {
    id: 'about', category: 'tools',
    label: 'About', labelEn: 'About', icon: 'ℹ️',
    hint: 'เกี่ยวกับ VetMock + changelog',
    kw: 'about info เกี่ยวกับ changelog version',
    invoke: { kind: 'view', view: 'about' },
  },
  {
    id: 'feedback', category: 'tools',
    label: 'แจ้งปัญหา / Feedback', labelEn: 'Feedback', icon: '🐛',
    hint: 'แจ้งบั๊ก / ติชม / ขอฟีเจอร์',
    kw: 'feedback bug แจ้ง ปัญหา ติชม report ขอ',
    invoke: { kind: 'view', view: 'feedback' },
  },
];

// ── Helpers ──────────────────────────────────────────────

/** Features in one category, in registry order. */
export function featuresByCategory(categoryId) {
  return FEATURES.filter((f) => f.category === categoryId);
}

/** The 3 primary study-mode cards (Quick / Exam / SR). */
export function primaryFeatures() {
  return FEATURES.filter((f) => f.primary);
}

/** Quick-access tools surfaced in the floating ToolsFAB (🧮/🎨/🔬). */
export function fabFeatures() {
  return FEATURES.filter((f) => f.fab);
}

/**
 * Filter a feature list for the current context.
 * @param {object} opts
 * @param {boolean} opts.signedIn   — drop auth-only features when false
 * @param {boolean} opts.scaffold   — drop hideOnScaffold features when true
 * @param {boolean} opts.hasSupabase — drop auth features when backend absent
 * @param {number} opts.selectedYear — drop features scoped to another year
 */
export function visibleFeatures(list, { signedIn, scaffold, hasSupabase, selectedYear } = {}) {
  return list.filter((f) => {
    if (f.flag && FEATURE_FLAGS[f.flag] === false) return false;
    if (f.auth && !signedIn) return false;
    if (f.auth && hasSupabase === false) return false;
    if (f.hideOnScaffold && scaffold) return false;
    if (Array.isArray(f.years) && selectedYear != null && !f.years.includes(Number(selectedYear))) return false;
    return true;
  });
}
