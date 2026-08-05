#!/usr/bin/env node
// ============================================================
// merge-conflict-notes.mjs — add conflict notes to the corrections overlay
// ============================================================
// Usage:
//   node scripts/merge-conflict-notes.mjs <entries.json>          # report
//   node scripts/merge-conflict-notes.mjs <entries.json> --write  # merge
//
// Input is an array of already-verified conflict notes:
//   { sectionId, severity, lectureSays, evidenceSays, examAdvice, sourceRef }
//
// This is the sibling of apply-note-corrections.mjs. That script is for a
// disagreement where the NOTE ITSELF was wrong and had to be rewritten. This
// one is for a disagreement where the note is a faithful record of what the
// lecturer taught, and it is the literature that differs — nothing in the note
// needs fixing, the conflict just needs to be visible next to it.
//
// A section id that matches no section in the corpus is refused rather than
// written, because a correction attached to nothing is invisible and would sit
// in the file looking like coverage.
// ============================================================

import fs from 'node:fs';
import { loadTopic } from '../src/lib/vetwiki/index.js';
import { CORRECTIONS } from '../src/lib/vetwiki/corrections.js';

const [, , FILE] = process.argv;
const WRITE = process.argv.includes('--write');
if (!FILE) { console.error('usage: merge-conflict-notes.mjs <entries.json> [--write]'); process.exit(2); }

const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entries = Array.isArray(raw) ? raw : (raw.entries || []);

// A section id is subject--topic--slug, so the first two parts address a topic.
const topicCache = new Map();
function sectionExists(sectionId) {
  const parts = String(sectionId).split('--');
  if (parts.length < 3) return false;
  const [subject, topic] = parts;
  const key = `${subject}--${topic}`;
  if (!topicCache.has(key)) topicCache.set(key, loadTopic(subject, topic));
  const t = topicCache.get(key);
  return !!t?.sections?.some((s) => s.id === sectionId);
}

const REQUIRED = ['sectionId', 'severity', 'lectureSays', 'evidenceSays', 'examAdvice', 'sourceRef'];

const merged = new Map(Object.entries(CORRECTIONS).map(([k, v]) => [k, [...v]]));
const added = [], rejected = [], duplicate = [];

for (const e of entries) {
  const missing = REQUIRED.filter((f) => !e[f]);
  if (missing.length) { rejected.push(`${e.sectionId || '(no id)'}: missing ${missing.join(', ')}`); continue; }
  if (!['contradicts', 'narrows'].includes(e.severity)) { rejected.push(`${e.sectionId}: severity '${e.severity}'`); continue; }
  if (!sectionExists(e.sectionId)) { rejected.push(`${e.sectionId}: matches no section in the corpus`); continue; }

  const list = merged.get(e.sectionId) || [];
  if (list.some((x) => x.sourceRef === e.sourceRef)) { duplicate.push(e.sectionId); continue; }

  list.push({
    severity: e.severity,
    lectureSays: e.lectureSays,
    evidenceSays: e.evidenceSays,
    examAdvice: e.examAdvice,
    sourceRef: e.sourceRef,
  });
  merged.set(e.sectionId, list);
  added.push(e.sectionId);
}

console.log(`${entries.length} entr(ies) in`);
console.log(`added     : ${added.length}`);
console.log(`duplicate : ${duplicate.length} (same section, same source, left alone)`);
console.log(`rejected  : ${rejected.length}`);
for (const r of rejected) console.log(`   ✗ ${r}`);
console.log(`\ncorrections overlay becomes ${merged.size} section(s), ${[...merged.values()].reduce((a, v) => a + v.length, 0)} note(s)`);

if (!WRITE) { console.log('\n(dry run — pass --write to merge)'); process.exit(0); }

const obj = Object.fromEntries([...merged.entries()].sort());
const header = fs.readFileSync('src/lib/vetwiki/corrections.js', 'utf8').split('/** @type')[0];
fs.writeFileSync('src/lib/vetwiki/corrections.js', [
  `${header}/** @type {Record<string, Array<{severity: string, lectureSays: string, evidenceSays: string, examAdvice: string, sourceRef: string}>>} */`,
  `export const CORRECTIONS = ${JSON.stringify(obj, null, 2)};`,
  '',
  '/** Corrections attached to one section, or an empty array. */',
  'export function correctionsFor(sectionId) {',
  '  return CORRECTIONS[sectionId] || [];',
  '}',
  '',
  'export default CORRECTIONS;',
  '',
].join('\n'));
console.log('\n✅ wrote src/lib/vetwiki/corrections.js');
