#!/usr/bin/env node
// ============================================================
// wiki-unverified.mjs — dump the sections that still rest on a slide alone
// ============================================================
// Usage: node scripts/wiki-unverified.mjs <outdir> [--subject <id>]
//
// wiki:coverage says how many sections carry a claim backed by a resolvable
// source. This writes out the ones that do not, with enough of their content
// for someone to go and find that source.
//
// Sections listed in non-verifiable.js are skipped: deck metadata and empty
// placeholders cannot be verified against literature and were excluded from the
// coverage denominator for that reason. Feeding them to a sourcing pass would
// only produce invented citations for slide furniture.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { listTopics, loadTopic } from '../src/lib/vetwiki/index.js';
import { SOURCES } from '../src/lib/vetwiki/sources.js';
import { NON_VERIFIABLE } from '../src/lib/vetwiki/non-verifiable.js';

const OUT = process.argv[2];
if (!OUT) { console.error('usage: wiki-unverified.mjs <outdir> [--subject <id>]'); process.exit(2); }
const only = process.argv.includes('--subject') ? process.argv[process.argv.indexOf('--subject') + 1] : null;

/** Flatten a section body to plain text so a sourcing agent can read the claim
 *  without needing the renderer. */
function flatten(body, out = []) {
  for (const it of body || []) {
    if (typeof it === 'string') { out.push(it); continue; }
    if (!it || typeof it !== 'object') continue;
    if (it.text) out.push(it.text);
    if (it.callout) out.push(it.callout);
    if (it.bullets) for (const b of it.bullets) out.push(typeof b === 'string' ? b : `${b.label}: ${b.value}`);
    if (it.sub) { out.push(`### ${it.sub}`); flatten(it.body, out); }
    if (it.table) {
      out.push((it.table.headers || []).join(' | '));
      for (const r of it.table.rows || []) out.push(r.join(' | '));
    }
  }
  return out;
}

const bySubject = new Map();
let total = 0;

for (const t of listTopics()) {
  if (only && t.subject !== only) continue;
  const full = loadTopic(t.subject, t.topic);
  for (const s of full?.sections || []) {
    if (NON_VERIFIABLE.has(s.id)) continue;
    const backed = (s.claims || []).some((c) => (c.sourceRefs || []).some((r) => SOURCES[r.sourceId]));
    if (backed) continue;
    if (!bySubject.has(t.subject)) bySubject.set(t.subject, []);
    bySubject.get(t.subject).push({
      topicId: t.topic,
      topicTitle: t.title,
      sectionHeading: s.heading,
      slideSource: (s.sourceRefs || [])[0]?.locator || null,
      content: flatten(s.body).join('\n').slice(0, 2200),
    });
    total++;
  }
}

fs.mkdirSync(OUT, { recursive: true });
for (const [subject, rows] of bySubject) {
  fs.writeFileSync(path.join(OUT, `${subject}.json`), JSON.stringify(rows, null, 2));
  console.log(`${subject.padEnd(24)} ${String(rows.length).padStart(4)} unverified sections`);
}
console.log(`\ntotal: ${total}`);
