#!/usr/bin/env node
// ============================================================
// lint-flag-severity — a note that disputes the key is a caution, not a note
// ============================================================
// The card shows the caution chip ("ข้อควรระวัง") for a `severity: 'major'`
// flag only; a minor note waits behind "ดูเต็ม" (docs/releases/pending/
// quiet-labels.md). A minor note that says another option may also be right,
// that the question is ambiguous or the key out of date, hides a dispute where
// a student does not look. This fails on such a note: make it major, or reword
// it if it does not dispute the key after all.
// ============================================================
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(root, p)).href);

/** Words that say the key is in dispute. One list, here. */
export const DISPUTE_WORDS = [
  'เถียงได้', 'กำกวม', 'อาจถูก', 'ถูกเช่นกัน', 'ตอบได้เช่นกัน', 'ล้าสมัย', 'ตอบได้มากกว่าหนึ่ง',
  'มากกว่าหนึ่งตัวเลือก', 'มากกว่าหนึ่งคำตอบ', 'มีคู่ที่ถูกมากกว่า', 'อาจนับเป็น', 'ให้ 2 คำตอบ',
  'ควรเป็น', 'ยังไม่ได้ยืนยัน',
  'outdated', 'ambiguous', 'arguably', 'two answers', '2 answers',
];

/** Words that say the key stands as it is: a note with one disputes nothing. */
export const KEY_STANDS_WORDS = ['เฉลยไม่เปลี่ยน', 'เฉลยนี้ตาม'];
const STANDS = new RegExp(KEY_STANDS_WORDS.join('|'));
const DISPUTE = new RegExp(DISPUTE_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

/** The minor flags whose note disputes the key. */
export function disputedMinors(questions) {
  return questions
    .filter((q) => q?.flag && typeof q.flag === 'object' && q.flag.severity === 'minor'
      && DISPUTE.test(String(q.flag.note || '')) && !STANDS.test(String(q.flag.note || '')))
    .map((q) => ({ key: `${q.subject}:${q.id}`, word: String(q.flag.note).match(DISPUTE)[0], note: q.flag.note }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { QB, loadQB } = await imp('src/data/questions.js');
  await loadQB();
  const bad = disputedMinors(QB);
  if (bad.length) {
    for (const b of bad) console.error(`  ${b.key} ("${b.word}"): make it major or reword. ${b.note.slice(0, 100)}`);
    console.error(`✗ lint:flag-severity: ${bad.length} minor note(s) dispute the key`);
    process.exit(1);
  }
  const minors = QB.filter((q) => q?.flag?.severity === 'minor').length;
  console.log(`✓ lint:flag-severity: none of ${minors} minor notes disputes its key`);
}
