#!/usr/bin/env node
// ============================================================
// lint-empty-sections.mjs — a section must carry something to learn
// ============================================================
// Usage: node scripts/lint-empty-sections.mjs [--write]
//
// The drafting prompt tells an agent to say so when a slide holds nothing
// rather than inventing content. That instruction is right, and it was taken
// one step too far: agents began writing whole SECTIONS whose only content is
// an inventory of which slides were blank — "p.4, p.11 และ p.19 เป็นภาพเปล่า".
//
// Palm, reading them: "บางหัวข้อ ไม่เห็นมีอะไรเลย เป็นว่างเปล่า งง".
//
// Honesty about a gap belongs INSIDE a section that teaches something, as the
// caveat it is. A section that is only the gap is noise wearing the shape of a
// note. The test used here is deliberately narrow: short, matching one of the
// no-content phrasings, AND carrying no bolded fact — because every real
// section marks the thing worth retaining in bold.
// ============================================================

import fs from 'node:fs';

const WRITE = process.argv.includes('--write');

const NO_CONTENT = /(ไม่มีข้อความ|ไม่มีเนื้อหา|ภาพเปล่า|สไลด์ว่าง|ว่างเปล่า|label ล้วน|มีแต่ชื่อ|มีเพียงหัวข้อ|ไม่มีคำอธิบาย|เป็นภาพประกอบ|หน้าปก|Questions\?|ไม่ได้ให้รายละเอียด)/;

const bodyText = (body) => JSON.stringify(body ?? []);

function isEmptySection(sec) {
  const t = bodyText(sec.body);
  if (t.length > 700) return false;              // long enough to teach something
  if (!NO_CONTENT.test(t)) return false;
  if (t.includes('**')) return false;            // carries a fact worth keeping
  return true;
}

const files = fs.readdirSync('src/data').filter((f) => /^notes-y2-.*\.js$/.test(f));
let removedSections = 0, removedTopics = 0, scanned = 0;
const report = [];

for (const file of files) {
  const p = `src/data/${file}`;
  const src = fs.readFileSync(p, 'utf8');
  // Anchor on the export: the header comment documents body shapes with
  // braces, so the first '{' in the file is not the data.
  const exp = src.indexOf('export const');
  const open = src.indexOf('{', exp);
  const close = src.lastIndexOf('}');
  let notes;
  try { notes = JSON.parse(src.slice(open, close + 1)); } catch { continue; }

  const out = {};
  for (const [id, topic] of Object.entries(notes)) {
    scanned += topic.sections.length;
    const keep = topic.sections.filter((s) => !isEmptySection(s));
    const cut = topic.sections.length - keep.length;
    removedSections += cut;
    // A topic that is nothing but blank-slide bookkeeping is not a topic.
    if (keep.length < 2) {
      removedTopics++;
      report.push(`  drop topic  ${file} / ${id}  (${topic.sections.length} sections, ${cut} empty)`);
      continue;
    }
    if (cut) report.push(`  ${String(cut).padStart(3)} empty     ${file} / ${id}`);
    out[id] = { ...topic, sections: keep };
  }

  if (WRITE) fs.writeFileSync(p, src.slice(0, open) + JSON.stringify(out, null, 2) + src.slice(close + 1));
}

for (const r of report.slice(0, 20)) console.log(r);
if (report.length > 20) console.log(`  … ${report.length - 20} more`);
console.log(`\n${scanned} section(s) scanned: ${removedSections} carry no content, ${removedTopics} topic(s) left with nothing`);

if (!WRITE) {
  if (removedSections) { console.log('\n(dry run — pass --write to apply)'); process.exit(1); }
  console.log('✅ every section carries content.');
}
