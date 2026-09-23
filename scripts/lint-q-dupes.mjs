#!/usr/bin/env node
// ============================================================
// lint-q-dupes.mjs — Detect duplicate Q TEXT across all subjects
// ============================================================
// Usage: node scripts/lint-q-dupes.mjs
//
// Why: Same question copy-pasted into multiple Q files is wasteful
// (user sees the same prompt twice during exam mode) and indicates
// content drift between past-paper sources. This catches near-dupes
// where the question stem has been re-typed almost identically.
//
// Logic:
//   1. Load QB (the spread of every subject Q file).
//   2. Normalize each Q's text:
//        - lowercase
//        - strip markdown bold/italics/strike: ** * _ ~
//        - strip middle-dot · (bullet style varies per file)
//        - collapse all whitespace to single space
//   3. Take the first 80 chars of the normalized text as the dupe key.
//      (Past-paper Qs often share an identical stem but diverge in
//      multiple-choice options or the exact final phrase — comparing
//      the lead-in catches the duplicates without false-flagging
//      legitimately-different questions.)
//   4. When the Q has a `passage`/`passage_title` (research-reading
//      mocks share generic stems like "What was the purpose of the
//      study?" applied to DIFFERENT passages — Mock 1 PASSAGE_PETS vs
//      Mock 4 PASSAGE_AMR), prefix the key with the passage_title or
//      passage hash so each passage-Q pair gets its own dupe bucket.
//   5. Group Qs sharing a key. Anything with >1 entry is a dupe set.
//
// Near-duplicates (added 2026-09-23). The 80-character key misses a copy
// that differs by one word: milk hygiene carried the same true/false
// sentence twice, keyed false in one bank and true in another, and this
// lint said 0 groups. So, within one subject:
//   6. Compare stems by character-bigram Dice (the method of
//      work/exam-content-pipeline/scripts/cross-group-dupes.mjs). A pair at
//      NEAR_STEM_DICE or above, with the same negations and the same
//      numbers in the stem, is a candidate.
//   7. Then the keys. True/false: same answer is a duplicate, opposite
//      answers are a CONTRADICTION. Multiple choice: a duplicate when each
//      copy's key is, among the other copy's options, the one closest to
//      it; when a key is closer to one of the other copy's distractors the
//      two ask different things ("thermophilic" vs "thermoduric
//      mesophiles" over the same four incubation options).
//   8. Rows held for answer review are not served, so they are skipped.
//
// A contradiction always fails. A duplicate fails unless it is in
// ALLOWED_NEAR_DUPLICATES (deliberate, with a reason) or in
// KNOWN_NEAR_DUPLICATES (found 2026-09-23, awaiting a merge). The known
// list may only shrink: an entry that no longer matches fails too, so it
// gets deleted the day its merge lands.
//
// Exit code 0 if no dupes, 1 otherwise (CI-friendly).
//
// Mirrors the style of scripts/lint-q-ids.mjs.
// ============================================================

import { pathToFileURL } from 'node:url';
import { questionNeedsAnswerReview } from '../src/lib/question-prediction.js';

export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[*_~·]/g, '')          // strip markdown emphasis + middle-dot
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim();
}

// Passage fingerprint: prefer the BODY over title because mock-exam
// passage_titles are intentionally generic ("Read this article and
// write a summary" appears on every Part II Q across all mocks). The
// first 80 normalized chars of the body discriminate cleanly between
// PASSAGE_BATS / PASSAGE_ATOPIC / PASSAGE_EARABSCESS without false
// flags. Falls back to title when body absent (rare).
function passageKey(item) {
  if (item.passage) return normalizeText(item.passage).slice(0, 80);
  if (item.passage_title) return normalizeText(item.passage_title).slice(0, 60);
  return '';
}

