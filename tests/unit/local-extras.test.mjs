import test from 'node:test';
import assert from 'node:assert/strict';
import { exportLocalExtras, parseLocalExtras, restoreLocalExtras } from '../../src/lib/local-extras.js';
import { addNote, loadNotes } from '../../src/lib/video-notes.js';
import { addPin, loadPins } from '../../src/lib/pinboard.js';
import { saveUserFlashcard, saveClozeText, loadUserFlashcards } from '../../src/lib/user-flashcards.js';
import { saveDeck, loadDecks } from '../../src/lib/image-occlusion.js';

test('the supplemental archive round-trips real tool records and refuses a partial quota write', () => {
  const values = new Map();
  let fail = false;
  globalThis.window = { localStorage: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { if (fail) throw new Error('quota'); values.set(key, value); },
  }, dispatchEvent() {} };
  try {
    addNote('video', 1, 'saved');
    addPin({ type: 'note', payload: { qKey: 'q' }, label: 'saved pin' });
    saveUserFlashcard({ front: 'front', back: 'back' });
    saveClozeText({ fullText: 'A {{c1::test}} sentence.' });
    const archive = exportLocalExtras();
    assert.equal(parseLocalExtras(archive).success, true);
    const changed = structuredClone(archive);
    changed.data['vmx-video-notes'].video.notes[0].text = 'restored';
    changed.data['vmx-pinboard'] = [];
    fail = true;
    assert.equal(restoreLocalExtras(changed).ok, false);
    assert.equal(loadNotes('video')[0].text, 'saved');
    assert.equal(loadPins().length, 1);
    fail = false;
    assert.equal(restoreLocalExtras(changed).ok, true);
    assert.equal(loadNotes('video')[0].text, 'restored');
    assert.equal(loadPins().length, 0);
    assert.equal(loadUserFlashcards().length, 2);
    fail = true;
    assert.equal(addPin({ type: 'note', payload: { qKey: 'new' }, label: 'not saved' }), null);
    assert.equal(loadPins().length, 0, 'a failed write must not mutate the cached bundle');
  } finally { delete globalThis.window; }
});

test('malformed tool archives are rejected before any local data is changed', () => {
  assert.equal(parseLocalExtras({ format: 'vetmock-local-extras-v1', data: { 'vmx-pinboard': [{}] } }).success, false);
  assert.equal(parseLocalExtras(JSON.parse('{"format":"vetmock-local-extras-v1","data":{"vmx-video-notes":{"__proto__":{}}}}')).success, false);
});

test('an SVG occlusion deck round-trips through backup without permitting non-image data URLs', () => {
  const values = new Map();
  globalThis.window = { localStorage: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }, dispatchEvent() {} };
  try {
    const imageDataUrl = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><text y="8">A</text></svg>').toString('base64');
    const saved = saveDeck({ name: 'SVG study diagram', imageDataUrl,
      masks: [{ id: 'label', x: 0, y: 0, w: 1, h: 1, answer: 'A' }] });
    assert.ok(saved);
    const archive = exportLocalExtras();
    assert.equal(parseLocalExtras(archive).success, true);
    assert.equal(restoreLocalExtras(archive).ok, true);
    assert.equal(loadDecks()[0].imageDataUrl, imageDataUrl);
    for (const invalid of ['data:text/html;base64,PHNjcmlwdD4=', 'javascript:alert(1)', 'https://example.com/diagram.svg']) {
      const bad = structuredClone(archive);
      bad.data['vmx-image-occlusion-decks'][0].imageDataUrl = invalid;
      assert.equal(restoreLocalExtras(bad).ok, false);
      assert.equal(loadDecks()[0].imageDataUrl, imageDataUrl);
    }
  } finally { delete globalThis.window; }
});
