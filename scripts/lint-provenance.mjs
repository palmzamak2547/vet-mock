#!/usr/bin/env node
// ============================================================
// lint-provenance.mjs: where a question came from is a checked vocabulary
// ============================================================
// Usage: node scripts/lint-provenance.mjs      (npm run lint:provenance)
//
// Whether a question counts as a sat paper decides the "ฝึกเฉพาะข้อสอบเก่า"
// counts and the order Panic Mode serves, and it has been read from free
// text. That reading has gone wrong in both directions three times. This lint
// holds the three provenance fields (sourceType, examOrigin and the
// อิงแนวข้อสอบ marker) to src/data/exam-origins.js, and fails on:
//
//   1. an examOrigin string nobody has filed in EXAM_ORIGINS;
//   2. a malformed EXAM_ORIGINS entry;
//   3. a sourceType outside SOURCE_TYPES;
//   4. an exam-aligned row without the marker (it would fall to band 2);
//   5. a row whose only marker is the short spelling "อิงแนวสอบ", which
//      isExamAlignedQuestion does not read, so Panic Mode never shows it
//      (three known rows wait for their own fix; the list may only shrink);
//   6. a row that is both a sat paper and marked, outside the fifty that
//      were reviewed as naming their paper;
//   7. a band-2 row whose origin is filed as a paper or as exam guidance:
//      Panic Mode never shows it, and the fix is the tag;
//   8. a row counted as a sat paper through its examOrigin while that origin
//      is filed as not a paper (one known row, cleared when the predicate
//      reads the map);
//   9. more rows without a sourceType, or more past-paper rows without an
//      examOrigin, than the budget. Both budgets may only fall;
//  10. a figure that does not resolve under public/, or more figures
//      without a real imageAlt than FIGURE_ALT_BUDGET (checkFigures).
//
// It also prints what switching isPastPaperQuestion to the map would move,
// so that switch can be made after the exams against a reviewed list.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';
import {
  EXAM_ORIGINS,
  ORIGIN_KINDS,
  PAPER_KINDS,
  SOURCE_TYPES,
  originEntry,
} from '../src/data/exam-origins.js';
import {
  isExamAlignedQuestion,
  isPastPaperQuestion,
  panicRank,
} from '../src/lib/question-metadata.js';

export const MARKER = 'อิงแนวข้อสอบ';
export const SHORT_MARKER = 'อิงแนวสอบ';

// Measured 2026-09-23. Lower these when the numbers fall; never raise them.
export const BUDGETS = Object.freeze({
  noSourceType: 3031,
  pastPaperWithoutOrigin: 428,
});

// Both a sat paper and marked, reviewed 2026-09-22/23 as correctly counted:
// each names its paper and the marker sits in tags or verified.
//   avian-medicine 17: sourceType past-paper, the seniors' post-exam record
//     (MID 86 audit pages) and the two matching sets marked Final
//   food-industry 18: student-compilation, "Aj. Sirawit / Aj. Mintra FIQC
//     Vet 83-85 Midterm"
//   milk-meat-hygiene 15: sourceType past-paper, RUM MID true/false set
export const REVIEWED_PAST_AND_ALIGNED = Object.freeze([
  206039, 206040, 206041, 206056, 206057, 206058, 206059, 206060, 206061, 206062,
  206063, 206064, 206107, 206108, 206109, 206161, 206162,
  202253, 202254, 202255, 202256, 202257, 202258, 202259, 202260, 202261,
  202262, 202263, 202264, 202265, 202266, 202268, 202269, 202270, 202271,
  104516, 104636, 104638, 104640, 104646, 104660, 104664, 104668, 104700,
  104732, 104740, 104742, 104748, 104770, 104786,
]);

// Carry only "อิงแนวสอบ", so band 1 cannot see them. Normalising them, and
// the academic-safety replacement that writes that spelling, is its own
// change (AGENTS.md 2026-09-22). Delete an id here when it is fixed.
export const KNOWN_SHORT_SPELLING = Object.freeze([4046, 5000, 5066]);

// Counted as a sat paper because "Swine Medicine midterm study notes" says
// "midterm". Clears when isPastPaperQuestion reads the map for typed rows.
export const KNOWN_ORIGIN_OVERCLAIMS = Object.freeze([105636]);

