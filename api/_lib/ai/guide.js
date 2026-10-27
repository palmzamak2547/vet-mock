// ============================================================
// ai/guide.js — what VetMock knows about itself, as citable documents
// ============================================================
// "VetMock มีอะไรใหม่", "ปลายภาคสอบวิชาอะไรบ้าง", "ใครสอน rabies",
// "จับเวลาโฟกัสอยู่ตรงไหน" are answered from the app's OWN data, never from a
// model's idea of the app. Each document here is generated from the module
// the app renders that screen from:
//
//   feature    lib/feature-registry.js (label, hint, keywords) + how-to tips
//   howto      data/how-to.js goals and their steps (labels resolved the way
//              the guide resolves them)
//   release    the changelog, newest first (release files + history)
//   subject    data/curriculum.js: code, year, semester, topics + lecturers,
//              and how many deliverable bank questions it has right now
//   year       one list of a year's subjects
//   exam       data/schedule.js EXAM_SCHEDULE, one document per year and
//              paper (midterm / final) of the current term, with days left
//   instructor data/instructors-directory.js: name, department, research
//              areas, what they teach here. Never the e-mail address.
//
// Questions of a known shape are routed deterministically (a "what's new"
// question has almost no content words for a scorer to use); everything else
// is scored with the same concept index the rest of the corpus uses.
//
// Release files are read from their directory rather than through the
// gitignored changelog-releases.generated.js, so this does not depend on the
// build having generated that file before the function was bundled.
// ============================================================

import fs from 'node:fs';
import { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, CURRENT_YEAR } from '../../../src/data/curriculum.js';
import { TextIndex } from './textindex.js';
import { featureLink, viewLink, librarySubjectLink } from './links.js';
import { clip } from './text.js';

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** "2026-10-22" → "22 ต.ค. 2569". */
export function thaiShortDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return String(iso || '');
  return `${Number(m[3])} ${THAI_MONTHS[Number(m[2]) - 1]} ${Number(m[1]) + 543}`;
}

const parseVersion = (v) => String(v).split('.').map((n) => Number.parseInt(n, 10) || 0);
const newerFirst = (a, b) => {
  const x = parseVersion(a.version);
  const y = parseVersion(b.version);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i];
  return 0;
};

/** Every release, newest first. */
export async function loadReleases() {
  const { CHANGELOG: history } = await import('../../../src/data/changelog.js');
  let files = [];
  try {
    files = fs.readdirSync(new URL('../../../src/data/changelog/', import.meta.url))
      .filter((f) => /^\d+\.\d+\.\d+\.js$/.test(f));
  } catch { /* no directory in this bundle: fall through to the merged module */ }
  let releases = [];
  if (files.length) {
    const mods = await Promise.all(files.map((f) => import(`../../../src/data/changelog/${f}`).catch(() => null)));
    releases = mods.map((m) => m?.default).filter((e) => e?.version);
  } else {
    try {
      const all = await import('../../../src/data/changelog-all.js');
      return [...all.CHANGELOG].sort(newerFirst);
    } catch { /* history alone below */ }
  }
  const seen = new Set(releases.map((r) => r.version));
  return [...releases, ...history.filter((h) => !seen.has(h.version))].sort(newerFirst);
}

const subjectYear = new Map();
for (const [y, list] of Object.entries(SUBJECTS_BY_YEAR)) for (const s of list) subjectYear.set(s.id, Number(y));

function goLink(go) {
  if (!go) return null;
  if (go.feature) return null; // resolved by the caller, which has the registry
  if (go.nav) return viewLink(go.nav);
  return null;
}

