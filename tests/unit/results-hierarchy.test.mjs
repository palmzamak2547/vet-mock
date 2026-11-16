// ============================================================
// Results: the score first, the answers next, the social last (UI-06)
// ============================================================
// After a late-night set on a phone, the first thing a student saw was the
// promotion banner "เลื่อนยศโต้รุ้ง! ..." above the score, and the answer
// review was the last of six identical buttons, under "ส่งเข้ากลุ่ม",
// "สร้างห้องแข่ง" and "ท้าเพื่อน". UI-06 made the banner a note under the
// stats and put the three ways to bring a friend behind one disclosure.
// 5.282.0 (work/results-design direction 1) went further: the promotion is
// said on Progress, the answers and the one share entry sit side by side
// under the one filled button, and the disclosure is gone.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const results = read('src/views/ResultsView.jsx');
const nightCard = read('src/components/NightRankCard.jsx');
const css = read('src/styles.css');

test('UI-06: the promotion is never drawn on the results; the night rank card on Progress says it', () => {
  assert.equal(results.includes('vmx-night-rank-promo'), false, 'the promotion is back between the score and the actions');
  assert.equal(results.includes('takePromotion'), false, 'results would take the stash before Progress can read it');
  assert.match(nightCard, /const pending = takePromotion\(\);\n\s*if \(pending\) setPromo\(pending\);/);
  assert.match(nightCard, /window\.addEventListener\(NIGHT_RANK_EVENT, onPromo\);/, 'a promotion fired while Progress is open still shows');
  assert.equal(nightCard.split('className="vmx-night-rank-promo"').length - 1, 1, 'one promotion element');
});

test('UI-06: the answers and the one share entry sit side by side, then one next-step row, no disclosure', () => {
  const thumb = results.indexOf('<div className={`vmx-res-thumb');
  const pair = results.indexOf('<div className={`vmx-res-pair');
  const next = results.indexOf('<button type="button" className={`vmx-res-next');
  assert.ok(thumb > 0 && pair > thumb && next > pair, 'filled button, then the pair, then the next step');
  const row = results.slice(pair, next);
  assert.ok(row.indexOf('{side.label}') < row.indexOf('ส่งให้เพื่อน'), 'the answers (or, after an exam, the redo) come first');
  assert.equal(results.split('ส่งให้เพื่อน').length - 1, 1, 'one share entry');
  for (const gone of ['<details className="vmx-invite">', 'ChallengeQuizButton', 'SendToGroupButton', 'ShareQuizButton', 'ShareToIGRow']) {
    assert.equal(results.includes(gone), false, `${gone} is back on the results`);
  }
});

test('UI-06: a writing-only set leads with the answers, where it is marked', () => {
  const at = results.indexOf('if (autoQs.length === 0) {');
  const block = results.slice(at, results.indexOf('} else if', at));
  assert.match(block, /primary = \{ label: 'ดูเฉลยและให้คะแนนข้อเขียน'[^}]*onClick: openReview \}/);
});

// The disclosure's own rules (marker hidden, actions stacked on a phone) went with it in 5.282.0;
// the note that says a set of the student's own questions cannot travel is kept for the sheet.
test('UI-06: the disclosure and the pace chip left no rules behind, and the share note keeps its own', () => {
  assert.doesNotMatch(css, /\.vmx-invite(?!-note)/);
  assert.doesNotMatch(css, /\.vmx-pacing-telemetry/);
  assert.match(css, /\.vmx-invite-note \{ display: block; font-size: 14px;/);
});
