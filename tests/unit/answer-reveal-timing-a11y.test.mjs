// ============================================================
// AnswerReveal: one default for reveal timing (B40), a quiet written
// reveal for screen readers (B44)
// ============================================================
// B40. The lecturer block draws its "เฉลยทีละข้อ" switch from instant
// feedback, which is on by default, and promises that matching rows and
// written answers reveal as you go. Matching rows and the written reveal
// read the stored reveal timing instead, which defaulted to "after the
// whole set". A first-time student saw the switch on เฉลยทีละข้อ and got the
// opposite. The timing now follows instant feedback until the student
// picks a timing of their own.
//
// B44. The whole written reveal (checklist, model answer, explanation) was
// one role="status" region, so every keyword ticked while typing had a
// screen reader read the model answer again. Only the n/m counter is live
// now, and the panel takes focus when it opens, since the button that
// opened it is gone.
//
// Driven through the real AnswerReveal source (fake-react harness).
// ============================================================

import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

let AR;
const store = new Map();
const savedLS = globalThis.localStorage;
before(async () => {
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
  };
  AR = await loadModule('src/components/AnswerReveal.jsx', {
    stubs: [
      { match: '/SmartGrader\\.jsx$', contents: `export function keywordCoverage(text, kws) {
          if (!Array.isArray(kws) || !kws.length) return null;
          const found = kws.filter((k) => String(text).includes(k));
          return { found, missing: kws.filter((k) => !found.includes(k)) };
        }` },
      { match: '/TermLinkedRichText\\.jsx$', contents: 'export default function TermLinkedRichText({ text }) { return <span className="stub-rich">{text}</span>; }' },
    ],
  });
});
after(() => { if (savedLS === undefined) delete globalThis.localStorage; else globalThis.localStorage = savedLS; });
beforeEach(() => store.clear());

test('B40: a first-time student (nothing stored) gets row-by-row reveal, as the lecturer switch shows', () => {
  assert.equal(AR.readRevealTiming(), AR.REVEAL_ROW);
});

test('B40: with instant feedback on and no timing chosen, the timing is row by row', () => {
  store.set('vmx-instant-feedback', 'on');
  assert.equal(AR.readRevealTiming(), AR.REVEAL_ROW);
});

test('B40: with instant feedback off and no timing chosen, the timing is after the whole set', () => {
  store.set('vmx-instant-feedback', 'off');
  assert.equal(AR.readRevealTiming(), AR.REVEAL_END);
});

test('B40: a timing the student picked is kept, whatever instant feedback says', () => {
  store.set('vmx-instant-feedback', 'on');
  AR.writeRevealTiming(AR.REVEAL_END);
  assert.equal(AR.readRevealTiming(), AR.REVEAL_END);
  store.set('vmx-instant-feedback', 'off');
  AR.writeRevealTiming(AR.REVEAL_ROW);
  assert.equal(AR.readRevealTiming(), AR.REVEAL_ROW);
});

const Q = { keywords: ['antibody', 'antigen', 'complement'], model_answer: 'A long model answer that must not be re-read.', explain: 'Why.' };

test('B44: the written reveal is not one live region; only the counter announces', () => {
  const inst = mount(AR.WrittenReveal, { q: Q, answer: 'antibody', subject: 'x' });
  const root = inst.tree;
  assert.equal(root.props.className, 'vmx-written-reveal');
  assert.notEqual(root.props.role, 'status', 'the whole panel (model answer included) is a live region');
  assert.equal(root.props['aria-live'], undefined);
  const live = findAll(root, (n) => n.props.role === 'status' || n.props['aria-live']);
  assert.equal(live.length, 1, 'exactly one live region: the keyword counter');
  assert.equal(textOf(live[0]).trim(), '1/3');
  // The model answer and explanation are outside it.
  assert.doesNotMatch(textOf(live[0]), /model answer|Why/);
  inst.unmount();
});

test('B44: the counter updates as a keyword is typed', () => {
  const inst = mount(AR.WrittenReveal, { q: Q, answer: 'antibody', subject: 'x' });
  inst.update({ answer: 'antibody antigen' });
  const live = findAll(inst.tree, (n) => n.props.role === 'status');
  assert.equal(textOf(live[0]).trim(), '2/3');
  inst.unmount();
});

test('B44: the panel takes focus when it opens, without scrolling the page', () => {
  const calls = [];
  const inst = mount(AR.WrittenReveal, { q: Q, answer: '', subject: 'x' });
  // Attach a fake DOM node to the panel's ref and re-run the mount effect path.
  const root = inst.tree;
  assert.equal(root.props.tabIndex, -1, 'the panel must be focusable by script');
  assert.ok(root.props.ref, 'the panel carries a ref to focus');
  inst.unmount();
  const node = { focus: (o) => calls.push(o) };
  // A fresh mount whose ref is filled before effects run, as React does.
  const Wrapped = (p) => {
    const out = AR.WrittenReveal(p);
    if (out?.props?.ref && !out.props.ref.current) out.props.ref.current = node;
    return out;
  };
  const again = mount(Wrapped, { q: Q, answer: '', subject: 'x' });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], { preventScroll: true });
  again.unmount();
});