async function buildStaticDocs(questionCounts) {
  const [{ FEATURES }, howTo, { INSTRUCTOR_DIRECTORY }, { getInstructorByLecturerString }] = await Promise.all([
    import('../../../src/lib/feature-registry.js'),
    import('../../../src/data/how-to.js'),
    import('../../../src/data/instructors-directory.js'),
    import('../../../src/data/instructors.js'),
  ]);
  const docs = [];
  const featureById = new Map(FEATURES.map((f) => [f.id, f]));
  const resolve = (text) => howTo.parseHowTo(text).map(howTo.resolveSegment).join('');

  for (const f of FEATURES) {
    if (f.adminOnly) continue;
    const tips = howTo.FEATURE_TIPS[f.id]?.tips || [];
    docs.push({
      kind: 'guide', gtype: 'feature', featureId: f.id,
      title: `${f.label} (${f.labelEn})`,
      heading: f.hint || '',
      text: [f.hint, f.auth ? 'ต้องเข้าสู่ระบบก่อนใช้' : '', ...tips.map((t) => `${t.title}: ${resolve(t.text)}`), f.kw].filter(Boolean).join('\n'),
      url: featureLink(f),
    });
  }

  for (const p of howTo.GUIDE_PATHS) {
    const steps = p.steps.map((s, i) => `${i + 1}. ${resolve(s.text)}${s.note ? ` (${resolve(s.note)})` : ''}`);
    const firstGo = p.steps.find((s) => s.go)?.go;
    docs.push({
      kind: 'guide', gtype: 'howto', featureId: firstGo?.feature || null,
      title: `วิธีใช้: ${p.title}`,
      heading: p.summary,
      text: [p.summary, p.intro, ...steps].filter(Boolean).join('\n'),
      url: (firstGo?.feature && featureLink(featureById.get(firstGo.feature))) || goLink(firstGo) || viewLink('home'),
    });
  }

  // Who teaches what, from the curriculum's lecturer strings.
  const teaches = new Map();
  for (const s of SUBJECTS) {
    for (const t of s.topics || []) {
      if (!t.lecturer) continue;
      const ins = getInstructorByLecturerString(t.lecturer);
      if (!ins) continue;
      if (!teaches.has(ins.slug)) teaches.set(ins.slug, []);
      teaches.get(ins.slug).push(`${s.name}: ${t.label}`);
    }
  }

  for (const s of SUBJECTS) {
    if (s.id === 'all') continue;
    const year = subjectYear.get(s.id);
    const count = questionCounts.get(s.id) || 0;
    const topics = (s.topics || []).filter((t) => !t.hidden).map((t) => `- ${t.label}${t.lecturer ? ` (ผู้สอน ${t.lecturer})` : ''}`);
    docs.push({
      kind: 'guide', gtype: 'subject', subject: s.id,
      title: `${s.name} (${s.name_en || s.id})`,
      heading: `รหัส ${s.code || '-'}, ชั้นปีที่ ${year || '-'}`,
      text: [
        `รายวิชา ${s.name}${s.name_en ? ` (${s.name_en})` : ''} รหัส ${s.code || '-'}`,
        `ชั้นปีที่ ${year || '-'}${s.semester ? ` ภาคการศึกษาที่ ${s.semester}` : ''}`,
        count ? `ข้อสอบในคลังของ VetMock ${count} ข้อ` : 'ยังไม่มีข้อสอบในคลังของ VetMock',
        topics.length ? 'หัวข้อ:' : '',
        ...topics,
      ].filter(Boolean).join('\n'),
      url: librarySubjectLink(s.id),
    });
  }

  for (const y of YEARS) {
    const list = SUBJECTS_BY_YEAR[y.id] || [];
    if (!list.length) continue;
    docs.push({
      kind: 'guide', gtype: 'year', year: y.id,
      title: `รายวิชาชั้นปีที่ ${y.id}`,
      heading: y.desc || '',
      text: list.map((s) => `- ${s.name} (${s.code || '-'})${s.semester ? ` ภาค ${s.semester}` : ''}${(questionCounts.get(s.id) || 0) ? `, ข้อสอบ ${questionCounts.get(s.id)} ข้อ` : ', ยังไม่มีข้อสอบ'}`).join('\n'),
      url: viewLink('subject-select'),
    });
  }

  for (const ins of INSTRUCTOR_DIRECTORY) {
    if (ins.status && ins.status !== 'faculty') continue;
    const taught = teaches.get(ins.slug) || [];
    docs.push({
      kind: 'guide', gtype: 'instructor', slug: ins.slug,
      title: `${ins.position || ''}${ins.nameTh || ''} (${ins.nameEn || ''})`.trim(),
      heading: ins.department || '',
      text: [
        ins.nickname ? `ชื่อเล่น ${ins.nickname}` : '',
        ins.department || '',
        (ins.areas || []).length ? `สาขาที่สนใจ: ${ins.areas.join(', ')}` : '',
        taught.length ? `สอนใน VetMock: ${taught.join('; ')}` : '',
        ...(ins.aliases || []),
      ].filter(Boolean).join('\n'),
      url: viewLink('faculty'),
    });
  }

  const releases = (await loadReleases()).slice(0, 15);
  for (const r of releases) {
    docs.push({
      kind: 'guide', gtype: 'release', version: r.version, date: r.date,
      title: `อัปเดต ${r.version} (${thaiShortDate(r.date)})`,
      heading: r.headline || '',
      text: [r.headline, ...(r.changes || []).map((c) => `- ${c.title}${c.desc ? `: ${c.desc}` : ''}`)].filter(Boolean).join('\n'),
      url: viewLink('about'),
    });
  }
  return docs;
}

