#!/usr/bin/env node
/**
 * regen-exam-recurrence.mjs
 *
 * Palm, 2026-10-28: "เราจะได้สถิติว่าข้อไหน หรือแนวโน้มแบบไหน ที่ออกซ้ำข้าม
 * หลายรุ่นได้นะครับ ... ถ้าเราทำดีๆ เก็บข้อมูลดีๆ ออกแบบดีๆ". This is the data
 * layer for that: which topics, and which items, the papers of more than one
 * senior cohort have examined. It is history. Nothing here says what a coming
 * paper will hold, and a label built on it must read as history too
 * ("เคยออก N รุ่น"), which lint:answer-voice and lint:academic-safety enforce.
 *
 * Writes src/data/exam-recurrence.generated.js:
 *
 *   EXAM_RECURRENCE[subject].topics[topic]
 *     cohorts       the cohorts that sat an item on this topic, ascending
 *     first, last   the earliest and latest of them, or null
 *     items         past-paper items filed under the topic
 *     sat           cohort -> paper -> question keys: the evidence for every
 *                   cohort above, by the paper the origin names
 *     unattributed  past-paper items whose provenance names no sitting cohort
 *   EXAM_RECURRENCE_CLUSTERS
 *     the same item recorded more than once, with each copy's cohorts. A
 *     cluster whose cohorts number two or more is an item that recurred.
 *
 * Every number is the length of a list of question keys (`subject:id`), so
 * any count can be opened and checked.
 *
 * Evidence. A learner-ready question is a past-paper item when its examOrigin
 * is filed as a paper in src/data/exam-origins.js, or, with no filed origin,
 * when isPastPaperQuestion says so. The filing decides because it is a
 * person's reading of the string: 65 recalled items sit in Panic band 1 only
 * because the predicate's regex has not been switched to the filed kind yet.
 * The sitting cohort comes from src/lib/exam-origin-parse.js, read from
 * examOrigin and then from an explicit post-exam record in `source`; for an
 * origin that is only a file label, a cohort filed for it in exam-origins.js
 * counts unless it is the label's own number. It is null whenever none of
 * these names one, and never 86 off a label such as "Mid 86" or "TJ86"
 * (those name the cohort a compilation was made for: the TJ86 files are
 * senior recall notes gathered for Vet 86 before 86 sat the paper).
 * `verified` is never read: it cites the cohort's own lecture videos.
 * Exam years are parsed too but left out here: on 2026-10-28 no topic had
 * items from two dated sittings, so a year field would carry no recurrence.
 *
 * Same item. Two past-paper items are the same item when, measured on
 * 2026-10-28 over 2,334 items:
 *   - their stems agree on character trigrams (Jaccard >= 0.25; Thai has no
 *     spaces to split words on, and a recall is reworded: the one item two
 *     cohorts were found to share inside a subject, a foal's incisors read
 *     as about six weeks old by Vet 81 and Vet 85, scores 0.283), and
 *   - their keys agree (Jaccard >= 0.6 once a bracketed explanation is
 *     removed), because a stem alone joins siblings that ask the same frame
 *     about a different thing, and
 *   - nothing marks them as different: a different count of negations, a
 *     different number in the stems or in the keys, a key that only names
 *     options ("ถูกทุกข้อ"), stems about different animals, a key under eight
 *     letters with no number unless the stems agree to 0.4, keys that each
 *     say a dozen trigrams the other does not, or stems that each name a
 *     term the other item never mentions (sulfosalicylic against picric).
 * True/false items need stems at 0.6 and the same truth value; short and
 * essay items have no comparable key, so their stems must agree to 0.9.
 * A hand check of 20 pairs drawn from the final rule found 20 the same item,
 * and all 11 pairs that span two cohorts were read and are one item each.
 * The rule was fitted on four earlier samples of 20 pairs, and each guard
 * rejects a pair one of them showed to be two items; the pairs are kept in
 * tests/fixtures/exam-recurrence-pairs.json. The one true pair the guards
 * also reject (paralysis against paraplegia, both unattributed) stays split:
 * two distinct items must never be counted as one.
 * Clusters are complete-linkage: a third copy joins only when it passes
 * against every member, so a chain of near matches cannot pull in an item
 * that differs from its first link.
 *
 * Usage:  node scripts/regen-exam-recurrence.mjs
 *         node scripts/regen-exam-recurrence.mjs --check   (CI, via lint:data)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';
import { isQuestionDeliverable, questionDeliveryKey } from '../src/data/question-delivery.generated.js';
import { originEntry } from '../src/data/exam-origins.js';
import { isPastPaperQuestion, questionTopicId } from '../src/lib/question-metadata.js';
import { cohortList, compiledForCohorts, namesCohort, parseProvenance } from '../src/lib/exam-origin-parse.js';
import { sameGenerated } from './lib/same-generated.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const OUT = 'src/data/exam-recurrence.generated.js';

// ── Evidence ───────────────────────────────────────────────────────────────

/** A question that sat on a paper a cohort took. */
export function isPaperEvidence(question) {
  const filed = originEntry(question?.examOrigin);
  return filed ? filed.kind === 'paper' : isPastPaperQuestion(question);
}

