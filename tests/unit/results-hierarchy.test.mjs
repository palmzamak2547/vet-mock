// ============================================================
// Results: the score first, the answers next, the social last (UI-06)
// ============================================================
// After a late-night set on a phone, the first thing a student saw was the
// promotion banner "เลื่อนยศโต้รุ้ง! ..." above the score, and the answer
// review was the last of six identical buttons, under "ส่งเข้ากลุ่ม",
// "สร้างห้องแข่ง" and "ท้าเพื่อน". Now the banner is a one-line note under
// the stats, the row reads ดูเฉลย, อ่านสรุปเรื่องนี้, ทำ...อีก 5 ข้อ in DOM
// and visual order, and the three ways to bring a friend sit behind one
// "ชวนเพื่อน" disclosure.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const results = read('src/views/ResultsView.jsx');
const css = read('src/styles.css');

test('UI-06: the promotion note renders after the stat grid, not above the score', () => {
  const hero = results.indexOf('<div className="vmx-results-hero">');
  const stats = results.indexOf('<div className="vmx-stat-grid">');
  const promo = results.indexOf('className="vmx-night-rank-promo"');
  assert.ok(hero > 0 && stats > hero, 'the hero and the stat grid moved');
  assert.ok(promo > stats, 'the promotion is drawn before the score again');
  assert.equal(results.split('className="vmx-night-rank-promo"').length - 1, 1, 'one promotion element');
});

test('UI-06: the secondary row is a stack: review, summary, more, then one invite disclosure', () => {
  const at = results.indexOf('<div className="vmx-btn-row is-stack"');
  assert.ok(at > 0, 'the Results row is not a stack');
  const row = results.slice(at, results.indexOf('</details>', at) + '</details>'.length);
  const order = ['ดูเฉลย', 'อ่านสรุปเรื่องนี้', 'นี้อีก 5 ข้อ', '<details className="vmx-invite">'].map((s) => row.indexOf(s));
  assert.ok(order.every((i) => i >= 0), `a part of the row is missing: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'the row is out of order');
  const invite = row.slice(row.indexOf('<details className="vmx-invite">'));
  assert.match(invite, /<summary className="vmx-btn vmx-btn-ghost">ชวนเพื่อน<\/summary>/);
  for (const social of ['<ChallengeQuizButton', '/> สร้างห้องแข่ง', '<SendToGroupButton']) {
    assert.ok(invite.includes(social), `${social} is not inside the invite disclosure`);
    assert.equal(row.split(social).length - 1, 1, `${social} is drawn twice`);
  }
});

test('UI-06: the writing-only row puts the review first too', () => {
  const at = results.indexOf('if (autoQs.length === 0) {');
  const block = results.slice(at, results.indexOf('}\n', results.indexOf('</div>', at)));
  assert.match(block, /className="vmx-btn-row is-stack"/);
  assert.ok(block.indexOf("setView('review')") < block.indexOf('<ShareQuizButton'));
  assert.ok(block.indexOf('<ShareQuizButton') < block.indexOf('onClick={goHome}'));
});

test('UI-06: the disclosure hides the native marker and its actions stack on a phone', () => {
  assert.match(css, /\.vmx-invite > summary \{[^}]*list-style: none;/);
  assert.match(css, /\.vmx-invite > summary::-webkit-details-marker \{ display: none; \}/);
  assert.match(css, /\.vmx-invite\[open\] \{[^}]*flex-basis: 100%;/);
  assert.match(css, /@media \(max-width: 640px\) \{[^}]*\.vmx-btn-row\.is-stack > \.vmx-invite \{ width: 100%; \}/);
});
