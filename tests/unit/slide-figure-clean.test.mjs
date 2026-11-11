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

import {
  FURNITURE_MIN_REPEATS, applyPlacements, cleanWithPlacements, deckOf, figureOrder, furnitureHashes, planClean,
} from '../../scripts/lib/slide-figure-clean.mjs';
import { KEEP_FLAT, KEEP_REPEATED, REKEYS } from '../../scripts/lib/slide-figure-placements.mjs';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { sectionId } from '../../src/lib/vetwiki/schema.js';

const D1 = '/figures/vet-x/deck--one';
const D2 = '/figures/vet-x/deck--two';
const files = (rows) => new Map(rows);
// The notes of the made-up subject: two sections of deck one.
const LIVE = new Set(['tectum', 'cross section']);
const sectionOf = (subject, topic, heading) => (LIVE.has(heading) ? `${subject}--${topic}--${heading}` : null);
const TECTUM = 'vet-x--deck--one--tectum';
const CROSS = 'vet-x--deck--one--cross section';

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

// ── The whole clean, hand placements included ────────────────────────
// planClean alone is not what ships: the placements are applied to its map
// afterwards, and that pass takes a listed figure out of every section its
// rows do not name. On 11 Nov 2026 that cost a real figure its place:
// neuroanat--midbrain/p8-1, under "Tectum", was the same drawing as p18-0,
// hand-placed under "Cross section". The plan pointed Tectum at p18-0 (the
// test above), the pass after it took p18-0 out of Tectum, and nothing said so.
const P8_0 = `${D1}/p8-0.webp`;
const P8_1 = `${D1}/p8-1.webp`;
const P18_0 = `${D1}/p18-0.webp`;
const midbrain = () => ({
  files: files([[P8_0, 'a'], [P8_1, 'h'], [P18_0, 'h']]),
  map: { [TECTUM]: [P8_0, P8_1], [CROSS]: [P18_0] },
  sectionOf,
});
const toCross = { figure: P18_0, to: ['deck--one', 'cross section'], label: 'slide p.18 caption' };
const toTectum = { figure: P18_0, to: ['deck--one', 'tectum'], label: 'the drawing on slide p.8' };

test('the clean never takes a hand-placed picture out of a section that showed a copy of it without saying so', () => {
  const result = cleanWithPlacements({ ...midbrain(), rows: [toCross] });
  assert.equal(result.map, undefined, 'nothing is written');
  assert.equal(result.problems.length, 1);
  assert.match(result.problems[0], new RegExp(`^${P8_1}: the same picture as the hand-placed ${P18_0}, and section ${TECTUM} shows it\\. Add a REKEYS row placing ${P18_0} in that section too, or a drop row for ${P8_1}$`));
});

test('with a row for each section, the picture is one file and both sections show it', () => {
  // The row for the earlier slide comes first in the table, so the section keeps the deck's order.
  const result = cleanWithPlacements({ ...midbrain(), rows: [toTectum, toCross] });
  assert.deepEqual(result.problems, []);
  assert.deepEqual(result.map, { [TECTUM]: [P8_0, P18_0], [CROSS]: [P18_0] });
  assert.deepEqual(result.plan.remove, [P8_1]);
  assert.deepEqual(result.plan.copies, [{ keep: P18_0, drop: [P8_1] }]);
  // Cleaning what was written changes nothing: `--clean` and `--rekey` agree.
  const again = cleanWithPlacements({ files: files([[P8_0, 'a'], [P18_0, 'h']]), map: result.map, rows: [toTectum, toCross], sectionOf });
  assert.deepEqual([again.problems, again.map, again.plan.remove], [[], result.map, []]);
  assert.deepEqual(applyPlacements({ map: result.map, rows: [toTectum, toCross], exists: () => true, sectionOf }), { map: result.map, problems: [] });
});