/**
 * The cohorts a person filed for an origin string that names none itself.
 *
 * Only a label-only string qualifies ("COM I Final 86", "TJ86"): one with a
 * designator has already been read by the parser, author or sitter. And the
 * label's own number never counts: the years-1-4 lane found every TJ86 file
 * headed as senior recall notes compiled for Vet 86 before 86 sat the paper,
 * so the 86 those entries were filed with is the label read back, while an
 * 85 or 84 filed in its place comes from a block that names its cohort.
 */
export function filedCohorts(origin, filing = originEntry) {
  const entry = filing(origin);
  if (!entry || entry.kind !== 'paper' || namesCohort(origin)) return [];
  const label = new Set(compiledForCohorts(origin));
  return cohortList(entry.cohort).filter((cohort) => !label.has(cohort));
}

/**
 * Who sat it, and the paper its origin names (null when it names none).
 * Most specific first: a cohort the origin names, then a post-exam record in
 * the row's own source, then a cohort filed for a label-only origin.
 */
export function sittingOf(question, { filing = originEntry } = {}) {
  const origin = parseProvenance(question?.examOrigin, { field: 'examOrigin' });
  const named = cohortList(origin.cohort);
  const recorded = named.length ? [] : cohortList(parseProvenance(question?.source, { field: 'source' }).cohort);
  const cohorts = named.length ? named : recorded.length ? recorded : filedCohorts(question?.examOrigin, filing);
  return { cohorts, paper: origin.paper };
}

// ── Same item ──────────────────────────────────────────────────────────────

export const SAME_ITEM = Object.freeze({
  stem: 0.25,
  key: 0.6,
  trueFalseStem: 0.6,
  writtenStem: 0.9,
  weakKeyLength: 8,
  weakKeyStem: 0.4,
  keyResidual: 12,
  minStem: 12,
});

