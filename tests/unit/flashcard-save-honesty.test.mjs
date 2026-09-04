// ============================================================
// flashcard-save-honesty.test.mjs — a card that was not stored is not saved
// ============================================================
// writeRaw() swallowed a localStorage failure and returned nothing. Its own
// comment said "UI layer can show a toast if needed" — which the UI layer
// could not do, because nothing was ever returned to it. saveUserFlashcard
// handed back the card object either way, so HighlightToCard showed
// "✓ เพิ่ม flashcard แล้ว" for a card the browser had refused to store, and
// the student found out when they opened their deck and it was not there.
//
// localStorage fills up (VetMock shares the origin with the question bank,
// notes and annotations) and private windows can refuse writes outright, so
// this is not a hypothetical.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

const STORE_KEY_HINT = 'vmx';

/** A localStorage stand-in whose behaviour the test controls. */
function installStorage({ failWrites = false } = {}) {
  const map = new Map();
  const storage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => {
      if (failWrites) {
        const err = new Error('QuotaExceededError');
        err.name = 'QuotaExceededError';
        throw err;
      }
      map.set(k, String(v));
    },
    removeItem: (k) => map.delete(k),
    key: (i) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
  globalThis.window = {
    localStorage: storage,
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  globalThis.localStorage = storage;
  return map;
}

async function freshModule() {
  // Bust the module cache so each case starts from a clean store.
  const url = new URL('../../src/lib/user-flashcards.js', import.meta.url);
  return import(`${url.href}?t=${Math.random()}`);
}

test('a flashcard that stores is returned, and it is really in the store', async () => {
  const map = installStorage();
  const { saveUserFlashcard, loadUserFlashcards } = await freshModule();
  const card = saveUserFlashcard({ front: 'ตับอ่อน', back: 'pancreas', subject: 'com5' });
  assert.ok(card, 'a successful save must return the card');
  assert.equal(card.front, 'ตับอ่อน');
  assert.equal(loadUserFlashcards().length, 1, 'the card must be readable back');
  assert.ok([...map.keys()].some((k) => k.includes(STORE_KEY_HINT)), 'it went to a vmx key');
});

test('a flashcard the browser refuses to store returns null, so no toast can lie', async () => {
  installStorage({ failWrites: true });
  const { saveUserFlashcard, loadUserFlashcards } = await freshModule();
  const card = saveUserFlashcard({ front: 'ตับอ่อน', back: 'pancreas' });
  assert.equal(card, null, 'a refused write must not look like a save');
  assert.equal(loadUserFlashcards().length, 0);
});

test('a cloze deck the browser refuses to store returns null, not an empty deck', async () => {
  installStorage({ failWrites: true });
  const { saveClozeText } = await freshModule();
  const cards = saveClozeText({ fullText: 'the {{c1::pancreas}} makes {{c2::insulin}}', subject: 'com5' });
  assert.equal(cards, null, 'null distinguishes "refused" from "no cloze markers"');
});

test('an empty front is still rejected the way it always was', async () => {
  installStorage();
  const { saveUserFlashcard } = await freshModule();
  assert.equal(saveUserFlashcard({ front: '   ', back: 'x' }), null);
  assert.equal(saveUserFlashcard({}), null);
});

test('the toast and the error message are wired to the returned value', async () => {
  // The store now tells the truth; these pin that the two callers listen.
  const { readFileSync } = await import('node:fs');
  const { join, resolve } = await import('node:path');
  const root = resolve(process.cwd());
  const highlight = readFileSync(join(root, 'src/components/HighlightToCard.jsx'), 'utf8');
  assert.match(highlight, /const saved = saveUserFlashcard\(/, 'the return value must be captured');
  assert.match(highlight, /if \(!saved\) \{/, 'a refused save must not fall through to the ✓ toast');
  const cloze = readFileSync(join(root, 'src/components/ClozeEditor.jsx'), 'utf8');
  assert.match(cloze, /cards === null/, 'the editor must separate "refused" from "no cloze marks"');
});
