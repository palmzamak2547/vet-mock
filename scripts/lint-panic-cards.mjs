#!/usr/bin/env node
/**
 * lint-panic-cards.mjs
 *
 * The panic cards carry a course code printed on the artwork, and the app
 * carries one in curriculum.js. They are two copies of the same fact, so they
 * will drift. This fails when they do — the first run already caught
 * EQUINE MEDICINE printed as 3108510 against 3106510 in the curriculum.
 *
 * Also checks that every card names a real subject, that the subject is in the
 * scope the cards claim (ปี 5 เทอม 1), that no two cards share a code, and
 * that the art file each card points at exists.
 *
 * Usage: node scripts/lint-panic-cards.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (p) => import(pathToFileURL(path.join(ROOT, p)).href);

const { PANIC_CARDS, PANIC_CARD_SCOPE, PANIC_CARDS_NOT_EXAMINED } = await load('src/data/panic-cards.js');
const { SUBJECTS_BY_YEAR } = await load('src/data/curriculum.js');

const errors = [];
const warnings = [];

const inScope = (SUBJECTS_BY_YEAR[PANIC_CARD_SCOPE.year] || [])
  .filter((s) => s.semester === PANIC_CARD_SCOPE.semester);
const byId = new Map(inScope.map((s) => [s.id, s]));

const seenCode = new Map();
for (const [id, card] of Object.entries(PANIC_CARDS)) {
  const subject = byId.get(id);
  if (!subject) {
    errors.push(`${id}: no such subject in year ${PANIC_CARD_SCOPE.year} semester ${PANIC_CARD_SCOPE.semester}`);
    continue;
  }
  if (String(subject.code) !== String(card.code)) {
    errors.push(`${id}: card says ${card.code}, curriculum says ${subject.code} — one of them is wrong, and a student reads both`);
  }
  const clash = seenCode.get(String(card.code));
  if (clash) errors.push(`${card.code}: printed on two cards, ${clash} and ${id}`);
  seenCode.set(String(card.code), id);

  for (const field of ['en', 'th', 'paper', 'ink', 'art']) {
    if (!card[field]) errors.push(`${id}: missing ${field}`);
  }
  if (card.paper && !/^#[0-9a-f]{6}$/i.test(card.paper)) errors.push(`${id}: paper is not a hex colour`);
  if (card.ink && !/^#[0-9a-f]{6}$/i.test(card.ink)) errors.push(`${id}: ink is not a hex colour`);

  // The art is referenced from the page, so a missing file is a broken card
  // rather than a build error — it has to be checked here.
  if (card.art) {
    const artPath = path.join(ROOT, 'public', card.art.replace(/^\//, ''));
    if (!fs.existsSync(artPath)) warnings.push(`${id}: artwork not in the repo yet (${card.art})`);
  }
}

// A subject in scope with neither a card nor an entry on the pending list has
// been forgotten rather than deliberately left out.
const notExamined = new Set(PANIC_CARDS_NOT_EXAMINED || []);
for (const s of inScope) {
  if (PANIC_CARDS[s.id] || notExamined.has(s.id)) continue;
  errors.push(`${s.id} (${s.code}, ${s.name}): taught this term but has neither a card nor a place on the not-examined list`);
}
for (const id of notExamined) {
  if (PANIC_CARDS[id]) errors.push(`${id}: marked as not examined, but a card exists — one of the two is wrong`);
  else if (!byId.has(id)) errors.push(`${id}: marked as not examined, but is not a subject taught this term`);
}

for (const w of warnings) console.warn('  warn  ' + w);
for (const e of errors) console.error('  ERROR ' + e);
const cards = Object.keys(PANIC_CARDS).length;
console.log(`\n${cards} card(s), ${inScope.length} subject(s) in scope, ${notExamined.size} not examined at midterm — ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