// Question frames carry no content and would make unrelated items look alike.
const FRAMES = [
  /ข้อใดต่อไปนี้/g,
  /ข้อใด(?:ถูก(?:ต้อง)?|ผิด|กล่าวถูก|กล่าวผิด|ไม่ถูกต้อง|คือ)?/g,
  /ต่อไปนี้/g,
  /จงเลือก(?:คำตอบ)?/g,
  /ถูกหรือผิด/g,
  /which (?:of the following|one|statement)/g,
  /true or false/g,
];
const NEGATION = /ไม่|ยกเว้น|ผิด|(?<![a-z])(?:not|except|false|incorrect|never)(?![a-z])/g;
// What is left of a key once these are removed has to say something.
const GENERIC_KEY_WORDS = /ถูก|ผิด|ทุก|เฉพาะ|ข้อ|และ|หรือ|กับ|ทั้ง|ไม่มี|ไม่|ต้อง|all|none|of|the|above|both|and|or|correct|incorrect|true|false|\d/g;
// Thai patterns stop short of the longer words they begin: ม้าม (spleen),
// ปลาย (end, as in ปลายภาค), หมู่ (group), หมาก.
const SPECIES = [
  ['dog', /สุนัข|หมา(?!ก)|(?<![a-z])(?:dogs?|canine|pupp(?:y|ies))(?![a-z])/],
  ['cat', /แมว|(?<![a-z])(?:cats?|feline|kittens?)(?![a-z])/],
  ['horse', /ม้า(?!ม)|(?<![a-z])(?:horses?|equine|foals?|mares?|stallions?)(?![a-z])/],
  ['cattle', /วัว|โคนม|โคเนื้อ|ลูกโค|แม่โค|โคสาว|(?<![a-z])(?:cattle|cows?|bovine|calf|calves|heifers?)(?![a-z])/],
  ['pig', /สุกร|หมู(?![่้])|(?<![a-z])(?:pigs?|swine|porcine|piglets?|sows?|boars?)(?![a-z])/],
  ['poultry', /ไก่|เป็ด|(?<![a-z])(?:chickens?|poultry|broilers?|ducks?|avian)(?![a-z])/],
  ['shrimp', /กุ้ง|(?<![a-z])(?:shrimps?|prawns?)(?![a-z])/],
  ['fish', /ปลา(?!ย)|(?<![a-z])fish(?:es)?(?![a-z])/],
  ['small-ruminant', /แพะ|แกะ|(?<![a-z])(?:goats?|sheep|ovine|caprine)(?![a-z])/],
];

function plain(text) {
  return String(text ?? '').normalize('NFC').replace(/\u0E4D\u0E32/g, '\u0E33')
    .toLowerCase().replace(/\*\*|__/g, '');
}
const unbracketed = (text) => plain(text).replace(/\([^()]*\)|\[[^[\]]*\]/g, ' ');
// "Phenobarbital (long-acting ...)", "Myoclonus — rhythmic jerk": the
// explanation one copy carries and the other does not.
const keyCore = (text) => unbracketed(text).replace(/\s[—–]\s.*$/, ' ');
const lettersAndDigits = (text) => text.replace(/[^\p{L}\p{M}\p{N}]+/gu, '');

/** The stem with frames, emphasis, punctuation and spaces taken out. */
export function normalizeStem(text) {
  let t = plain(text);
  for (const frame of FRAMES) t = t.replace(frame, ' ');
  return lettersAndDigits(t);
}

/** The text of the correct answer, or of the model answer for a written item. */
export function keyText(question) {
  const q = question || {};
  if (q.type === 'tf') return q.answer === true ? 'T' : q.answer === false ? 'F' : '';
  if (Array.isArray(q.options) && Number.isInteger(q.answer)) return String(q.options[q.answer] ?? '');
  if (Array.isArray(q.pairs)) return q.pairs.map((p) => `${p?.left ?? ''} ${p?.right ?? ''}`).join(' ');
  if (Array.isArray(q.blanks)) return q.blanks.join(' ');
  return String(q.model_answer ?? '');
}

function trigrams(text) {
  const out = new Set();
  for (let i = 0; i + 3 <= text.length; i++) out.add(text.slice(i, i + 3));
  if (!out.size && text) out.add(text);
  return out;
}
const numbersIn = (text) => [...new Set(text.match(/\d+(?:\.\d+)?/g) || [])].sort().join(',');
const speciesIn = (text) => new Set(SPECIES.filter(([, re]) => re.test(text)).map(([name]) => name));
// Latin terms of six letters or more, plural folded: the named things a stem is about.
const termsIn = (text) => new Set((text.match(/[a-z]{6,}/g) || []).map((w) => w.replace(/e?s$/, '')));
const WRITTEN = new Set(['tf', 'short', 'essay']);

