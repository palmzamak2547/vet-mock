#!/usr/bin/env node
// ============================================================
// lint-source-line.mjs — nothing on the card gives the key away early
// ============================================================
// Palm, 1 Nov 2026: "ตรงที่มาตอนทำโจทย์ บางอันอ่านแล้วสามารถรู้เฉลยได้ แก้ที".
// While a question is open, its source chip shows only the kind of source
// (src/lib/source-line.js), the wait hint and, where the paper moved, the
// origin note; a data-conflict flag shows its warning but not its note; the
// meta row above the stem shows the topic unless its label would name the
// key. This lint reads all of it for every question in the bank and fails
// when any of it gives the key away by the rules in
// scripts/lib/answer-leak.mjs: a distinctive word of the correct option, the
// disease, drug or organism the key names, or for a true/false or written
// item the fact it tests.
//
// A figure's caption and credit sit under the picture while the question is
// open, on the question card and on the review card. They are read too, by
// figureTextLeak, which holds them to more: epidemiology 100004 asked which
// animal is the mixing vessel above the caption "สุกรเป็น mixing vessel; …",
// every word of which the stem or another option also carries.
//
// It writes src/data/source-line.generated.js, which the card reads, and
// fails when that file has drifted from the bank, the curriculum, the origin
// filing or the check: TOPIC_CHIP_HELD, the questions whose topic label would
// give the key away, and COHORT_UNCONFIRMED, the paper origins whose filed
// cohort exam-origin-parse.js does not find in them (a file label's "86"),
// which the line then prints without a cohort. Both are decided here, in
// Node, so the browser needs neither the word segmenter nor the parser.
// tests/unit/source-line-no-spoiler.test.mjs runs the same check on the
// rendered chip and the rendered meta row.
//
// Usage: node scripts/lint-source-line.mjs [--full] [--write]
//   --write  rewrite source-line.generated.js (npm run regen:source-line)
//   --full   also report how many questions' FULL source line (shown once the
//            key is on screen) would give the key away if it came before it,
//            by course: the size of what the wait holds back. Never fails.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { figureTextLeak, leakOf } from './lib/answer-leak.mjs';
import { sameGenerated } from './lib/same-generated.mjs';
import {
  sourceLineBeforeAnswer, sourceLineAfterAnswer, SOURCE_LINE_WAIT,
  topicChipText, holdsTopicChip, TOPIC_CHIP_WAIT, flagChipText,
} from '../src/lib/source-line.js';
import { originPaperNote } from '../src/lib/exam-scope.js';
import { SUBJECTS } from '../src/data/curriculum.js';
import { EXAM_ORIGINS } from '../src/data/exam-origins.js';
import { parseExamOrigin, cohortList } from '../src/lib/exam-origin-parse.js';

const FULL = process.argv.includes('--full');
const WRITE = process.argv.includes('--write');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const GENERATED_FILE = path.join(root, 'src/data/source-line.generated.js');

/** Paper origins whose filed cohort the one parser does not find in the string. */
export function unconfirmedCohorts() {
  const out = new Set();
  for (const [origin, entry] of Object.entries(EXAM_ORIGINS)) {
    if (entry.kind !== 'paper' || !cohortList(entry.cohort).length) continue;
    if (JSON.stringify(cohortList(entry.cohort)) !== JSON.stringify(cohortList(parseExamOrigin(origin).cohort))) out.add(origin);
  }
  return out;
}

/** Everything the source chip and the data-conflict flag say while the question is open. */
export function preAnswerText(question) {
  return [
    sourceLineBeforeAnswer(question), SOURCE_LINE_WAIT, originPaperNote(question) || '',
    question?.flag ? `${flagChipText(question.flag)} ${SOURCE_LINE_WAIT}` : '',
  ].filter(Boolean).join('\n');
}

/**
 * What a figure prints under itself while the question is open
 * (components/ZoomableImage.jsx, from Question.jsx and SRSessionView.jsx).
 */
export const FIGURE_TEXT_FIELDS = ['imageCaption', 'imageCredit'];

/** The fields of a question's figure text that give its key away: [{ field, text, leak }]. */
export function figureTextLeaks(question) {
  const out = [];
  for (const field of FIGURE_TEXT_FIELDS) {
    const text = question?.[field];
    if (typeof text !== 'string' || !text.trim()) continue;
    const leak = figureTextLeak(question, text);
    if (leak) out.push({ field, text, leak });
  }
  return out;
}

/** What the flag would open: shown only once the key is on screen. */
const flagDetail = (question) => (question?.flag
  ? [question.flag.note, ...(question.flag.sources || [])].filter(Boolean).join('\n')
  : '');

const TOPICS = new Map(SUBJECTS.flatMap((s) => (s.topics || []).map((t) => [`${s.id}\u0000${t.id}`, t])));
/** The topic label the meta row prints for a question, or '' when it prints none. */
export function topicLabelOf(question) {
  const topic = question?.topic && TOPICS.get(`${question.subject}\u0000${question.topic}`);
  return topic ? topicChipText(topic.label) : '';
}

/** What the meta row says for the topic while the question is open. */
export function topicBeforeAnswer(question) {
  const label = topicLabelOf(question);
  if (!label) return '';
  return holdsTopicChip(question) ? TOPIC_CHIP_WAIT : label;
}

