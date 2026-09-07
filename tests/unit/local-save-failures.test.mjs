import test from 'node:test';
import assert from 'node:assert/strict';
import { addNote, updateNote, deleteNote, loadNotes } from '../../src/lib/video-notes.js';
import { addPin, removePin, clearPinboard, loadPins } from '../../src/lib/pinboard.js';

test('failed note edits and pin mutations retain the saved copy and return failure', () => {
  const data = new Map();
  let full = false;
  globalThis.window = {
    localStorage: {
      getItem: key => data.get(key) ?? null,
      setItem: (key, value) => { if (full) throw new Error('QuotaExceeded'); data.set(key, value); },
    }, dispatchEvent() {},
  };
  try {
    const note = addNote('video', 10, 'saved note');
    const pin = addPin({ type: 'note', payload: { qKey: 'q' }, label: 'saved pin' });
    assert.ok(note && pin);
    full = true;
    assert.equal(addNote('video', 11, 'unsaved draft'), null);
    assert.equal(updateNote('video', note.id, 'unsaved edit'), false);
    assert.equal(deleteNote('video', note.id), false);
    assert.deepEqual(loadNotes('video'), [note]);
    assert.equal(addPin({ type: 'note', payload: { qKey: 'other' }, label: 'unsaved' }), null);
    assert.equal(removePin(pin.id), false);
    assert.equal(clearPinboard(), false);
    assert.deepEqual(loadPins(), [pin]);
  } finally { delete globalThis.window; }
});
