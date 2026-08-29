// ============================================================
// Escape must close the dialog the reader is actually looking at
// ============================================================
// useModalFocus lets only the top-most open modal handle Escape. "Top-most"
// used to mean last-in-DOM, which is not what a reader sees: ConfirmDialog is
// mounted once at the app root (early in the DOM) but painted above whatever
// raised it, so a confirm opened from the command palette lost the contest to
// the palette — Escape closed the palette and left the confirm floating over
// nothing. This pins the stacking rule the hook now uses.
//
// The rule is duplicated here deliberately rather than imported: the hook is a
// React module that reaches for document/window at import time, and the thing
// worth protecting is the DECISION, not the wiring around it.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SRC = readFileSync(new URL('../../src/hooks/useModalFocus.js', import.meta.url), 'utf8');

// Mirror of the hook's chooser, exercised against fake stacking contexts.
function topMost(dialogs) {
  const depthOf = (el) => {
    for (let n = el; n; n = n.parent) {
      if (Number.isFinite(n.z)) return n.z;
    }
    return 0;
  };
  let top = dialogs[0];
  let topZ = depthOf(top);
  for (const el of dialogs.slice(1)) {
    const z = depthOf(el);
    if (z >= topZ) { top = el; topZ = z; }
  }
  return top;
}

test('a confirm painted above wins over a modal that comes later in the DOM', () => {
  // DOM order: the root-mounted confirm first, the palette second.
  const confirm = { name: 'confirm', parent: { z: 1080 } };
  const palette = { name: 'palette', parent: { z: 1000 } };
  assert.equal(topMost([confirm, palette]).name, 'confirm');
});

test('with equal stacking the later sibling wins, matching paint order', () => {
  const first = { name: 'first', parent: { z: 1000 } };
  const second = { name: 'second', parent: { z: 1000 } };
  assert.equal(topMost([first, second]).name, 'second');
});

test('a dialog with no z-index anywhere above it counts as ground level', () => {
  const plain = { name: 'plain', parent: { parent: null } };
  const raised = { name: 'raised', parent: { z: 1100 } };
  assert.equal(topMost([plain, raised]).name, 'raised');
});

test('the hook really decides by stacking, not by DOM position', () => {
  assert.ok(
    SRC.includes('getComputedStyle') && /zIndex/.test(SRC),
    'useModalFocus no longer inspects stacking — Escape can hit the wrong dialog again',
  );
  assert.ok(
    !/openDialogs\[openDialogs\.length - 1\] !== dialog/.test(SRC),
    'the last-in-DOM shortcut is back',
  );
});