test('a drop row for the copy says the section is to lose it, and then it does', () => {
  const result = cleanWithPlacements({ ...midbrain(), rows: [toCross, { figure: P8_1, drop: 'the p.18 drawing again; this section is about the colliculi' }] });
  assert.deepEqual(result.problems, []);
  assert.deepEqual(result.map, { [TECTUM]: [P8_0], [CROSS]: [P18_0] });
  assert.deepEqual(result.plan.remove, [P8_1]);
});

test('the placement table: a figure goes where its rows say and nowhere else, and a bad row is a problem', () => {
  const exists = (figure) => figure !== `${D1}/p99-0.webp`;
  const map = { [TECTUM]: [P8_0, P18_0], [CROSS]: [P8_0], other: [P18_0, `${D2}/p1-0.webp`] };
  const placed = applyPlacements({ map, rows: [toCross, { figure: `${D2}/p1-0.webp`, drop: 'a logo' }], exists, sectionOf });
  assert.deepEqual(placed, { map: { [TECTUM]: [P8_0], [CROSS]: [P8_0, P18_0] }, problems: [] }, 'moved, dropped, and the emptied section is gone');
  assert.deepEqual(applyPlacements({ map: placed.map, rows: [toCross, { figure: `${D2}/p1-0.webp`, drop: 'a logo' }], exists, sectionOf }).map, placed.map, 'twice is once');

  const bad = applyPlacements({
    map,
    rows: [
      { figure: `${D1}/p99-0.webp`, to: ['deck--one', 'tectum'] },
      { figure: P8_0, to: ['deck--one', 'no such heading'] },
      toCross, { ...toCross, label: 'again' },
    ],
    exists, sectionOf,
  });
  assert.deepEqual(bad.problems, [
    `${D1}/p99-0.webp: no such file`,
    `${P8_0}: no section "no such heading" in deck--one`,
    `${P18_0}: placed twice under "cross section"`,
  ]);
  // One subject's rows only, as a fresh extraction of that subject applies them.
  const other = applyPlacements({ map: { s: ['/figures/vet-y/deck/p1-0.webp', P18_0] }, rows: [toCross, { figure: '/figures/vet-y/deck/p1-0.webp', drop: 'x' }], exists, sectionOf, onlySubject: 'vet-y' });
  assert.deepEqual(other.map, { s: [P18_0] });
});

test('a hand-placed figure the clean would remove is a problem, not a removal', () => {
  const rows = [[`${D1}/p1-0.webp`, 'T'], [`${D1}/p2-0.webp`, 'T'], [`${D1}/p3-0.webp`, 'T'], [`${D1}/p4-0.webp`, 'T'], [P18_0, 'shape']];
  const map = { [TECTUM]: [`${D1}/p1-0.webp`], [CROSS]: [P18_0] };
  const asTemplate = cleanWithPlacements({ files: files(rows), map, rows: [{ figure: `${D1}/p2-0.webp`, to: ['deck--one', 'tectum'] }], sectionOf });
  assert.match(asTemplate.problems.join('\n'), new RegExp(`^${D1}/p2-0\\.webp: placed by hand in REKEYS, and it is template art, a drawn shape or a second file of one picture`));
  const asShape = cleanWithPlacements({ files: files(rows), map, rows: [toCross], shapes: [P18_0], sectionOf });
  assert.match(asShape.problems.join('\n'), new RegExp(`^${P18_0}: placed by hand in REKEYS, and it is template art, a drawn shape`));
  // Named as a real figure, it stays.
  const kept = cleanWithPlacements({ files: files(rows), map, rows: [toCross], shapes: [P18_0], keep: [P18_0], sectionOf });
  assert.deepEqual([kept.problems, kept.map[CROSS]], [[], [P18_0]]);
});

