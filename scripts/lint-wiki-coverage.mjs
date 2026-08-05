#!/usr/bin/env node
// ============================================================
// lint-wiki-coverage.mjs — every verifiable section carries a real source
// ============================================================
// Usage: npm run lint:wiki-coverage
//
// wiki:coverage reports the number. This one enforces it, so the number cannot
// quietly fall while nobody is looking.
//
// The failure mode this exists to stop is not a bug — it is drift. Adding notes
// is easy and satisfying; sourcing them is slow. Without a gate the corpus
// grows, coverage slides from 100% to 78% to 40%, and every individual commit
// looked reasonable at the time. A knowledge base that claims to be verified
// and is mostly not is worse than one that never claimed it, because a reader
// has no way to tell which half they are looking at.
//
// A section passes when it carries at least one claim whose sourceRefs resolve
// to an entry in the source registry. Citing its own lecture slide is not
// enough — the slide is provenance, not verification.
//
// Sections in non-verifiable.js are exempt and reported separately: deck
// metadata and empty placeholders cannot be checked against literature, and
// pretending otherwise would only invite invented citations.
//
// When this fails, the fix is either to source the sections it names, or — if
// they genuinely cannot be sourced — to add them to non-verifiable.js WITH a
// reason. Both are deliberate acts. That is the point.
// ============================================================

import { listTopics, loadTopic } from '../src/lib/vetwiki/index.js';
import { SOURCES } from '../src/lib/vetwiki/sources.js';
import { NON_VERIFIABLE } from '../src/lib/vetwiki/non-verifiable.js';

const unsourced = [];
const seenIds = new Set();
let verifiable = 0, verified = 0, exempt = 0;

for (const t of listTopics()) {
  for (const s of loadTopic(t.subject, t.topic)?.sections || []) {
    seenIds.add(s.id);
    if (NON_VERIFIABLE.has(s.id)) { exempt++; continue; }
    verifiable++;
    const backed = (s.claims || []).some((c) => (c.sourceRefs || []).some((r) => SOURCES[r.sourceId]));
    if (backed) verified++;
    else unsourced.push({ id: s.id, subject: t.subject, topic: t.topic, heading: s.heading });
  }
}

// An exemption id that matches no section exempts nothing. It is not a
// harmless typo: the author believed they had excused a section, the section
// stays in the denominator, and the entry sits in the file looking like a
// decision somebody made. Mistyping one Thai slug is enough — that is exactly
// how this check came to exist.
const dangling = [...NON_VERIFIABLE].filter((id) => !seenIds.has(id));

const pct = verifiable ? (100 * verified / verifiable) : 100;
console.log('VetWiki verification gate');
console.log(`  verifiable sections : ${verifiable}`);
console.log(`  source-backed       : ${verified}  (${pct.toFixed(1)}%)`);
console.log(`  exempt              : ${exempt}  (declared in non-verifiable.js)`);

if (dangling.length) {
  console.log(`\n❌ ${dangling.length} exemption(s) in non-verifiable.js match no section:\n`);
  for (const id of dangling) console.log(`     - ${id}`);
  console.log('\nEither the section was renamed or removed, or the id is mistyped.');
  console.log('Fix the id or delete the entry — as written it excuses nothing.');
}

if (!unsourced.length) {
  if (!dangling.length) console.log('\n✅ Every verifiable section carries a resolvable source.');
  process.exit(dangling.length ? 1 : 0);
}

// group so the report is a work list, not a wall
const byTopic = new Map();
for (const u of unsourced) {
  const k = `${u.subject}/${u.topic}`;
  if (!byTopic.has(k)) byTopic.set(k, []);
  byTopic.get(k).push(u.heading);
}

console.log(`\n❌ ${unsourced.length} section(s) rest only on the lecture slide they came from:\n`);
for (const [k, list] of [...byTopic].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${k}  (${list.length})`);
  for (const h of list.slice(0, 4)) console.log(`     - ${h.slice(0, 72)}`);
  if (list.length > 4) console.log(`     ... and ${list.length - 4} more`);
}
console.log('\nSource them, or declare them in src/lib/vetwiki/non-verifiable.js with a reason.');
console.log('List them all with: npm run wiki:unverified');
process.exit(1);
