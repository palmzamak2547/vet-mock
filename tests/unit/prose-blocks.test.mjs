// Prose typeset as blocks (src/lib/rich-blocks.js proseBlocks and splitStem,
// drawn by src/components/RichBlocks.jsx): over the whole bank, the blocks give
// every text back character for character; a stem that is not cut draws
// exactly as before; a typeset text shows the same characters as before; and
// the cases that set the rules (by id) come out as designed.
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { lineShape, proseBlocks, splitBlocks, splitStem } from '../../src/lib/rich-blocks.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);

let questions = [];
// The stems whose last line is drawn as the heading, each heading read by a person (review of #281, 15 Nov 2026).
// A stem joining this list is a decision: read its heading on the card, then add its id here.
const CUT_STEMS = [8310, 8311, 8312, 8313, 8330, 8331, 209588, 209599, 211082];
let byId = new Map();
let tmp;
let ui;

before(async () => {
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  byId = new Map(questions.map((q) => [q.id, q]));
  // The real components, bundled; React stays external (as in faculty-view-render.test.mjs).
  const result = await build({
    stdin: {
      contents: [
        "export { default as RichBlocks, StemText } from './src/components/RichBlocks.jsx';",
        "export { RichText } from './src/lib/richtext.jsx';",
        "export { createElement } from 'react';",
        "export { renderToStaticMarkup } from 'react-dom/server';",
      ].join('\n'),
      resolveDir: repoRoot,
      loader: 'js',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    plugins: [{
      name: 'react-external',
      setup(b) {
        b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (args) => ({ path: pathToFileURL(require.resolve(args.path)).href, external: true }));
      },
    }],
    write: false,
    logLevel: 'silent',
  });
  tmp = mkdtempSync(join(tmpdir(), 'prose-blocks-'));
  const file = join(tmp, 'prose-blocks.bundle.mjs');
  writeFileSync(file, result.outputFiles[0].text);
  ui = await import(pathToFileURL(file).href);
});

after(() => { if (tmp) rmSync(tmp, { recursive: true, force: true }); });

// Every text a question holds that the app draws.
function* texts() {
  for (const q of questions) {
    for (const field of ['q', 'passage', 'explain']) if (typeof q[field] === 'string') yield [q, field, q[field]];
    if (Array.isArray(q.options)) for (const [k, o] of q.options.entries()) if (typeof o === 'string') yield [q, `options[${k}]`, o];
  }
}

function assertWhole(text, blocks, where) {
  assert.ok(blocks.length > 0, where);
  assert.equal(blocks[0].start, 0, `${where}: starts at 0`);
  assert.equal(blocks[blocks.length - 1].end, text.length, `${where}: ends at the end`);
  for (let k = 1; k < blocks.length; k++) assert.equal(blocks[k].start, blocks[k - 1].end, `${where}: block ${k} starts where ${k - 1} ends`);
  assert.equal(blocks.map((b) => text.slice(b.start, b.end)).join(''), text, `${where}: slices joined`);
  for (const b of blocks) {
    for (const line of [...(b.lead ? [b.lead] : []), ...b.lines]) {
      assert.equal(text.slice(line.start, line.end), line.text, `${where}: line offsets`);
      assert.ok(line.start >= b.start && line.end <= b.end, `${where}: line inside its block`);
      if (line.parts) assert.equal(Object.values(line.parts).join(''), line.text, `${where}: parts joined`);
    }
  }
}

test('over the whole bank, every text comes back from its blocks character for character', () => {
  let n = 0;
  const cut = [];
  for (const [q, field, text] of texts()) {
    const where = `${q.subject}:${q.id}:${field}`;
    assertWhole(text, proseBlocks(text), where);
    // RichBlocks typesets the prose between tables, so each of those runs too.
    for (const run of splitBlocks(text)) if (run.type === 'text') assertWhole(run.text, proseBlocks(run.text), `${where}@${run.start}`);
    if (field === 'q') {
      const split = splitStem(text);
      if (split) {
        cut.push(q.id);
        assertWhole(text, [...split.body, split.ask], `${where} (cut)`);
        assert.equal(split.bodyText + split.askText, text, where);
        assert.equal(split.ask.start, split.body[split.body.length - 1].end, where);
      }
    }
    n++;
  }
  assert.ok(questions.length > 9000, `bank read whole (${questions.length})`);
  assert.ok(n > questions.length, 'stems, explanations and options all walked');
  assert.deepEqual(cut.sort((a, b) => a - b), CUT_STEMS, 'the stems drawn with their last line as the heading');
});

