import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ATLAS_CATALOG } from '../../src/data/atlas-catalog.js';

const specimen = ATLAS_CATALOG.find((item) => item.id === 'canine-musculoskeletal-stark');
const source = JSON.parse(readFileSync(new URL('../../public/atlas/canine-musculoskeletal-stark-source.json', import.meta.url)));
const proof = JSON.parse(readFileSync(new URL('../../public/atlas/canine-musculoskeletal-stark-provenance.json', import.meta.url)));

test('full-body inventory preserves skeletal composites and muscle paths as different representations', () => {
  assert.equal(source.bodies.length, 24);
  assert.equal(source.musclePaths.length, 158);
  assert.deepEqual(specimen.parts.filter((p) => p.representation === 'source-segment').map((p) => p.id), source.bodies.map((p) => p.id));
  assert.deepEqual(specimen.parts.filter((p) => p.representation === 'muscle-path').map((p) => p.id), source.musclePaths.map((p) => p.id));
  assert.ok(!specimen.parts.some((part) => part.id === 'ground'));
  assert.equal(specimen.terminologyReview, 'pending');
  for (const part of specimen.parts.filter((part) => part.pair)) {
    assert.equal(specimen.parts.find((other) => other.id === part.pair)?.pair, part.id);
  }
});

test('published body transforms are finite rigid frames, not independent repositioned parts', () => {
  const ids = new Set(['ground', ...source.bodies.map((body) => body.sourceName)]);
  for (const body of source.bodies) {
    assert.ok(ids.has(body.parent));
    assert.ok(body.matrix.flat().every(Number.isFinite));
    assert.deepEqual(body.matrix[3], [0, 0, 0, 1]);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
      const dot = body.matrix.slice(0, 3).reduce((sum, row) => sum + row[a] * row[b], 0);
      assert.ok(Math.abs(dot - Number(a === b)) < 1e-9);
    }
  }
});

test('both downloadable levels include the MIT notice and preserve published path endpoints', () => {
  for (const asset of Object.values(specimen.profiles)) {
    const bytes = readFileSync(new URL(`../../public${asset.model}`, import.meta.url));
    const document = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)));
    assert.ok(document.nodes.some((node) => node.extras?.license === 'MIT' && node.extras.licenseText.includes('Permission is hereby granted')));
    for (const path of source.musclePaths) {
      const node = document.nodes.find((item) => item.name === path.id);
      const positions = document.accessors[document.meshes[node.mesh].primitives[0].attributes.POSITION];
      for (const point of path.points) {
        const world = [point.world[1], point.world[2], point.world[0]];
        world.forEach((value, axis) => {
          const normalized = (value - proof.sourceToDisplay.center[axis]) * proof.sourceToDisplay.scale;
          assert.ok(normalized >= positions.min[axis] / 32767 - 0.006, path.id);
          assert.ok(normalized <= positions.max[axis] / 32767 + 0.006, path.id);
        });
      }
    }
  }
});
