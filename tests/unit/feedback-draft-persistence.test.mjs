// ============================================================
// feedback-draft-persistence.test.mjs — the unsent draft outlives the page
// ============================================================
// feedback-draft.test.mjs pins what happens INSIDE the feedback view (the
// success timer clears only what was sent). This file pins the storage layer
// under it: lib/feedback-client.js owns one localStorage key mirroring the
// unsent draft, so a failed send, a closed tab or a view switch never costs
// the student their words. Load and save are pure against an injected store;
// no network, no email, no DOM.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FEEDBACK_DRAFT_KEY,
  loadFeedbackDraft,
  saveFeedbackDraft,
} from '../../src/lib/feedback-client.js';

/** An in-memory localStorage stand-in, the way a browser holds it. */
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    dump: () => Object.fromEntries(map),
  };
}

const DRAFT = { type: 'Bug', subject: 'ข้อ 12 เฉลยผิด', message: 'เฉลยข้อ 12 ของ COM IV ชุดกลางภาค ไม่ตรงกับสไลด์' };

test('a saved draft loads back exactly, capped to the field limits', () => {
  const store = memoryStorage();
  saveFeedbackDraft(DRAFT, store);
  assert.equal(store.dump()[FEEDBACK_DRAFT_KEY], JSON.stringify(DRAFT));
  assert.deepEqual(loadFeedbackDraft(store), DRAFT);
});

test('an over-long paste is capped on save, not trusted to the page', () => {
  const store = memoryStorage();
  saveFeedbackDraft({ type: 'Bug', subject: 's'.repeat(500), message: 'm'.repeat(9000) }, store);
  const loaded = loadFeedbackDraft(store);
  assert.equal(loaded.subject.length, 200);
  assert.equal(loaded.message.length, 5000);
});

test('an empty body removes the key — the success timer must not leave a ghost', () => {
  const store = memoryStorage();
  saveFeedbackDraft(DRAFT, store);
  saveFeedbackDraft({ type: 'Bug', subject: '', message: '   ' }, store);
  assert.equal(store.getItem(FEEDBACK_DRAFT_KEY), null);
  assert.equal(loadFeedbackDraft(store), null);
});

test('a type alone is nothing to rescue; the key stays clean', () => {
  const store = memoryStorage();
  saveFeedbackDraft({ type: 'Feature', subject: '', message: '' }, store);
  assert.equal(loadFeedbackDraft(store), null);
  assert.equal(store.getItem(FEEDBACK_DRAFT_KEY), null, 'a bare type must not linger as a fake draft');
});

test('corrupt or foreign JSON in the key loads as nothing', () => {
  const store = memoryStorage({ [FEEDBACK_DRAFT_KEY]: '{not json' });
  assert.equal(loadFeedbackDraft(store), null);
  assert.equal(loadFeedbackDraft(memoryStorage({ [FEEDBACK_DRAFT_KEY]: '"a string"' })), null);
  assert.equal(loadFeedbackDraft(memoryStorage({ [FEEDBACK_DRAFT_KEY]: 'null' })), null);
});

test('an absent storage object is a no-op on both sides', () => {
  assert.equal(loadFeedbackDraft(null), null);
  assert.doesNotThrow(() => saveFeedbackDraft(DRAFT, undefined));
});
