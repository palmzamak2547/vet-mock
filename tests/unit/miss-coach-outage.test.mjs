// ============================================================
// MissCoach — an outage says so, "nothing to add" stays quiet
// ============================================================
// The wrong-answer coach used to vanish on every failure, so a dead service
// looked exactly like a question with nothing more to say. Now off, error and
// timeout put one plain line where the button was; a declined answer
// (blocked) and a quota (rate, budget) still remove the button silently.
// Driven through the real component (fake-react harness), with the client
// call stubbed.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

const STUBS = [
  { match: '/lib/study-coach\\.js$', contents: 'export const explainMiss = async () => globalThis.__coachResult; export const alreadyExplained = () => false;' },
  { match: '/lib/richtext\\.jsx$', contents: 'export function RichText({ text }) { return text ?? null; }' },
];

let MissCoach, OUTAGE_LINE;
before(async () => {
  ({ default: MissCoach, OUTAGE_LINE } = await loadModule('src/components/MissCoach.jsx', { stubs: STUBS }));
});

const q = { id: 9001, type: 'mcq', q: 'stem', options: ['a', 'b', 'c', 'd'], answer: 0, explain: 'because a' };

async function pressWith(result) {
  globalThis.__coachResult = result;
  const inst = mount(MissCoach, { q, chosen: 2 });
  const [button] = findAll(inst.tree, (n) => n.type === 'button');
  assert.ok(button, 'the coach offers its button first');
  button.props.onClick();
  await settle(inst);
  return inst;
}

for (const reason of ['off', 'error', 'timeout']) {
  test(`an outage (${reason}) shows one plain line in place of the button`, async () => {
    const inst = await pressWith({ ok: false, reason });
    assert.equal(findAll(inst.tree, (n) => n.type === 'button').length, 0);
    assert.equal(textOf(inst.tree), OUTAGE_LINE);
    assert.equal(OUTAGE_LINE, 'ตอนนี้ยังอธิบายเพิ่มไม่ได้ ลองใหม่ภายหลัง');
  });
}

for (const reason of ['blocked', 'rate', 'budget']) {
  test(`nothing to add (${reason}) stays quiet for the student`, async () => {
    const inst = await pressWith({ ok: false, reason });
    assert.equal(inst.tree, null);
  });
}

test('an answer still shows the two lines', async () => {
  const inst = await pressWith({ ok: true, data: { trap: 'trap text', tell: 'tell text' } });
  const text = textOf(inst.tree);
  assert.ok(text.includes('trap text') && text.includes('tell text'));
  assert.ok(!text.includes(OUTAGE_LINE));
});
