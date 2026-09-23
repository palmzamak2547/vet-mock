#!/usr/bin/env node
// ============================================================
// lint-citation-moments.mjs — a cited lecture moment exists in that lecture
// ============================================================
// A question cites the recording it was checked against as
// "<videoId> [mm:ss]", which humanSource renders as "คาบ N นาที mm:ss", and a
// summary's examFormat cites moments of its own recording. Following one is a
// promise that the fact is there. #207494 cited [12:06] in a recording whose
// summary had nothing near it, and the only checks were two scripts under the
// gitignored work/ folder, with a hard-coded checkout path and two different
// tolerances (90 s and 20 s).
//
// This is that check, tracked and in one place. A cite passes when:
//   - its recording has a summary (an unknown 11-character id is an error,
//     never skipped: nothing else would ever notice it);
//   - the time is well formed (seconds 00-59) and inside the recording:
//     VIDEO_META's durationMin is whole minutes, cut down, so a 52:08 cite in
//     a "52-minute" recording is real and the limit is the end of that minute;
//   - its start falls within [-60 s, +180 s] of a timestamp the recording's
//     summary carries. A summary stamps only its section headings, so a cite
//     a minute or two into a section is a legitimate mid-section reference,
//     and one that sits just before a heading is the tail of the previous
//     section. This window gives 0 alarms over 981 question cites and 169
//     examFormat cites; the old [-5, +90] and [-20, +20] windows each raised
//     false ones.
//
// What timing cannot prove: that the cite is in the RIGHT section. #207494's
// wrong [12:06] sat 87 s after a real heading and would pass this window. A
// reviewer still reads the section; this only guarantees the moment exists.
//
// Usage: node scripts/lint-citation-moments.mjs [--list]
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';

export const WINDOW = Object.freeze({ before: 60, after: 180 });
// Every current cite passes, so any fault is new.
export const BUDGET = 0;

const TIME = String.raw`\d{1,3}:\d{2}(?::\d{2})?`;
// "<id> [5:24], [3:47-4:01]": commas between brackets belong to one citation,
// the way humanSource reads them.
const CITE = new RegExp(String.raw`(?<![A-Za-z0-9_-])([A-Za-z0-9_-]{11})((?:\s*,?\s*\[${TIME}(?:\s*[-–]\s*${TIME})?\])+)`, 'g');
const BRACKET = new RegExp(String.raw`\[(${TIME})(?:\s*[-–]\s*(${TIME}))?\]`, 'g');

