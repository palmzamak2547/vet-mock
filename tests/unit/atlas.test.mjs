import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ATLAS_PARTS, ATLAS_SPECIMEN } from '../../src/data/atlas.js';
import { ATLAS_IDS, atlasSearch, atlasPartFromHash, atlasVisibleIds, atlasIsTap, assertAtlasModelIds } from '../../src/lib/atlas.js';
import { appPathForView, frontDoorFor } from '../../src/lib/view-route.js';

test('atlas GLB contains exactly the documented published surfaces and valid geometry', () => {
  const bytes = readFileSync(new URL(`../../public${ATLAS_SPECIMEN.model}`, import.meta.url));
  const provenance = JSON.parse(readFileSync(new URL('../../public/atlas/model-provenance.json', import.meta.url)));
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  assert.equal(bytes.length, ATLAS_SPECIMEN.bytes);
  assert.equal(provenance.sha256, createHash('sha256').update(bytes).digest('hex'));
  assert.equal(provenance.model, ATLAS_SPECIMEN.model);
  const jsonLength = bytes.readUInt32LE(12);
  const model = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
  const bin = bytes.subarray(28 + jsonLength);
  const nodes = model.nodes.filter(node => Number.isInteger(node.mesh));
  assertAtlasModelIds(nodes.map(node => node.name));
  for (const node of nodes) {
    const part = ATLAS_PARTS.find(row => row.id === node.name);
    const proof = provenance.parts.find(row => row.id === node.name);
    assert.equal(proof.filename, part.sourceFile);
    assert.ok(proof.simplifierError <= provenance.relativeErrorLimit);
    const primitive = model.meshes[node.mesh].primitives[0];
    const positions = model.accessors[primitive.attributes.POSITION];
    const indices = model.accessors[primitive.indices];
    assert.equal(positions.count, proof.vertices);
    assert.equal(indices.count / 3, proof.triangles);
    const positionView = model.bufferViews[positions.bufferView];
    const indexView = model.bufferViews[indices.bufferView];
    const indexBytes = indices.componentType === 5123 ? 2 : 4;
    for (let i = 0; i < positions.count * 3; i++) {
      assert.ok(Number.isFinite(bin.readFloatLE((positionView.byteOffset || 0) + (positions.byteOffset || 0) + i * 4)));
    }
    for (let i = 0; i < indices.count; i++) {
      const offset = (indexView.byteOffset || 0) + (indices.byteOffset || 0) + i * indexBytes;
      const index = indexBytes === 2 ? bin.readUInt16LE(offset) : bin.readUInt32LE(offset);
      assert.ok(index < positions.count, `${part.id}: invalid triangle index`);
    }
  }
  assert.ok(model.buffers.every(buffer => !buffer.uri), 'no external buffer downloads');
  assert.equal(model.images, undefined, 'no external texture downloads');
});

test('atlas search accepts Thai, English and exact Latin multiword names', () => {
  assert.deepEqual(atlasSearch('  VOMER ').map(row => row.id), ['vomer']);
  assert.deepEqual(atlasSearch('เพดานปากซ้าย').map(row => row.id), ['palatine-left']);
  assert.deepEqual(atlasSearch('os pterygoideum').map(row => row.id), ['pterygoid-left', 'pterygoid-right']);
  assert.deepEqual(atlasSearch('kidney'), []);
  assert.equal(atlasSearch('').length, 7);
});

test('shared part URLs reject unknown IDs and the atlas is year agnostic', () => {
  assert.equal(atlasPartFromHash('#part=vomer'), 'vomer');
  assert.equal(atlasPartFromHash('#part=not-a-bone'), null);
  assert.equal(atlasPartFromHash('#part=%3Cscript%3E'), null);
  assert.equal(appPathForView('atlas'), '/app/atlas');
  assert.equal(frontDoorFor('atlas', { storedYearRaw: null, seenLanding: false }), null);
});

test('hidden geometry stays unselectable and isolation cannot resurrect hidden parts', () => {
  assert.deepEqual(atlasVisibleIds('vomer', ['vomer'], true), []);
  assert.deepEqual(atlasVisibleIds('vomer', [], true), ['vomer']);
  assert.equal(atlasVisibleIds('vomer', [], false).length, ATLAS_IDS.length);
  assert.throws(() => assertAtlasModelIds([...ATLAS_IDS, 'ethmoid']));
  assert.throws(() => assertAtlasModelIds(ATLAS_IDS.slice(1)));
});

test('a drag, another pointer and a secondary click are never bone-selection taps', () => {
  const start = { pointerId: 1, x: 20, y: 20 };
  assert.equal(atlasIsTap(start, { pointerId: 1, x: 24, y: 20, button: 0 }), true);
  assert.equal(atlasIsTap(start, { pointerId: 1, x: 40, y: 20, button: 0 }), false);
  assert.equal(atlasIsTap(start, { pointerId: 2, x: 20, y: 20, button: 0 }), false);
  assert.equal(atlasIsTap(start, { pointerId: 1, x: 20, y: 20, button: 2 }), false);
  assert.equal(atlasIsTap(null, { pointerId: 1, x: 20, y: 20, button: 0 }), false);
});