/** Everything the same-item rule compares, computed once per question. */
export function fingerprint(question) {
  const q = question || {};
  const stem = normalizeStem(q.q);
  const key = keyText(q);
  const core = lettersAndDigits(keyCore(key));
  const raw = plain(q.q);
  return {
    key: questionDeliveryKey(q),
    type: q.type,
    written: WRITTEN.has(q.type),
    stemLength: stem.length,
    stem: trigrams(stem),
    keyGrams: trigrams(core),
    keyLength: core.length,
    keyHasDigit: /\d/.test(core),
    keyIsGeneric: core.replace(GENERIC_KEY_WORDS, '').length < 3,
    keyNumbers: numbersIn(keyCore(key)),
    truth: q.type === 'tf' ? q.answer : undefined,
    negations: (raw.match(NEGATION) || []).length,
    stemNumbers: numbersIn(raw),
    species: speciesIn(raw),
    terms: termsIn(unbracketed(q.q)),
    fullText: plain([q.q, ...(q.options || []), q.explain, q.model_answer, ...(q.blanks || []),
      ...(q.pairs || []).map((p) => `${p?.left ?? ''} ${p?.right ?? ''}`)].filter(Boolean).join(' ')),
  };
}

function overlap(a, b) {
  let n = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) n++;
  return n;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  const n = overlap(a, b);
  return n / (a.size + b.size - n);
}

/**
 * Whether two fingerprints are the same item, and the stem score that
 * decides merge order. Null when they are not.
 */
export function sameItem(a, b, rule = SAME_ITEM) {
  if (a.written !== b.written) return null;
  if (a.stemLength < rule.minStem || b.stemLength < rule.minStem) return null;
  const stem = jaccard(a.stem, b.stem);
  if (stem < rule.stem) return null;
  if (a.negations !== b.negations) return null;
  if (a.stemNumbers && b.stemNumbers && a.stemNumbers !== b.stemNumbers) return null;
  if (a.species.size && b.species.size && ![...a.species].some((s) => b.species.has(s))) return null;
  const aOnly = [...a.terms].filter((t) => !b.terms.has(t) && !b.fullText.includes(t));
  const bOnly = [...b.terms].filter((t) => !a.terms.has(t) && !a.fullText.includes(t));
  if (aOnly.length && bOnly.length) return null;
  if (a.written) {
    if (a.type === 'tf' && b.type === 'tf') {
      return a.truth === b.truth && stem >= rule.trueFalseStem ? { stem } : null;
    }
    if (a.type === 'tf' || b.type === 'tf') return null;
    return stem >= rule.writtenStem ? { stem } : null;
  }
  if (a.keyIsGeneric || b.keyIsGeneric) return null;
  if (a.keyNumbers && b.keyNumbers && a.keyNumbers !== b.keyNumbers) return null;
  if (jaccard(a.keyGrams, b.keyGrams) < rule.key) return null;
  const weak = (x) => x.keyLength < rule.weakKeyLength && !x.keyHasDigit;
  if ((weak(a) || weak(b)) && stem < rule.weakKeyStem) return null;
  const aSays = [...a.keyGrams].filter((g) => !b.keyGrams.has(g)).length;
  const bSays = [...b.keyGrams].filter((g) => !a.keyGrams.has(g)).length;
  if (Math.min(aSays, bSays) >= rule.keyResidual) return null;
  return { stem };
}

