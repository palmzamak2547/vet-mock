// ============================================================
// slide-figure-shape.test.mjs — a shape a slide draws is not a figure
// ============================================================
// After the template art went, 77 of the 1,833 "figures" under the Year-2
// notes were still shapes: 54 dark backdrops a slide puts behind a photograph
// (the section "Clinical signs และ lesions ของ Chytridiomycosis" showed three
// of them and nothing else), two silhouettes, arrows, triangles, rounded
// panels, gradient bars and two dark vignettes.
//
// scripts/lib/slide-figure-shape.mjs tells a shape from a picture by its
// pixels. The numbers were set from the 1,833 files, with every picture the
// rule takes and the 38 nearest to it looked at. These tests hold the rule on
// pictures made here, each the kind of thing that was found, and then hold the
// repository to it: the shapes are gone, and the real pictures that measure
// closest to a shape are still shown and still read as pictures.
// ============================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { SHAPE_RULE, describeShape, measureShape, pictureStats, shapeKind } from '../../scripts/lib/slide-figure-shape.mjs';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** A picture painted pixel by pixel: paint(x, y) gives [r, g, b]. */
function painted(width, height, paint) {
  const data = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = paint(x, y);
      const i = (y * width + x) * 3;
      data[i] = r; data[i + 1] = g; data[i + 2] = b;
    }
  }
  return { data, width, height };
}
const verdict = (picture) => { const stats = pictureStats(picture); return { kind: shapeKind(stats), stats }; };
const grey = (v) => [v, v, v];
/** The same numbers on every run. */
function noise(seed) {
  let x = seed >>> 0;
  return () => { x = (Math.imul(x, 1103515245) + 12345) >>> 0; return (x >>> 16) / 65536; };
}

// ── What was found, made here ────────────────────────────────────────
test('a dark backdrop, #333333 on #000000 with a bevelled rim, is a flat mask', () => {
  const inside = (x, y, inset) => x >= inset && x < 400 - inset && y >= inset && y < 300 - inset;
  const { kind, stats } = verdict(painted(400, 300, (x, y) => (inside(x, y, 24) ? grey(0x33) : inside(x, y, 21) ? grey(0x55) : inside(x, y, 18) ? grey(0x2a) : grey(0))));
  assert.equal(kind, 'flat');
  assert.ok(stats.colours <= 4 && stats.tones[2] > 0.97 && stats.exact > 0.9, JSON.stringify(stats));
  assert.match(describeShape(kind, stats), /^a flat mask: \d+ colours, [\d.]+% in three tones, [\d.]+% in two exact colours$/);
});

test('a silhouette cut for a photograph and a white triangle on black are flat masks too', () => {
  const blob = verdict(painted(300, 300, (x, y) => (Math.hypot(x - 120, y - 150) < 90 || Math.hypot(x - 200, y - 170) < 70 ? grey(0x33) : grey(0))));
  assert.equal(blob.kind, 'flat');
  // White covers under half of it, so it is not a drawing on paper.
  const triangle = verdict(painted(300, 300, (x, y) => (Math.abs(x - 150) < y * 0.45 ? grey(255) : grey(0))));
  assert.equal(triangle.kind, 'flat');
  assert.ok(triangle.stats.paper > 0.4 && triangle.stats.paper < SHAPE_RULE.PAPER, `paper ${triangle.stats.paper}`);
});

test('an arrow, a disc and a rounded panel filled with a soft gradient are smooth shapes', () => {
  const arrow = verdict(painted(300, 300, (x, y) => {
    const on = y < 150 ? Math.abs(x - 150) < y : Math.abs(x - 150) < 60;
    return on ? grey(205 - Math.round(y / 15)) : grey(0);
  }));
  assert.equal(arrow.kind, 'smooth');
  const disc = verdict(painted(300, 300, (x, y) => (Math.hypot(x - 150, y - 150) < 140 ? grey(200 - Math.round(y / 20)) : grey(0))));
  assert.equal(disc.kind, 'smooth');
  // A lavender panel with no black around it: no two exact colours hold it, its smoothness does.
  const panel = verdict(painted(400, 200, (x, y) => [146 + Math.round(y / 6), 165 + Math.round(y / 8), 216 + Math.round(y / 30)]));
  assert.equal(panel.kind, 'smooth');
  assert.ok(panel.stats.exact < SHAPE_RULE.FLAT_EXACT, 'a gradient is not two exact colours');
  assert.match(describeShape(panel.kind, panel.stats), /^a smooth shape: [\d.]+% of it shades into its neighbours, [\d.]+% in three tones$/);
});

