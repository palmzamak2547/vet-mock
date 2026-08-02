#!/usr/bin/env node
// ============================================================
// wiki-gap.mjs — what the knowledge base does not cover yet
// ============================================================
// Usage: npm run wiki:gap
//
// wiki:coverage answers "how much of what we have is verified" and now reads
// 100%. That number stops being useful the moment it saturates, because it says
// nothing about what is missing entirely.
//
// This answers the other question: where are students already practising
// questions with no governed article behind them? Those subjects are the
// expansion front — the reader has a question, gets it wrong, and there is
// nothing to send them to.
//
// Ranked by questions-without-an-article, because that is the size of the hole
// a student actually falls into.
// ============================================================

import { SUBJECTS } from '../src/data/curriculum.js';
import { listTopics, articleForQuestion } from '../src/lib/vetwiki/index.js';
import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';

const governed = new Map();
for (const t of listTopics()) {
  if (!governed.has(t.subject)) governed.set(t.subject, new Set());
  governed.get(t.subject).add(t.topic);
}

// question counts per subject+topic, straight from the banks
const qBySubject = new Map();
const qByTopic = new Map();
// A question can reach an article two ways: through its own topic, or through a
// judged link when its topic is a past-paper bucket. Count both, or the gap
// looks larger than the reader's actual experience of it.
let reachable = 0, totalQs = 0;
for (const entry of BANK_REGISTRY) {
  // load() resolves to the question array itself, not a module namespace
  const bank = await entry.load();
  for (const q of (Array.isArray(bank) ? bank : [])) {
    if (!q?.subject) continue;
    totalQs++;
    if (articleForQuestion(q)) { reachable++; continue; }
    qBySubject.set(q.subject, (qBySubject.get(q.subject) || 0) + 1);
    const k = `${q.subject}::${q.topic || '(no topic)'}`;
    qByTopic.set(k, (qByTopic.get(k) || 0) + 1);
  }
}

const rows = [];
for (const [subject, qCount] of qBySubject) {
  const g = governed.get(subject) || new Set();
  const meta = SUBJECTS.find((s) => s.id === subject);
  // questions with no route to any article
  let orphanQs = 0;
  const orphanTopics = new Map();
  for (const [k, n] of qByTopic) {
    const [s, t] = k.split('::');
    if (s !== subject) continue;
    if (!g.has(t)) { orphanQs += n; orphanTopics.set(t, n); }
  }
  rows.push({
    subject, name: meta?.name || subject, qCount,
    governedTopics: g.size, orphanQs, orphanTopics,
  });
}

rows.sort((a, b) => b.orphanQs - a.orphanQs);

console.log('VetWiki coverage gap — questions with no governed article behind them');
console.log('='.repeat(84));
console.log(`${'subject'.padEnd(22)} ${'Qs'.padStart(5)} ${'articles'.padStart(8)} ${'uncovered Qs'.padStart(12)}   top uncovered topics`);
console.log('-'.repeat(84));

let totalOrphan = 0;
for (const r of rows) {
  totalOrphan += r.orphanQs;
  if (!r.orphanQs) continue;
  const top = [...r.orphanTopics.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([t, n]) => `${t}(${n})`).join(', ');
  console.log(`${r.subject.padEnd(22)} ${String(r.qCount).padStart(5)} ${String(r.governedTopics).padStart(8)} ${String(r.orphanQs).padStart(12)}   ${top}`);
}

const covered = rows.filter((r) => !r.orphanQs);
console.log('-'.repeat(84));
console.log(`${'TOTAL'.padEnd(22)} ${String(totalQs).padStart(5)} ${String([...governed.values()].reduce((a, s) => a + s.size, 0)).padStart(8)} ${String(totalOrphan).padStart(12)}`);
console.log(`\n${covered.length} subject(s) with no uncovered questions left: ${covered.map((r) => r.subject).join(', ') || 'none'}`);
console.log(`${(100 * reachable / totalQs).toFixed(1)}% of questions can send a reader to a governed article (${reachable} of ${totalQs}).`);
