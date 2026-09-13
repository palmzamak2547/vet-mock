#!/usr/bin/env node
/**
 * lint-glossary.mjs
 *
 * The glossary shows a definition next to a question. Get the scope
 * wrong and it shows a confident, well-typeset definition of a
 * different disease — which is worse than showing nothing, because the
 * student has no reason to doubt it. That happened: a poultry
 * Infectious Bursal Disease question opened a card about canine
 * inflammatory bowel disease, and nothing in the build objected.
 *
 * This is the gate that objects. It checks the things a human reviewer
 * cannot hold in their head across 100 entries:
 *   - every entry declares where it is true, using real subject ids
 *   - no two entries can both answer to the same term in the same
 *     subject (that is the ambiguity that produced the bug)
 *   - an alias never collides with another entry's canonical term
 *     inside a shared subject
 *   - the card's own house style: one-line defShort, Thai present,
 *     no answer-marking glyphs
 *
 * Usage:  node scripts/lint-glossary.mjs
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

const { GLOSSARY, SCOPE_FAMILIES, expandScope, entryKey } = await load('src/data/glossary.js');
const { SUBJECTS } = await load('src/data/curriculum.js');

const VALID_SUBJECTS = new Set(
  (Array.isArray(SUBJECTS) ? SUBJECTS : Object.values(SUBJECTS)).map((s) => s.id),
);
const VALID_CATEGORIES = new Set(['symptom', 'disease', 'drug', 'lab-value', 'anatomy', 'organism']);
const FORBIDDEN = [
  ['★', 'star marks the answer'],
  ['**', 'bold marks the answer'],
  ['…', 'ellipsis reads as truncated'],
  ['·', 'middle dot'],
];
const MAX_DEFSHORT = 120;

const errors = [];
const warnings = [];
const err = (term, msg) => errors.push(`${term}: ${msg}`);
const warn = (term, msg) => warnings.push(`${term}: ${msg}`);

// ── per-entry shape ──────────────────────────────────────────────
for (const e of GLOSSARY) {
  const t = e.term || '(no term)';
  if (!e.term) err('(entry)', 'missing `term`');
  if (!e.thai) err(t, 'missing `thai` — the card shows an English-only header');
  if (!VALID_CATEGORIES.has(e.category)) err(t, `category "${e.category}" is not one of ${[...VALID_CATEGORIES].join(' | ')}`);

  if (e.scope === undefined) {
    err(t, 'missing `scope` — say where this definition is true, or mark it \'universal\'');
  } else if (e.scope !== 'universal') {
    if (!Array.isArray(e.scope) || e.scope.length === 0) {
      err(t, '`scope` must be \'universal\' or a non-empty array');
    } else {
      for (const s of e.scope) {
        if (!SCOPE_FAMILIES[s] && !VALID_SUBJECTS.has(s)) {
          err(t, `scope "${s}" is neither a family nor a subject id in curriculum.js`);
        }
      }
    }
  }

  for (const a of e.aliases || []) {
    // The detector drops anything under 3 characters (two letters are never
    // unambiguous across disciplines), so a 2-char alias is dead weight that
    // reads like coverage.
    if (a.length < 3) err(t, `alias "${a}" is shorter than the detector's minimum and can never match`);
  }

  if (!e.defShort) err(t, 'missing `defShort`');
  else {
    if (e.defShort.length > MAX_DEFSHORT) err(t, `defShort is ${e.defShort.length} chars (max ${MAX_DEFSHORT})`);
    if (/[.]$/.test(e.defShort.trim())) warn(t, 'defShort ends with a period — it is a label, not a sentence');
  }
  if (!e.defLong) warn(t, 'no `defLong` — the card will be a single line');

  for (const field of ['defShort', 'defLong', 'thai']) {
    const v = e[field];
    if (!v) continue;
    for (const [glyph, why] of FORBIDDEN) {
      if (String(v).includes(glyph)) err(t, `${field} contains "${glyph}" (${why})`);
    }
  }
}

// ── cross-entry ambiguity: the bug class this file exists for ────
// Two entries may share a term ONLY if no subject can reach both.
const byKey = new Map();
for (const e of GLOSSARY) {
  for (const key of [e.term, ...(e.aliases || [])]) {
    const k = String(key).toLowerCase();
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(e);
  }
}
for (const [key, list] of byKey) {
  if (list.length < 2) continue;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = expandScope(list[i].scope);
      const b = expandScope(list[j].scope);
      if (a === 'universal' && b === 'universal') {
        err(key, `two universal entries answer to this key (${list[i].term} / ${list[j].term}) — one must be scoped`);
        continue;
      }
      if (a === 'universal' || b === 'universal') continue; // scoped wins, resolvable
      const shared = [...a].filter((s) => b.has(s));
      if (shared.length) {
        err(key, `${list[i].term} and ${list[j].term} both answer to "${key}" in ${shared.slice(0, 3).join(', ')} — ambiguous`);
      }
    }
  }
}

// ── duplicate identity ───────────────────────────────────────────
const seenKeys = new Set();
for (const e of GLOSSARY) {
  const k = entryKey(e);
  if (seenKeys.has(k)) err(e.term, `duplicate entry identity "${k}"`);
  seenKeys.add(k);
}

// ── report ───────────────────────────────────────────────────────
const scoped = GLOSSARY.filter((e) => e.scope !== 'universal').length;
for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`✗ glossary: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`✓ ${GLOSSARY.length} glossary entries (${scoped} scoped, ${GLOSSARY.length - scoped} universal), no ambiguous terms${warnings.length ? `, ${warnings.length} warning(s)` : ''}`);