const TERM_TH = { midterm: 'กลางภาค', final: 'ปลายภาค' };

/** The current term's exam papers as documents, with days left as of `now`. */
export async function examDocs(now = new Date()) {
  const { EXAM_SCHEDULE, SEMESTER, examTitle, bangkokDate, calendarDaysBetween } = await import('../../../src/data/schedule.js');
  const today = bangkokDate(now);
  const docs = [];
  for (const [key, list] of Object.entries(EXAM_SCHEDULE)) {
    const year = Number(key.replace(/\D/g, ''));
    for (const term of ['midterm', 'final']) {
      const papers = list.filter((e) => e.term === term).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      if (!papers.length) continue;
      const period = term === 'midterm' ? SEMESTER.midtermPeriod : SEMESTER.finalPeriod;
      const upcoming = papers.some((e) => calendarDaysBetween(today, e.date) >= 0);
      const lines = papers.map((e) => {
        const left = calendarDaysBetween(today, e.date);
        const when = left > 0 ? `อีก ${left} วัน` : left === 0 ? 'วันนี้' : 'สอบไปแล้ว';
        return `- ${thaiShortDate(e.date)} เวลา ${e.time} ${examTitle(e)} (${e.code})${e.location ? ` ห้อง ${e.location}` : ''}${e.credits ? `, ${e.credits} หน่วยกิต` : ''} (${when})`;
      });
      docs.push({
        kind: 'guide', gtype: 'exam', year, term, upcoming,
        title: `ตารางสอบ${TERM_TH[term]} ชั้นปีที่ ${year} ${SEMESTER.labelTh}`,
        heading: period?.labelTh || '',
        text: [period?.labelTh, `วันนี้ ${thaiShortDate(today)}`, `${papers.length} วิชา`, ...lines, SEMESTER.sourceNote ? `ที่มา: ${SEMESTER.sourceNote}` : ''].filter(Boolean).join('\n'),
        url: viewLink('schedule'),
      });
    }
  }
  return docs;
}

let pendingStatic = null;
/** Static guide documents and their index, built once (needs question counts). */
export function loadGuide(questionCounts = new Map()) {
  if (!pendingStatic) {
    pendingStatic = buildStaticDocs(questionCounts).then((docs) => ({ docs, index: new TextIndex(docs) }))
      .catch((err) => { pendingStatic = null; throw err; });
  }
  return pendingStatic;
}

