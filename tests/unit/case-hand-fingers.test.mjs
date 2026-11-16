// Finger writing on a case surface (src/lib/ink/case-hand.js): one finger writes, two scroll. A finger
// whose pointerup the surface never heard (a stroke dropped by a second finger lets go of its capture,
// and an engine may then send its pointerup elsewhere) must not count as "down" for ever after, or the
// next single finger is read as a second one and one finger never writes again.
import test from 'node:test';
import assert from 'node:assert/strict';
import { attachCaseSurface } from '../../src/lib/ink/case-hand.js';

function fakeSurface() {
  const on = new Map();
  const root = {
    style: {},
    addEventListener(type, fn) { on.set(type, fn); },
    removeEventListener(type) { on.delete(type); },
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 400, bottom: 400 }),
    setPointerCapture() {},
    releasePointerCapture() {},
    contains: () => false,
    querySelectorAll: () => [],
  };
  return { root, fire: (type, e) => on.get(type)?.({ preventDefault() {}, ...e }) };
}

test('one finger still writes after a dropped stroke whose finger lifted unheard', () => {
  globalThis.document = { caretPositionFromPoint: () => null };
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  globalThis.window = { getSelection: () => null };
  const downs = [];
  const { root, fire } = fakeSurface();
  const detach = attachCaseSurface(root, null, {
    policy: { penSeen: false, marks: () => true },
    state: () => ({ tool: 'pen', writeSwitch: true, penEnabled: true, text: 'abc', ranges: [], scroller: null }),
    onRange() {}, onErase() {},
    pen: { down: (pt) => downs.push(pt), move() {}, up() {}, cancel() {}, hit: () => [] },
  });
  const touch = (type, id, x = 10) => fire(type, { pointerId: id, pointerType: 'touch', clientX: x, clientY: 10, button: 0 });
  touch('pointerdown', 1);                      // finger 1 starts a stroke
  assert.equal(downs.length, 1);
  touch('pointerdown', 2, 60);                  // finger 2 lands: the stroke is dropped, the hand scrolls
  touch('pointerup', 2, 60);                    // finger 2's up is heard ...
  fire('touchend', { touches: [] });            // ... finger 1's is not, but every finger is off the glass
  touch('pointerdown', 3, 20);                  // one finger again
  assert.equal(downs.length, 2, 'the single finger writes');
  detach();
});