const label = (q) => `${q.subject || '?'} #${q.id}`;
const carries = (q, text) => (Array.isArray(q.tags) && q.tags.some((t) => String(t).includes(text)))
  || String(q.verified || '').includes(text)
  || String(q.examOrigin || '').includes(text);

/** Problems with an origin map entry, as strings. */
export function entryFaults(origin, entry) {
  const out = [];
  if (!entry || !ORIGIN_KINDS.includes(entry.kind)) return [`"${origin}": kind ${entry?.kind} is not one of ${ORIGIN_KINDS.join(', ')}`];
  if (entry.kind !== 'paper') {
    if (entry.cohort !== undefined || entry.paper !== undefined) out.push(`"${origin}": only a paper carries cohort and paper`);
    return out;
  }
  const cohorts = entry.cohort === null ? [] : [].concat(entry.cohort);
  if (entry.cohort === undefined || cohorts.some((c) => !Number.isInteger(c) || c < 70 || c > 99)) {
    out.push(`"${origin}": cohort ${JSON.stringify(entry.cohort)} is not a cohort number, a list of them, or null`);
  }
  if (!(entry.paper === null || PAPER_KINDS.includes(entry.paper))) {
    out.push(`"${origin}": paper ${JSON.stringify(entry.paper)} is not one of ${PAPER_KINDS.join(', ')} or null`);
  }
  return out;
}

/**
 * Check rows against the provenance rules.
 * @returns {{errors: string[], warnings: string[], counts: object, switchPreview: {into: object[], outOf: object[]}}}
 */