const markup = (el) => ui.renderToStaticMarkup(el);
const shown = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, '');

test('every stem that is not cut draws through the old path: the same markup as before', () => {
  const { createElement: h, StemText, RichText } = ui;
  const ask = (content) => h('h2', { className: 'vmx-review-q' }, content);
  let same = 0;
  for (const q of questions) {
    if (typeof q.q !== 'string' || splitStem(q.q)) continue;
    assert.equal(markup(h(StemText, { text: q.q, ask })), markup(h('h2', { className: 'vmx-review-q' }, h(RichText, { text: q.q }))), `${q.subject}:${q.id}`);
    same++;
  }
  assert.ok(same > 9000, `${same} stems unchanged`);
});

test('a typeset stem, explanation or passage shows the same characters, in order, as its old drawing', () => {
  const { createElement: h, StemText, RichBlocks, RichText } = ui;
  const counts = { stems: 0, explanations: 0, passages: 0 };
  for (const q of questions) {
    if (typeof q.q === 'string' && splitStem(q.q)) {
      const now = markup(h(StemText, { text: q.q, ask: (c) => h('h2', null, c) }));
      assert.equal(shown(now), shown(markup(h(RichText, { text: q.q }))), `${q.subject}:${q.id}:q`);
      assert.match(now, /class="vmx-qstem"/);
      counts.stems++;
    }
    for (const [field, key] of [['explain', 'explanations'], ['passage', 'passages']]) {
      const text = q[field];
      if (typeof text !== 'string') continue;
      const runs = splitBlocks(text).filter((b) => b.type === 'text');
      let typeset = false;
      for (const run of runs) {
        const now = markup(h(RichBlocks, { text: run.text }));
        if (!now.includes('class="vmx-rb"')) continue;
        typeset = true;
        assert.equal(shown(now), shown(markup(h(RichText, { text: run.text }))), `${q.subject}:${q.id}:${field}@${run.start}`);
      }
      if (typeset) counts[key]++;
    }
  }
  // The counts the release names; a rule that suddenly typesets far more or far less than this is a change to look at.
  console.log(`typeset: ${counts.stems} stems, ${counts.explanations} explanations, ${counts.passages} passages (review list only)`);
  assert.equal(counts.stems, CUT_STEMS.length, JSON.stringify(counts));
});

const types = (blocks) => blocks.map((b) => b.type);

test('209588: the leads, three result runs and the ask', () => {
  const q = byId.get(209588);
  const split = splitStem(q.q);
  assert.ok(split);
  assert.deepEqual(types(split.body), ['para', 'results', 'results', 'results', 'para']);
  const [, flexion, nerve, joint] = split.body;
  assert.equal(flexion.lead.text, 'Flexion test');
  // A short label is set apart in weight; a sentence that leads in is not.
  assert.equal(flexion.lead.label, true);
  assert.equal(nerve.lead.label, false);
  assert.equal(joint.lead.label, false);
  assert.deepEqual(flexion.lines.map((l) => l.parts.result), ['(Negative)', '(Negative)', '(Negative)']);
  assert.match(nerve.lead.text, /ได้ผลดังต่อไปนี้$/);
  assert.deepEqual(nerve.lines.map((l) => l.parts.label), ['Palmar digital nerve block', 'Abaxial digital nerve block', 'Low four nerve block']);
  assert.match(joint.lead.text, /ได้ผลดังนี้$/);
  assert.equal(joint.lines.length, 2);
  assert.equal(split.askText, 'จากผลการตรวจทั้งหมด ม้าตัวนี้มีปัญหาอะไร (Diagnosis) ตอบไม่เกิน 1 บรรทัด');
});

