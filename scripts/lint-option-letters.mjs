#!/usr/bin/env node
// ============================================================
// lint-option-letters — an option named by its letter on a shuffled card
// ============================================================
// The card letters options by their shuffled position, so "→ C ผิด" in an
// explanation, its read-aloud paragraph or a flag note points at whatever the
// shuffle put third. A question that cites letters keeps its order
// (`noShuffle: true`) until its text names the option instead (11 Nov 2026:
// 35 questions, listed in docs/releases/pending/quiet-labels.md for the
// content batch). This fails on a shuffled question that cites a letter.
// ============================================================
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { optionLetterCitations, isShuffled } from './lib/option-letters.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(root, p)).href);

// Letters that are content, not option names: each was read on 11 Nov 2026.
export const LETTERS_ARE_CONTENT = new Map([
  ['biochem-1:70034', 'the options are orders of steps named A to E'],
  ['biochem-1:74010', 'A, B and Z forms of DNA'],
  ['biochem-1:74011', 'A, B and Z forms of DNA'],
  ['biochem-1:75010', 'the free enzyme written (E)'],
  ['biochem-1:72027', 'the ampere, (A)'],
  ['com2:90540', 'the ABCD of triage'],
  ['com3:701', 'the ABCD of triage'],
  ['com5:572', 'Giardia assemblages A and B'],
  ['zoonoses:208108', 'Giardia assemblages'],
  ['food-safety-y4:92502', 'C for concentration in a formula'],
  ['food-safety-y4:92503', 'P(D), a probability'],
  ['one-health:210046', 'P(D), a probability'],
  ['herd-health-rum:94528', 'D for deficit in a formula'],
  ['vca:693124', 'a cell of the risk matrix'],
  ['aquatic-clinic:211075', 'the options are orders of steps named A to F'],
  ['equine-medicine:105309', 'vitamins C and D'],
  ['avian-medicine:105043', 'subtypes A to D of a pathogen, named in every option'],
  ['milk-meat-hygiene:101114', 'the first question of a decision tree, not an option'],
  ['livestock-pathology:8556', 'held back (unclear flag); a working note about the scanned paper'],
]);

/** Shuffled questions whose explanation, read-aloud text or flag note names an option by its letter. */
export function letterCitingShuffled(questions) {
  return questions
    .filter((q) => isShuffled(q) && !LETTERS_ARE_CONTENT.has(`${q.subject}:${q.id}`))
    .map((q) => ({ key: `${q.subject}:${q.id}`, found: optionLetterCitations(q) }))
    .filter((r) => r.found.length);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { QB, loadQB } = await imp('src/data/questions.js');
  await loadQB();
  const bad = letterCitingShuffled(QB);
  const stale = [...LETTERS_ARE_CONTENT.keys()].filter((k) => {
    const q = QB.find((x) => `${x.subject}:${x.id}` === k);
    return !q || !optionLetterCitations(q).length;
  });
  for (const r of bad) console.error(`  ${r.key}: ${r.found.map((f) => `${f.field} "${f.text}"`).join('; ')}`);
  for (const k of stale) console.error(`  ${k}: listed as content letters but cites none now; take it off the list`);
  if (bad.length || stale.length) {
    console.error(`✗ lint:option-letters: ${bad.length} shuffled question(s) name an option by its letter (set noShuffle: true or name the option), ${stale.length} stale list entr(y/ies)`);
    process.exit(1);
  }
  const held = QB.filter((q) => q.type === 'mcq' && q.noShuffle === true && optionLetterCitations(q).length).length;
  console.log(`✓ lint:option-letters: no shuffled question names an option by its letter (${held} keep their order for it, ${LETTERS_ARE_CONTENT.size} letters read as content)`);
}
