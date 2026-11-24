// ============================================================
// Wrap-up slide frame: a cited deck page, resolved to a picture the store has
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { deckCites, itemSlideAudit, itemSlides, normTitle, slideFor, slideIndex } from '../../src/lib/wrap-slide.js';

const EV = {
  docs: [
    ['aaaaaaaaaaaaaaaa', 'swine-enteric', 'Swine Enteric Diseases', 'slide'],
    ['bbbbbbbbbbbbbbbb', 'equine-surg', 'Equine surgery & anesthesia', 'slide'],
    ['cccccccccccccccc', 'twin-1', 'Twin Title', 'slide'],
    ['dddddddddddddddd', 'twin-2', 'twin  title', 'handout'],
  ],
  q: {
    1: [0, 97, 960, 540, [[1, 2, 3, 4]], 'h'],
    2: [0, 5, 720, 540, [], 'h'],
    3: [1, 12, 960, 720, [], 'h'],
    4: [2, 3, 960, 540, [], 'h'],
    5: [0, 98, 0, 540, [], 'h'],
    6: 'junk',
  },
};

test('titles fold case, "&", punctuation and spacing, nothing more', () => {
  assert.equal(normTitle('Equine Surgery & Anesthesia'), normTitle('equine surgery and anesthesia'));
  assert.equal(normTitle('Concept of causation_TC 3 August 2026'), 'concept of causation tc 3 august 2026');
  assert.notEqual(normTitle('Swine Enteric Diseases (2024)'), normTitle('Swine Enteric Diseases'), 'another year is another deck');
});

test('a citation names its deck pages; a range names none', () => {
  assert.deepEqual(
    deckCites('2_2M9bEGpmE [8:39]; เดค Swine Enteric Diseases หน้า 97; เดค Study Design หน้า 15, 17; เดค ASF หน้า 1-10; TJ ข้อ 3'),
    [{ title: 'Swine Enteric Diseases', pages: [97] }, { title: 'Study Design', pages: [15, 17] }],
  );
  assert.deepEqual(deckCites('เดค Prion Diseases หน้า 1-5, 36, 43-49'), [{ title: 'Prion Diseases', pages: [36] }]);
  assert.deepEqual(deckCites(undefined), []);
});

test('a page whose number or size is not a plain number gets no picture', () => {
  const index = slideIndex({ docs: EV.docs, q: { 1: [0, '5', 960, 540, [], 'h'], 2: [0, 6, Infinity, 540, [], 'h'], 3: [0, 7.5, 960, 540, [], 'h'], 4: [0, 8, '960', 540, [], 'h'], 5: [0, 1e21, 960, 540, [], 'h'] } });
  assert.deepEqual([...index.get(normTitle('Swine Enteric Diseases')).pages.keys()], []);
});

test('the index holds only pages a row filed with a size, and drops a title two documents share', () => {
  const index = slideIndex(EV);
  const swine = index.get(normTitle('Swine Enteric Diseases'));
  assert.deepEqual([...swine.pages.keys()].sort(), [5, 97]);
  assert.deepEqual(swine.pages.get(97), { w: 960, h: 540 });
  assert.equal(index.has(normTitle('Twin Title')), false, 'never pick between two documents');
  assert.equal(slideIndex(null).size, 0);
});

test('a page filed only as a further page of an answer has its picture too', () => {
  const index = slideIndex({ docs: EV.docs, q: { 1: [0, 97, 960, 540, [], 'h', [[0, 33, 720, 540, [[1, 2, 3, 4]]], 'junk', [0, 0, 720, 540, []]]] } });
  const swine = index.get(normTitle('Swine Enteric Diseases'));
  assert.deepEqual([...swine.pages.keys()].sort((a, b) => a - b), [33, 97]);
  assert.deepEqual(swine.pages.get(33), { w: 720, h: 540 });
});

test('a line gets the first cited page that has a picture, unmarked', () => {
  const index = slideIndex(EV);
  assert.deepEqual(slideFor('เดค Swine Enteric Diseases หน้า 98, 97', index), {
    sha16: 'aaaaaaaaaaaaaaaa', title: 'Swine Enteric Diseases', kind: 'slide', page: 97, w: 960, h: 540, boxes: [],
  });
  assert.equal(slideFor('เดค Equine Surgery and Anesthesia หน้า 12', index).sha16, 'bbbbbbbbbbbbbbbb');
  assert.equal(slideFor('เดค Swine Enteric Diseases หน้า 40', index), null, 'a page the store does not hold');
  assert.equal(slideFor('เดค Nipah หน้า 4', index), null, 'a deck the store does not hold');
  assert.equal(slideFor('เดค Swine Enteric Diseases หน้า 97', new Map()), null);
});

test('an item shows each page once, under the first line that cites it', () => {
  const index = slideIndex(EV);
  const a = { text: 'a', src: 'เดค Swine Enteric Diseases หน้า 97' };
  const b = { text: 'b', src: 'เดค Swine Enteric Diseases หน้า 98, 97' }; // the same page again
  const c = { text: 'c', src: 'เดค Nipah หน้า 4' }; // no picture
  const d = { text: 'd', src: 'เดค Equine Surgery and Anesthesia หน้า 12' };
  const e = { text: 'e', src: 'เดค Swine Enteric Diseases หน้า 97, 5' }; // its first page is drawn: it takes its next one
  const item = { emphasis: [a, b, c, e], examined: [d] };
  const first = itemSlides(item, index);
  assert.deepEqual([...first.keys()], [a, e, d]);
  assert.equal(first.get(a).page, 97);
  assert.equal(first.get(e).page, 5);
  assert.equal(first.get(d).sha16, 'bbbbbbbbbbbbbbbb');
  // Nothing is marked on the item: asked again (the view asks on every render), the same lines get their slides.
  assert.deepEqual([...itemSlides(item, index).keys()], [a, e, d]);
  assert.equal(itemSlides(item, new Map()).size, 0);
  assert.equal(itemSlides({}, index).size, 0);
});

test('the audit lists every cited page with whether it has a picture', () => {
  const item = { emphasis: [{ src: 'เดค Swine Enteric Diseases หน้า 97, 40' }], examined: [{ src: 'เดค Nipah หน้า 4' }] };
  assert.deepEqual(itemSlideAudit(item, slideIndex(EV)), [
    { title: 'Swine Enteric Diseases', page: 97, deck: true, picture: true },
    { title: 'Swine Enteric Diseases', page: 40, deck: true, picture: false },
    { title: 'Nipah', page: 4, deck: false, picture: false },
  ]);
});
