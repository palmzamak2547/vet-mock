// Inside LINE, Facebook or Instagram a student signed in only on ai.vetmock.com
// meets vetmock.com's Chula wall in the reader, where Google will not sign in
// (9 Nov 2026). There a library PDF opens as the file, and the label names the
// page to scroll to; everywhere else it opens the reader at that page.
import test from 'node:test';
import assert from 'node:assert/strict';
import { openLink, sourceHref } from '../../src/lib/env.js';

const card = {
  page: 12,
  open: 'https://vetmock.com/app/tools/pdf?doc=rabies-com5&page=12',
  file: 'https://vetmock.com/api/library-file?slug=rabies-com5&open=1#page=12',
};

test('in an in-app browser a library file opens as the file, and its label names the page', () => {
  assert.deepEqual(openLink(card, true), { href: card.file, label: 'เปิดไฟล์ แล้วเลื่อนไปหน้า 12' });
  assert.deepEqual(openLink({ ...card, page: 1 }, true), { href: card.file, label: 'เปิดไฟล์' });
  assert.deepEqual(openLink(card, false), { href: card.open, label: 'เปิดหน้า 12' });
  assert.deepEqual(openLink({ open: card.open, page: null }, true), { href: card.open, label: 'เปิด' }, 'a card without the file link keeps its own');
  assert.equal(sourceHref({ url: card.open, file: card.file }, true), card.file);
  assert.equal(sourceHref({ url: card.open, file: card.file }, false), card.open);
  assert.equal(sourceHref({ url: 'https://pubmed.ncbi.nlm.nih.gov/1/' }, true), 'https://pubmed.ncbi.nlm.nih.gov/1/', 'a paper keeps its address');
});