/** `subject:id` keys in subject order, then by id (numeric when both are). */
export function compareKeys(a, b) {
  const i = a.indexOf(':');
  const j = b.indexOf(':');
  const sa = a.slice(0, i);
  const sb = b.slice(0, j);
  if (sa !== sb) return sa < sb ? -1 : 1;
  const ia = a.slice(i + 1);
  const ib = b.slice(j + 1);
  const na = Number(ia);
  const nb = Number(ib);
  if (ia !== '' && ib !== '' && Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
  return ia < ib ? -1 : ia > ib ? 1 : 0;
}

/**
 * Same-item clusters over a list of questions, complete-linkage: pairs are
 * merged strongest first, and two groups join only when every cross pair is
 * the same item. Returns arrays of question keys, two or more each.
 */
export function sameItemClusters(questions, rule = SAME_ITEM) {
  const prints = questions.map(fingerprint).filter((p) => p.stemLength >= rule.minStem);
  const pairs = [];
  const linked = new Set();
  for (let i = 0; i < prints.length; i++) {
    for (let j = i + 1; j < prints.length; j++) {
      const a = prints[i];
      const b = prints[j];
      // Jaccard cannot reach the threshold when one set is far smaller.
      const [lo, hi] = a.stem.size < b.stem.size ? [a.stem.size, b.stem.size] : [b.stem.size, a.stem.size];
      if (lo < rule.stem * hi) continue;
      const verdict = sameItem(a, b, rule);
      if (!verdict) continue;
      const [x, y] = compareKeys(a.key, b.key) <= 0 ? [a.key, b.key] : [b.key, a.key];
      pairs.push({ x, y, stem: verdict.stem });
      linked.add(`${x}|${y}`);
    }
  }
  pairs.sort((p, q) => q.stem - p.stem || compareKeys(p.x, q.x) || compareKeys(p.y, q.y));
  const passes = (u, v) => linked.has(compareKeys(u, v) <= 0 ? `${u}|${v}` : `${v}|${u}`);
  const groupOf = new Map();
  for (const { x, y } of pairs) {
    const gx = groupOf.get(x) || [x];
    const gy = groupOf.get(y) || [y];
    if (gx === gy) continue;
    if (!gx.every((u) => gy.every((v) => passes(u, v)))) continue;
    const merged = [...gx, ...gy];
    for (const k of merged) groupOf.set(k, merged);
  }
  const groups = [...new Set(groupOf.values())].map((g) => [...g].sort(compareKeys));
  return groups.sort((a, b) => compareKeys(a[0], b[0]));
}

// ── Build ──────────────────────────────────────────────────────────────────

const PAPER_ORDER = ['midterm', 'final', 'quiz', 'osce', 'station', 'unknown'];

/**
 * The recurrence tables for a list of questions (pure: same input, same output).
 * @param {object[]} questions every question in the bank
 * @param {{ deliverable?: (q: object) => boolean }} [options]
 */
export function buildExamRecurrence(questions, { deliverable = isQuestionDeliverable } = {}) {
  const evidence = (questions || []).filter((q) => q && deliverable(q) && isPaperEvidence(q));
  const subjects = {};
  const sittings = new Map();
  for (const q of evidence) {
    const key = questionDeliveryKey(q);
    const { cohorts, paper } = sittingOf(q);
    sittings.set(key, cohorts);
    const subject = (subjects[q.subject] ||= { cohorts: new Set(), items: new Set(), topics: {} });
    const topic = (subject.topics[questionTopicId(q)] ||= { items: new Set(), sat: new Map(), unattributed: [] });
    subject.items.add(key);
    topic.items.add(key);
    if (!cohorts.length) { topic.unattributed.push(key); continue; }
    for (const cohort of cohorts) {
      subject.cohorts.add(cohort);
      if (!topic.sat.has(cohort)) topic.sat.set(cohort, new Map());
      const byPaper = topic.sat.get(cohort);
      const kind = paper || 'unknown';
      if (!byPaper.has(kind)) byPaper.set(kind, []);
      byPaper.get(kind).push(key);
    }
  }

  const table = {};
  for (const subjectId of Object.keys(subjects).sort()) {
    const s = subjects[subjectId];
    const topics = {};
    for (const topicId of Object.keys(s.topics).sort()) {
      const t = s.topics[topicId];
      const cohorts = [...t.sat.keys()].sort((a, b) => a - b);
      const sat = {};
      for (const cohort of cohorts) {
        const byPaper = t.sat.get(cohort);
        sat[cohort] = {};
        for (const kind of PAPER_ORDER) {
          if (byPaper.has(kind)) sat[cohort][kind] = [...byPaper.get(kind)].sort(compareKeys);
        }
      }
      topics[topicId] = {
        cohorts,
        first: cohorts.length ? cohorts[0] : null,
        last: cohorts.length ? cohorts[cohorts.length - 1] : null,
        items: t.items.size,
        sat,
        unattributed: [...t.unattributed].sort(compareKeys),
      };
    }
    table[subjectId] = {
      cohorts: [...s.cohorts].sort((a, b) => a - b),
      items: s.items.size,
      topics,
    };
  }

  const clusters = sameItemClusters(evidence).map((members) => {
    const cohorts = [...new Set(members.flatMap((k) => sittings.get(k) || []))].sort((a, b) => a - b);
    return { cohorts, members: members.map((k) => [k, sittings.get(k) || []]) };
  });

  return { subjects: table, clusters };
}

// ── Render ─────────────────────────────────────────────────────────────────

// Objects one key per line, lists of plain values (and lists of such lists,
// a cluster member's [key, cohorts]) on one line: a new key in a diff shows
// which topic and cohort it joined.
const isPlain = (v) => v === null || typeof v !== 'object';
const isFlat = (v) => isPlain(v) || (Array.isArray(v) && v.every(isPlain));

function render(value, indent = '') {
  if (Array.isArray(value)) {
    const flat = (v) => (Array.isArray(v) ? `[${v.map((x) => JSON.stringify(x)).join(', ')}]` : JSON.stringify(v));
    if (value.every(isFlat)) return `[${value.map(flat).join(', ')}]`;
    const inner = indent + '  ';
    return `[\n${value.map((v) => inner + render(v, inner)).join(',\n')},\n${indent}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (!entries.length) return '{}';
    const inner = indent + '  ';
    return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${render(v, inner)}`).join(',\n')},\n${indent}}`;
  }
  return JSON.stringify(value);
}

export function renderModule({ subjects, clusters }) {
  return [
    '// AUTO-GENERATED by scripts/regen-exam-recurrence.mjs - do not hand-edit.',
    '// Run `npm run regen:exam-recurrence` (or `npm run regen:all`) after a question',
    '// bank, src/data/exam-origins.js or src/lib/exam-origin-parse.js changes.',
    '//',
    '// Which topics and items the papers of senior cohorts have examined, by cohort.',
    '// History only: it records what earlier cohorts sat and claims nothing about a',
    '// coming paper. Every count is a list of question keys (subject:id). The rules,',
    '// and the hand check behind the same-item clusters, are in the generator header.',
    '',
    `export const EXAM_RECURRENCE = ${render(subjects)};`,
    '',
    `export const EXAM_RECURRENCE_CLUSTERS = ${render(clusters)};`,
    '',
  ].join('\n');
}

// ── Main ───────────────────────────────────────────────────────────────────

async function loadQuestions() {
  const all = [];
  for (const entry of BANK_REGISTRY) all.push(...(await entry.load()));
  return all;
}

export function summarize({ subjects, clusters }) {
  let items = 0;
  let attributed = 0;
  let recurring = 0;
  for (const s of Object.values(subjects)) {
    items += s.items;
    for (const t of Object.values(s.topics)) {
      attributed += t.items - t.unattributed.length;
      if (t.cohorts.length >= 2) recurring += 1;
    }
  }
  const across = clusters.filter((c) => c.cohorts.length >= 2).length;
  return `${items} past-paper items, ${attributed} with a sitting cohort, ${recurring} topics sat by 2+ cohorts, ${clusters.length} same-item clusters (${across} across cohorts)`;
}

async function main() {
  const data = buildExamRecurrence(await loadQuestions());
  const output = renderModule(data);
  const file = path.join(ROOT, OUT);
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    if (!sameGenerated(current, output)) {
      console.error(`✗ ${OUT} is stale — run: npm run regen:exam-recurrence`);
      process.exit(1);
    }
    console.log(`✓ exam recurrence up to date: ${summarize(data)}`);
  } else {
    fs.writeFileSync(file, output, 'utf8');
    console.log(`✓ wrote ${OUT}: ${summarize(data)} (${Math.round(output.length / 1024)} KB)`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await main();
