// ============================================================
// loop-round5.test.mjs — the round-5 audit's verified fixes, pinned
// ============================================================
// No \b anywhere in this file (see resume-keeps-mode for why).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { updateCard, initCard } from '../../src/hooks/sm2.js';
import { findAutoPromoteCandidates } from '../../src/lib/wrong-to-sr.js';

const src = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

test('SR previews read the live record, grading dispatches the event once, the backlog is honest', () => {
  const s = src('src/views/SRSessionView.jsx');
  assert.equal((s.match(/previewInterval\(liveCard, /g) || []).length, 4, 'all four previews read the live card');
  assert.equal(s.includes('previewInterval(currentCard,'), false);
  assert.ok(s.includes("new CustomEvent('vmx-sr-card-graded'"), 'the App-level listener finally has a dispatcher');
  assert.ok(s.includes('if (!currentCard._relearn) {'), 'a relearn copy earns no second credit');
  assert.ok(s.includes('const remaining = duePool.length;'), 'the backlog is the live pool, not pool minus session');
  assert.ok(src('src/App.jsx').includes("addEventListener('vmx-sr-card-graded'"), 'the listener still exists');
});

test('a low-ease card can still be spaced out by pressing Good, and Hard grows a streak', () => {
  const stuck = { ...initCard(1), repetitions: 2, interval: 1, easeFactor: 1.3 };
  assert.ok(updateCard(stuck, 2).interval > 1, 'Good must grow a 1-day interval');
  const streak = { ...initCard(2), repetitions: 2, interval: 6, easeFactor: 1.3 };
  assert.ok(updateCard(streak, 1).interval > 6, 'Hard must not hold a streaked card still');
  const fresh = { ...initCard(3), repetitions: 0, interval: 1, easeFactor: 2.5 };
  assert.equal(updateCard(fresh, 2).interval, 1, 'a brand-new card still starts at one day');
});

test('auto-promote never replaces a card that is already in the SR system', () => {
  const now = Date.now();
  const history = [
    { questionId: 7, subject: 'com5', correct: false, date: '2026-09-01' },
    { questionId: 7, subject: 'com5', correct: false, date: '2026-09-02' },
  ];
  const cards = { 7: { questionId: 7, totalReviews: 0, autoPromoted: true, nextReview: now - 1000 } };
  const picked = findAutoPromoteCandidates(history, cards, { now });
  assert.equal(picked.some((c) => String(c.questionId) === '7'), false, 'a due promoted card must not be re-promoted');
});

test('Escape inside an element that owns it no longer closes the dialog', () => {
  assert.ok(src('src/hooks/useModalFocus.js').includes("closest?.('[data-vmx-owns-escape]')"));
  assert.ok(src('src/components/ImageOcclusionEditor.jsx').includes('data-vmx-owns-escape="true"'));
  assert.equal((src('src/components/VideoNotePanel.jsx').match(/data-vmx-owns-escape="true"/g) || []).length, 2);
});

test('sign-out drops the LINE session, and an expired LINE token is refreshed', () => {
  const sb = src('src/lib/supabase.js');
  assert.equal((sb.match(/await liffLogoutIfInitialised\(\);/g) || []).length, 2, 'both sign-out paths');
  assert.ok(sb.includes("signOut({ scope: 'local' })"));
  assert.ok(src('src/lib/line-liff.js').includes('if (idTokenExpired(idToken))'));
});

test('agent refusals reach the student in Thai', () => {
  const aa = src('api/_lib/agent-actions.js');
  for (const en of ['unknown practice subject', 'unknown library subject', 'unknown wiki topic', 'unknown feature', 'no matching action', 'unknown action type']) {
    assert.equal(aa.includes(`'${en}`), false, `${en} still reaches the palette`);
  }
  assert.ok(src('api/agent-action.js').includes('hasCJK(verdict.reason)'));
});

test('a student id is never a display name', () => {
  for (const f of ['src/hooks/useAuth.js', 'src/hooks/useStudyBuddies.js', 'src/views/RaceView.jsx']) {
    assert.equal(src(f).includes("split('@')[0]"), false, `${f} still derives a name from the email`);
  }
});

test('the palette auto-ask waits for a pause and never re-asks a mere extension', () => {
  const s = src('src/components/CommandPalette.jsx');
  assert.ok(s.includes('}, 900);'), 'a settle timer, not the 60 ms debounce');
  assert.ok(s.includes('q.startsWith(lastAutoAsk.current)'));
});

test('the orthography gate can fail, the reader loading box follows the theme, the landing radiograph is lazy and cached', () => {
  assert.ok(src('scripts/lint-thai-orthography.mjs').includes('if (show.length) process.exitCode = 1;'));
  assert.ok(src('src/views/PdfAnnotateView.jsx').includes("background: 'var(--clr-bg, #fff)', color: 'var(--clr-ink)', padding: 16"));
  assert.ok(src('src/views/landing/LandingBody.jsx').includes('loading="lazy"'));
  const cfg = JSON.parse(src('vercel.json'));
  const rule = cfg.headers.find((h) => h.source === '/images/(.*)');
  assert.ok(rule && /max-age=604800/.test(rule.headers[0].value));
});
