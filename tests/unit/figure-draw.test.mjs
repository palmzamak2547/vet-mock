// The drawing's words (ExplainFigure.jsx): the screen-reader description says
// everything the drawing shows and never mangles a word; Thai labels break only
// between words; the layout reserves the same height the drawing fills.
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { bundleModule } from './helpers/mini-dom.mjs';
import { parseFigure, figureLayout } from '../../src/lib/figure-spec.js';

let bundle;
let mod;
before(async () => {
  bundle = await bundleModule({ prefix: 'fig-draw-words-', contents: "export { describe, thaiWords, readings } from './src/components/ExplainFigure.jsx';" });
  mod = bundle.mod;
});
after(() => bundle?.dispose());

test('a description keeps every letter: an s is a letter, not a space', () => {
  const said = mod.describe(parseFigure('timeline', 'unit: hours\nstart: births\nat: 1 | stands\nat: 2 | sucks | key'));
  for (const word of ['hours', 'births', 'stands', 'sucks']) assert.ok(said.includes(word), said);
  const scale = mod.describe(parseFigure('scale', 'band: 0.40 | 0.59 | moderate agreements | key\nvalue: kappas = 0.46'));
  assert.ok(scale.includes('moderate agreements') && scale.includes('kappas'), scale);
});

test('a description says everything the drawing shows, as a list, never as a sequence', () => {
  const flow = mod.describe(parseFigure('flow', 'step: 2 | เทียบกับค่าฐาน\nstep: 7 | ประเมินสมมติฐาน | ระบาดวิทยาเชิงวิเคราะห์ | key'));
  assert.ok(!flow.includes('แล้ว'), flow);
  for (const part of ['ขั้นตอนที่ 2', 'เทียบกับค่าฐาน', 'ขั้นตอนที่ 7', 'ระบาดวิทยาเชิงวิเคราะห์', '(คำตอบ)']) assert.ok(flow.includes(part), part);
  const two = mod.describe(parseFigure('twobytwo', 'cols: เพาะเชื้อบวก | เพาะเชื้อลบ\nrow: ELISA บวก | 102 | 40\nrow: ELISA ลบ | 38 | 224\nsum: รวม | 140 | 264\ncalc: Sensitivity = 102/140 = 0.73'));
  for (const part of ['102', '40', '38', '224', '140', '264', 'อ่านลงตามคอลัมน์', '0.73']) assert.ok(two.includes(part), part);
  const tl = mod.describe(parseFigure('timeline', 'unit: ชม.\nstart: คลอด\nat: 3 | แม่ขับรก\nat: 3 | ลูกขับขี้เทาหรือ meconium'));
  assert.ok(tl.includes('meconium') && tl.includes('แม่ขับรก'), tl);
});

test('a Thai label breaks only between words, never inside a compound', () => {
  const pieces = (s) => mod.thaiWords(s);
  assert.ok(pieces('ผลบวก').includes('ผลบวก'), pieces('ผลบวก').join('|'));
  assert.ok(pieces('อย่างน้อยสองวิธีในเวลาเดียวกัน').some((p) => p.includes('อย่างน้อย')), pieces('อย่างน้อยสองวิธีในเวลาเดียวกัน').join('|'));
  assert.equal(pieces('ลูกกินนมได้').join(''), 'ลูกกินนมได้');
  assert.deepEqual(pieces('ELISA'), ['ELISA']);
});

test('the way a 2x2 is read: down a column for a column total, along a row for a row total', () => {
  const se = mod.readings(parseFigure('twobytwo', 'cols: a | b\nrow: r | 102 | 40\nrow: s | 38 | 224\nsum: t | 140 | 264\ncalc: Se = 102/140 = 0.73'));
  assert.deepEqual(se.ways, ['อ่านลงตามคอลัมน์']);
  const ppv = mod.readings(parseFigure('twobytwo', 'cols: a | b | t\nrow: r | 102 | 40 | 142\nrow: s | 38 | 224 | 262\ncalc: PPV = 102/142 = 0.72'));
  assert.deepEqual(ppv.ways, ['อ่านตามแถว']);
});

test('the held height follows the width it is drawn at', () => {
  const tl = parseFigure('timeline', 'unit: ชม.\nstart: คลอด\nat: 1 | ลูกยืนได้\nat: 2 | ลูกกินนมได้ | key\nat: 3 | แม่ขับรก\nat: 3 | ลูกขับขี้เทาหรือ meconium');
  assert.ok(figureLayout(tl, 188).height > figureLayout(tl, 343).height);
  assert.ok(figureLayout(tl, 188).narrow && !figureLayout(tl, 343).narrow);
});
