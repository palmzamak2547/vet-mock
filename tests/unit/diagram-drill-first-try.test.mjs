// ============================================================
// diagram-drill-first-try.test.mjs — the score counts the first answer
// ============================================================
// OV-critic-3. A wrong anchor could be labelled again before the reveal, the
// new pick overwrote the old one, and the score was the number of anchors
// right at the end. Retrying every wrong anchor therefore always ended at
// 100%. Retries stay (they are how the drill teaches), but the score now
// counts each anchor's first pick only, and the result says how many were
// right first time.
//
// The real component is compiled from source and mounted under react-dom.
// The anchors sit in an svg whose markup is injected, so a tap on one is
// delivered the way the svg's own onClick receives it: an event whose target
// carries data-id.
// ============================================================
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

import { DIAGRAM_DRILLS } from '../../src/data/diagram-drills.js';
import {
  bundleModule, buttonsWithText, click, findAll, installDom, mountElement, reactProps, stubModule,
} from './helpers/mini-dom.mjs';

const DRILL = DIAGRAM_DRILLS[0];
const N = DRILL.anchors.length;

let dom;
let bundle;
let mod;

before(async () => {
  dom = installDom();
  bundle = await bundleModule({
    prefix: 'diagram-drill-',
    contents: "export { default as DiagramLabelDrill } from './src/components/DiagramLabelDrill.jsx';",
    plugins: [stubModule(/useModalFocus\.js$/, "import { useRef } from 'react'; export function useModalFocus() { return useRef(null); }")],
  });
  mod = bundle.mod;
});

after(() => {
  bundle?.dispose();
  dom?.restore();
});

const textOf = (node) => node.textContent.replace(/\s+/g, ' ').trim();

async function openDrill(t) {
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.DiagramLabelDrill, { onClose() {} }));
  await click(mod, buttonsWithText(container, DRILL.title)[0]);
  return container;
}

const svgOf = (container) => findAll(container, (n) => n.tagName === 'SVG')[0];
// A tap on an anchor, as the svg's delegated onClick receives it.
const tapAnchor = (container, id) => mod.act(async () => {
  const svg = svgOf(container);
  reactProps(svg).onClick({ target: { dataset: { id }, parentNode: null }, currentTarget: svg });
});
const chip = (container, label) => {
  const hits = findAll(container, (n) => n.tagName === 'BUTTON' && n.getAttribute('class') === 'vmx-chip' && textOf(n) === label);
  assert.equal(hits.length, 1, `one chip labelled "${label}"`);
  return hits[0];
};
const label = (id) => DRILL.anchors.find((a) => a.id === id).label;
async function place(container, anchorId, text) {
  await tapAnchor(container, anchorId);
  await click(mod, chip(container, text));
}
const reveal = async (container) => click(mod, buttonsWithText(container, 'ดูคะแนน')[0]);

test('retrying a wrong anchor until it is right does not make the score 100%', async (t) => {
  const container = await openDrill(t);
  const [first, second, ...rest] = DRILL.anchors;

  // First anchor: wrong at first (the second anchor's label), then corrected.
  await place(container, first.id, second.label);
  await place(container, first.id, first.label);
  // Everything else is right the first time.
  await place(container, second.id, second.label);
  for (const a of rest) await place(container, a.id, a.label);

  await reveal(container);
  const text = textOf(container);
  const expectedPct = Math.round(((N - 1) / N) * 100);
  assert.match(text, new RegExp(`${expectedPct}%`), 'the score counts the first answers');
  assert.doesNotMatch(text, /100%/, 'retrying cannot reach 100%');
  assert.ok(text.includes(`ถูกตั้งแต่ครั้งแรก ${N - 1}/${N}`), 'the result says how many were right first time');
  // The live count still shows what is right now, so the retry is visible.
  assert.ok(text.includes(`${N}/${N} ถูก`), 'all anchors end up labelled correctly');
});

test('every anchor right first time is 100%', async (t) => {
  const container = await openDrill(t);
  for (const a of DRILL.anchors) await place(container, a.id, a.label);
  await reveal(container);
  const text = textOf(container);
  assert.match(text, /100%/);
  assert.ok(text.includes(`ถูกตั้งแต่ครั้งแรก ${N}/${N}`));
});

test('every anchor that needed a second try costs a point, however many retries', async (t) => {
  const container = await openDrill(t);
  const [a, b, c, d, ...rest] = DRILL.anchors;
  await place(container, a.id, b.label); // wrong
  await place(container, a.id, c.label); // wrong again
  await place(container, a.id, a.label); // right on the third try
  await place(container, c.id, d.label); // wrong
  await place(container, c.id, c.label); // right on the second try
  for (const x of [b, d, ...rest]) await place(container, x.id, x.label);

  await reveal(container);
  const text = textOf(container);
  const firstTry = N - 2;
  assert.ok(text.includes(`ถูกตั้งแต่ครั้งแรก ${firstTry}/${N}`));
  assert.match(text, new RegExp(`${Math.round((firstTry / N) * 100)}%`));
  assert.doesNotMatch(text, /100%/);
});

test('the drill renders without a React warning', () => {
  assert.deepEqual(dom.consoleErrors, []);
});