test('209599: the lab values as one pairs block with ranges, under their lead, and the ask', () => {
  const q = byId.get(209599);
  const split = splitStem(q.q);
  assert.ok(split);
  const labs = split.body.find((b) => b.type === 'pairs');
  assert.ok(labs?.range);
  assert.equal(labs.lines.length, 21);
  assert.match(labs.lead.text, /ได้ผลดังต่อไปนี้ \(Parameter: Results \| Range\)$/);
  assert.equal(labs.lead.label, false);
  assert.deepEqual(labs.lines[0].parts, { label: 'RBC (10⁶/μl)', sep: ': ', value: '5.1', bar: ' | ', range: '6.0–12.0' });
  assert.equal(labs.lines[2].parts.label, 'HCT (%)');
  assert.equal(labs.lines[20].parts.label, 'Phosphorus (mg/dl)');
  // The smear line is not a pair: it stays a sentence after the grid.
  assert.equal(split.body[split.body.length - 1].type, 'para');
  assert.equal(split.body[split.body.length - 1].lines[0].text, 'Blood Parasite (direct smear) negative');
  assert.match(split.askText, /^จากผลที่ได้ จงระบุ Differential diagnosis มา 4 ข้อ/);
});

test('2200: a numbered run that ends the stem keeps the stem whole', () => {
  const q = byId.get(2200);
  assert.equal(splitStem(q.q), null);
  const blocks = proseBlocks(q.q);
  assert.deepEqual(types(blocks), ['para', 'list']);
  assert.deepEqual(blocks[1].lines.map((l) => l.parts.marker), ['1)', '2)', '3)']);
});

test('2103: two lists in an explanation, numbered then bulleted', () => {
  const blocks = proseBlocks(byId.get(2103).explain);
  assert.deepEqual(types(blocks), ['para', 'list', 'para', 'list', 'para']);
  assert.deepEqual(blocks[1].lines.map((l) => l.parts.marker), ['1.', '2.', '3.', '4.', '5.', '6.']);
  assert.ok(blocks[3].lines.every((l) => l.parts.marker === '•'));
});

test('70001: blank lines end paragraphs, and dash items are a list', () => {
  const text = byId.get(70001).explain;
  const blocks = proseBlocks(text);
  assert.deepEqual(types(blocks), ['para', 'para', 'list', 'para']);
  assert.equal(blocks[2].lines.length, 4);
  assert.ok(blocks[2].lines.every((l) => l.parts.marker === '—'));
  // The blank line belongs to the block before it.
  assert.ok(text.slice(blocks[0].start, blocks[0].end).endsWith('\n\n'));
});