test('a bar shading from blue to black and a dark vignette are smooth shapes whatever their tones', () => {
  const bar = verdict(painted(700, 180, (x) => [Math.round(60 * (1 - x / 700)), Math.round(100 * (1 - x / 700)), Math.round(150 * (1 - x / 700))]));
  assert.equal(bar.kind, 'smooth');
  assert.ok(bar.stats.smooth >= SHAPE_RULE.GRADIENT && bar.stats.tones[2] < SHAPE_RULE.SMOOTH_TONES, 'dozens of tones, every one shading into the next');
  const vignette = verdict(painted(260, 190, (x, y) => grey(Math.max(0, 22 - Math.round(Math.hypot(x - 130, y - 95) / 6)))));
  assert.equal(vignette.kind, 'smooth');
});

test('one flat colour is blank, paper white included', () => {
  for (const colour of [[255, 255, 255], [0, 0, 0], [40, 90, 160]]) {
    const { kind, stats } = verdict(painted(120, 80, () => colour));
    assert.equal(kind, 'blank');
    assert.match(describeShape(kind, stats), /^one flat colour: 100\.0% of it is one tone$/);
  }
});

// ── What it must never take ──────────────────────────────────────────
test('a photograph is a picture: it has texture, and no two colours hold it', () => {
  const rnd = noise(11);
  // Slow light and shade with grain on top, as a bench photograph has.
  const { kind, stats } = verdict(painted(320, 240, (x, y) => {
    const base = 120 + 50 * Math.sin(x / 40) + 40 * Math.cos(y / 30);
    return [base + rnd() * 30, base * 0.9 + rnd() * 30, base * 0.8 + rnd() * 30].map((v) => Math.max(0, Math.min(255, Math.round(v))));
  }));
  assert.equal(kind, null);
  assert.ok(stats.smooth < 0.5 && stats.exact < 0.05 && stats.colours > 20, JSON.stringify(stats));
});

test('a green fluorescence field, nearly all dark, is a picture: no exact colour holds it', () => {
  // The nearest photograph to a mask on 11 Nov 2026 (microbio-1--viral-ag-detection/p2-0): 14
  // colours and 97.9% in three tones, with 12.6% in its two commonest exact colours.
  const rnd = noise(5);
  const { kind, stats } = verdict(painted(400, 300, (x, y) => {
    const speck = (x * 7 + y * 13) % 211 === 0;
    return speck ? [20, 150 + Math.round(rnd() * 60), 20] : [4 + Math.round(rnd() * 6), 19 + Math.round(rnd() * 12), Math.round(rnd() * 3)];
  }));
  assert.equal(kind, null);
  assert.ok(stats.tones[2] > 0.9, 'three tones hold nearly all of it, as they hold a mask');
  assert.ok(stats.exact < 0.2, `two exact colours hold ${stats.exact}`);
  // One tone holds 99.5% of this one, as it holds a blank sheet. Its grain is what keeps it.
  assert.ok(stats.tones[0] >= SHAPE_RULE.BLANK && stats.smooth < SHAPE_RULE.SMOOTH, JSON.stringify(stats));
});

test('a chart, a table and a line drawing are on paper and are kept, however few their colours', () => {
  // Axes, a grid and a curve on white: two tones and a handful of colours, like a mask.
  const chart = painted(500, 320, (x, y) => {
    if (x === 40 || y === 280) return grey(0);
    if (x > 40 && y < 280 && (x % 46 === 0 || y % 40 === 0)) return grey(225);
    if (x > 40 && Math.abs(y - (260 - (x - 40) * 0.5)) < 1.5) return [30, 30, 200];
    return grey(255);
  });
  const { kind, stats } = verdict(chart);
  assert.equal(kind, null);
  assert.ok(stats.paper >= SHAPE_RULE.PAPER, `paper ${stats.paper}`);
  // Without the paper, the same measures would read as a flat mask: the paper is what keeps it.
  assert.equal(shapeKind({ ...stats, paper: 0 }), 'flat');
  // A white shape on black that is mostly white reads as paper too: the rule errs towards keeping.
  assert.equal(verdict(painted(300, 300, (x, y) => (Math.abs(x - 150) < 40 + y * 0.45 ? grey(255) : grey(0)))).kind, null);
});