// ── Routing ──────────────────────────────────────────────────────────────
const RE_WHATS_NEW = /(อะไรใหม่|มีไรใหม่|ใหม่ล่าสุด|อัปเดต|อัพเดต|อัปเดท|อัพเดท|changelog|what'?s new|release note|เวอร์ชัน|เวอร์ชั่น|ฟีเจอร์ใหม่)/i;
const RE_EXAM = /(ตารางสอบ|สอบวิชา|สอบอะไร|วันสอบ|สอบวันไหน|สอบกี่โมง|สอบที่ไหน|ห้องสอบ|กลางภาค|ปลายภาค|มิดเทอม|ไฟนอล|midterm|final exam|exam schedule|สอบเมื่อไหร่|สอบเมื่อไร)/i;
const RE_LECTURER = /(อาจารย์|ใครสอน|ผู้สอน|lecturer|instructor|professor|อ\.\s?\S)/i;
const RE_SUBJECTS = /(วิชาอะไรบ้าง|มีวิชาอะไร|รายวิชา|เรียนวิชาอะไร|วิชาของปี|วิชาปี)/;

/** Which deterministic guide routes a question asks for. */
export function guideRoutes(text) {
  const t = String(text || '');
  const yearM = /(?:ปี|year|y)\s*([1-6])\b/i.exec(t);
  const term = /(กลางภาค|มิดเทอม|midterm)/i.test(t) ? 'midterm' : /(ปลายภาค|ไฟนอล|final)/i.test(t) ? 'final' : null;
  return {
    whatsNew: RE_WHATS_NEW.test(t),
    exam: RE_EXAM.test(t) ? { term, year: yearM ? Number(yearM[1]) : null } : null,
    lecturer: RE_LECTURER.test(t),
    subjects: RE_SUBJECTS.test(t) ? { year: yearM ? Number(yearM[1]) : null } : null,
  };
}

/** The feature a routed guide answer should offer as a button. */
const ROUTE_FEATURE = { whatsNew: 'about', exam: 'schedule', lecturer: 'faculty' };

/**
 * Guide documents for a question, best first.
 * @returns {{ picks: Array<{ doc, score, coverage }>, featureId: string|null, routed: boolean }}
 */
export async function retrieveGuide(text, concepts, { facetWords = [], now = new Date(), questionCounts, limit = 4 } = {}) {
  const routes = guideRoutes(text);
  const { docs, index } = await loadGuide(questionCounts);
  const picks = [];
  let featureId = null;
  if (routes.exam) {
    const all = await examDocs(now);
    const rankOf = (d) => (d.year === CURRENT_YEAR ? 0 : 2) + (d.upcoming ? 0 : 1);
    const want = all
      .filter((d) => !routes.exam.term || d.term === routes.exam.term)
      .filter((d) => !routes.exam.year || d.year === routes.exam.year)
      // The current cohort's year first, a paper still ahead before one that
      // is over.
      .sort((a, b) => rankOf(a) - rankOf(b));
    for (const d of want.slice(0, 2)) picks.push({ doc: d, score: 100, coverage: 1 });
    featureId = ROUTE_FEATURE.exam;
  }
  if (routes.whatsNew) {
    for (const d of docs.filter((x) => x.gtype === 'release').slice(0, 4)) picks.push({ doc: d, score: 90, coverage: 1 });
    featureId = featureId || ROUTE_FEATURE.whatsNew;
  }
  if (routes.subjects) {
    const year = routes.subjects.year || CURRENT_YEAR;
    const d = docs.find((x) => x.gtype === 'year' && x.year === year);
    if (d) picks.push({ doc: d, score: 80, coverage: 1 });
  }
  if (concepts.length) {
    const filter = routes.lecturer ? (d) => d.gtype === 'instructor' || d.gtype === 'subject' : null;
    const { results } = index.rank(concepts, { facetWords, filter, limit: limit * 2 });
    for (const r of results) {
      if (picks.length >= limit + 2) break;
      if (picks.some((p) => p.doc === docs[r.i])) continue;
      picks.push({ doc: docs[r.i], score: r.score, coverage: r.coverage });
    }
    if (routes.lecturer && !featureId) featureId = ROUTE_FEATURE.lecturer;
  }
  const top = picks.slice(0, limit + (routes.exam && routes.whatsNew ? 2 : 0));
  if (!featureId) featureId = top.find((p) => p.doc.featureId && p.coverage >= 0.5)?.doc.featureId || null;
  return { picks: top, featureId, routed: Boolean(routes.exam || routes.whatsNew || routes.subjects) };
}

/** A short display line for a guide document. */
export const guideSubtitle = (d) => clip(d.heading || '', 120);