/** Seconds, or NaN when a field is out of range ("99:99"). */
export function seconds(t) {
  const parts = String(t).split(':').map(Number);
  if (parts.some((n) => !Number.isInteger(n) || n < 0)) return NaN;
  if (parts.slice(1).some((n) => n > 59)) return NaN;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** The timestamps a summary carries, ascending, in seconds. */
export function summaryMoments(summary) {
  return [...String(summary || '').matchAll(new RegExp(String.raw`\[(${TIME})`, 'g'))]
    .map((m) => seconds(m[1]))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

/** Every "<id> [time]" cite in a string: [{ id, start, end }] (end may be null). */
export function citesIn(text) {
  const out = [];
  for (const m of String(text || '').matchAll(CITE)) {
    const id = m[1];
    // An id carries a letter, and a digit or capital: plain lowercase words
    // like "information" are not recordings.
    if (!/[A-Za-z]/.test(id) || !/\d|[A-Z]/.test(id)) continue;
    for (const b of m[2].matchAll(BRACKET)) out.push({ id, start: b[1], end: b[2] || null });
  }
  return out;
}

/** Bracketed moments in an examFormat, which cites its own recording. */
export function examFormatMoments(text) {
  return [...String(text || '').matchAll(BRACKET)].map((b) => ({ start: b[1], end: b[2] || null }));
}

/**
 * Check one cite against its recording.
 * @param recording { moments: number[], durationMin?: number } or undefined
 * @returns null when it passes, otherwise the reason
 */
export function citeFault({ start, end }, recording) {
  if (!recording) return 'no summary for this recording id';
  const s = seconds(start);
  const e = end == null ? null : seconds(end);
  if (!Number.isFinite(s) || (end != null && !Number.isFinite(e))) return 'malformed time';
  const limit = Number(recording.durationMin) > 0 ? recording.durationMin * 60 + 59 : null;
  if (limit != null && (s > limit || (e != null && e > limit))) return `past the end of a ${recording.durationMin}-minute recording`;
  if (!recording.moments.length) return 'the summary carries no timestamps';
  if (!recording.moments.some((h) => s >= h - WINDOW.before && s <= h + WINDOW.after)) {
    const closest = recording.moments.reduce((a, b) => (Math.abs(b - s) < Math.abs(a - s) ? b : a));
    return `no summary timestamp within [-${WINDOW.before} s, +${WINDOW.after} s] (closest ${Math.floor(closest / 60)}:${String(closest % 60).padStart(2, '0')})`;
  }
  return null;
}

function strings(value, at, out) {
  if (typeof value === 'string') out.push([at, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${at}[${i}]`, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) strings(v, at ? `${at}.${k}` : k, out);
  return out;
}

/**
 * @param questions every bank row
 * @param recordings Map videoId -> { moments, durationMin, examFormat }
 */
export function checkCitationMoments({ questions, recordings }) {
  const faults = [];
  let checked = 0;
  for (const q of questions) {
    for (const [field, text] of strings(q, '', [])) {
      for (const cite of citesIn(text)) {
        checked++;
        const why = citeFault(cite, recordings.get(cite.id));
        if (why) faults.push({ where: `${q.subject}#${q.id} ${field}`, cite: `${cite.id} [${cite.start}${cite.end ? `-${cite.end}` : ''}]`, why });
      }
    }
  }
  for (const [id, rec] of recordings) {
    for (const cite of examFormatMoments(rec.examFormat)) {
      checked++;
      const why = citeFault(cite, rec);
      if (why) faults.push({ where: `examFormat of ${id}`, cite: `[${cite.start}${cite.end ? `-${cite.end}` : ''}]`, why });
    }
  }
  return { checked, faults };
}

/** Every recording that has a summary, from the per-subject source files. */
export async function loadRecordings(root) {
  const dir = path.join(root, 'src/data');
  const { VIDEO_META } = await import(pathToFileURL(path.join(dir, 'video-summaries-meta.js')).href);
  const recordings = new Map();
  for (const f of fs.readdirSync(dir).filter((x) => /^video-summaries-.*\.js$/.test(x) && x !== 'video-summaries-meta.js')) {
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    const entries = Object.values(mod).find((v) => v && typeof v === 'object' && !Array.isArray(v));
    if (!entries) continue;
    for (const [id, e] of Object.entries(entries)) {
      recordings.set(id, {
        moments: summaryMoments(e?.summary),
        durationMin: VIDEO_META[id]?.durationMin ?? null,
        examFormat: e?.examFormat || '',
      });
    }
  }
  return recordings;
}

export async function loadQuestions(root) {
  const rows = [];
  for (const file of bankFiles(path.join(root, 'src/data'))) rows.push(...(await readBank(file)).questions);
  return rows;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const [questions, recordings] = await Promise.all([loadQuestions(root), loadRecordings(root)]);
  const { checked, faults } = checkCitationMoments({ questions, recordings });
  console.log(`${recordings.size} recordings with a summary; ${checked} cited moments checked in ${questions.length} questions and every examFormat`);
  const list = process.argv.includes('--list') || faults.length <= 40;
  if (list) for (const f of faults) console.log(`  ${f.where}  ${f.cite}  ${f.why}`);
  if (faults.length > BUDGET) {
    console.error(`✗ ${faults.length} cited moment(s) do not land in their recording (budget ${BUDGET})`);
    process.exit(1);
  }
  console.log(`✓ every cited moment lands in its recording (${faults.length}/${BUDGET})`);
}
