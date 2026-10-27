import test from 'node:test';
import assert from 'node:assert/strict';
import { CELL_FS, GLOW_FS, COMPOSITE_FS } from '../../src/ocean/shaders.js';

// The cell pass hands each cell's glyph index to the next passes through an
// 8-bit channel. GPUs disagree on how they round a value that sits on a tie
// (Apple: up, most desktop GPUs: down), so the index must be stored as an exact
// k / 255 and read back by rounding. (idx + 0.5) / 255 read with floor() made
// every iPad and iPhone draw a grey tile in every empty cell of water.
test('glyph index is stored exactly and read back by rounding', () => {
  assert.match(CELL_FS, /gl_FragColor = vec4\(col, idx \/ 255\.0\)/);
  for (const [name, src] of [['glow', GLOW_FS], ['composite', COMPOSITE_FS]]) {
    assert.match(src, /floor\(d\.a \* 255\.0 \+ 0\.5\)/, `${name} rounds`);
    assert.doesNotMatch(src, /floor\(d\.a \* 255\.0\)/, `${name} does not truncate`);
  }
});

test('the round trip survives both rounding rules', () => {
  const store = (v, rule) => (rule === 'up' ? Math.floor(v * 255 + 0.5) : Math.round(v * 255 - 1e-9)) / 255;
  for (let idx = 0; idx < 40; idx++) {
    for (const rule of ['up', 'down']) assert.equal(Math.floor(store(idx / 255, rule) * 255 + 0.5), idx);
  }
});
