import test from 'node:test';
import assert from 'node:assert/strict';
import { exportLocalExtras, parseLocalExtras, restoreLocalExtras } from '../../src/lib/local-extras.js';
import { addNote, loadNotes } from '../../src/lib/video-notes.js';
import { addPin, loadPins } from '../../src/lib/pinboard.js';
import { saveUserFlashcard, saveClozeText, loadUserFlashcards } from '../../src/lib/user-flashcards.js';

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
