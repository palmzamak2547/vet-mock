import assert from 'node:assert/strict';
import test from 'node:test';

import {
  consumeNoteRetryTarget,
  NOTES_RETRY_SESSION_KEY,
  parseNoteRetryTarget,
  saveNoteRetryTarget,
} from '../../src/lib/note-retry.js';

function memorySession() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test('note retry target is validated and consumed exactly once', () => {
  const session = memorySession();
  assert.equal(saveNoteRetryTarget('zoonoses', 'zoo-intro', session), true);
  assert.deepEqual(consumeNoteRetryTarget(session), { subject: 'zoonoses', topic: 'zoo-intro' });
  assert.equal(session.getItem(NOTES_RETRY_SESSION_KEY), null);
  assert.equal(consumeNoteRetryTarget(session), null);
});

test('malformed retry targets cannot steer App state', () => {
  assert.equal(parseNoteRetryTarget('{broken'), null);
  assert.equal(parseNoteRetryTarget(JSON.stringify({ subject: '' })), null);
  assert.equal(parseNoteRetryTarget(JSON.stringify({ subject: ['com5'] })), null);
  assert.equal(parseNoteRetryTarget(JSON.stringify({ subject: 'com5', topic: 42 })), null);
});
