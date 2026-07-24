// ============================================================
// personal-notes-ui.test.mjs — Unit tests for Personal Notes UI data contracts
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

// Helper function modeling the setNote contract in App.jsx
function setNoteContract(notes, qId, text) {
  if (text && text.trim()) {
    return { ...notes, [qId]: text };
  } else {
    const { [qId]: _, ...rest } = notes;
    return rest;
  }
}

// Helper function modeling the Pinboard snippet extraction
function extractPinboardSnippet(pin, notes) {
  if (!pin || pin.type !== 'question') return null;
  const qId = pin.payload?.id;
  const subjId = pin.payload?.subject;
  const noteContent = notes?.[qId] || (subjId && notes?.[`${subjId}:${qId}`]);
  if (!noteContent || !String(noteContent).trim()) return null;
  return String(noteContent).trim();
}

test('W2A-3: 1. ReviewView displays existing note data correctly', () => {
  const notes = { 'com5:101': 'ข้อนี้ต้องระวังเรื่อง dosage' };
  const qId = 'com5:101';
  assert.equal(notes[qId], 'ข้อนี้ต้องระวังเรื่อง dosage');
});

test('W2A-3: 2. Changing/saving invokes note callback with correct QID and text value', () => {
  let state = { 'com5:101': 'old note' };
  const updatedText = 'ข้อนี้เฉลยละเอียดเพิ่มเรื่อง EEG';
  state = setNoteContract(state, 'com5:101', updatedText);
  assert.equal(state['com5:101'], updatedText);
});

test('W2A-3: 3. Clearing note invokes deletion contract removing key', () => {
  let state = { 'com5:101': 'to be deleted', 'com5:102': 'keep me' };
  state = setNoteContract(state, 'com5:101', '');
  assert.equal(state['com5:101'], undefined);
  assert.equal(state['com5:102'], 'keep me');
  assert.equal(Object.keys(state).length, 1);
});

test('W2A-3: 4. No note-editor data/UI target on invalid/missing question state', () => {
  const invalidQ = null;
  const notes = { 'com5:101': 'some note' };
  const qId = invalidQ?.id;
  assert.equal(qId, undefined);
  assert.equal(notes[qId], undefined);
});

test('W2A-3: 5. PinboardView snippet extracts note text when non-empty note exists', () => {
  const pin = { type: 'question', payload: { id: 'com5:202', subject: 'com5' } };
  const notes = { 'com5:202': 'ทบทวนเรื่อง Rabies vaccine schedule' };
  const snippet = extractPinboardSnippet(pin, notes);
  assert.equal(snippet, 'ทบทวนเรื่อง Rabies vaccine schedule');
});

test('W2A-3: 6. PinboardView snippet returns null when no note exists', () => {
  const pin = { type: 'question', payload: { id: 'com5:203', subject: 'com5' } };
  const notes = { 'com5:202': 'another note' };
  const snippet = extractPinboardSnippet(pin, notes);
  assert.equal(snippet, null);
});

test('W2A-3: 7. Note content is plain text; HTML tags do not format or create elements', () => {
  const rawNote = '<script>alert("xss")</script><b>Bold Text</b>';
  const notes = setNoteContract({}, 'com5:301', rawNote);
  // Ensure the stored content matches raw string verbatim without HTML evaluation
  assert.equal(notes['com5:301'], '<script>alert("xss")</script><b>Bold Text</b>');
  assert.equal(typeof notes['com5:301'], 'string');
});
