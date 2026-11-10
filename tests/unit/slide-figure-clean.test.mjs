// ============================================================
// slide-figure-clean.test.mjs — template art is not a figure, and one picture is one file
// ============================================================
// The slide-figure map showed students their decks' templates: a blue
// background 59 times in one parasitology deck, a strip of sky and wind
// turbines in another, a dark vignette 34 times in bone marrow. 292 of the
// 2,218 deck figures were such art, and 88 more were second and third copies
// of a real picture the lecturer put on several slides, so a section could
// show the same micrograph three times in a row.
//
// scripts/lib/slide-figure-clean.mjs plans the removal from paths and hashes
// alone. The rule's number was set by looking at every group of repeats:
// four or more copies in one deck were always template art (9 groups), two or
// three always slide content (81 groups). These tests hold the rule, and the
// last ones hold the repository to it.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import { FURNITURE_MIN_REPEATS, deckOf, figureOrder, furnitureHashes, planClean } from '../../scripts/lib/slide-figure-clean.mjs';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';

const D1 = '/figures/vet-x/deck--one';
const D2 = '/figures/vet-x/deck--two';
const files = (rows) => new Map(rows);

test('a picture four times in one deck is its template: out of the map and off the disk', () => {
  const plan = planClean({
    files: files([[`${D1}/p1-0.webp`, 'TPL'], [`${D1}/p2-0.webp`, 'TPL'], [`${D1}/p3-0.webp`, 'TPL'], [`${D1}/p4-0.webp`, 'TPL'], [`${D1}/p2-1.webp`, 'real']]),
    map: { a: [`${D1}/p1-0.webp`], b: [`${D1}/p2-0.webp`, `${D1}/p2-1.webp`], c: [`${D1}/p3-0.webp`, `${D1}/p4-0.webp`] },
  });
  assert.equal(FURNITURE_MIN_REPEATS, 4);
  assert.deepEqual(plan.furniture, [{ deck: D1, hash: 'TPL', files: [`${D1}/p1-0.webp`, `${D1}/p2-0.webp`, `${D1}/p3-0.webp`, `${D1}/p4-0.webp`] }]);
  assert.deepEqual(plan.map, { b: [`${D1}/p2-1.webp`] });
  assert.deepEqual(plan.emptied, ['a', 'c'], 'a section that showed only the template shows nothing');
  assert.deepEqual(plan.remove, [`${D1}/p1-0.webp`, `${D1}/p2-0.webp`, `${D1}/p3-0.webp`, `${D1}/p4-0.webp`]);
});

test('three copies are a real figure shown on three slides: one file, shown once a section', () => {
  const plan = planClean({
    files: files([[`${D1}/p14-0.webp`, 'egg'], [`${D1}/p15-0.webp`, 'egg'], [`${D1}/p16-0.webp`, 'egg']]),
    map: { routes: [`${D1}/p14-0.webp`, `${D1}/p15-0.webp`, `${D1}/p16-0.webp`], later: [`${D1}/p16-0.webp`] },
  });
  assert.deepEqual(plan.furniture, []);
  assert.deepEqual(plan.copies, [{ keep: `${D1}/p14-0.webp`, drop: [`${D1}/p15-0.webp`, `${D1}/p16-0.webp`] }]);
  assert.deepEqual(plan.map, { routes: [`${D1}/p14-0.webp`], later: [`${D1}/p14-0.webp`] });
  assert.deepEqual(plan.remove, [`${D1}/p15-0.webp`, `${D1}/p16-0.webp`]);
});

test('repeats are counted inside one deck: two and two in two decks are one picture, not a template', () => {
  const plan = planClean({
    files: files([[`${D1}/p5-0.webp`, 'plate'], [`${D1}/p6-0.webp`, 'plate'], [`${D2}/p21-0.webp`, 'plate'], [`${D2}/p23-0.webp`, 'plate']]),
    map: { one: [`${D1}/p5-0.webp`, `${D1}/p6-0.webp`], two: [`${D2}/p21-0.webp`, `${D2}/p23-0.webp`] },
  });
  assert.deepEqual(plan.furniture, []);
  assert.deepEqual(plan.map, { one: [`${D1}/p5-0.webp`], two: [`${D1}/p5-0.webp`] }, 'the second deck shows the first deck\'s file');
  assert.equal(plan.remove.length, 3);
});

test('a real figure that repeats four times stays when it is named, as one file', () => {
  const rows = [[`${D1}/p1-0.webp`, 'fig'], [`${D1}/p2-0.webp`, 'fig'], [`${D1}/p3-0.webp`, 'fig'], [`${D1}/p4-0.webp`, 'fig']];
  const map = { s: rows.map(([p]) => p) };
  const plan = planClean({ files: files(rows), map, keep: [`${D1}/p3-0.webp`] });
  assert.deepEqual(plan.furniture, []);
  assert.deepEqual(plan.map, { s: [`${D1}/p1-0.webp`] });
});

test('the first in figure order keeps its file, by page number and not by spelling', () => {
  assert.ok(figureOrder(`${D1}/p2-0.webp`, `${D1}/p10-0.webp`) < 0, 'page 2 before page 10');
  assert.ok(figureOrder(`${D1}/p2-1.webp`, `${D1}/p2-0.webp`) > 0);
  assert.ok(figureOrder(`${D1}/p99-0.webp`, `${D2}/p1-0.webp`) < 0, 'deck one before deck two');
  assert.equal(deckOf(`${D1}/p2-0.webp`), D1);
  const plan = planClean({ files: files([[`${D1}/p10-0.webp`, 'h'], [`${D1}/p2-0.webp`, 'h']]), map: { s: [`${D1}/p10-0.webp`] } });
  assert.deepEqual(plan.map, { s: [`${D1}/p2-0.webp`] });
  assert.deepEqual(plan.remove, [`${D1}/p10-0.webp`]);
});

