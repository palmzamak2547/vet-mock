#!/usr/bin/env node
// ============================================================
// verify-tags.mjs — check tags before they land
// ============================================================
// Usage: node scripts/verify-tags.mjs
//
// Tags decide what a student finds when they search one idea, so the failures
// that matter are: a tag naming the container instead of the concept, and the
// same idea spelled two ways so a search returns half the questions.
// ============================================================

import fs from 'node:fs';

const DIR = '.tags-fix';
const batches = JSON.parse(fs.readFileSync(`${DIR}/batches.json`, 'utf8'));

// A tag every question in a file would carry tells a student nothing.
const CONTAINER = /^(biochem|histology|histo|neuroanat|anatomy|physiology|microbiology|parasitology|vet|veterinary|exam|quiz|question|lecture|lab|midterm|final|year[-\s]?\d|ปี\s?\d)$/i;
const SHAPE = /^[A-Za-z0-9][A-Za-z0-9:&+.\u0E00-\u0E7F-]*$/;   // & for H&E

let total = 0, problems = 0, missing = 0;
const seenLower = new Map();      // lowercase -> first spelling, to catch splits
const report = [];

for (const b of batches) {
  const inPath = `${DIR}/${b.key}.in.json`;
  const outPath = `${DIR}/${b.key}.out.json`;
  if (!fs.existsSync(outPath)) { report.push(`✗ ${b.key}: no out.json`); missing++; continue; }

  const input = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  const out = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const results = Array.isArray(out) ? out : (out.results || []);
  const ids = new Set(input.map((q) => q.id));
  const seen = new Set();

  for (const r of results) {
    total++;
    if (!ids.has(r.id)) { report.push(`✗ ${b.key} #${r.id}: not in the batch`); problems++; continue; }
    if (seen.has(r.id)) { report.push(`✗ ${b.key} #${r.id}: returned twice`); problems++; }
    seen.add(r.id);

    const tags = r.tags || [];
    if (tags.length < 2 || tags.length > 3) { report.push(`✗ ${b.key} #${r.id}: ${tags.length} tag(s)`); problems++; }
    if (new Set(tags.map((t) => t.toLowerCase())).size !== tags.length) { report.push(`✗ ${b.key} #${r.id}: duplicate tags ${JSON.stringify(tags)}`); problems++; }

    for (const t of tags) {
      if (!SHAPE.test(t)) { report.push(`✗ ${b.key} #${r.id}: malformed tag "${t}"`); problems++; }
      if (CONTAINER.test(t)) { report.push(`✗ ${b.key} #${r.id}: "${t}" names the container, not the concept`); problems++; }
      if (/\s/.test(t)) { report.push(`✗ ${b.key} #${r.id}: "${t}" has a space — use kebab-case`); problems++; }
      const k = t.toLowerCase().replace(/-/g, '');
      const first = seenLower.get(k);
      if (first && first !== t) report.push(`· split spelling: "${first}" and "${t}"`);
      else if (!first) seenLower.set(k, t);
    }
  }
  for (const q of input) if (!seen.has(q.id)) { report.push(`✗ ${b.key} #${q.id}: no tags returned`); missing++; }
}

const splits = report.filter((r) => r.startsWith('·')).length;
for (const line of report.filter((r) => !r.startsWith('·'))) console.log(line);
for (const line of report.filter((r) => r.startsWith('·')).slice(0, 15)) console.log(line);
console.log(`\n${total} tagged · ${problems} problem(s) · ${missing} missing · ${splits} split spelling(s) · ${seenLower.size} distinct tags`);
process.exitCode = problems || missing ? 1 : 0;
