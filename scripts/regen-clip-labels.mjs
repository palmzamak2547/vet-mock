#!/usr/bin/env node
// ============================================================
// regen-clip-labels.mjs — regenerate src/data/clip-labels.generated.js
// ============================================================
// Why this file exists:
//   source-label.js turns a cited recording into words a student can read:
//   "7XyI0SjnuBA [12:34]" becomes "คาบ 1 (4 ส.ค.) นาที 12:34". It only knew
//   the recordings that are timetabled sessions in lecturer-sets.js, so a
//   question checked against a clip from another course (208044 and 208058
//   cite COM V's heartworm and protozoa clips) showed the bare eleven-character
//   id and no minute to open.
//
//   Every clip the app has a summary for is listed in video-summaries-meta.js,
//   but that file is about 270 KB, too much to load with every question's
//   source chip. This script keeps only what the chip needs: one short label
//   per clip, "คลิป COM V (1 เม.ย.)", built from the clip's subject name in
//   curriculum.js and its date.
//
// Usage:
//   node scripts/regen-clip-labels.mjs           # rewrite the module
//   node scripts/regen-clip-labels.mjs --check   # exit 1 when stale
//
// tests/unit/source-label.test.mjs fails when the checked-in copy is stale, so
// a change to video-summaries-meta.js (regen-video-meta.mjs) or to a subject
// name is caught by the unit suite.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sameGenerated } from './lib/same-generated.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
export const OUT = path.join(root, 'src/data/clip-labels.generated.js');

const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const EN_MONTH = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * The day and month a meta date names, as "1 เม.ย.", or '' when it does not
 * name both. The meta dates were written by hand in several ways:
 * "2025-10-14", "2025-5-6", "11 Feb 68", "7 Oct 2024 (DekDokVet85 recording)",
 * "27 มิ.ย. 69". A date it cannot read is left out rather than guessed.
 */
export function clipDate(raw) {
  const s = String(raw ?? '').trim();
  let day = 0;
  let month = 0;
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?!\d)/.exec(s);
  if (m) {
    month = Number(m[2]);
    day = Number(m[3]);
  } else if ((m = /^(\d{1,2})\s+([A-Za-z]{3})[A-Za-z]*\.?(?:\s|$)/.exec(s))) {
    day = Number(m[1]);
    month = EN_MONTH.indexOf(m[2].toLowerCase()) + 1;
  } else if ((m = /^(\d{1,2})\s+(\S+)(?:\s|$)/.exec(s))) {
    day = Number(m[1]);
    month = TH_MONTH.indexOf(m[2]) + 1;
  }
  if (!(month >= 1 && month <= 12 && day >= 1 && day <= 31)) return '';
  return `${day} ${TH_MONTH[month - 1]}`;
}

/**
 * The Buddhist-era year a meta date names, or 0 when it names none. Four
 * digits above 2400 are already BE, four below are CE; two digits are the
 * short BE year the hand-written dates use ("11 Feb 68", "27 มิ.ย. 69").
 */
export function clipYearBE(raw) {
  const s = String(raw ?? '').trim();
  let m = /^(\d{4})-\d{1,2}-\d{1,2}(?!\d)/.exec(s);
  if (!m) m = /^\d{1,2}\s+\S+\s+(\d{2}|\d{4})(?!\d)/.exec(s);
  if (!m) return 0;
  const y = Number(m[1]);
  if (m[1].length === 2) return 2500 + y;
  return y > 2400 ? y : y + 543;
}

/**
 * A clip from an earlier academic year says its year: "7 พ.ย. 2568", so a
 * recording of last November never reads as one still to come this term. The
 * current year's clips stay "7 ต.ค.". The academic year is SEMESTER.id's BE
 * year and starts in June (the first term opens in August).
 */
export function clipDateLabel(raw, academicYearBE) {
  const day = clipDate(raw);
  if (!day || !academicYearBE) return day;
  const year = clipYearBE(raw);
  if (!year) return day;
  const [, month] = /^\d+ (\S+)$/.exec(day) || [];
  const monthIndex = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].indexOf(month);
  const academic = monthIndex >= 5 ? year : year - 1;
  return academic < academicYearBE ? `${day} ${year}` : day;
}

const byCodePoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * { subject name: { videoId: "1 เม.ย." or '' } } for every clip in the meta
 * whose subject is in the curriculum, both levels sorted. Grouping by subject
 * writes each subject's name once instead of once per clip: 23 KB instead of
 * 56 KB for the same 644 labels.
 */
export function buildClipLabels({ meta, subjects, academicYearBE = 0 }) {
  const names = new Map(subjects.map((s) => [s.id, String(s.name || '').trim()]));
  const grouped = new Map();
  for (const id of Object.keys(meta).sort(byCodePoint)) {
    const entry = meta[id];
    const name = names.get(entry?.subject);
    // A clip whose subject is not in the curriculum keeps its raw id: an
    // honest pointer beats a label naming the wrong course.
    if (!name) continue;
    if (!grouped.has(name)) grouped.set(name, {});
    grouped.get(name)[id] = clipDateLabel(entry.date, academicYearBE);
  }
  return Object.fromEntries([...grouped.keys()].sort(byCodePoint).map((name) => [name, grouped.get(name)]));
}

export function renderClipLabels(labels) {
  return `// ============================================================
// CLIPS_BY_SUBJECT — what a summarised clip is called, for citations
// ============================================================
//
// AUTO-GENERATED by scripts/regen-clip-labels.mjs from
// src/data/video-summaries-meta.js, the video library (video-registry.generated.js)
// and the subject names in curriculum.js.
// Do NOT hand-edit; run \`node scripts/regen-clip-labels.mjs\`.
// tests/unit/source-label.test.mjs fails when this file is stale.
//
// source-label.js names a timetabled session "คาบ 1 (4 ส.ค.)". A cited clip
// that is not a session is named from here instead, "คลิป COM V (1 เม.ย.)",
// so the student never reads a bare eleven-character id. Shape:
// { subject name: { videoId: day and month (and the BE year for a clip from
// an earlier academic year), or '' when the meta has none } }.
// ============================================================

export const CLIPS_BY_SUBJECT = ${JSON.stringify(labels, null, 2)};
`;
}

/** The module text a fresh generation writes. A recording the video library
 *  holds but no summary covers yet (the final wrap-ups cite this term's late
 *  lectures) is labelled from the library's own subject and date; a
 *  summary's entry wins where both exist. */
export async function generateClipLabels() {
  const { VIDEO_META } = await import(pathToFileURL(path.join(root, 'src/data/video-summaries-meta.js')).href);
  const { VIDEO_REGISTRY } = await import(pathToFileURL(path.join(root, 'src/data/video-registry.generated.js')).href);
  const { SUBJECTS } = await import(pathToFileURL(path.join(root, 'src/data/curriculum.js')).href);
  const { SEMESTER } = await import(pathToFileURL(path.join(root, 'src/data/semester.js')).href);
  const library = Object.fromEntries(Object.entries(VIDEO_REGISTRY).map(([id, v]) => [id, { subject: v.subject, date: v.date }]));
  const academicYearBE = Number(String(SEMESTER.id).split('-', 1)[0]) || 0;
  return renderClipLabels(buildClipLabels({ meta: { ...library, ...VIDEO_META }, subjects: SUBJECTS, academicYearBE }));
}

const invokedDirectly = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invokedDirectly) {
  const body = await generateClipLabels();
  const rel = path.relative(root, OUT);
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (process.argv.includes('--check')) {
    if (!sameGenerated(current, body)) {
      console.error(`${rel} is stale; run: node scripts/regen-clip-labels.mjs`);
      process.exit(1);
    }
    console.log(`${rel} matches video-summaries-meta.js`);
    process.exit(0);
  }
  if (sameGenerated(current, body)) {
    console.log(`${rel} already current`);
  } else {
    fs.writeFileSync(OUT, body);
    console.log(`wrote ${rel}`);
  }
}
