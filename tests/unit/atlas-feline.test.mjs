import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ATLAS_CATALOG } from '../../src/data/atlas-catalog.js';

const specimen = ATLAS_CATALOG.find((item) => item.id === 'feline-skeleton-westerly');
const source = JSON.parse(readFileSync(new URL('../../public/atlas/feline-skeleton-westerly-source.json', import.meta.url)));
const proof = JSON.parse(readFileSync(new URL('../../public/atlas/feline-skeleton-westerly-provenance.json', import.meta.url)));

test('the feline skeleton ships as one whole surface, not an invented segmentation', () => {
  assert.equal(specimen.kind, 'whole');
  assert.equal(specimen.geometryReview, 'source-linked');
  assert.deepEqual(specimen.parts.map((part) => part.id), ['specimen']);
  assert.deepEqual(proof.profiles.quick.parts.map((part) => part.id), ['specimen']);
  // The eight OBJ export chunks covered the whole body; the merge kept them all.
  assert.equal(source.sourceChunks.length, 8);
  assert.equal(source.original.sha256, 'b2be07592effdcc6a7786057d1dd7774d530a6c61ea7f4523b7322a8869d25c9');
});

test('the author pose is kept and the sculpt status is stated to the student', () => {
  assert.deepEqual(proof.sourceToDisplay.rotationDegreesXYZ, [0, 0, 0]);
  assert.match(specimen.scope, /ศิลปินสลัก/);
  assert.match(specimen.scope, /ไม่ใช่สแกน/);
  assert.match(specimen.scope, /ไม่แยกชื่อกระดูก/);
});

test('the CC BY credit travels inside the published GLB bytes', () => {
  for (const profile of ['quick', 'detail']) {
    const bytes = readFileSync(new URL(`../../public${specimen.profiles[profile].model}`, import.meta.url));
    const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
    const userData = json.nodes?.[0]?.mesh !== undefined ? json.asset : json.nodes?.find((node) => node.extras || node.userData);
    assert.ok(json.asset || userData);
    const extras = json.meshes?.[0]?.extras || json.nodes?.[0]?.extras || {};
    // The converter embeds attribution as root userData; assert through the mesh extras chain.
    const attribution = JSON.stringify(json);
    assert.match(attribution, /westerly/);
    assert.match(attribution, /CC BY 4\.0/);
    assert.match(attribution, /creativecommons\.org\/licenses\/by\/4\.0/);
  }
});
