// The library's shelves: a document goes on the shelf its folder path or title names, and its
// years are read from the collection's own spellings.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DISCIPLINES, GENERAL_SHELF, shelfOf, yearsOf, formatOf } from '../../src/data/disciplines.js';
import { DOMAINS, FAMILIES } from '../../src/data/domains.js';

test('shelves have unique ids and point at real domains and families', () => {
  assert.equal(new Set(DISCIPLINES.map((d) => d.id)).size, DISCIPLINES.length);
  const domains = new Set(DOMAINS.map((d) => d.id));
  const families = new Set(FAMILIES.map((f) => f.id));
  for (const d of DISCIPLINES) {
    assert.ok(d.domain === null || domains.has(d.domain), `${d.id}: domain ${d.domain}`);
    assert.ok(families.has(d.family), `${d.id}: family ${d.family}`);
    assert.ok(d.match.length > 0, `${d.id}: spellings`);
  }
  assert.ok(!DISCIPLINES.some((d) => d.id === GENERAL_SHELF.id));
});

test('the deepest folder that names a field wins', () => {
  assert.equal(shelfOf({ title: 'x', categories: ['VCA 2568/Anesthesiology/รวมข้อสอบเก่า'] }).id, 'anesthesiology');
  assert.equal(shelfOf({ title: 'x', categories: ['VCA 2568/Virology'] }).id, 'virology');
  assert.equal(shelfOf({ title: 'Mycology summary', categories: ['VCA 2568 exam information'] }).id, 'mycology', 'falls back to the title');
});

test('a document naming no field goes on the general shelf', () => {
  assert.equal(shelfOf({ title: 'VCA 2567 หมวด 2', categories: ['ข้อสอบเก่า'] }), GENERAL_SHELF);
  assert.equal(shelfOf({ title: '', categories: [] }), GENERAL_SHELF);
  assert.equal(shelfOf(null), GENERAL_SHELF);
});

test('years from the collection\'s spellings, in the Buddhist era', () => {
  assert.deepEqual(yearsOf('Ophthalmology (VCA58-68).pdf'), { from: 2558, to: 2568 });
  assert.deepEqual(yearsOf('VCA 66-58'), { from: 2558, to: 2566 });
  assert.deepEqual(yearsOf("VCA'66-65"), { from: 2565, to: 2566 });
  assert.deepEqual(yearsOf('VCA 2567 หมวด 2'), { from: 2567, to: 2567 });
  assert.deepEqual(yearsOf('VCA 1.2568 หมวด 3'), { from: 2568, to: 2568 });
  assert.deepEqual(yearsOf('VCA2026_anatomy'), { from: 2569, to: 2569 });
  assert.deepEqual(yearsOf('🐷 VCA’65 หมวดที่ 2'), { from: 2565, to: 2565 });
  assert.equal(yearsOf('Anatomy key answer'), null);
  assert.equal(yearsOf(''), null);
  assert.equal(yearsOf('Room 2599'), null, 'outside the collection\'s years');
});

test('file formats in Thai readers\' words', () => {
  assert.equal(formatOf('application/pdf'), 'PDF');
  assert.equal(formatOf('video/mp4'), 'วิดีโอ');
  assert.equal(formatOf('application/x-unknown'), 'ไฟล์');
});
