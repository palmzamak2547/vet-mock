// ============================================================
// Handwriting belongs to the question it was written for (B37), and the
// photo option is a real control (B45)
// ============================================================
// B37. ExamView renders one question card with no key, so the pad was the
// same instance from question 7 to question 8: its ink carried over, and a
// transcription that returned after the clock (or ถัดไป) had moved on was
// appended to question 8 through the refreshed onText. The pad is now keyed
// by the question in Question.jsx (fresh pad, no ink carried over), and a
// pad that has gone away drops a late result instead of writing it into
// whichever question is on screen.
//
// B45. The photo option was a <label> around a display:none file input, so
// Tab skipped it. It is a button now, and the input is visually hidden but
// not display:none.
//
// Driven through the real HandwritingInput source (fake-react harness); the
// key in Question.jsx is a source pin because the card itself is not
// mounted here.
// ============================================================

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

let HandwritingInput;
const saved = {};
before(async () => {
  for (const k of ['window', 'document', 'fetch', 'Image', 'URL', 'AbortSignal']) saved[k] = globalThis[k];
  globalThis.window = { innerWidth: 390, devicePixelRatio: 2, addEventListener() {}, removeEventListener() {} };
  globalThis.document = {
    createElement: () => ({ getContext: () => ({ fillRect() {}, drawImage() {} }), toDataURL: () => 'data:image/jpeg;base64,QUJD' }),
  };
  globalThis.Image = class { set src(_v) { queueMicrotask(() => this.onload?.()); } get naturalWidth() { return 800; } get naturalHeight() { return 600; } };
  const RealURL = saved.URL;
  globalThis.URL = class extends RealURL {};
  globalThis.URL.createObjectURL = () => 'blob:photo';
  globalThis.URL.revokeObjectURL = () => {};
  HandwritingInput = (await loadModule('src/components/HandwritingInput.jsx')).default;
});
after(() => {
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
});

function open(props) {
  const inst = mount(HandwritingInput, props);
  const toggle = findAll(inst.tree, (n) => n.type === 'button')[0];
  toggle.props.onClick();
  inst.flush();
  return inst;
}
const fileInput = (tree) => findAll(tree, (n) => n.type === 'input' && n.props.type === 'file')[0];

test('B37: a transcription that returns after the pad is gone is dropped, not written into the next question', async () => {
  let release;
  globalThis.fetch = () => new Promise((res) => { release = res; });
  const got = [];
  const inst = open({ onText: (t) => got.push(t), maxChars: 1000 });
  fileInput(inst.tree).props.onChange({ target: { files: [{ name: 'q7.jpg' }], value: 'q7.jpg' } });
  await settle(inst);
  assert.equal(typeof release, 'function', 'the photo was never sent for transcription');
  // The question moves on: Question.jsx keys the pad by question, so the
  // pad for question 7 unmounts.
  inst.unmount();
  release({ status: 200, ok: true, json: async () => ({ text: 'written on question 7' }) });
  await new Promise((r) => setTimeout(r, 10));
  assert.deepEqual(got, [], 'question 7\'s handwriting was delivered after its pad was gone');
});

test('B37: while the pad is still there, the transcription reaches the answer', async () => {
  globalThis.fetch = async () => ({ status: 200, ok: true, json: async () => ({ text: 'ตอบข้อนี้' }) });
  const got = [];
  const inst = open({ onText: (t) => got.push(t), maxChars: 1000 });
  fileInput(inst.tree).props.onChange({ target: { files: [{ name: 'p.jpg' }], value: 'p.jpg' } });
  await settle(inst);
  assert.deepEqual(got, ['ตอบข้อนี้']);
  assert.match(textOf(inst.tree), /ถอดแล้ว/);
  inst.unmount();
});

test('B37: Question.jsx keys both handwriting pads by the question, so ink never carries over', () => {
  const src = readFileSync(new URL('../../src/components/Question.jsx', import.meta.url), 'utf8');
  const pads = [...src.matchAll(/<HandwritingInput\b([^>]*?)(\/?>|\n\s*maxChars)/g)];
  assert.equal(pads.length, 2, 'expected the short-answer and essay pads');
  for (const m of pads) assert.match(m[1] + m[2], /key=\{compoundId\}/, 'a handwriting pad is not keyed by the question');
});

test('B45: the photo option is a focusable button that opens the file picker', () => {
  const inst = open({ onText: () => {}, maxChars: 1000 });
  const btn = findAll(inst.tree, (n) => n.type === 'button' && textOf(n).includes('ถ่ายรูปที่เขียนบนกระดาษ'))[0];
  assert.ok(btn, 'the photo option is not a button');
  assert.equal(btn.props.type, 'button');
  assert.notEqual(btn.props.tabIndex, -1);
  const input = fileInput(inst.tree);
  assert.equal(input.props.hidden, undefined, 'a display:none input cannot be reached or reliably clicked');
  assert.match(String(input.props.className || ''), /vmx-sr-only/);
  assert.equal(input.props.tabIndex, -1, 'the hidden input must not be a second, invisible tab stop');
  assert.equal(input.props.accept, 'image/*');
  assert.equal(input.props.capture, 'environment');
  // The button clicks the input through its ref.
  let clicked = 0;
  input.props.ref.current = { click: () => { clicked += 1; } };
  btn.props.onClick();
  assert.equal(clicked, 1);
  inst.unmount();
});
