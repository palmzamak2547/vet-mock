// ============================================================
// how-to.js — the words of the วิธีใช้ guide and of the once-a-day hints
// ============================================================
// Owner review (Palm, v5.141.6): "วิธีใช้งาน บอกแค่อันคร่าวๆ ยังไม่แนะนำการใช้
// ได้จริง". The old tour was seven paragraphs about what exists. This is the
// opposite: a handful of goals a student actually has, each a few steps that
// name the exact button, with a button that goes there.
//
// Pure data plus tiny helpers, so the content is reviewable in one place and
// the unit suite (tests/unit/how-to-content.test.mjs) can hold every sentence
// to the code:
//   {nav:ID}      a bottom-bar / rail destination, label read from lib/nav.js
//   {feature:ID}  a registry feature, label read from lib/feature-registry.js
//   {ui:LABEL}    a button or heading quoted verbatim; the step's `src` names
//                 the file that renders it and the test fails when it is gone
// Labels of shared destinations are never typed here, so a rename in the
// registry reaches the guide by itself instead of leaving it behind.
//
// Copy rules (house): plain Thai with English technical words, one glance per
// step, no middle dot, no em dash, no build or vendor words, nothing promised
// that the screen does not do today.
// ============================================================

import { NAV_ITEMS } from '../lib/nav.js';
import { FEATURES, visibleFeatures } from '../lib/feature-registry.js';
import { YEARS, CURRENT_YEAR } from './curriculum.js';

const NAV_BY_ID = new Map(NAV_ITEMS.map((n) => [n.id, n]));
const FEATURE_BY_ID = new Map(FEATURES.map((f) => [f.id, f]));

export const GUIDE_REOPEN_HINT = 'เปิดหน้านี้อีกได้ทุกเมื่อ จากปุ่ม วิธีใช้ ในหน้าแรก';

