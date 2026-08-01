#!/usr/bin/env node
// ============================================================
// wiki-coverage.mjs — how much of VetWiki is actually verified
// ============================================================
// Usage: npm run wiki:coverage
//
// The goal is a knowledge base where every point is backed by a source a
// reader can follow — a guideline, a textbook, or a paper. This prints how
// far along that is, per subject, so progress is a number rather than a
// feeling, and so an honest claim can be made about the state of the corpus.
//
// It counts what is REAL: a section counts as verified only when it carries at
// least one claim whose sourceRefs resolve to an entry in the source registry.
// A section that merely cites its own lecture slide is a draft — the slide is
// provenance, not verification.
// ============================================================

import { listTopics, loadTopic } from '../src/lib/vetwiki/index.js';
import { SOURCES } from '../src/lib/vetwiki/sources.js';

const bar = (frac, width = 22) => {
  const n = Math.round(frac * width);
  return '█'.repeat(n) + '░'.repeat(width - n);
};

const rows = new Map();
let totalSections = 0, totalVerified = 0, totalClaims = 0;
const danglingSourceIds = new Set();

for (const t of listTopics()) {
  const full = loadTopic(t.subject, t.topic);
  if (!full?.sections) continue;
  const r = rows.get(t.subject) || { subject: t.subject, topics: 0, sections: 0, verified: 0, claims: 0 };
  r.topics++;
  for (const s of full.sections) {
    r.sections++; totalSections++;
    const claims = s.claims || [];
    // only count a claim whose source actually exists in the registry
    const backed = claims.filter((c) => (c.sourceRefs || []).some((ref) => {
      if (!SOURCES[ref.sourceId]) { danglingSourceIds.add(ref.sourceId); return false; }
      return true;
    }));
    if (backed.length) { r.verified++; totalVerified++; }
    r.claims += backed.length; totalClaims += backed.length;
  }
  rows.set(t.subject, r);
}

const list = [...rows.values()].sort((a, b) => (b.verified / b.sections) - (a.verified / a.sections) || b.sections - a.sections);

console.log('VetWiki verification coverage');
console.log('='.repeat(72));
console.log(`${'subject'.padEnd(20)} ${'topics'.padStart(6)} ${'sections'.padStart(8)} ${'verified'.padStart(8)}  coverage`);
console.log('-'.repeat(72));
for (const r of list) {
  const frac = r.sections ? r.verified / r.sections : 0;
  console.log(
    `${r.subject.padEnd(20)} ${String(r.topics).padStart(6)} ${String(r.sections).padStart(8)} ${String(r.verified).padStart(8)}  ${bar(frac)} ${(frac * 100).toFixed(1).padStart(5)}%`,
  );
}
console.log('-'.repeat(72));
const overall = totalSections ? totalVerified / totalSections : 0;
console.log(`${'TOTAL'.padEnd(20)} ${String(list.reduce((a, r) => a + r.topics, 0)).padStart(6)} ${String(totalSections).padStart(8)} ${String(totalVerified).padStart(8)}  ${bar(overall)} ${(overall * 100).toFixed(1).padStart(5)}%`);
console.log(`\nsource-backed claims: ${totalClaims}`);
console.log(`registered sources  : ${Object.keys(SOURCES).length}`);

if (danglingSourceIds.size) {
  console.log(`\n❌ ${danglingSourceIds.size} claim(s) cite a sourceId absent from the registry:`);
  for (const id of danglingSourceIds) console.log(`   • ${id}`);
  console.log('A claim citing an unregistered source is not verified. Register it or drop the claim.');
  process.exitCode = 1;
}

console.log(`\n${totalSections - totalVerified} section(s) still rest only on the lecture slide they were derived from.`);
