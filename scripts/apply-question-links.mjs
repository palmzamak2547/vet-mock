#!/usr/bin/env node
// ============================================================
// apply-question-links.mjs — send orphaned questions to the right article
// ============================================================
// Usage:
//   node scripts/apply-question-links.mjs <judged.json>          # report only
//   node scripts/apply-question-links.mjs <judged.json> --write  # regenerate
//
// Questions from past-paper compilations carry the compilation's name as their
// topic, so nothing matches and a reader who gets one wrong is offered no
// article — even though the article they need already exists and is verified.
//
// A retrieval pass shortlisted candidates and a judge picked the ones that
// actually answer each question. This turns the survivors into the generated
// lookup src/lib/vetwiki/question-links.generated.js.
//
// Every link is re-checked here against the live corpus before it is written:
// the section must exist, and its topic must be governed. A judge naming a
// section that has since been renamed would otherwise produce a button that
// opens an empty article — the exact failure this whole feature exists to stop.
// ============================================================

import fs from 'node:fs';
import { listTopics, loadTopic } from '../src/lib/vetwiki/index.js';
import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';

const [, , FILE] = process.argv;
const WRITE = process.argv.includes('--write');
if (!FILE) { console.error('usage: apply-question-links.mjs <judged.json> [--write]'); process.exit(2); }

// live section index
const sectionOwner = new Map();
for (const t of listTopics()) {
  for (const s of loadTopic(t.subject, t.topic)?.sections || []) {
    sectionOwner.set(s.id, { subject: t.subject, topic: t.topic, heading: s.heading });
  }
}

// real question ids, so a hallucinated id cannot enter the table
const realIds = new Set();
for (const entry of BANK_REGISTRY) {
  const bank = await entry.load();
  for (const q of (Array.isArray(bank) ? bank : [])) if (q?.id != null) realIds.add(String(q.id));
}

const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const links = raw.links || raw;

const kept = {}, rejected = [], unlinked = [], conflicts = [];
for (const l of links) {
  if (!l.sectionId) { unlinked.push(l); continue; }
  const id = String(l.questionId);
  if (!realIds.has(id)) { rejected.push({ id, why: 'no question with that id' }); continue; }
  const owner = sectionOwner.get(l.sectionId);
  if (!owner) { rejected.push({ id, why: `section '${l.sectionId}' does not exist` }); continue; }
  if (kept[id]) { rejected.push({ id, why: 'duplicate, first one kept' }); continue; }
  kept[id] = {
    subject: owner.subject, topic: owner.topic,
    sectionId: l.sectionId,
    confidence: l.confidence || 'supporting',
  };
  if (l.contradictsAnswer) conflicts.push({ id, note: l.conflictNote || '', sectionId: l.sectionId });
}

console.log(`judged            : ${links.length}`);
console.log(`linked            : ${Object.keys(kept).length}`);
console.log(`judge said none   : ${unlinked.length}`);
console.log(`rejected here     : ${rejected.length}`);
for (const r of rejected.slice(0, 20)) console.log(`  ✗ ${r.id}: ${r.why}`);

const strong = Object.values(kept).filter((k) => k.confidence === 'strong').length;
console.log(`\nconfidence: ${strong} strong, ${Object.keys(kept).length - strong} supporting`);

if (conflicts.length) {
  console.log(`\n⚠️  ${conflicts.length} question(s) whose marked answer the linked article contradicts:`);
  for (const c of conflicts) console.log(`   • ${c.id} → ${c.sectionId}\n     ${c.note}`);
  fs.writeFileSync('wiki-answer-conflicts.json', JSON.stringify(conflicts, null, 2));
  console.log('   written to wiki-answer-conflicts.json for review');
}

if (!WRITE) { console.log('\n(dry run — pass --write to regenerate)'); process.exit(0); }

const body = [
  '// ============================================================',
  '// question-links.generated.js — AUTO-GENERATED, do NOT hand-edit',
  '// ============================================================',
  '// Regenerate with: node scripts/apply-question-links.mjs <judged.json> --write',
  '//',
  '// Most questions reach their article through their own topic. These are the',
  '// ones that cannot: they come from past-paper compilations, so their stored',
  '// topic is the name of the compilation ("vca/dogcat", "mahahon-*") and there is',
  '// no article by that name — the reader gets a question wrong and has nowhere to',
  '// go, even though the article they need already exists and is already verified.',
  '//',
  '// Each entry was proposed by term-overlap retrieval and then judged, because a',
  '// retrieval score is word overlap, not evidence that the article answers the',
  '// question. A wrong link is worse than none: it teaches the reader that the',
  '// article is useless.',
  '//',
  `// ${Object.keys(kept).length} link(s): ${strong} answer the question directly, ${Object.keys(kept).length - strong} give supporting context.`,
  '// ============================================================',
  '',
  '/** @type {Record<string, {subject: string, topic: string, sectionId: string, confidence: string}>} */',
  `export const QUESTION_LINKS = ${JSON.stringify(kept, null, 2)};`,
  '',
  'export default QUESTION_LINKS;',
  '',
].join('\n');
fs.writeFileSync('src/lib/vetwiki/question-links.generated.js', body);
console.log(`\n✅ wrote src/lib/vetwiki/question-links.generated.js (${Object.keys(kept).length} links)`);