// `needsQuestions`: the goal is about answering questions, so a year whose
// bank is still being prepared (curriculum YEARS `scaffold`) does not get it.
export const GUIDE_PATHS = [
  {
    id: 'daily',
    icon: 'flame',
    title: 'ฝึกทุกวัน วันละ 10 นาที',
    summary: 'ทบทวนการ์ดที่ถึงรอบ แล้วฝึกต่ออีก 10 ข้อ',
    intro: 'ทำสั้น ๆ แต่ทุกวัน ช่วยให้จำได้นานกว่าอ่านรวดเดียวก่อนสอบ',
    needsQuestions: true,
    steps: [
      {
        text: 'เปิด {feature:sr-session} แล้วกด {ui:เริ่ม Session}',
        note: 'ตอบตามที่จำได้จริง ข้อที่ยังไม่แม่นจะถูกนัดให้กลับมาเร็วขึ้น',
        go: { feature: 'sr-session' },
        src: ['src/views/SRSessionView.jsx'],
      },
      {
        text: 'กด {nav:subject-select} เลือกวิชา แล้วเลือกหัวข้อหรือ {ui:รวมทุกหัวข้อ}',
        go: { nav: 'subject-select' },
        src: ['src/views/TopicSelectView.jsx'],
      },
      {
        text: 'ตั้ง 10 ข้อ เปิด {ui:เฉลยทันที} ไว้ แล้วกด {ui:เริ่มฝึก}',
        note: 'ข้อปรนัยจะเห็นเฉลยพร้อมเหตุผลทันทีที่ตอบ',
        src: ['src/views/ConfigView.jsx'],
      },
      {
        text: 'ข้อไหนยังไม่มั่นใจ กดรูปดาวบนข้อนั้น เก็บไว้ทำซ้ำทีหลัง',
        check: [
          { file: 'src/components/Question.jsx', has: 'aria-label="บันทึกข้อนี้"' },
          { file: 'src/components/Question.jsx', has: '<NavIcon name="star"' },
        ],
      },
    ],
    start: 'ลองทำ 1 ข้อเลย',
  },
  {
    id: 'exam',
    icon: 'calendar',
    title: 'เตรียมสอบกลางภาค ปลายภาค',
    summary: 'เลือกช่วงสอบ ดูวันสอบ แล้วซ้อมแบบจับเวลา',
    // The approved wording for a phase says what it EXCLUDES (Critical Rule
    // 10): topics whose paper is not mapped yet are still shown.
    intro: 'เลือกช่วงสอบก่อน ชุดฝึกจะไม่รวมเนื้อหาของอีกช่วง',
    needsQuestions: true,
    steps: [
      {
        text: 'แตะป้ายช่วงสอบด้านบน เช่น {ui:ทม.1 กลาง} แล้วเลือกการ์ดที่มีป้าย {ui:แนะนำ}',
        go: { view: 'phase-select', label: 'เลือกช่วงสอบ' },
        src: ['src/components/HeaderBar.jsx', 'src/views/PhaseSelectView.jsx'],
      },
      {
        text: 'เปิด {feature:schedule} ดูวันสอบและเวลาที่เหลือของแต่ละวิชา',
        note: 'กด {ui:ฝึกข้อสอบวิชานี้} ใต้วิชาที่ใกล้สอบ เพื่อฝึกเฉพาะวิชานั้น',
        go: { feature: 'schedule' },
        src: ['src/views/ScheduleView.jsx'],
      },
      {
        text: 'ซ้อมแบบวันสอบด้วย {nav:mock-exam} จับเวลา และไม่เฉลยจนกว่าจะกด {ui:ส่งข้อสอบ}',
        go: { nav: 'mock-exam' },
        src: ['src/views/ExamView.jsx'],
      },
      {
        // The palette's item, not the Home menu card: that card had no
        // handler on 2026-10-12 (handoff night-1012/b.md) and the guide must
        // only send students to controls that work.
        text: 'เวลาเหลือน้อย เปิดช่องค้นหาแล้วพิมพ์ {feature:panic-mode}',
        note: 'ได้ชุดสั้นพร้อมจับเวลา ข้อที่คุณยังผิดบ่อยขึ้นมาก่อน',
        go: { search: true, label: 'เปิดช่องค้นหา' },
        check: [
          { file: 'src/components/CommandPalette.jsx', has: "case 'panic':" },
          { file: 'src/lib/question-metadata.js', has: 'missed(b) - missed(a)' },
        ],
      },
    ],
  },
  {
    id: 'mistakes',
    icon: 'repeat',
    title: 'ทบทวนข้อที่ตอบผิด',
    summary: 'แก้ข้อที่พลาดทันทีหลังจบชุด แล้วเก็บจุดอ่อนไว้ทำซ้ำ',
    intro: 'ประวัติการตอบถูกเก็บไว้ ข้อที่ยังผิดจึงเรียกกลับมาทำซ้ำได้ตลอด',
    needsQuestions: true,
    steps: [
      {
        text: 'จบชุดแล้ว กด {ui:แก้ข้อที่ผิด} ที่หน้าสรุปผล เพื่อทำเฉพาะข้อที่พลาดอีกรอบ',
        src: ['src/views/ResultsView.jsx'],
      },
      {
        text: 'กด {ui:ดูเฉลย} อ่านเหตุผลของข้อที่ผิดทีละข้อ',
        src: ['src/views/ResultsView.jsx'],
      },
      {
        text: 'ข้อที่ยังผิดจากทุกชุด รวมอยู่ที่ปุ่ม {ui:ทำข้อที่อ่อน} ในหน้า {nav:dashboard}',
        go: { nav: 'dashboard' },
        src: ['src/views/DashboardView.jsx'],
      },
      {
        text: 'ข้อที่ผิดซ้ำตั้งแต่ 2 ครั้ง จะถูกส่งเข้า {feature:sr-session} ให้วนกลับมาเอง',
        go: { feature: 'sr-session' },
        check: [{ file: 'src/App.jsx', has: 'threshold: 2' }],
      },
    ],
  },
  {
    id: 'read',
    icon: 'book',
    title: 'อ่านสรุป จดโน้ต พิมพ์เป็น PDF',
    summary: 'อ่านสรุปบทเรียนและสรุปคลิป แล้วเก็บเป็นไฟล์ไว้อ่านต่อ',
    steps: [
      {
        text: 'เปิด {feature:notes} เลือกวิชา แล้วเลือกหัวข้อที่จะอ่าน',
        note: 'อ่านยาว กด {ui:โฟกัสทีละย่อหน้า} แล้วใช้ {ui:ถัดไป} ไปทีละย่อหน้า',
        go: { feature: 'notes' },
        src: ['src/components/ReadingEffects.jsx'],
      },
      {
        text: 'อยากได้เป็นไฟล์ กด {ui:พิมพ์} ข้างชื่อหัวข้อ แล้วเลือกบันทึกเป็น PDF',
        src: ['src/views/NotesView.jsx'],
      },
      {
        text: 'ใน {feature:videos} เปิดคลิปที่มีสรุป กด {ui:อ่านสรุปคลิป} แล้วกด {ui:บันทึกเป็น PDF}',
        note: 'ในสรุปคลิป ลากคลุมข้อความแล้วกด {ui:ทำ flashcard} เพื่อเก็บไว้ทบทวน',
        go: { feature: 'videos' },
        src: ['src/views/VideoView.jsx', 'src/components/SummaryModal.jsx', 'src/components/HighlightToCard.jsx'],
      },
      {
        text: 'PDF ของตัวเอง: ใน {feature:library} กด {ui:เปิด PDF ของฉัน} แล้ว {ui:เลือกไฟล์ PDF}',
        note: 'ขีดเขียนได้เลย แล้วส่งออกพร้อมรอยเขียนจากเมนู {ui:เครื่องมืออื่น}',
        go: { feature: 'library' },
        src: ['src/views/LibraryView.jsx', 'src/views/PdfAnnotateView.jsx'],
      },
    ],
  },
  {
    id: 'search',
    icon: 'search',
    title: 'ค้นหาและถามคลังความรู้',
    summary: 'ค้นข้อสอบ สรุปคลิป VetWiki หรือถามเป็นประโยคในช่องเดียว',
    steps: [
      {
        text: 'กดปุ่มรูปแว่นขยายด้านบนของหน้า',
        keys: 'palette',
        go: { search: true, label: 'เปิดช่องค้นหา' },
        check: [{ file: 'src/components/HeaderBar.jsx', has: 'aria-label="ค้นหา"' }],
      },
      {
        text: 'พิมพ์ชื่อโรค ยา หรือหัวข้อ ผลแยกเป็นกลุ่ม เช่น {ui:ข้อสอบ} {ui:สรุปคลิป} {ui:VetWiki}',
        src: ['src/components/CommandPalette.jsx'],
      },
      {
        text: 'พิมพ์เป็นประโยคคำถาม แล้วเลือก {ui:ถามคลังความรู้}',
        note: 'คำตอบบอกที่มาจาก VetWiki ถ้าคลังยังไม่มีเรื่องนั้นจะบอกตรง ๆ',
        src: ['src/components/CommandPalette.jsx'],
        check: [{ file: 'api/wiki-explain.js', has: 'ยังไม่มีเนื้อหาในคลังความรู้ที่ตอบคำถามนี้ได้' }],
      },
      {
        text: 'พิมพ์ชื่อยากับน้ำหนัก เช่น ketamine 12 kg แมว จะได้ช่วงขนาดยาทันที',
        note: 'ตรวจกับข้อมูลยาปัจจุบันก่อนใช้จริงทุกครั้ง',
        check: [{ file: 'src/lib/omni-intents.js', has: 'detectDoseIntent' }],
      },
    ],
  },
  {
    id: 'phone',
    icon: 'phone',
    title: 'ใช้บนมือถือให้เหมือนแอป',
    summary: 'ติดตั้งลงหน้าจอโฮม แล้วเข้าสู่ระบบให้ข้อมูลตามไปทุกเครื่อง',
    steps: [
      {
        text: 'เปิด {nav:profile} ที่หัวข้อ {ui:แอปของฉัน} กด {ui:ติดตั้งแอป}',
        go: { nav: 'profile' },
        src: ['src/views/ProfileView.jsx', 'src/components/PWAInstallChip.jsx'],
      },
      {
        text: 'บน iPhone หรือ iPad: กด Share ใน Safari เลือก {ui:Add to Home Screen} แล้วเปิด {ui:Open as Web App} ไว้',
        // The iOS steps are rendered from lib/install-guide.js (iOS 26 wording).
        src: ['src/lib/install-guide.js'],
      },
      {
        text: 'ไม่เห็นปุ่มบน Android: ใน Chrome เปิดเมนูของเบราว์เซอร์ แล้วเลือกติดตั้งแอป',
        check: [{ file: 'src/components/PWAInstallChip.jsx', has: 'เลือกติดตั้งแอปหรือเพิ่มที่หน้าจอโฮมจากเมนูของเบราว์เซอร์' }],
      },
      {
        text: 'ไม่ต้องสมัครก็ฝึกได้ ถ้า {ui:เข้าสู่ระบบ} สถิติ ข้อที่บันทึก และการ์ดทบทวนจะตามไปทุกเครื่อง',
        src: ['src/views/ProfileView.jsx'],
        check: [
          { file: 'src/lib/user-data-sync.js', has: 'vmx-history' },
          { file: 'src/lib/user-data-sync.js', has: 'vmx-bookmarks' },
          { file: 'src/lib/user-data-sync.js', has: 'vmx-sr-cards' },
        ],
      },
    ],
  },
];

