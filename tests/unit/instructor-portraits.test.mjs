// Lecturer portraits: a pointer in the directory, the picture behind the members' image address.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initialsOf, portraitUrl } from '../../src/lib/instructor-portrait.js';
import { applyPortraits, checkPortraits, PORTRAITS } from '../../scripts/instructor-portraits.mjs';
import { INSTRUCTOR_DIRECTORY } from '../../src/data/instructors-directory.js';

const BASE = 'https://slides.vetmock.com/e/0123456789abcdef0123456789abcdef';
const ROW = [320, 320, '0a1b2c3d', 'https://vet.chula.ac.th/department/anatomy', 'https://vet.chula.ac.th/storage/dept_anatomy/a.jpg', '2026-11-11'];
const person = { slug: 'somchai-jaidee', nameTh: 'สมชาย ใจดี', nameEn: 'Somchai Jaidee', email: 'x@chula.ac.th', areas: [] };

test('a portrait address needs the member base, a photo and a clean slug', () => {
  const p = { ...person, photo: { w: 320, h: 320, v: '0a1b2c3d' } };
  assert.equal(portraitUrl(BASE, p), `${BASE}/people/somchai-jaidee.webp?v=0a1b2c3d`);
  assert.equal(portraitUrl(null, p), null, 'a visitor the wall does not serve gets no address');
  assert.equal(portraitUrl(undefined, p), null, 'nor while the address is still being asked for');
  assert.equal(portraitUrl(BASE, person), null, 'a profile without a portrait has none');
  assert.equal(portraitUrl(BASE, { ...p, slug: '../x' }), null);
  assert.equal(portraitUrl(BASE, { ...p, photo: { w: 320, h: 320, v: 'zz' } }), null);
});

test('the monogram takes the first consonant of the first and last name', () => {
  assert.equal(initialsOf(person), 'สจ');
  assert.equal(initialsOf({ nameTh: 'เกรียงยศ สัจจเจริญพงษ์' }), 'กส', 'a leading vowel is skipped');
  assert.equal(initialsOf({ nameEn: 'sayamon srisuwatanasagul' }), 'SS');
  assert.equal(initialsOf({ nameTh: 'ไพศาล' }), 'พ');
  assert.equal(initialsOf({}), '');
});

test('the check holds the pointer and its source to each other, both ways', () => {
  const dir = applyPortraits([person, { ...person, slug: 'other' }], { 'somchai-jaidee': ROW });
  assert.deepEqual(dir[0].photo, { w: 320, h: 320, v: '0a1b2c3d' });
  assert.deepEqual(Object.keys(dir[0]).slice(0, 5), ['slug', 'nameTh', 'nameEn', 'email', 'photo'], 'photo sits after the email');
  assert.equal(dir[1].photo, undefined);
  assert.deepEqual(checkPortraits(dir, { 'somchai-jaidee': ROW }), []);

  assert.match(checkPortraits(dir, {}).join(), /no line in instructor-portraits/, 'a photo without a source fails');
  assert.match(checkPortraits([person], { 'somchai-jaidee': ROW }).join(), /has no photo/, 'a source without a photo fails');
  assert.match(checkPortraits(dir, { 'somchai-jaidee': ROW, ghost: ROW }).join(), /not in the directory/);
  const odd = [{ ...dir[0], photo: { w: 320, h: 300, v: '0a1b2c3d' } }];
  assert.match(checkPortraits(odd, { 'somchai-jaidee': ROW }).join(), /square/);
  const extra = [{ ...dir[0], photo: { ...dir[0].photo, url: 'x' } }];
  assert.match(checkPortraits(extra, { 'somchai-jaidee': ROW }).join(), /exactly/);
  const social = [...ROW]; social[3] = 'https://www.facebook.com/someone';
  assert.match(checkPortraits(dir, { 'somchai-jaidee': social }).join(), /source must be/, 'only the official staff pages are sources');
  const removed = applyPortraits(dir, {});
  assert.equal(removed[0].photo, undefined, 'deleting the line removes the portrait');
});

test('the shipped directory and the list agree', () => {
  assert.deepEqual(checkPortraits(INSTRUCTOR_DIRECTORY, PORTRAITS), []);
});

test('no portrait file or image address is in the app', () => {
  const lib = readFileSync(new URL('../../src/lib/instructor-portrait.js', import.meta.url), 'utf8');
  assert.doesNotMatch(lib, /[0-9a-f]{32}/, 'the folder is given to members, never written down');
  const dir = readFileSync(new URL('../../src/data/instructors-directory.js', import.meta.url), 'utf8');
  assert.doesNotMatch(dir, /storage\/dept_|makewell/, 'where a portrait came from stays out of the bundle');
});
