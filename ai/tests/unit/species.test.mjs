import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { speciesOf, SPECIES } from '../../src/lib/species.js';
import { PLATES } from '../../scripts/specimens.mjs';

const of = (title, subtitle, subject) => speciesOf({ title, subtitle, subject });

test('a species named outright gives its plate', () => {
  assert.equal(of('ระยะฟักตัวของ Rabies ในสุนัข'), 'dog');
  assert.equal(of('Feline infectious peritonitis'), 'cat');
  assert.equal(of('PRRSV in nursery pigs'), 'pig');
  assert.equal(of('Mastitis ในโคนม'), 'cow');
  assert.equal(of('Equine colic'), 'horse');
  assert.equal(of('ไข้หวัดนก H5N1'), 'chicken');
  assert.equal(of('Tilapia lake virus'), 'fish');
  assert.equal(of('Bluetongue in sheep'), 'sheep');
  assert.equal(of('การจับบังคับหนูทดลอง'), 'rat');
  assert.equal(of('Psittacosis in parrots'), 'bird');
  assert.equal(of('Metabolic bone disease ในเต่า'), 'turtle');
});

test('Thai words that only contain a species name do not count', () => {
  assert.equal(of('ความหมายของค่า PCV'), null); // หมาย
  assert.equal(of('การตรวจหมู่เลือด'), null); // หมู่
  assert.equal(of('ม้ามโต'), null); // ม้าม
  assert.equal(of('ปลายประสาทรับความรู้สึก'), null); // ปลาย
  assert.equal(of('แกะสลักกระดูก'), null);
  assert.equal(of('แมวน้ำ'), null);
});

test("the dog in rabies' Thai name is not the patient", () => {
  assert.equal(of('โรคพิษสุนัขบ้าในแมว'), 'cat');
  assert.equal(of('โรคพิษสุนัขบ้า'), null);
});

test('English names need a whole word', () => {
  assert.equal(of('Catheter care after surgery'), null);
  assert.equal(of('Pigment changes in the skin'), null);
  assert.equal(of('Heart rate and ratio'), null);
});

test('title first, then subtitle, then subject; earliest name wins inside a field', () => {
  assert.equal(of('Anaesthesia protocols', 'Swine Clinic'), 'pig');
  assert.equal(of('Biosecurity', '', 'Poultry Medicine'), 'chicken');
  assert.equal(of('สุนัขและแมว'), 'dog');
  assert.equal(of('แมวและสุนัข'), 'cat');
  assert.equal(of('Zoonoses overview', 'COM5'), null);
});

test('every species the matcher can name has a plate on disk', () => {
  for (const key of SPECIES) {
    assert.ok(PLATES[key], `plate recipe for ${key}`);
    assert.ok(fs.existsSync(new URL(`../../public/art/specimens/${key}.svg`, import.meta.url)), `${key}.svg`);
  }
});
