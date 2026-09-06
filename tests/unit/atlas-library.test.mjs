import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ATLAS_CATALOG } from '../../src/data/atlas-catalog.js';
import { atlasFitDistance, atlasSharePath, readAtlasLocation } from '../../src/lib/atlas-workspace.js';

test('every selectable specimen has matching quantized geometry, identity and provenance', () => {
  assert.ok(ATLAS_CATALOG.length >= 3);
  assert.equal(new Set(ATLAS_CATALOG.map(specimen => specimen.id)).size, ATLAS_CATALOG.length);
  for (const specimen of ATLAS_CATALOG) {
    const proof = JSON.parse(readFileSync(new URL(`../../public/atlas/${specimen.id}-provenance.json`, import.meta.url)));
    assert.ok(specimen.sourceUrl.startsWith('https://'));
    assert.ok(specimen.licenseUrl.startsWith('https://creativecommons.org/') ||
      (specimen.license === 'MIT' && specimen.licenseUrl === 'https://opensource.org/license/mit') ||
      (specimen.licenseStatus === 'not-specified' && specimen.license === 'ไม่ระบุใบอนุญาตในไฟล์ต้นฉบับ'
        && specimen.licenseUrl === specimen.sourceUrl && specimen.sourceManifest));
    assert.ok(readFileSync(new URL(`../../public${specimen.poster}`, import.meta.url)).length > 100);
    for (const [level, asset] of Object.entries(specimen.profiles)) {
      const bytes = readFileSync(new URL(`../../public${asset.model}`, import.meta.url));
      assert.equal(bytes.length, asset.bytes);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
      assert.equal(bytes.readUInt32LE(0), 0x46546c67);
      assert.equal(bytes.readUInt32LE(8), bytes.length);
      const jsonLength = bytes.readUInt32LE(12);
      const document = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
      const binary = bytes.subarray(28 + jsonLength);
      assert.deepEqual(document.extensionsRequired, ['KHR_mesh_quantization']);
      assert.ok(document.buffers.every(buffer => !buffer.uri));
      assert.equal(document.images, undefined);
      const nodes = document.nodes.filter(node => Number.isInteger(node.mesh));
      assert.deepEqual(nodes.map(node => node.name).sort(), specimen.parts.map(part => part.id).sort());
      let triangles = 0;
      for (const node of nodes) {
        const metadata = proof.profiles[level].parts.find(part => part.id === node.name);
        assert.ok(metadata.error <= proof.profiles[level].relativeErrorLimit);
        const primitive = document.meshes[node.mesh].primitives[0];
        const positions = document.accessors[primitive.attributes.POSITION], indices = document.accessors[primitive.indices];
        assert.equal(positions.componentType, 5122); assert.equal(positions.normalized, true);
        assert.ok(positions.min.every(value => value >= -32767)); assert.ok(positions.max.every(value => value <= 32767));
        assert.equal(positions.count, metadata.vertices);
        triangles += indices.count / 3;
        const view = document.bufferViews[indices.bufferView];
        const step = indices.componentType === 5123 ? 2 : 4;
        for (let i = 0; i < indices.count; i++) {
          const offset = (view.byteOffset || 0) + (indices.byteOffset || 0) + i * step;
          assert.ok((step === 2 ? binary.readUInt16LE(offset) : binary.readUInt32LE(offset)) < positions.count);
        }
      }
      assert.equal(triangles, asset.triangles);
    }
    assert.ok(specimen.profiles.quick.bytes < specimen.profiles.detail.bytes);
  }
});

test('comparison URLs retain context while unknown specimen or part IDs fail closed', () => {
  const state = { specimenId: 'canine-skull-nih282', selected: 'specimen', compareId: 'equine-skull-edinburgh' };
  assert.deepEqual(readAtlasLocation(atlasSharePath(state).split('#')[1]), state);
  assert.equal(readAtlasLocation('#part=vomer').specimenId, 'canine-skull-base-cuhl9');
  assert.equal(readAtlasLocation('#specimen=javascript:alert(1)&part=bad&compare=missing').compareId, null);
  assert.ok(!atlasSharePath({ ...state, compareId: state.specimenId }).includes('compare='));
});

test('camera fit encloses a sphere in portrait, landscape and comparison panes', () => {
  for (const aspect of [0.3, 0.5, 1, 2, 3]) {
    const radius = 1.7, distance = atlasFitDistance(radius, 35, aspect);
    const vertical = 35 * Math.PI / 360, horizontal = Math.atan(Math.tan(vertical) * aspect);
    assert.ok(distance * Math.sin(vertical) >= radius);
    assert.ok(distance * Math.sin(horizontal) >= radius);
  }
});

test('worker preserves the bounded atlas cache and does not duplicate geometry', () => {
  const worker = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
  assert.match(worker, /const ATLAS_MODELS = 'vmx-atlas-models-v1'/);
  assert.match(worker, /k !== ATLAS_MODELS/);
  assert.match(worker, /event\.respondWith\(fetch\(request\)\.catch/);
});
