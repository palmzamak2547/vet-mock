import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ATLAS_CATALOG } from '../../src/data/atlas-catalog.js';

const FELINE = {
  'feline-skeleton-westerly': {
    chunks: 8, sha256: 'b2be07592effdcc6a7786057d1dd7774d530a6c61ea7f4523b7322a8869d25c9',
    words: [/ศิลปินสลัก/, /ไม่ใช่สแกน/, /ไม่แยกชื่อกระดูก/],
  },
  'feline-ecorche-westerly': {
    chunks: 5, sha256: 'c687f23ab0df293de6d0695736539dc5cc99bd9a0134048909b6f936a1a12e35',
    words: [/ศิลปินสลัก/, /ไม่ใช่สแกน/, /ไม่แยกชื่อกล้ามเนื้อ/, /ไม่ได้จัดตำแหน่งร่วมกับโมเดลโครงกระดูก/],
  },
};

for (const [id, known] of Object.entries(FELINE)) {
  const specimen = ATLAS_CATALOG.find((item) => item.id === id);
  const source = JSON.parse(readFileSync(new URL(`../../public/atlas/${id}-source.json`, import.meta.url)));
  const proof = JSON.parse(readFileSync(new URL(`../../public/atlas/${id}-provenance.json`, import.meta.url)));

  test(`${id} ships as one whole surface, not an invented segmentation`, () => {
    assert.ok(specimen, 'specimen must be published');
    assert.equal(specimen.kind, 'whole');
    assert.equal(specimen.geometryReview, 'source-linked');
    assert.deepEqual(specimen.parts.map((part) => part.id), ['specimen']);
    assert.deepEqual(proof.profiles.quick.parts.map((part) => part.id), ['specimen']);
    // The OBJ export chunks covered the whole body; the merge kept them all.
    assert.equal(source.sourceChunks.length, known.chunks);
    assert.equal(source.original.sha256, known.sha256);
  });

  test(`${id} keeps the author pose and states the sculpt status to the student`, () => {
    assert.deepEqual(proof.sourceToDisplay.rotationDegreesXYZ, [0, 0, 0]);
    for (const word of known.words) assert.match(specimen.scope, word);
  });

  test(`${id} carries the CC BY credit inside the published GLB bytes`, () => {
    for (const profile of ['quick', 'detail']) {
      const bytes = readFileSync(new URL(`../../public${specimen.profiles[profile].model}`, import.meta.url));
      const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
      const attribution = JSON.stringify(json);
      assert.match(attribution, /westerly/);
      assert.match(attribution, /CC BY 4\.0/);
      assert.match(attribution, /creativecommons\.org\/licenses\/by\/4\.0/);
    }
  });
}
