import test from 'node:test';
import assert from 'node:assert/strict';
import { atlasGroupVisibility } from '../../src/lib/atlas-workspace.js';

const specimen = { parts: ['spine', 'left-leg', 'right-leg', 'heart'].map((id) => ({ id })) };
const all = specimen.parts.map((part) => part.id);

test('showing a partially hidden group preserves visible structures in other systems', () => {
  assert.deepEqual(atlasGroupVisibility(specimen, ['left-leg', 'heart'], ['left-leg', 'right-leg'], 'show'),
    ['left-leg', 'right-leg', 'heart']);
});
test('hiding and isolating a group act on the actual visible set', () => {
  assert.deepEqual(atlasGroupVisibility(specimen, ['heart'], ['left-leg'], 'show'), ['left-leg', 'heart']);
  assert.deepEqual(atlasGroupVisibility(specimen, all, ['left-leg', 'right-leg'], 'hide'), ['spine', 'heart']);
  assert.deepEqual(atlasGroupVisibility(specimen, all, ['left-leg', 'right-leg'], 'isolate'), ['left-leg', 'right-leg']);
});
test('unknown parts cannot enter visibility and invalid actions cannot erase the model', () => {
  assert.deepEqual(atlasGroupVisibility(specimen, all, ['invented'], 'isolate'), all);
  assert.deepEqual(atlasGroupVisibility(specimen, all, ['heart'], 'invalid'), all);
  assert.deepEqual(atlasGroupVisibility(specimen, ['invented', 'heart'], ['heart', 'invented'], 'show'), ['heart']);
});
