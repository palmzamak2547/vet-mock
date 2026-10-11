// ============================================================
// slide-figures-resolve.test.mjs — every figure key names a note section
// ============================================================
// B35: SLIDE_IMAGES is keyed by note section id. Cutting a section whose body
// only said the slide was an image left its figures under an id nothing
// renders: 11 keys, 24 figures (the only labelled neuroanatomy images among
// them). Which surviving section each belongs to is a content call. Round 2
// (2026-10-11) placed 13 of them by the words printed on the figure and took 4
// non-teaching images out, through the REKEYS table in
// scripts/extract-slide-figures.mjs. The 3 keys below hold the 7 figures whose
// place would need the original deck; the list can only shrink, and any NEW
// orphan fails. The generator drops a regenerated subject's stale keys instead
// of merging them back in, and re-applies the hand placements.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { sectionId } from '../../src/lib/vetwiki/schema.js';

const KNOWN_ORPHANS = new Set([
  // A book cover on the further-reading slide; no section lists readings.
  'vet-microbio-1--microbio-1--immune-responses-to-viral-infections--further-readings-ที่อาจารย์แนะนำ',
  // p.4 divider photos with no printed label, and the p.12 Day 1-22 embryo
  // strip, whose heading (Development of chick embryo) has no section.
  'vet-microbio-1--microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout--สไลด์ที่เป็นหน้าคั่นหรือรูปล้วน',
  // Three micrographs with no label on the closing outline slide.
  'vet-parasit-1--parasit-1--lect-8-amoeba-histomonas-balantidium-final--สรุปท้าย-lecture',
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

test('the map carries every hand placement in the REKEYS table', () => {
  // The dry run exits 1 when a placement or drop is missing from the map, or
  // when a placement names a section that no longer exists.
  const root = fileURLToPath(new URL('../..', import.meta.url));
  const out = execFileSync(process.execPath, ['scripts/extract-slide-figures.mjs', '--rekey'], { cwd: root, encoding: 'utf8' });
  assert.match(out, /carries all \d+ hand placement/);
});