export function checkProvenance(rows, {
  origins = EXAM_ORIGINS,
  budgets = BUDGETS,
  reviewedPastAndAligned = REVIEWED_PAST_AND_ALIGNED,
  knownShortSpelling = KNOWN_SHORT_SPELLING,
  knownOverclaims = KNOWN_ORIGIN_OVERCLAIMS,
} = {}) {
  const errors = [];
  const warnings = [];
  const reviewed = new Set(reviewedPastAndAligned);
  const knownShort = new Set(knownShortSpelling);
  const knownOver = new Set(knownOverclaims);
  const entryOf = (origin) => (typeof origin === 'string' && Object.hasOwn(origins, origin) ? origins[origin] : null);

  // 2. the map itself
  for (const [origin, entry] of Object.entries(origins)) errors.push(...entryFaults(origin, entry));

  const unfiled = new Map();
  const used = new Set();
  const seen = { short: new Set(), both: new Set(), over: new Set() };
  let noSourceType = 0;
  let pastPaperWithoutOrigin = 0;
  const switchPreview = { into: [], outOf: [] };

  for (const q of rows) {
    const origin = q.examOrigin;
    const hasOrigin = origin !== undefined && origin !== null && origin !== '';
    const entry = hasOrigin ? entryOf(String(origin)) : null;
    const past = isPastPaperQuestion(q);
    const aligned = isExamAlignedQuestion(q);

    // 1. every origin is filed
    if (hasOrigin) {
      if (entry) used.add(String(origin));
      else {
        const list = unfiled.get(String(origin)) || [];
        list.push(q);
        unfiled.set(String(origin), list);
      }
    }

    // 3. sourceType vocabulary
    const typed = q.sourceType !== undefined && q.sourceType !== null;
    if (!typed) noSourceType++;
    else if (!Object.hasOwn(SOURCE_TYPES, q.sourceType)) {
      errors.push(`${label(q)}: sourceType "${q.sourceType}" is not one of ${Object.keys(SOURCE_TYPES).join(', ')}`);
    }

    // 4. exam-aligned carries its marker
    if (q.sourceType === 'exam-aligned' && !aligned) {
      errors.push(`${label(q)}: sourceType exam-aligned without "${MARKER}", so it sits in band 2`);
    }

    // 5. the short spelling alone
    if (carries(q, SHORT_MARKER) && !aligned && !past) {
      seen.short.add(q.id);
      if (!knownShort.has(q.id)) {
        errors.push(`${label(q)}: carries "${SHORT_MARKER}" but not "${MARKER}", so Panic Mode never shows it`);
      }
    }

    // 6. both a sat paper and marked
    if (past && aligned) {
      seen.both.add(q.id);
      if (!reviewed.has(q.id)) {
        errors.push(`${label(q)}: counted as a sat paper AND marked "${MARKER}"; a row cannot be both unless it names its paper and is reviewed`);
      }
    }

    // 7. a paper or exam guidance hidden in band 2
    if (entry && (entry.kind === 'paper' || entry.kind === 'aligned') && panicRank(q) === 2) {
      errors.push(`${label(q)}: examOrigin "${origin}" is filed as ${entry.kind} but the row is in band 2, so Panic Mode never shows it; tag it "${MARKER}"`);
    }

    // 8. counted as a paper through an origin filed as something else
    if (q.sourceType !== 'past-paper' && past && entry && entry.kind !== 'paper') {
      seen.over.add(q.id);
      if (!knownOver.has(q.id)) {
        errors.push(`${label(q)}: counted as a sat paper through examOrigin "${origin}", which is filed as ${entry.kind}`);
      }
    }

    // 9. ratchets
    if (past && !hasOrigin) pastPaperWithoutOrigin++;

    // What reading the map for typed rows would change.
    if (typed && q.sourceType !== 'past-paper' && q.sourceType !== 'lecture-derived') {
      const byMap = entry?.kind === 'paper';
      if (byMap && !past) switchPreview.into.push(q);
      if (!byMap && past) switchPreview.outOf.push(q);
    }
  }

  for (const [origin, list] of unfiled) {
    errors.push(`examOrigin "${origin}" (${list.length} row${list.length === 1 ? '' : 's'}, e.g. ${list.slice(0, 3).map(label).join(', ')}) is not filed in src/data/exam-origins.js`);
  }
  for (const [name, count] of [['noSourceType', noSourceType], ['pastPaperWithoutOrigin', pastPaperWithoutOrigin]]) {
    if (count > budgets[name]) errors.push(`${name}: ${count} rows, over the budget of ${budgets[name]}`);
    else if (count < budgets[name]) warnings.push(`${name}: ${count} rows, under the budget of ${budgets[name]}; lower BUDGETS.${name} to ${count}`);
  }
  for (const [list, set, what] of [
    [reviewedPastAndAligned, seen.both, 'REVIEWED_PAST_AND_ALIGNED'],
    [knownShortSpelling, seen.short, 'KNOWN_SHORT_SPELLING'],
    [knownOverclaims, seen.over, 'KNOWN_ORIGIN_OVERCLAIMS'],
  ]) {
    const stale = list.filter((id) => !set.has(id));
    if (stale.length) warnings.push(`${what}: ${stale.join(', ')} no longer need${stale.length === 1 ? 's' : ''} listing; delete ${stale.length === 1 ? 'it' : 'them'}`);
  }
  const unused = Object.keys(origins).filter((o) => !used.has(o));
  if (unused.length) warnings.push(`${unused.length} filed origin(s) no row uses any more: ${unused.slice(0, 5).map((o) => `"${o}"`).join(', ')}`);

  return {
    errors,
    warnings,
    counts: {
      rows: rows.length,
      origins: used.size,
      noSourceType,
      pastPaperWithoutOrigin,
      shortSpelling: seen.short.size,
      pastAndAligned: seen.both.size,
      overclaims: seen.over.size,
    },
    switchPreview,
  };
}

// ── Figures ─────────────────────────────────────────────────────────
// Where a question's figure comes from is provenance too. A figure path that
// does not resolve was only ever caught by regen-question-delivery, which
// blocks the question quietly: after a regen the gate was green and the
// question had left practice without anyone being told. And a figure with no
// imageAlt is announced as "ภาพประกอบข้อ <id> วิชา <subject>" by a screen reader.
// A figure is a path under public/ or an inline data:image; anything else
// fails. An imageAlt must describe what is visible (FIGURE_ALT_MIN
// characters, the rule q-counts.test.mjs already held epidemiology to)
// without giving the answer away.
export const FIGURE_ALT_MIN = 20;
// Rows with a figure but no real imageAlt. Measured 2026-09-23 at 55, then
// written for all of them. Lower it when it falls; never raise it.
export const FIGURE_ALT_BUDGET = 0;
const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url));

