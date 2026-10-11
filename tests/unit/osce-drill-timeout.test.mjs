// ============================================================
// osce-drill-timeout.test.mjs — an OSCE station ends at the bell
// ============================================================
// OV-critic-5. The drill header read "⏱ 7:12 / 5:00": the timer ran until
// the student pressed stop and nothing compared it with the station time. A
// real station is graded when time is called, so the timer now stops at the
// limit, the attempt is graded with the ticks made by then, and "หมดเวลา"
// takes the place of the stop button.
//
// The real component is compiled from source and mounted under react-dom.
// Date and setInterval are mocked, so the whole station runs in a moment.
// ============================================================
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

import { OSCE_CHECKLISTS } from '../../src/data/osce-checklists.js';
import {
  bundleModule, buttonsWithText, click, findAll, installDom, mountElement, reactProps, stubModule,
} from './helpers/mini-dom.mjs';

const ATTEMPTS_KEY = 'vmx-osce-attempts';
const STATION = OSCE_CHECKLISTS[0];
const LIMIT_MS = STATION.minutes * 60_000;

let dom;
let bundle;
let mod;

before(async () => {
  dom = installDom();
  bundle = await bundleModule({
    prefix: 'osce-drill-',
    contents: "export { default as OSCEDrill } from './src/components/OSCEDrill.jsx';",
    plugins: [stubModule(/useModalFocus\.js$/, "import { useRef } from 'react'; export function useModalFocus() { return useRef(null); }")],
  });
  mod = bundle.mod;
});

after(() => {
  bundle?.dispose();
  dom?.restore();
});

const textOf = (node) => node.textContent.replace(/\s+/g, ' ').trim();
const attempts = () => JSON.parse(dom.storage.getItem(ATTEMPTS_KEY) || '{}')[STATION.id] || [];
const checkboxes = (root) => findAll(root, (n) => n.tagName === 'INPUT' && n.getAttribute('type') === 'checkbox');
const stopButton = (root) => buttonsWithText(root, 'จบและให้คะแนน')[0];
const clock = (root) => {
  const spans = findAll(root, (n) => n.tagName === 'SPAN' && /^⏱ \d+:\d\d$/.test(textOf(n)));
  assert.equal(spans.length, 1, 'one timer readout');
  return textOf(spans[0]).replace('⏱ ', '');
};
const tick = (t, ms) => mod.act(async () => { t.mock.timers.tick(ms); });

// Mount the drill, choose the station, tick the first and the second item
// (weights 1 and 2 of the station) and start the timer.
async function runningStation(t) {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 1_700_000_000_000 });
  dom.storage.clear();
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.OSCEDrill, { onClose() {} }));
  await click(mod, buttonsWithText(container, STATION.title)[0]);
  const boxes = checkboxes(container);
  await mod.act(async () => {
    reactProps(boxes[0]).onChange({ target: { checked: true } });
    reactProps(boxes[1]).onChange({ target: { checked: true } });
  });
  await click(mod, buttonsWithText(container, 'เริ่มจับเวลา')[0]);
  return container;
}

const ticked = STATION.items[0].weight + STATION.items[1].weight;
const totalWeight = STATION.items.reduce((s, it) => s + it.weight, 0);
const expectedScore = Math.round((ticked / totalWeight) * 100);

test('before the limit the timer runs and nothing is graded', async (t) => {
  const container = await runningStation(t);
  await tick(t, 60_000);
  assert.equal(clock(container), '1:00');
  assert.ok(stopButton(container), 'the stop button is still there');
  assert.ok(!textOf(container).includes('หมดเวลา'));
  assert.equal(attempts().length, 0);
});

test('pressing stop before the limit still grades the attempt', async (t) => {
  const container = await runningStation(t);
  await tick(t, 120_000);
  await click(mod, stopButton(container));
  assert.equal(attempts().length, 1);
  assert.equal(attempts()[0].ms, 120_000);
  assert.equal(attempts()[0].score, expectedScore);
  assert.ok(!textOf(container).includes('หมดเวลา'), 'no time-up notice when the student stopped');
});

test('at the limit the timer stops, the attempt is graded and time-up replaces the stop button', async (t) => {
  const container = await runningStation(t);
  // Three seconds past the bell: the display must not run on to 5:03.
  await tick(t, LIMIT_MS + 3_000);

  assert.equal(clock(container), `${STATION.minutes}:00`, 'the readout is held at the limit');
  assert.equal(stopButton(container), undefined, 'the stop button is gone');
  assert.ok(textOf(container).includes('หมดเวลา'), 'the time-up notice is shown');

  const saved = attempts();
  assert.equal(saved.length, 1, 'graded once');
  assert.equal(saved[0].ms, LIMIT_MS, 'graded at the bell, not at the next tick');
  assert.equal(saved[0].score, expectedScore, 'graded with the items ticked by then');

  // The clock is stopped: time moving on changes nothing.
  await tick(t, 60_000);
  assert.equal(clock(container), `${STATION.minutes}:00`);
  assert.equal(attempts().length, 1);
});

test('a stop pressed in the same instant as the bell does not grade twice', async (t) => {
  const container = await runningStation(t);
  const staleStop = reactProps(stopButton(container)).onClick;
  await tick(t, LIMIT_MS + 250);
  assert.equal(attempts().length, 1);
  await mod.act(async () => { staleStop({}); });
  assert.equal(attempts().length, 1, 'the late click was ignored');
  assert.equal(attempts()[0].ms, LIMIT_MS);
});

test('after the bell the checklist is closed, and a repeat starts clean', async (t) => {
  const container = await runningStation(t);
  await tick(t, LIMIT_MS);
  assert.ok(checkboxes(container).every((b) => b.hasAttribute('disabled')), 'no ticking after time is called');

  await click(mod, buttonsWithText(container, 'ทำซ้ำ')[0]);
  assert.equal(clock(container), '0:00');
  assert.ok(!textOf(container).includes('หมดเวลา'), 'the notice is cleared');
  assert.ok(checkboxes(container).every((b) => !b.hasAttribute('disabled')));
  assert.ok(buttonsWithText(container, 'เริ่มจับเวลา')[0], 'the start button is back');
});

test('the drill renders without a React warning', () => {
  assert.deepEqual(dom.consoleErrors, []);
});
