#!/usr/bin/env node
// ============================================================
// lint-source-line.mjs — the "ที่มา" line never gives the key away
// ============================================================
// Palm, 1 Nov 2026: "ตรงที่มาตอนทำโจทย์ บางอันอ่านแล้วสามารถรู้เฉลยได้ แก้ที".
// While a question is open, its source chip shows only the kind of source
// (src/lib/source-line.js), the wait hint and, where the paper moved, the
// origin note. This lint reads that text for every question in the bank and
// fails when it gives the key away by the rules in scripts/lib/answer-leak.mjs:
// a distinctive word of the correct option, the disease, drug or organism the
// key names, or for a true/false or written item the fact it tests.
//
// It is the same check tests/unit/source-line-no-spoiler.test.mjs runs on the
// rendered chip, here in the data lints, so an ingest that adds a new kind of
// source, or a change to what the line prints, cannot bring a leak back.
//
// Usage: node scripts/lint-source-line.mjs [--full]
//   --full  also report how many questions' FULL line (shown once the key is
//           on screen) would give the key away if it were shown before it,
//           by course: the size of what the wait holds back. Never fails.
// ============================================================
import { pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { leakOf } from './lib/answer-leak.mjs';
import { sourceLineBeforeAnswer, sourceLineAfterAnswer, SOURCE_LINE_WAIT } from '../src/lib/source-line.js';
import { originPaperNote } from '../src/lib/exam-scope.js';

const FULL = process.argv.includes('--full');

/** Everything the closed chip says while the question is open. */
export function preAnswerText(question) {
  return [sourceLineBeforeAnswer(question), SOURCE_LINE_WAIT, originPaperNote(question) || ''].filter(Boolean).join('\n');
}

export async function sourceLineLeaks() {
  const leaks = [];
  const held = [];
  let count = 0;
  for (const file of bankFiles()) {
    const { questions } = await readBank(file);
    for (const q of questions) {
      count += 1;
      const leak = leakOf(q, preAnswerText(q));
      if (leak) leaks.push({ file, q, leak, text: preAnswerText(q) });
      if (FULL) {
        const full = leakOf(q, sourceLineAfterAnswer(q));
        if (full) held.push({ q, full });
      }
    }
  }
  return { count, leaks, held };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { count, leaks, held } = await sourceLineLeaks();
  if (FULL) {
    const bySubject = {};
    for (const { q } of held) bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
    console.log(`The full line, if it were shown before the key, would give it away on ${held.length} questions:`);
    for (const [subject, n] of Object.entries(bySubject).sort((a, b) => b[1] - a[1])) console.log(`  ${subject}: ${n}`);
  }
  if (leaks.length) {
    console.error(`✗ lint:source-line: ${leaks.length} of ${count} questions show text that gives the key away before the answer:`);
    for (const { file, q, leak, text } of leaks.slice(0, 20)) {
      console.error(`  ${q.subject}#${q.id} (${file}) ${leak.rule}: ${leak.words.join(', ')}\n    shows: ${text.replace(/\n/g, ' | ')}`);
    }
    if (leaks.length > 20) console.error(`  ... and ${leaks.length - 20} more`);
    console.error('Before the key the line names only the kind of source (src/lib/source-line.js); keep document titles, pages and topics for after it.');
    process.exit(1);
  }
  console.log(`✓ lint:source-line: ${count} questions, none gives its key away in the source line before the answer`);
}