/** Figures that do not resolve, and figures that do not describe themselves. */
export function checkFigures(rows, { publicDir = PUBLIC_DIR, altBudget = FIGURE_ALT_BUDGET } = {}) {
  const errors = [];
  const warnings = [];
  let figures = 0;
  let missing = 0;
  const withoutAlt = [];
  for (const q of rows) {
    const src = q.image || q.imagePath;
    if (!src) continue;
    figures++;
    const value = String(src);
    if (value.startsWith('/')) {
      const onDisk = path.join(publicDir, value.split(/[?#]/)[0].replace(/^\/+/, ''));
      if (!fs.existsSync(onDisk)) {
        missing++;
        errors.push(`${label(q)}: figure ${value} does not exist under public/`);
      }
    } else if (!value.startsWith('data:image/')) {
      errors.push(`${label(q)}: figure ${value.slice(0, 80)} is neither a path under public/ nor an inline image`);
    }
    if ([...String(q.imageAlt || '').trim()].length < FIGURE_ALT_MIN) withoutAlt.push(q);
  }
  if (withoutAlt.length > altBudget) {
    errors.push(`${withoutAlt.length} figure(s) without an imageAlt of ${FIGURE_ALT_MIN}+ characters, over the budget of ${altBudget}: ${withoutAlt.slice(0, 8).map(label).join(', ')}`);
  } else if (withoutAlt.length < altBudget) {
    warnings.push(`figures without imageAlt: ${withoutAlt.length}, under the budget of ${altBudget}; lower FIGURE_ALT_BUDGET to ${withoutAlt.length}`);
  }
  return { errors, warnings, counts: { figures, missing, withoutAlt: withoutAlt.length } };
}

/** Everything lint:provenance fails on, over one set of rows. main() prints it. */
export function lintRows(rows, { publicDir } = {}) {
  const provenance = checkProvenance(rows);
  const figureCheck = checkFigures(rows, publicDir ? { publicDir } : {});
  return {
    provenance,
    figureCheck,
    errors: [...provenance.errors, ...figureCheck.errors],
    warnings: [...provenance.warnings, ...figureCheck.warnings],
  };
}

async function main() {
  const rows = [];
  for (const entry of BANK_REGISTRY) for (const q of await entry.load()) rows.push(q);
  const { provenance, figureCheck, errors, warnings } = lintRows(rows);
  const { counts, switchPreview } = provenance;

  const bySubject = (list) => Object.entries(list.reduce((acc, q) => ({ ...acc, [q.subject]: (acc[q.subject] || 0) + 1 }), {}))
    .map(([s, n]) => `${s} ${n}`).join(', ') || 'none';
  console.log(`lint:provenance: ${counts.rows} rows, ${counts.origins} filed origins in use`);
  console.log(`  no sourceType ${counts.noSourceType}/${BUDGETS.noSourceType}, past paper without examOrigin ${counts.pastPaperWithoutOrigin}/${BUDGETS.pastPaperWithoutOrigin}`);
  console.log(`  reviewed past-and-marked ${counts.pastAndAligned}, short spelling alone ${counts.shortSpelling}, origin over-claims ${counts.overclaims}`);
  console.log(`  if typed rows read the map: into band 0 ${switchPreview.into.length} (${bySubject(switchPreview.into)}); out of band 0 ${switchPreview.outOf.map(label).join(', ') || 'none'}`);
  console.log(`  figures ${figureCheck.counts.figures}: missing on disk ${figureCheck.counts.missing}, without imageAlt ${figureCheck.counts.withoutAlt}/${FIGURE_ALT_BUDGET}`);
  for (const w of warnings) console.log(`⚠️  ${w}`);
  if (errors.length) {
    for (const e of errors.slice(0, 60)) console.error(`✗ ${e}`);
    if (errors.length > 60) console.error(`  ... and ${errors.length - 60} more`);
    console.error(`\n${errors.length} provenance error(s).`);
    process.exit(1);
  }
  console.log('✓ provenance holds');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