/** The generated module for the held question keys and the unconfirmed cohorts. */
export function generatedModule(heldKeys, unconfirmed) {
  const list = (items) => [...items].sort().map((k) => `  ${JSON.stringify(k)},`);
  return [
    '// AUTO-GENERATED by `npm run regen:source-line` (scripts/lint-source-line.mjs --write). Do not hand-edit.',
    '',
    '// Questions whose topic label, printed above the stem before the answer, would give the key away',
    '// by scripts/lib/answer-leak.mjs. Question.jsx prints TOPIC_CHIP_WAIT in its place until the key is',
    '// on screen (src/lib/source-line.js holdsTopicChip).',
    'export const TOPIC_CHIP_HELD = new Set([',
    ...list(heldKeys),
    ']);',
    '',
    '// Paper origins whose filed cohort (src/data/exam-origins.js) src/lib/exam-origin-parse.js does',
    '// not find in the string, mostly a file label\'s "86": the source line names no cohort for them.',
    'export const COHORT_UNCONFIRMED = new Set([',
    ...list(unconfirmed),
    ']);',
    '',
  ].join('\n');
}

export async function sourceLineLeaks() {
  const leaks = [];
  const topicLeaks = [];
  const figureLeaks = [];
  const shouldHold = new Set();
  const held = [];
  const flagsHeld = [];
  let count = 0;
  let figureTexts = 0;
  for (const file of bankFiles()) {
    const { questions } = await readBank(file);
    for (const q of questions) {
      count += 1;
      const leak = leakOf(q, preAnswerText(q));
      if (leak) leaks.push({ file, q, leak, text: preAnswerText(q) });
      figureTexts += FIGURE_TEXT_FIELDS.filter((f) => typeof q[f] === 'string' && q[f].trim()).length;
      for (const hit of figureTextLeaks(q)) figureLeaks.push({ file, q, ...hit });
      const label = topicLabelOf(q);
      if (label && leakOf(q, label)) shouldHold.add(`${q.subject}:${q.id}`);
      const topicText = topicBeforeAnswer(q);
      const topicLeak = topicText && leakOf(q, topicText);
      if (topicLeak) topicLeaks.push({ file, q, leak: topicLeak, text: topicText });
      if (FULL) {
        const full = leakOf(q, sourceLineAfterAnswer(q));
        if (full) held.push({ q, full });
        const flag = flagDetail(q) && leakOf(q, flagDetail(q));
        if (flag) flagsHeld.push({ q, flag });
      }
    }
  }
  const unconfirmed = unconfirmedCohorts();
  const fresh = generatedModule(shouldHold, unconfirmed);
  const current = fs.existsSync(GENERATED_FILE) ? fs.readFileSync(GENERATED_FILE, 'utf8') : '';
  return { count, leaks, topicLeaks, figureLeaks, figureTexts, held, flagsHeld, shouldHold, unconfirmed, fresh, stale: !sameGenerated(current, fresh) };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { count, leaks, topicLeaks, figureLeaks, figureTexts, held, flagsHeld, shouldHold, unconfirmed, fresh, stale } = await sourceLineLeaks();
  if (WRITE) {
    fs.writeFileSync(GENERATED_FILE, fresh);
    console.log(`wrote ${path.relative(root, GENERATED_FILE)}: ${shouldHold.size} topic labels wait for the key, ${unconfirmed.size} filed cohorts unconfirmed`);
    process.exit(0);
  }
  if (FULL) {
    const bySubject = {};
    for (const { q } of held) bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
    console.log(`The full line, if it were shown before the key, would give it away on ${held.length} questions:`);
    for (const [subject, n] of Object.entries(bySubject).sort((a, b) => b[1] - a[1])) console.log(`  ${subject}: ${n}`);
    console.log(`A flag's note and sources, if they opened before the key, would give it away on ${flagsHeld.length} questions.`);
  }
  let failed = false;
  if (leaks.length) {
    failed = true;
    console.error(`✗ lint:source-line: ${leaks.length} of ${count} questions show a source line that gives the key away before the answer:`);
    for (const { file, q, leak, text } of leaks.slice(0, 20)) {
      console.error(`  ${q.subject}#${q.id} (${file}) ${leak.rule}: ${leak.words.join(', ')}\n    shows: ${text.replace(/\n/g, ' | ')}`);
    }
    if (leaks.length > 20) console.error(`  ... and ${leaks.length - 20} more`);
    console.error('Before the key the line names only the kind of source (src/lib/source-line.js); keep document titles, pages and topics for after it.');
  }
  if (stale) {
    failed = true;
    console.error(`✗ lint:source-line: src/data/source-line.generated.js is stale (${shouldHold.size} topic labels should wait for the key, ${unconfirmed.size} filed cohorts are unconfirmed). Run npm run regen:source-line.`);
  } else if (topicLeaks.length) {
    failed = true;
    console.error(`✗ lint:source-line: ${topicLeaks.length} questions show a topic that gives the key away before the answer:`);
    for (const { file, q, leak, text } of topicLeaks.slice(0, 20)) console.error(`  ${q.subject}#${q.id} (${file}) ${leak.rule}: ${leak.words.join(', ')}\n    shows: ${text}`);
  }
  if (figureLeaks.length) {
    failed = true;
    console.error(`✗ lint:source-line: ${figureLeaks.length} figure caption(s) or credit(s) give the key away before the answer:`);
    for (const { file, q, field, text, leak } of figureLeaks.slice(0, 20)) {
      console.error(`  ${q.subject}#${q.id} (${file}) ${field}, ${leak.rule}: ${leak.words.join(', ')}\n    shows: ${text}`);
    }
    if (figureLeaks.length > 20) console.error(`  ... and ${figureLeaks.length - 20} more`);
    console.error('A caption says what kind of picture it is or where its data comes from, never what the question asks; a credit names the source without a title that answers it.');
  }
  if (failed) process.exit(1);
  console.log(`✓ lint:source-line: ${count} questions, none gives its key away in the source line, the flag or the topic before the answer (${shouldHold.size} topic labels wait for it), nor in the ${figureTexts} caption(s) and credit(s) under a figure`);
}
