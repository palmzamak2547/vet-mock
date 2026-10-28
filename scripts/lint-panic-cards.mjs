#!/usr/bin/env node
/**
 * lint-panic-cards.mjs
 *
 * The panic cards carry a course code printed on the artwork, and the app
 * carries one in curriculum.js. They are two copies of the same fact, so they
 * will drift. This fails when they do — the first run already caught
 * EQUINE MEDICINE printed as 3108510 against 3106510 in the curriculum.
 *
 * Also checks that every card names a real subject, that no two cards share a
 * code, that the art file each card points at exists, and, for every paper
 * that shows cards (PANIC_CARD_PAPERS), that each subject taught that term is
 * either carded or on that paper's no-card list.
 *
 * Usage: node scripts/lint-panic-cards.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (p) => import(pathToFileURL(path.join(ROOT, p)).href);

const { PANIC_CARDS, PANIC_CARD_PAPERS } = await load('src/data/panic-cards.js');
const { SUBJECTS_BY_YEAR } = await load('src/data/curriculum.js');
const { PHASES } = await load('src/lib/current-phase.js');

const errors = [];
const warnings = [];

const allSubjects = new Map(Object.values(SUBJECTS_BY_YEAR).flat().map((s) => [s.id, s]));

const seenCode = new Map();
for (const [id, card] of Object.entries(PANIC_CARDS)) {
  const subject = allSubjects.get(id);
  if (!subject) {
    errors.push(`${id}: no such subject in the curriculum`);
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

// Per paper: a subject taught that term with neither a card nor an entry on
// the no-card list has been forgotten rather than deliberately left out.
let papers = 0;
for (const [year, phases] of Object.entries(PANIC_CARD_PAPERS)) {
  for (const [phase, { cards = [], noCard = [] }] of Object.entries(phases)) {
    papers += 1;
    const where = `year ${year} ${phase}`;
    const semester = PHASES.find((p) => p.id === phase)?.semester;
    if (!semester) { errors.push(`${where}: ${phase} is not a phase (${PHASES.map((p) => p.id).join(', ')})`); continue; }
    const inScope = (SUBJECTS_BY_YEAR[year] || []).filter((s) => s.semester === semester);
    const byId = new Map(inScope.map((s) => [s.id, s]));
    const excused = new Set(noCard);
    for (const id of cards) {
      if (!PANIC_CARDS[id]) errors.push(`${where}: ${id} is listed but has no card`);
      if (!byId.has(id)) errors.push(`${where}: ${id} is not a subject taught that term`);
      if (excused.has(id)) errors.push(`${where}: ${id} is both carded and on the no-card list — one of the two is wrong`);
    }
    for (const s of inScope) {
      if (cards.includes(s.id) || excused.has(s.id)) continue;
      errors.push(`${where}: ${s.id} (${s.code}, ${s.name}) is taught that term but has neither a card nor a place on the no-card list`);
    }
    for (const id of excused) {
      if (!byId.has(id)) errors.push(`${where}: ${id} is on the no-card list, but is not a subject taught that term`);
    }
  }
}

for (const w of warnings) console.warn('  warn  ' + w);
for (const e of errors) console.error('  ERROR ' + e);
const cards = Object.keys(PANIC_CARDS).length;
console.log(`\n${cards} card(s) on ${papers} paper(s) — ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