test('a copy that a hand placement names keeps its own file', () => {
  const rows = [[`${D1}/p8-1.webp`, 'h'], [`${D1}/p18-0.webp`, 'h']];
  const plan = planClean({ files: files(rows), map: { early: [`${D1}/p8-1.webp`], placed: [`${D1}/p18-0.webp`] }, prefer: [`${D1}/p18-0.webp`] });
  assert.deepEqual(plan.map, { early: [`${D1}/p18-0.webp`], placed: [`${D1}/p18-0.webp`] });
  assert.deepEqual(plan.remove, [`${D1}/p8-1.webp`]);
});

test('a file no section lists goes, a listed file that is missing is reported, the order inside a section stays', () => {
  const plan = planClean({
    files: files([[`${D1}/p1-0.webp`, 'a'], [`${D1}/p1-1.webp`, 'b'], [`${D1}/p9-0.webp`, 'stale']]),
    map: { s: [`${D1}/p1-1.webp`, `${D1}/p1-0.webp`, `${D1}/p7-0.webp`] },
  });
  assert.deepEqual(plan.unlisted, [`${D1}/p9-0.webp`]);
  assert.deepEqual(plan.remove, [`${D1}/p9-0.webp`]);
  assert.deepEqual(plan.missing, [`${D1}/p7-0.webp`]);
  assert.deepEqual(plan.map.s, [`${D1}/p1-1.webp`, `${D1}/p1-0.webp`, `${D1}/p7-0.webp`]);
});

test('a cleaned map and disk are a fixed point: cleaning again changes nothing', () => {
  const rows = [[`${D1}/p1-0.webp`, 'T'], [`${D1}/p2-0.webp`, 'T'], [`${D1}/p3-0.webp`, 'T'], [`${D1}/p4-0.webp`, 'T'], [`${D1}/p5-0.webp`, 'x'], [`${D1}/p6-0.webp`, 'x'], [`${D2}/p1-0.webp`, 'y']];
  const first = planClean({ files: files(rows), map: { a: [`${D1}/p1-0.webp`, `${D1}/p6-0.webp`], b: [`${D2}/p1-0.webp`, `${D1}/p5-0.webp`] } });
  const left = files(rows.filter(([p]) => !first.remove.includes(p)));
  const second = planClean({ files: left, map: first.map });
  assert.deepEqual(second.map, first.map);
  assert.deepEqual([second.remove, second.furniture, second.copies, second.emptied], [[], [], [], []]);
});

test('the extractor finds a deck\'s template before it fills a page\'s three places', () => {
  const drawn = [['f-001-000.png', 'bg'], ['f-002-000.png', 'bg'], ['f-003-000.png', 'bg'], ['f-004-000.png', 'bg'], ['f-002-001.jpg', 'cell'], ['f-003-001.jpg', 'cell'], ['f-004-001.jpg', 'cell']];
  assert.deepEqual([...furnitureHashes(drawn)], ['bg']);
  assert.deepEqual([...furnitureHashes(drawn, 3)].sort(), ['bg', 'cell']);
});

// ── The repository ───────────────────────────────────────────────────
test('no section of the shipped map lists a figure twice', () => {
  for (const [id, figures] of Object.entries(SLIDE_IMAGES)) {
    assert.equal(new Set(figures).size, figures.length, `${id} lists a figure twice`);
    assert.ok(figures.length > 0, `${id} lists no figure`);
  }
});

test('the nine templates found on 11 Nov 2026 are in no section', () => {
  // One file of each group, as it was named; the clean removed all 292.
  const gone = [
    '/figures/vet-parasit-1/parasit-1--lect-9-1-enteric-and-tissue-apicomplexa/p10-0.webp',
    '/figures/vet-histo/histo--cytology/p10-0.webp',
    '/figures/vet-parasit-1/parasit-1--lect-9-2-blood-apicomplexa/p10-1.webp',
    '/figures/vet-histo/histo--cytology/p10-1.webp',
    '/figures/vet-histo/histo--bone-marrow/p10-0.webp',
    '/figures/vet-parasit-1/parasit-1--lect-8-amoeba-histomonas-balantidium-final/p10-0.webp',
    '/figures/vet-parasit-1/parasit-1--lect-6-general-overview-of-protozoa/p1-2.webp',
    '/figures/vet-parasit-1/parasit-1--lect-8-amoeba-histomonas-balantidium-final/p14-0.webp',
    '/figures/vet-parasit-1/parasit-1--lect-8-amoeba-histomonas-balantidium-final/p14-1.webp',
  ];
  const shown = new Set(Object.values(SLIDE_IMAGES).flat());
  assert.deepEqual(gone.filter((p) => shown.has(p)), []);
  // The real figures that repeated two or three times are still shown, once.
  for (const kept of [
    '/figures/vet-histo/histo--cytology/p28-1.webp',
    '/figures/vet-microbio-1/microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout/p14-0.webp',
    '/figures/vet-parasit-1/parasit-1--lect-7-part-2-hemoflagellates/p2-0.webp',
  ]) assert.ok(shown.has(kept), `${kept} is a real figure and stays`);
});
