// ============================================================
// modal-escape-before-effects.test.mjs: a dialog on screen takes Escape
// ============================================================
// Smoke e2e, 5.146.0 (WebKit): the search palette opened, Escape was
// pressed, and the palette stayed open over Home until a later click timed
// out at 120 s. Its keys were listened for from a passive effect, which runs
// after the browser has painted the dialog; WebKit delivered the Escape in
// that gap (dialog in the DOM 2,993 ms, Escape 3,139 ms, listener 3,152 ms;
// 2 of 10 first opens). The listener now goes on in the commit that shows
// the dialog. Here layout effects run at commit and passive ones later, as
// in React.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from '../helpers/fake-react.mjs';

test('Escape pressed before the passive effects run closes the dialog', async (t) => {
  const previous = new Map(['window', 'document', 'Element', 'HTMLElement'].map((key) => [key, globalThis[key]]));
  const savedReact = globalThis.__fakeReact;
  t.after(() => {
    globalThis.__fakeReact = savedReact;
    for (const [key, value] of previous) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; }
  });

  class El { isConnected = true; closest() { return null; } getClientRects() { return [{}]; } focus() { document.activeElement = this; } querySelectorAll() { return []; } }
  const listeners = new Map();
  globalThis.Element = globalThis.HTMLElement = El;
  const body = new El();
  globalThis.document = {
    body, activeElement: body,
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    querySelectorAll() { return []; },
  };
  globalThis.window = { requestAnimationFrame: () => 1, cancelAnimationFrame() {} };

  const layout = [];
  const passive = [];
  globalThis.__fakeReact = {
    ...savedReact,
    useRef: (current) => ({ current }),
    useLayoutEffect: (fn) => { layout.push(fn); },
    useEffect: (fn) => { passive.push(fn); },
  };
  const { useModalFocus } = await loadModule('src/hooks/useModalFocus.js');
  globalThis.__fakeReact = savedReact;

  let closed = 0;
  const dialogRef = useModalFocus({ active: true, onClose: () => { closed += 1; } });
  dialogRef.current = new El(); // the commit put the dialog in the DOM
  for (const fn of layout.splice(0)) fn();
  for (const fn of listeners.get('keydown') || []) {
    fn({ key: 'Escape', target: body, preventDefault() {}, stopPropagation() {} });
  }
  assert.equal(closed, 1, 'the dialog on screen closed on the Escape that arrived before its passive effects');
  for (const fn of passive.splice(0)) fn();
});