test('a dark drawing, many colours on black, is a picture', () => {
  // Thin coloured outlines on black, each line its own colour, as a labelled scan on a dark slide has.
  const { kind, stats } = verdict(painted(420, 300, (x, y) => {
    const line = Math.floor(y / 15);
    return y % 15 < 2 && x > 20 && x < 400 ? [60 + line * 9, 250 - line * 8, 40 + line * 10] : grey(0);
  }));
  assert.equal(kind, null);
  assert.ok(stats.colours > SHAPE_RULE.MAX_COLOURS && stats.tones[2] < SHAPE_RULE.FLAT_TONES, JSON.stringify(stats));
});

test('a large picture is read on an even grid, and reads the same', () => {
  const inside = (x, y, w, h) => x >= w * 0.06 && x < w * 0.94 && y >= h * 0.08 && y < h * 0.92;
  const small = verdict(painted(400, 300, (x, y) => (inside(x, y, 400, 300) ? grey(0x33) : grey(0))));
  const large = verdict(painted(2000, 1500, (x, y) => (inside(x, y, 2000, 1500) ? grey(0x33) : grey(0))));
  assert.equal(large.kind, 'flat');
  assert.ok(large.stats.samples <= SHAPE_RULE.SAMPLES && large.stats.samples > SHAPE_RULE.SAMPLES / 5, `samples ${large.stats.samples}`);
  assert.ok(Math.abs(large.stats.exact - small.stats.exact) < 0.01 && Math.abs(large.stats.tones[1] - small.stats.tones[1]) < 0.01);
});

test('a file is read as a browser shows it: transparency on white, any format', async () => {
  // A black disc on a transparent ground: on the page it is a black disc on white, mostly paper.
  const w = 200;
  const rgba = Buffer.alloc(w * w * 4);
  for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) rgba[(y * w + x) * 4 + 3] = Math.hypot(x - 100, y - 100) < 40 ? 255 : 0;
  const png = await sharp(rgba, { raw: { width: w, height: w, channels: 4 } }).png().toBuffer();
  const disc = await measureShape(png);
  assert.equal(disc.kind, null);
  assert.ok(disc.stats.paper > 0.8, `paper ${disc.stats.paper}`);
  // A one-channel picture is read as three.
  const greyscale = await sharp(Buffer.alloc(60 * 40, 0x33), { raw: { width: 60, height: 40, channels: 1 } }).png().toBuffer();
  assert.equal((await measureShape(greyscale)).kind, 'blank');
});

// ── The repository ───────────────────────────────────────────────────
const shown = new Set(Object.values(SLIDE_IMAGES).flat());

test('the shapes found on 11 Nov 2026 are in no section', () => {
  // One or more of each kind, as it was named; the clean removed 75 by the rule and two by name.
  const gone = [
    // the three black boxes of "Clinical signs และ lesions ของ Chytridiomycosis", and more backdrops
    '/figures/vet-microbio-1/microbio-1--aquatic-fungi/p8-0.webp',
    '/figures/vet-microbio-1/microbio-1--aquatic-fungi/p8-1.webp',
    '/figures/vet-microbio-1/microbio-1--aquatic-fungi/p8-2.webp',
    '/figures/vet-microbio-1/microbio-1--higher-bacteria/p13-1.webp',
    '/figures/vet-microbio-1/microbio-1--exercise-2-sample-collection-bacterial-isolation-primary-ide/p24-0.webp',
    // silhouettes
    '/figures/vet-microbio-1/microbio-1--fungal-culture-and-identification-lab/p9-0.webp',
    '/figures/vet-microbio-1/microbio-1--fungal-disease-and-classification-lect1/p25-0.webp',
    // a triangle, two arrows, a disc, rounded panels, a bar
    '/figures/vet-microbio-1/microbio-1--aquatic-fungi/p10-0.webp',
    '/figures/vet-microbio-1/microbio-1--aquatic-fungi/p24-1.webp',
    '/figures/vet-microbio-1/microbio-1--aquatic-fungi/p24-2.webp',
    '/figures/vet-microbio-1/microbio-1--aquatic-fungi/p7-0.webp',
    '/figures/vet-microbio-1/microbio-1--higher-bacteria/p18-2.webp',
    '/figures/vet-microbio-1/microbio-1--fungal-disease-and-classification-lect1/p11-0.webp',
    '/figures/vet-neuroanat/neuroanat--basal-nuclei/p3-0.webp',
    // gradient bars and dark vignettes
    '/figures/vet-microbio-1/microbio-1--fungal-disease-and-classification-lect1/p14-0.webp',
    '/figures/vet-histo/histo--bone-marrow/p51-0.webp',
    '/figures/vet-histo/histo--bone-marrow/p51-2.webp',
    // the two dropped by name: a small grey shadow and an empty frame
    '/figures/vet-histo/histo--bone-marrow/p51-1.webp',
    '/figures/vet-microbio-1/microbio-1--fungal-disease-and-classification-lect1/p10-2.webp',
  ];
  assert.deepEqual(gone.filter((p) => shown.has(p)), []);
  for (const p of gone) assert.equal(fs.existsSync(path.join(ROOT, 'public', p)), false, `${p} is still on disk`);
  // The section that showed three black boxes shows no figure now.
  assert.equal(Object.keys(SLIDE_IMAGES).some((id) => id.includes('clinical-signs-และ-lesions-ของ-chytridiomycosis')), false);
});

