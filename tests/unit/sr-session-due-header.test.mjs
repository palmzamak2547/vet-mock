import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { dueAt } from '../../src/lib/sr-scheduler.js';
import { fmtDate } from '../../src/hooks/utils.js';

// The review session header says when the card came due ("ถึงรอบ ..."). Under
// FSRS the session serves cards by the FSRS due date, so a header reading the
// SM-2 date could print a date ten days out on a card served as due today.

const SR = readFileSync(new URL('../../src/views/SRSessionView.jsx', import.meta.url), 'utf8');

test('every session header prints the selected scheduler due date', () => {
  const headers = SR.match(/ถึงรอบ \{[^}]*\}\}?/g) || [];
  assert.equal(headers.length, 3, 'image-occlusion, cloze and the default card each have one header');
  for (const header of headers) {
    assert.equal(header, 'ถึงรอบ {fmtDate(dueAt(currentCard, scheduler))}', `header reads: ${header}`);
  }
  assert.match(SR, /import \{[^}]*\bdueAt\b[^}]*\} from '\.\.\/lib\/sr-scheduler\.js';/);
});

test('the header expression shows the FSRS date in FSRS mode and the SM-2 date otherwise', () => {
  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const card = {
    questionId: 1, totalReviews: 3, lastReview: now - 4 * DAY, nextReview: now + 10 * DAY,
    fsrs: { stability: 3, difficulty: 5, interval: 3, due: now - DAY, lastReview: now - 4 * DAY },
  };
  assert.equal(fmtDate(dueAt(card, 'fsrs')), fmtDate(card.fsrs.due));
  assert.equal(fmtDate(dueAt(card, 'sm2')), fmtDate(card.nextReview));
  assert.notEqual(fmtDate(dueAt(card, 'fsrs')), fmtDate(card.nextReview));
});
