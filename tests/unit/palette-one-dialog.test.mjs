// The search box is one dialog from the tap to the close (PaletteShell.jsx). The frame shown while the
// palette's code downloads and the palette itself each drew a dialog of their own, so the arrival swapped
// one dialog element for another: a key pressed in that instant landed on a dialog already gone
// (tests/e2e/system-polish.spec.js:68 failed 2 of 12 runs on a phone). These read the code that draws it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const SHELL = read('src/components/PaletteShell.jsx');
const FRAME = read('src/components/PaletteFrame.jsx');
const PALETTE = read('src/components/CommandPalette.jsx');
const APP = read('src/App.jsx');

test('the shell draws the one search dialog', () => {
  for (const attr of ['role="dialog"', 'aria-modal="true"', 'data-vmx-modal="true"', 'aria-label="ค้นหาอัจฉริยะ"']) {
    assert.ok(SHELL.includes(attr), `${attr} on the shell`);
  }
  assert.match(SHELL, /<PaletteShellContext\.Provider value=\{shell\}>\{children\}<\/PaletteShellContext\.Provider>/);
});

test('the frame draws no dialog of its own and marks the shell while shown', () => {
  assert.doesNotMatch(FRAME, /role="dialog"/);
  assert.doesNotMatch(FRAME, /^\s+data-vmx-modal=/m, "no dialog attribute in the frame's markup");
  assert.doesNotMatch(FRAME, /className="vmx-modal-overlay"/);
  // Found from the frame's own node (the shell's ref is attached after a child's layout effect), set and
  // removed directly: no state in the shell, which re-rendered it while the palette's code was on its way.
  assert.match(FRAME, /const dialog = bodyRef\.current\?\.closest\('\[data-vmx-modal="true"\]'\);/);
  assert.match(FRAME, /dialog\.setAttribute\('data-palette-frame', failed \? 'failed' : 'pending'\);/);
  assert.match(FRAME, /dialog\.removeAttribute\('data-palette-frame'\);/);
  assert.doesNotMatch(SHELL, /useState/);
});

test('inside the shell the palette draws only its contents and takes over the focus trap', () => {
  assert.match(PALETTE, /function PaletteDialog\(\{ shell, dialogRef, onClose, children \}\) \{\n\s*if \(shell\) return children;/);
  assert.match(PALETTE, /<PaletteDialog shell=\{shell\} dialogRef=\{dialogRef\} onClose=\{onClose\}>/);
  // The shell's element, found from the palette's own box in the commit that shows it.
  assert.match(PALETTE, /const dialog = inputRef\.current\?\.closest\('\[data-vmx-modal="true"\]'\);\n\s*if \(dialog\) dialogRef\.current = dialog;/);
});

test('the app opens search inside the shell, around the frame and the palette alike', () => {
  const at = APP.indexOf('<PaletteShell onClose={() => setPaletteOpen(false)}>');
  assert.notEqual(at, -1);
  const block = APP.slice(at, APP.indexOf('</PaletteShell>', at));
  assert.match(block, /pending=\{<PaletteFrame /);
  assert.match(block, /failed=\{\(retry\) => <PaletteFrame failed /);
  assert.match(block, /<CommandPalette\n/);
});