// One hint per feature per day (lib/first-tip.js), rotating through the list
// so a student who opens the notes every day meets a new capability instead
// of the same sentence. The FIRST hint is what a student sees on day one, so
// it is the one the owner asked for where there is one (notes: print to PDF).
// `surface` limits a hint to one of the screens that share an id (VetWiki's
// index and article share 'knowledge', so VetWiki speaks once a day).
// `guide` is the goal "ดูวิธีใช้เรื่องนี้ทั้งหมด" opens.
export const FEATURE_TIPS = {
  library: {
    guide: 'read',
    tips: [
      {
        title: 'เปิด PDF ของตัวเองได้ที่นี่',
        text: 'กด {ui:เปิด PDF ของฉัน} แล้ว {ui:เลือกไฟล์ PDF} ขีดเขียนบนไฟล์ได้ทันที',
        src: ['src/views/LibraryView.jsx', 'src/views/PdfAnnotateView.jsx'],
      },
      {
        title: 'ส่งออกพร้อมรอยเขียนได้',
        text: 'เขียนบน PDF แล้วเปิดเมนู {ui:เครื่องมืออื่น} เลือก {ui:ส่งออกทั้งเล่มพร้อมรอยเขียน}',
        src: ['src/views/PdfAnnotateView.jsx'],
      },
    ],
  },
  knowledge: {
    guide: 'search',
    tips: [
      {
        surface: 'index',
        title: 'ค้นได้ทั้งเนื้อหา ไม่ใช่แค่ชื่อหัวข้อ',
        text: 'พิมพ์คำสำคัญ เช่น ชื่อโรคหรือยา ใต้ผลค้นหามี {ui:พบใน:} บอกส่วนที่เจอ แตะไปอ่านได้เลย',
        src: ['src/views/KnowledgeView.jsx'],
      },
      {
        surface: 'index',
        title: 'ทุกส่วนบอกที่มา',
        text: 'เปิดหัวข้อแล้วดูบรรทัด {ui:ที่มา:} ในแต่ละส่วน ว่าข้อความนั้นมาจากเอกสารไหน',
        src: ['src/views/KnowledgeView.jsx'],
      },
      {
        surface: 'article',
        title: 'อ่านยาวไม่หลุด',
        text: 'กด {ui:โฟกัสทีละย่อหน้า} แล้วใช้ {ui:ถัดไป} อ่านทีละย่อหน้า',
        src: ['src/components/ReadingEffects.jsx'],
      },
      {
        surface: 'article',
        title: 'ส่งส่วนที่อ่านให้เพื่อนได้',
        text: 'กดเครื่องหมาย # ข้างชื่อส่วน ลิงก์ที่พาไปถึงส่วนนั้นจะถูกคัดลอกไว้',
        check: [{ file: 'src/views/KnowledgeView.jsx', has: 'aria-label={`คัดลอกลิงก์: ${s.heading}`}' }],
      },
    ],
  },
  notes: {
    guide: 'read',
    tips: [
      {
        title: 'พิมพ์เป็น PDF ได้',
        text: 'กด {ui:พิมพ์} ข้างชื่อหัวข้อ แล้วเลือกบันทึกเป็น PDF เก็บไว้อ่านต่อ',
        src: ['src/views/NotesView.jsx'],
      },
      {
        title: 'อ่านยาวไม่หลุด',
        text: 'กด {ui:โฟกัสทีละย่อหน้า} แล้วใช้ {ui:ถัดไป} อ่านทีละย่อหน้า',
        src: ['src/components/ReadingEffects.jsx'],
      },
    ],
  },
  videos: {
    guide: 'read',
    tips: [
      {
        title: 'สรุปคลิปเก็บเป็น PDF ได้',
        text: 'คลิปที่มีสรุป กด {ui:อ่านสรุปคลิป} ใต้เครื่องเล่น แล้วกด {ui:บันทึกเป็น PDF}',
        src: ['src/views/VideoView.jsx', 'src/components/SummaryModal.jsx'],
      },
      {
        title: 'จดโน้ตตรงนาทีที่สำคัญ',
        text: 'ระหว่างดู กด {ui:+ จด ณ เวลานี้} แล้วแตะเวลาในโน้ต เพื่อกลับไปฟังช่วงนั้น',
        src: ['src/components/VideoNotePanel.jsx'],
      },
      {
        title: 'เก็บประโยคสำคัญเป็นการ์ด',
        text: 'ในสรุปคลิป ลากคลุมข้อความแล้วกด {ui:ทำ flashcard} การ์ดจะไปรอใน {feature:sr-session}',
        src: ['src/components/HighlightToCard.jsx'],
      },
    ],
  },
  schedule: {
    guide: 'exam',
    tips: [
      {
        title: 'ฝึกวิชาที่ใกล้สอบได้จากตรงนี้',
        text: 'กด {ui:ฝึกข้อสอบวิชานี้} ใต้วิชาในตารางสอบ ชุดฝึกจะตรงกับช่วงสอบของวิชานั้นให้เอง',
        src: ['src/views/ScheduleView.jsx'],
        check: [{ file: 'src/views/ScheduleView.jsx', has: 'setSelectedPhase?.(phase)' }],
      },
    ],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────

const TOKEN = /\{(nav|feature|ui):([^}]+)\}/g;

/** Split copy into text and label segments: { t: 'text'|'ui', v } or { t: 'nav'|'feature', id }. */
export function parseHowTo(text) {
  const out = [];
  if (typeof text !== 'string' || !text) return out;
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push({ t: 'text', v: text.slice(last, m.index) });
    out.push(m[1] === 'ui' ? { t: 'ui', v: m[2] } : { t: m[1], id: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}

/** The words a segment shows. Shared labels come from the registries. */
export function resolveSegment(seg) {
  if (!seg) return '';
  if (seg.t === 'text' || seg.t === 'ui') return seg.v;
  if (seg.t === 'nav') return NAV_BY_ID.get(seg.id)?.label ?? '';
  if (seg.t === 'feature') return FEATURE_BY_ID.get(seg.id)?.label ?? '';
  return '';
}

/** The line icon the bottom bar and the rail draw for a nav segment. */
export function navIconFor(seg) {
  return seg?.t === 'nav' ? NAV_BY_ID.get(seg.id)?.icon ?? null : null;
}

/** A registry feature's invoke descriptor, for a go button. */
export function featureInvoke(id) {
  return FEATURE_BY_ID.get(id)?.invoke ?? null;
}

/** What a step's go button says. */
export function goLabel(go) {
  if (!go) return '';
  if (go.label) return go.label;
  const target = go.nav ? NAV_BY_ID.get(go.nav)?.label : go.feature ? FEATURE_BY_ID.get(go.feature)?.label : '';
  return target ? `ไปที่ ${target}` : 'ไปที่หน้านั้น';
}

/**
 * The student's context, read once when the guide opens: the year they chose
 * (useLocalStorage stores it as JSON; absent or 'null' means the default) and
 * whether that year's bank exists yet.
 */
export function guideContext(hasSupabase = true) {
  let year = CURRENT_YEAR;
  try {
    const raw = localStorage.getItem('vmx-selected-year');
    const parsed = raw == null ? null : JSON.parse(raw);
    if (Number.isInteger(parsed)) year = parsed;
  } catch {
    // No store: the default year, as the rest of the app assumes.
  }
  const scaffold = Boolean(YEARS.find((y) => y.id === year)?.scaffold);
  return { selectedYear: year, scaffold, hasSupabase };
}

const featureIdsIn = (step) => [step.text, step.note]
  .filter(Boolean)
  .flatMap(parseHowTo)
  .filter((s) => s.t === 'feature')
  .map((s) => s.id)
  .concat(step.go?.feature ? [step.go.feature] : []);

/**
 * The goals this student can actually follow: a step that leans on a feature
 * hidden in their context is dropped, and a question goal is dropped on a year
 * that has no questions yet. Signed-out is assumed, so nothing here depends on
 * an account (the content suite also forbids account-only features outright).
 */
export function guidePathsFor(ctx = {}) {
  const visible = new Set(visibleFeatures(FEATURES, {
    signedIn: false,
    scaffold: Boolean(ctx.scaffold),
    hasSupabase: ctx.hasSupabase !== false,
    selectedYear: ctx.selectedYear ?? CURRENT_YEAR,
  }).map((f) => f.id));
  return GUIDE_PATHS
    .filter((p) => !(p.needsQuestions && ctx.scaffold))
    .map((p) => ({ ...p, steps: p.steps.filter((s) => featureIdsIn(s).every((id) => visible.has(id))) }))
    .filter((p) => p.steps.length > 0);
}

/**
 * Today's hint for a feature: the list for this surface, at this turn.
 * `turn` comes from lib/first-tip.js (0 on the first day ever, then +1 per
 * day the hint was shown), so day one always shows the first hint.
 */
export function pickTip(id, { surface = null, turn = 0 } = {}) {
  const entry = FEATURE_TIPS[id];
  if (!entry) return null;
  const list = entry.tips.filter((t) => !t.surface || !surface || t.surface === surface);
  if (!list.length) return null;
  const n = Number.isInteger(turn) && turn >= 0 ? turn : 0;
  return list[n % list.length];
}
