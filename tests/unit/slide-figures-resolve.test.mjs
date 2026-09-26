// ============================================================
// slide-figures-resolve.test.mjs — every figure key names a note section
// ============================================================
// B35: SLIDE_IMAGES is keyed by note section id. Cutting a section whose body
// only said the slide was an image left its figures under an id nothing
// renders: 11 keys, 24 figures (the only labelled neuroanatomy images among
// them). Which surviving section each belongs to is a content call, so the
// known 11 are listed below until someone reattaches them; the list can only
// shrink, and any NEW orphan fails. The generator now drops a regenerated
// subject's stale keys instead of merging them back in.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { sectionId } from '../../src/lib/vetwiki/schema.js';

const KNOWN_ORPHANS = new Set([
  'vet-histo--histo--bone-marrow--สไลด์ที่เป็นรูปภาพล้วน',
  'vet-histo--histo--bone-marrow--คำถามที่สไลด์ตั้งไว้แต่ไม่ได้ตอบ',
  'vet-histo--histo--epithelium--functions-ของ-epithelium',
  'vet-histo--histo--lymphatic-organs-ii--ภาพ-aggregated-lymphatic-nodules',
  'vet-microbio-1--microbio-1--immune-responses-to-viral-infections--further-readings-ที่อาจารย์แนะนำ',
  'vet-microbio-1--microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout--สไลด์ที่เป็นหน้าคั่นหรือรูปล้วน',
  'vet-parasit-1--parasit-1--lect-8-amoeba-histomonas-balantidium-final--สรุปท้าย-lecture',
  'vet-neuroanat--neuroanat--diencephalon--สไลด์ที่ไม่มีข้อความให้สรุป',
  'vet-neuroanat--neuroanat--midbrain--ภาพ-auditory-pathway-label-ล้วน',
  'vet-neuroanat--neuroanat--midbrain--ภาพระดับ-caudal-colliculus-label-ล้วน',
  'vet-physio-lab-1--physio-lab-1--pbl-case-6-endocrinology--รูปประกอบและหน้าที่เหลือของไฟล์',
]);

async function liveSectionIds() {
  const subjects = new Set(Object.keys(SLIDE_IMAGES).map((k) => k.split('--')[0]));
  const ids = new Set();
  for (const s of subjects) {
    const mod = await import(`../../src/data/notes-y2-${s.replace(/^vet-/, '')}.js`);
    const notes = Object.values(mod)[0];
    for (const [topic, t] of Object.entries(notes)) {
      for (const sec of t.sections || []) ids.add(sectionId(s, topic, sec.heading));
    }
  }
  return ids;
}

test('every slide-figure key resolves to a note section, bar the listed orphans', async () => {
  const ids = await liveSectionIds();
  const orphans = Object.keys(SLIDE_IMAGES).filter((k) => !ids.has(k));
  const unexpected = orphans.filter((k) => !KNOWN_ORPHANS.has(k));
  assert.deepEqual(unexpected, [], 'a figure key names no section; reattach it or let the generator drop it');
  const reattached = [...KNOWN_ORPHANS].filter((k) => !orphans.includes(k));
  assert.deepEqual(reattached, [], 'an orphan was resolved; remove it from KNOWN_ORPHANS');
});

test('the generator drops a regenerated subject\'s stale keys instead of merging them back', () => {
  const src = readFileSync(new URL('../../scripts/extract-slide-figures.mjs', import.meta.url), 'utf8');
  assert.match(src, /if \(id\.startsWith\(`\$\{SUBJECT\}--`\) && !liveIds\.has\(id\) && !manifest\[id\]\)/);
  assert.match(src, /const merged = \{ \.\.\.retained, \.\.\.manifest \};/);
  assert.doesNotMatch(src, /const merged = \{ \.\.\.existing, \.\.\.manifest \};/);
});