test('214506: a table in a passage is still drawn as the table it was', () => {
  const { createElement: h, RichBlocks } = ui;
  const q = byId.get(214506);
  assert.deepEqual(splitBlocks(q.passage).map((b) => b.type), ['text', 'table']);
  const html = markup(h(RichBlocks, { text: q.passage }));
  assert.match(html, /<table class="vmx-qtable/);
  assert.doesNotMatch(html, /\|---/);
});

test('what reads as a line, and what stays a sentence', () => {
  assert.equal(lineShape('RBC (10⁶/μl): 5.1 | 6.0–12.0').kind, 'lab');
  assert.equal(lineShape('Heart rate: 100 BPM').kind, 'key');
  assert.equal(lineShape('Fetlock (Negative)').kind, 'result');
  assert.equal(lineShape('Ochratoxin = renal tubular damage (ชัด)').kind, 'text');
  assert.equal(lineShape('ก. ข้อหนึ่ง').kind, 'list');
  assert.equal(lineShape('10:30 น. ม้าล้ม').kind, 'text');
  assert.equal(lineShape('http://example.org').kind, 'text');
  // Two lab lines are not a run; a mixed run is not one either.
  assert.deepEqual(types(proseBlocks('a: 1 | 2\nb: 3 | 4')), ['para']);
  assert.deepEqual(types(proseBlocks('a: 1 | 2\nb: 3\nc: 4 | 5')), ['para']);
  // A stem that asks first and gives the case after it is not cut.
  assert.equal(splitStem('ข้อใดถูก\nบรรทัดสอง\nบรรทัดสาม\nผลตรวจร่างกายปกติ'), null);
  assert.ok(splitStem('บรรทัดหนึ่ง\nบรรทัดสอง\nบรรทัดสาม\nข้อใดถูก'));
  assert.equal(splitStem('บรรทัดหนึ่ง\nบรรทัดสอง\nข้อใดถูก'), null);
});

test('211082: a step written "4.ตรวจ" with no space is step 4 of the list, not a paragraph', () => {
  const split = splitStem(byId.get(211082).q);
  assert.ok(split);
  assert.deepEqual(types(split.body), ['para', 'list']);
  assert.deepEqual(split.body[1].lines.map((l) => l.parts.marker), ['1.', '2.', '3.', '4.']);
  assert.equal(split.body[1].lines[3].parts.gap, '');
  assert.equal(split.askText, 'จงเรียงลำดับขั้นตอนที่เหมาะสม');
});

test('a numbered or lettered run is a list only when it counts on, and all or nothing', () => {
  assert.deepEqual(types(proseBlocks('1. a\n2. b\n4. c')), ['para']);
  assert.deepEqual(types(proseBlocks('1. a\n2.b\n3. c')), ['list']);
  assert.deepEqual(types(proseBlocks('1.5 mg\n2.5 mg')), ['para']);
  assert.deepEqual(types(proseBlocks('ก. หนึ่ง\nข. สอง\nค. สาม')), ['list']);
  assert.deepEqual(types(proseBlocks('a) one\nb) two')), ['list']);
  assert.deepEqual(types(proseBlocks('B. two\nC. three')), ['para']);
  assert.deepEqual(types(proseBlocks('C. parvum = calves\nC. canis = dogs')), ['para']);
});

test('550, 566, 92518, 8029: a genus initial ("C. parvum") never sits in a marker column', () => {
  for (const id of [550, 566, 92518, 8029]) {
    for (const block of proseBlocks(byId.get(id).explain)) {
      if (block.type !== 'list') continue;
      for (const line of block.lines) assert.doesNotMatch(line.parts.marker, /^[A-Za-z][.)]$/, `${id}: ${line.text}`);
    }
  }
});

test('8248: a line that carries on from the one above ("→ ...") is never a lead', () => {
  const blocks = proseBlocks(byId.get(8248).explain);
  assert.ok(blocks.some((b) => b.type === 'pairs'));
  assert.ok(blocks.every((b) => !b.lead || !/^→/.test(b.lead.text.trim())));
});

test('the heading is the ask only when the stem does not ask first, and words are read as words', () => {
  // Question first, case after: the last line is data, not the ask.
  assert.equal(splitStem('What joint would you like to flex?\nThe horse is lame.\nHoof testers negative.\nThe owner gave phenylbutazone, which helped a little.'), null);
  assert.equal(splitStem('ม้าตัวนี้เป็นอะไร\nประวัติ 1\nประวัติ 2\nเจ้าของเคยพาไปรักษาที่ไหนมาก่อน'), null);
  // A word that holds a question word is not a question: จงอาง is a snake, a problem list is data.
  assert.equal(splitStem('สุนัขถูกงูกัด\nบวมที่ขา\nเจ้าของนำงูมาด้วย\nงูที่กัดเป็นงูจงอาง'), null);
  assert.equal(splitStem('ม้าซึม\nไข้ 39\nไม่กินอาหาร\nProblem list: anorexia'), null);
  // The ask still reads as the ask.
  assert.equal(splitStem('ม้าซึม\nไข้ 39\nไม่กินอาหาร\nจงระบุ problem list').askText, 'จงระบุ problem list');
  assert.equal(splitStem('Case\nFever\nAnorexia\nList three differentials').askText, 'List three differentials');
});