// ── Drawn shapes ─────────────────────────────────────────────────────
test('a drawn shape leaves the map and the disk as template art does, unless it is named as a real figure', () => {
  const rows = [[`${D1}/p5-0.webp`, 'frame-a'], [`${D1}/p5-1.webp`, 'frame-b'], [`${D1}/p5-2.webp`, 'photo'], [`${D1}/p6-0.webp`, 'arrow']];
  const map = { a: [`${D1}/p5-0.webp`, `${D1}/p5-1.webp`, `${D1}/p5-2.webp`], b: [`${D1}/p6-0.webp`] };
  const shapes = [`${D1}/p5-0.webp`, `${D1}/p5-1.webp`, `${D1}/p6-0.webp`];
  const plan = planClean({ files: files(rows), map, shapes });
  assert.deepEqual(plan.shapes, shapes);
  assert.deepEqual(plan.map, { a: [`${D1}/p5-2.webp`] });
  assert.deepEqual(plan.emptied, ['b'], 'a section of shapes only shows no figure');
  assert.deepEqual(plan.remove, shapes);
  const named = planClean({ files: files(rows), map, shapes, keep: [`${D1}/p6-0.webp`] });
  assert.deepEqual([named.shapes, named.map.b], [[`${D1}/p5-0.webp`, `${D1}/p5-1.webp`], [`${D1}/p6-0.webp`]]);
  // Template art that is also a shape is counted once, as template art.
  const both = planClean({ files: files([[`${D1}/p1-0.webp`, 'T'], [`${D1}/p2-0.webp`, 'T'], [`${D1}/p3-0.webp`, 'T'], [`${D1}/p4-0.webp`, 'T']]), map: {}, shapes: [`${D1}/p1-0.webp`] });
  assert.deepEqual([both.furniture.length, both.shapes, both.remove.length], [1, [], 4]);
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

test('the shipped map shows every hand-placed figure in each section its rows name, and no dropped one', () => {
  const shown = new Set(Object.values(SLIDE_IMAGES).flat());
  const places = new Map();
  for (const row of REKEYS) {
    assert.ok(row.to ? row.label : row.drop, `${row.figure}: a row says why`);
    if (!row.to) { assert.equal(shown.has(row.figure), false, `${row.figure} is dropped and still shown`); continue; }
    const id = sectionId(row.figure.split('/')[2], row.to[0], row.to[1]);
    assert.ok((SLIDE_IMAGES[id] || []).includes(row.figure), `${row.figure} is not under "${row.to[1]}"; run --rekey --write`);
    if (!places.has(row.figure)) places.set(row.figure, new Set());
    places.get(row.figure).add(id);
  }
  // And nowhere else: the table decides where a listed figure goes.
  for (const [id, figures] of Object.entries(SLIDE_IMAGES)) {
    for (const figure of figures) if (places.has(figure)) assert.ok(places.get(figure).has(id), `${figure} is under ${id}, which no row names`);
  }
  // The drawing that lost its place: one file, in both sections, on the slide's own page order.
  const drawing = '/figures/vet-neuroanat/neuroanat--midbrain/p18-0.webp';
  assert.equal(places.get(drawing).size, 2);
  assert.deepEqual(SLIDE_IMAGES[sectionId('vet-neuroanat', 'neuroanat--midbrain', 'Tectum: rostral และ caudal colliculi')], [
    '/figures/vet-neuroanat/neuroanat--midbrain/p8-0.webp', drawing,
    '/figures/vet-neuroanat/neuroanat--midbrain/p9-0.webp', '/figures/vet-neuroanat/neuroanat--midbrain/p9-1.webp',
  ]);
  assert.equal(shown.has('/figures/vet-neuroanat/neuroanat--midbrain/p8-1.webp'), false, 'its second file is gone');
});

test('a figure kept against a rule says what it shows', () => {
  for (const row of [...KEEP_REPEATED, ...KEEP_FLAT]) {
    assert.match(row.figure, /^\/figures\/[^/]+\/[^/]+\/p\d+-\d+\.[a-z0-9]+$/);
    assert.ok(String(row.shows || '').trim().length >= 10, `${row.figure}: say what the figure shows`);
  }
});
