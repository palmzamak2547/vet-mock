#!/usr/bin/env node
// ============================================================
// apply-domain-reconcile.mjs — bring the governed pages in line with the notes
// ============================================================
// Usage:
//   node scripts/apply-domain-reconcile.mjs <edits.json>          # report only
//   node scripts/apply-domain-reconcile.mjs <edits.json> --write  # apply
//
// The notes were corrected where a followable source disagreed with the
// lecture. wiki/domain/*.md is a separate, coarser corpus covering the same
// subjects, and the two must not end up asserting different things.
//
// Same discipline as the notes pass: exact string replacement, rejected rather
// than approximated when the target is missing or ambiguous.
//
// The extra hazard here is citations. Exam questions cite these pages by
// pageId + anchorId, and a question's answer key was written against the text
// as it stood. Changing a fact inside a cited section can leave a question
// keyed to something the page now contradicts. Those edits are applied — a
// page that knowingly states something false is not an option — but every one
// is reported so the affected questions get re-checked rather than silently
// rotting.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

const [, , FILE] = process.argv;
const WRITE = process.argv.includes('--write');
if (!FILE) { console.error('usage: apply-domain-reconcile.mjs <edits.json> [--write]'); process.exit(2); }

const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const pages = raw.pages || raw;

const applied = [], rejected = [], atRisk = [];
const cache = new Map();
const read = (p) => { if (!cache.has(p)) cache.set(p, fs.readFileSync(p, 'utf8')); return cache.get(p); };

for (const page of pages) {
  for (const e of (page.edits || [])) {
    if (!e.oldString || !e.newString) { rejected.push({ page: page.pageId, why: 'no old/new string', claim: e.claim }); continue; }
    const full = path.join(process.cwd(), page.file);
    if (!fs.existsSync(full)) { rejected.push({ page: page.pageId, why: 'file missing', claim: e.claim }); continue; }
    const text = read(full);

    let oldStr = e.oldString, newStr = e.newString;
    if (!text.includes(oldStr) && oldStr.includes('\n')) {
      const crlf = (s) => s.replace(/\r?\n/g, '\r\n');
      if (text.includes(crlf(oldStr))) { oldStr = crlf(oldStr); newStr = crlf(newStr); }
    }
    const hits = text.split(oldStr).length - 1;
    if (hits !== 1) { rejected.push({ page: page.pageId, why: hits ? `appears ${hits}x` : 'not found', claim: e.claim }); continue; }

    // an anchor tag is citation identity; an edit must never move or rename one
    if (/<a id="/.test(oldStr) || /<a id="/.test(newStr)) {
      rejected.push({ page: page.pageId, why: 'edit touches an anchor tag', claim: e.claim }); continue;
    }

    cache.set(full, text.replace(oldStr, newStr));
    applied.push({ page: page.pageId, anchor: e.anchorId, claim: e.claim });
    if (e.verdict?.changesCitedFact) {
      atRisk.push({ page: page.pageId, anchor: e.anchorId, claim: e.claim, risk: e.citationRisk || '' });
    }
  }
}

console.log(`pages considered : ${pages.length}`);
console.log(`edits applied    : ${applied.length}`);
console.log(`rejected         : ${rejected.length}`);
for (const r of rejected) console.log(`  ✗ [${r.page}] ${r.why} — ${String(r.claim).slice(0, 60)}`);

if (atRisk.length) {
  console.log(`\n⚠️  ${atRisk.length} edit(s) changed a fact inside a section that questions cite.`);
  console.log('   The citing questions were keyed against the old text and must be re-checked:');
  for (const a of atRisk) console.log(`   • ${a.page}#${a.anchor}\n     ${a.risk}`);
}

if (!WRITE) { console.log('\n(dry run — pass --write to apply)'); process.exit(0); }
for (const [p, text] of cache) fs.writeFileSync(p, text);
console.log(`\n✅ wrote ${cache.size} page(s)`);
if (atRisk.length) console.log('   Now re-stamp citation hashes: npm run wiki:hashes');