export function exactDuplicateGroups(questions) {
  const byKey = new Map();
  for (const item of questions) {
    const text = item.q || '';
    const norm = normalizeText(text);
    if (norm.length < 10) continue;     // skip near-empty stems
    // Passage-aware key: when present, a generic stem like "What was
    // the purpose of the study?" applied to two distinct passages should
    // NOT be flagged as a dupe (they're different exam items by design).
    const stemKey = norm.slice(0, 80);
    const passage = passageKey(item);
    const key = passage ? `${passage}|${stemKey}` : stemKey;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(item);
  }
  return { byKey, groups: [...byKey.entries()].filter(([, arr]) => arr.length > 1) };
}

// ── Near-duplicates ─────────────────────────────────────────────────────

export const NEAR_STEM_DICE = 0.88;
const NEAR_KEY_DICE = 0.7;

// Pairs that look alike on purpose. Each needs a reason a reviewer can check.
export const ALLOWED_NEAR_DUPLICATES = [
  {
    pair: ['milk-meat-hygiene:207261', 'milk-meat-hygiene:104754'],
    reason: 'Deliberate opposite pair: the udder VEIN statement is false and the ARTERY statement is true; 207261 records that it is the counterpart of 104754.',
  },
  {
    pair: ['com3:1505', 'com3:1305'],
    reason: 'The same resuscitation item recorded from two different papers (COM III Final 2019 and COM III Final 86); each is its own past-paper record.',
  },
  {
    pair: ['com3:1523', 'com3:1315'],
    reason: 'The same RECOVER advanced-life-support item recorded from two different papers (COM III Final 2019 and COM III Final 86); each is its own past-paper record.',
  },
  {
    pair: ['milk-meat-hygiene:207298', 'milk-meat-hygiene:207308'],
    reason: 'The raw-milk pH standard was asked in two post-tests (Lect 4.1 and Lect 4.2), each recorded under its own lecture topic.',
  },
];

// Found 2026-09-23 when this pass was added: the same question stored twice,
// usually once from the Vet 85 midterm recall and once from a compilation
// sheet with different distractors. `keep` is the copy to keep when the pair
// is merged (the past-paper record where there is one); the other copy's
// distractors and pointer should move onto it. Delete an entry when its merge
// lands. Never add to this list: a new duplicate is merged or allow-listed.
export const KNOWN_NEAR_DUPLICATES = [
  { pair: ['milk-meat-hygiene:105739', 'milk-meat-hygiene:104642'], keep: 'milk-meat-hygiene:105739' },
  { pair: ['milk-meat-hygiene:207462', 'milk-meat-hygiene:105741'], keep: 'milk-meat-hygiene:105741' },
  { pair: ['milk-meat-hygiene:207462', 'milk-meat-hygiene:104624'], keep: 'milk-meat-hygiene:104624' },
  { pair: ['milk-meat-hygiene:207438', 'milk-meat-hygiene:105707'], keep: 'milk-meat-hygiene:105707' },
  { pair: ['milk-meat-hygiene:207420', 'milk-meat-hygiene:105700'], keep: 'milk-meat-hygiene:105700' },
  { pair: ['milk-meat-hygiene:207459', 'milk-meat-hygiene:104776'], keep: 'milk-meat-hygiene:104776' },
  { pair: ['milk-meat-hygiene:105690', 'milk-meat-hygiene:104758'], keep: 'milk-meat-hygiene:105690' },
  { pair: ['milk-meat-hygiene:207455', 'milk-meat-hygiene:104676'], keep: 'milk-meat-hygiene:104676' },
  { pair: ['milk-meat-hygiene:207449', 'milk-meat-hygiene:104772'], keep: 'milk-meat-hygiene:104772' },
  { pair: ['milk-meat-hygiene:105734', 'milk-meat-hygiene:104670'], keep: 'milk-meat-hygiene:105734' },
  { pair: ['milk-meat-hygiene:207445', 'milk-meat-hygiene:105714'], keep: 'milk-meat-hygiene:105714' },
];