test('the real pictures nearest to a shape are still shown, and still read as pictures', async () => {
  // Each is the kept picture closest to one of the rule's numbers on 11 Nov 2026, with the
  // measure that keeps it. A change to the rule that takes one of these is wrong.
  const kept = [
    // a standard curve: 8 colours and 98.3% in three tones; it is 95.5% paper
    ['/figures/vet-microbio-1/microbio-1--lab-pcr-other-molecular-techniques/p20-2.webp', (s) => s.paper >= 0.9],
    // a green fluorescence field: 14 colours, 97.9% in three tones; 12.6% in two exact colours
    ['/figures/vet-microbio-1/microbio-1--viral-ag-detection/p2-0.webp', (s) => s.exact < 0.3 && s.smooth < 0.93],
    // a grey micrograph: 11 colours; 92.9% in three tones and 40.1% in two exact colours
    ['/figures/vet-parasit-1/parasit-1--lect-12-2-diagnostic-techniques/p3-0.webp', (s) => s.tones[2] < SHAPE_RULE.FLAT_TONES && s.exact < 0.5],
    // a dog drawn on black: 76.4% in two exact colours; 25 colours and 94.3% in three tones
    ['/figures/vet-physio-lab-1/physio-lab-1--endocrine-physiology-ivggt-lab-2023-sp/p12-0.webp', (s) => s.colours > 20 && s.tones[2] < SHAPE_RULE.FLAT_TONES],
    // a labelled scan on black: 79.8% in two exact colours; 16 colours and 92.6% in three tones
    ['/figures/vet-microbio-1/microbio-1--epidemiology-of-viral-infection/p5-1.webp', (s) => s.colours > SHAPE_RULE.MAX_COLOURS && s.tones[2] < SHAPE_RULE.FLAT_TONES],
    // a test tube on a white bench, the smoothest photograph: 97.1% smooth; 77.8% in three tones
    ['/figures/vet-microbio-1/microbio-1--bacterial-metabolism/p28-0.webp', (s) => s.smooth < SHAPE_RULE.GRADIENT && s.tones[2] < 0.85],
    // an antibiotic disc plate: 95.8% smooth; 89.8% in three tones
    ['/figures/vet-microbio-1/microbio-1--antimicrobial-resistance/p8-0.webp', (s) => s.tones[2] < SHAPE_RULE.SMOOTH_TONES],
  ];
  for (const [figure, why] of kept) {
    assert.ok(shown.has(figure), `${figure} is a real figure and is no longer shown`);
    const { kind, stats } = await measureShape(path.join(ROOT, 'public', figure));
    assert.equal(kind, null, `${figure} now reads as ${kind}: ${JSON.stringify(stats)}`);
    assert.ok(why(stats), `${figure} is no longer kept by the measure this test names: ${JSON.stringify(stats)}`);
  }
});

test('the numbers are the ones the files were measured against', () => {
  assert.deepEqual(
    { ...SHAPE_RULE },
    { NEAR: 10, STEP: 3, COLOUR_SHARE: 0.001, MAX_COLOURS: 12, FLAT_TONES: 0.95, FLAT_EXACT: 0.6, SMOOTH: 0.95, SMOOTH_TONES: 0.93, GRADIENT: 0.985, BLANK: 0.995, WHITE: 235, PAPER: 0.5, SAMPLES: 200_000 },
    'a new number is a new measurement: run the rule over every deck figure and look at what it takes and what it nearly takes (docs/MEDIA.md)',
  );
});
