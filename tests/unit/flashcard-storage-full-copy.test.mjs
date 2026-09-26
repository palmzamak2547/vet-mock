// ============================================================
// flashcard-storage-full-copy.test.mjs — a failure message names an action
// the app offers (B69)
// ============================================================
// When localStorage refused a personal flashcard or cloze save, the toast said
// "ลองลบการ์ดเก่า" (delete old cards). No screen deletes a personal card (the
// delete exports were removed as dead code in 7a05f10a), so the advice sent
// the student looking for a control that does not exist. The message now
// comes from one place and names what a student can really do: delete an
// image-occlusion deck they no longer use (those decks hold whole images in
// the same storage) or leave private mode.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const uf = await import('../../src/lib/user-flashcards.js');
const io = await import('../../src/lib/image-occlusion.js');

test('the storage-full message points only at actions that exist', () => {
  const msg = uf.CARD_STORAGE_FULL_MESSAGE;
  assert.equal(typeof msg, 'string');
  const offersCardDelete = Object.keys(uf).some((k) => /^(delete|remove)/i.test(k));
  if (!offersCardDelete) assert.doesNotMatch(msg, /ลบการ์ด/, 'no screen deletes a personal card');
  assert.match(msg, /แฟลชการ์ดปิดภาพ/, 'names the deck the student can delete');
  assert.equal(typeof io.deleteDeck, 'function', 'image-occlusion decks can still be deleted');
  assert.doesNotMatch(msg, /·|นักศึกษา/);
});

test('every flashcard save screen shows that one message', () => {
  for (const file of ['src/components/ClozeEditor.jsx', 'src/components/HighlightToCard.jsx']) {
    const src = readFileSync(resolve(file), 'utf8');
    assert.doesNotMatch(src, /ลองลบการ์ดเก่า/, `${file} still tells students to delete old cards`);
    assert.match(src, /CARD_STORAGE_FULL_MESSAGE/, `${file} uses the shared message`);
  }
});