const compact = (s) => String(s ?? '').toLowerCase().replace(/[\s\u200b.,;:!?()[\]"'`\u2013\u2014\-*_~\u00b7]/g, '');

function grams(s) {
  const t = compact(s);
  const g = new Set();
  for (let i = 0; i < t.length - 1; i++) g.add(t.slice(i, i + 2));
  return g;
}

function dice(a, b) {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return (2 * n) / (a.size + b.size);
}

const NEGATION = /ไม่|ยกเว้น|ผิด|\bnot\b|\bexcept\b|\bfalse\b|\bincorrect\b/gi;
const negations = (s) => (String(s || '').match(NEGATION) || []).length;
const numbers = (s) => (String(s || '').match(/\d+(?:\.\d+)?/g) || []).sort().join(',');
const qKey = (q) => `${q.subject}:${q.id}`;
const pairKey = (a, b) => [a, b].sort().join('|');

function keyKind(q) {
  if (q.type === 'tf' && typeof q.answer === 'boolean') return 'tf';
  if (Array.isArray(q.options) && Number.isInteger(q.answer) && q.options[q.answer] != null) return 'mcq';
  return null;
}

// Among `other`'s options, is the one closest to `key` other's own key?
function keyLandsOnKey(key, other) {
  const k = grams(key);
  let best = -1;
  let bestScore = -1;
  let tie = false;
  other.options.forEach((option, i) => {
    const score = dice(k, grams(option));
    if (score > bestScore) { best = i; bestScore = score; tie = false; } else if (score === bestScore) tie = true;
  });
  return !tie && best === other.answer && bestScore >= NEAR_KEY_DICE;
}

/** Same-subject pairs whose stems nearly match and whose keys agree
 *  (duplicate) or, for true/false, disagree (contradiction). */
export function findNearDuplicates(questions) {
  const bySubject = new Map();
  for (const q of questions) {
    if (!q || questionNeedsAnswerReview(q)) continue;
    const kind = keyKind(q);
    if (!kind) continue;
    const g = grams(q.q);
    if (g.size < 8) continue;
    const row = { q, kind, g, neg: negations(q.q), num: numbers(q.q), passage: passageKey(q), image: q.image || q.imagePath || '' };
    if (!bySubject.has(q.subject)) bySubject.set(q.subject, []);
    bySubject.get(q.subject).push(row);
  }

  const found = [];
  for (const rows of bySubject.values()) {
    rows.sort((x, y) => x.g.size - y.g.size);
    for (let i = 0; i < rows.length; i++) {
      const a = rows[i];
      for (let j = i + 1; j < rows.length; j++) {
        const b = rows[j];
        // sorted by size: once b is too long for a, every later row is too
        if (a.g.size / b.g.size < 0.78) break;
        if (a.kind !== b.kind || a.neg !== b.neg || a.num !== b.num) continue;
        if (a.passage !== b.passage || a.image !== b.image) continue;
        const d = dice(a.g, b.g);
        if (d < NEAR_STEM_DICE) continue;
        let kind = null;
        if (a.kind === 'tf') {
          kind = a.q.answer === b.q.answer ? 'duplicate' : 'contradiction';
        } else if (keyLandsOnKey(a.q.options[a.q.answer], b.q) && keyLandsOnKey(b.q.options[b.q.answer], a.q)) {
          kind = 'duplicate';
        }
        if (!kind) continue;
        const [ka, kb] = [qKey(a.q), qKey(b.q)].sort();
        found.push({ kind, a: ka, b: kb, stemDice: Math.round(d * 1000) / 1000 });
      }
    }
  }
  return found.sort((x, y) => y.stemDice - x.stemDice || x.a.localeCompare(y.a));
}

/** Near-duplicates measured against the allow-list and the known list. */
export function checkNearDuplicates(questions, { allowed = ALLOWED_NEAR_DUPLICATES, known = KNOWN_NEAR_DUPLICATES } = {}) {
  const found = findNearDuplicates(questions);
  const allowedKeys = new Set(allowed.map((e) => pairKey(...e.pair)));
  const knownKeys = new Set(known.map((e) => pairKey(...e.pair)));
  const seen = new Set(found.map((p) => pairKey(p.a, p.b)));
  const contradictions = found.filter((p) => p.kind === 'contradiction' && !allowedKeys.has(pairKey(p.a, p.b)));
  const duplicates = found.filter((p) => p.kind === 'duplicate'
    && !allowedKeys.has(pairKey(p.a, p.b)) && !knownKeys.has(pairKey(p.a, p.b)));
  const stale = known.filter((e) => !seen.has(pairKey(...e.pair)));
  return {
    found,
    contradictions,
    duplicates,
    stale,
    knownCount: found.filter((p) => knownKeys.has(pairKey(p.a, p.b))).length,
    allowedCount: found.filter((p) => allowedKeys.has(pairKey(p.a, p.b))).length,
  };
}

// ── CLI ─────────────────────────────────────────────────────────────────

async function main() {
  const { QB, loadQB } = await import('../src/data/questions.js');
  // Phase 3 lazy QB rework (2026-05-17): QB starts empty; must await load.
  await loadQB();

  const { byKey, groups: dupeGroups } = exactDuplicateGroups(QB);
  const near = checkNearDuplicates(QB);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Q TEXT DUPLICATE LINT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total Qs: ${QB.length}`);
  console.log(`Unique 80-char keys: ${byKey.size}`);
  console.log(`Duplicate groups: ${dupeGroups.length}`);
  const dupeQCount = dupeGroups.reduce((acc, [, arr]) => acc + arr.length, 0);
  console.log(`Qs involved in duplicates: ${dupeQCount}`);
  console.log(`Near-duplicate pairs (stem Dice >= ${NEAR_STEM_DICE}, same subject): ${near.found.length}`
    + ` — allow-listed ${near.allowedCount}, known and awaiting merge ${near.knownCount}`);
  console.log('');

  let failed = false;

  if (dupeGroups.length) {
    failed = true;
    // Sort biggest groups first so the worst offenders are obvious.
    dupeGroups.sort((a, b) => b[1].length - a[1].length);
    console.log('Duplicate groups (subject:topic#id):');
    console.log('');
    for (const [key, arr] of dupeGroups) {
      const preview = key.length > 70 ? key.slice(0, 70) + '…' : key;
      console.log(`  ▸ "${preview}"`);
      for (const q of arr) {
        const subject = q.subject || '?';
        const topic = q.topic || q.tags?.[0] || '-';
        const id = q.id ?? '?';
        console.log(`      ${subject} :: ${topic} :: id=${id}`);
      }
      console.log('');
    }
  }

  if (near.contradictions.length) {
    failed = true;
    console.log('✗ Two copies of one statement with OPPOSITE keys — a student is marked wrong by one of them:');
    for (const p of near.contradictions) console.log(`      ${p.a}  vs  ${p.b}  (stem Dice ${p.stemDice})`);
    console.log('   Settle the key against the source, or hold the doubtful copy with flag: { severity: \'unclear\', note } until it is.');
    console.log('');
  }

  if (near.duplicates.length) {
    failed = true;
    console.log('✗ Near-duplicate questions not on the allow-list:');
    for (const p of near.duplicates) console.log(`      ${p.a}  ~  ${p.b}  (stem Dice ${p.stemDice})`);
    console.log('   Merge them (keep the past-paper copy), or allow-list the pair with a reason.');
    console.log('');
  }

  if (near.stale.length) {
    failed = true;
    console.log('✗ KNOWN_NEAR_DUPLICATES entries that no longer match — delete them from the list:');
    for (const e of near.stale) console.log(`      ${e.pair.join('  ~  ')}`);
    console.log('');
  }

  if (!failed) {
    console.log('✅ No duplicate Q text found. No action needed.');
    return 0;
  }

  console.log('💡 To resolve:');
  console.log('   1. Pick the canonical Q (best wording / most complete options)');
  console.log('   2. Delete the others, OR rephrase the stem if both questions');
  console.log('      really do test different concepts and just happen to share');
  console.log('      a lead-in.');
  console.log('   3. Re-run `npm run lint:dupes` until clean.');
  return 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(await main());
}
