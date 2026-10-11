// ============================================================
// exam-results-ladder-pins.test.mjs — the exam screen on a phone and the
// results screen's next step, pinned at the source
// ============================================================
// The tester called the phone "panic-mode only": the next-question button sat
// under the fold, the exam map had its own button in a header that wrapped,
// and the results screen spoke mono English ("DIAGNOSTIC REFINEMENT NEEDED")
// above a Thai verdict. These pins hold the shape that fixed it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const exam = read('src/views/ExamView.jsx');
const results = read('src/views/ResultsView.jsx');
const question = read('src/components/Question.jsx');
const css = read('src/styles.css');
const night = css.slice(css.indexOf('/* === night-d === */'), css.indexOf('/* === end night-d === */'));

test('the position pill is the exam map opener and says ข้อ, not CASE', () => {
  assert.match(exam, /const Pill = jumpToQ \? 'button' : 'div';/);
  assert.match(exam, /'aria-label': `ข้อ \$\{currentIdx \+ 1\} จาก \$\{questions\.length\}, เปิดแผนผังข้อสอบ`/);
  assert.match(exam, /<span className="vmx-progress-case" aria-hidden="true">ข้อ<\/span>/);
  assert.equal(exam.includes('>CASE<'), false);
  assert.equal(exam.split('setShowNav(true)').length - 1, 1, 'one opener, not three');
  assert.equal(exam.includes('<span>แผนผัง</span>'), false, 'the separate header button is gone');
  assert.match(night, /\.vmx-progress\.is-opener \{[^}]*min-height: var\(--touch-min\)/);
  assert.match(night, /\.vmx-progress-case \{ font-family: var\(--vmx-sans\); letter-spacing: 0; \}/);
});

test('previous and next are one sticky row on a phone, the next one wider', () => {
  assert.match(exam, /<div className="vmx-btn-row vmx-exam-actions">/);
  assert.match(exam, /className="vmx-btn vmx-btn-ghost vmx-exam-prev"/);
  assert.match(exam, /className="vmx-btn vmx-btn-primary vmx-exam-next"/);
  const phone = night.slice(night.indexOf('.vmx-exam-actions {'), night.indexOf('.vmx-exam-actions .vmx-exam-next'));
  assert.match(phone, /position: sticky;/);
  assert.match(phone, /bottom: calc\(var\(--vmx-bottom-nav-h, 0px\) \+ env\(safe-area-inset-bottom, 0px\) \+ 8px\);/);
  assert.match(phone, /flex-direction: row; flex-wrap: nowrap;/);
  assert.match(night, /\.vmx-exam-actions \.vmx-exam-prev \{ flex: 0 1 38%/);
  assert.match(night, /\.vmx-exam-actions \.vmx-exam-next \{ flex: 1 1 62%; \}/);
  // Inside the 640px block, which is where the phone rules of this file live.
  const at = night.indexOf('.vmx-exam-actions {');
  const mediaOpen = night.lastIndexOf('@media (max-width: 640px)', at);
  assert.ok(mediaOpen > 0 && night.indexOf('}\n}', mediaOpen) > at, 'the sticky bar is a phone rule');
});

test('the config start bar is sticky on a phone and in flow on a desktop', () => {
  const phone = night.slice(night.indexOf('.vmx-config-actions {\n    position: sticky;'));
  assert.match(phone, /bottom: calc\(var\(--vmx-bottom-nav-h, 0px\) \+ env\(safe-area-inset-bottom, 0px\) \+ 8px\);/);
  assert.match(night, /@media \(min-width: 641px\) \{\n  \.vmx-config-actions \{ flex-direction: row;/);
});

test('the instant verdict and the results seal speak Thai, with no English kicker or bullet', () => {
  assert.equal(question.includes('CLINICAL VERDICT'), false);
  assert.equal(question.includes("'APPROVED'"), false);
  assert.match(question, /\{ok \? 'ถูกแล้ว' : 'ลองอีกที'\}/);
  for (const gone of ['CLINICAL BENCHMARK ATTAINED', 'DIAGNOSTIC REFINEMENT NEEDED', 'RUBRIC SELF-EVALUATION', '% PASS', '<span>• เฉลี่ย']) {
    assert.equal(results.includes(gone), false, `${gone} is back`);
  }
  assert.match(results, /\{reached \? 'ถึงเกณฑ์ซ้อมแล้ว' : 'ยังไม่ถึงเกณฑ์ซ้อม'\}/);
  assert.match(results, /<div className="vmx-benchmark-flag">เกณฑ์ \{PRACTICE_PASS_PCT\}%<\/div>/);
  assert.match(night, /\.vmx-clinical-seal \{ font-family: var\(--vmx-sans\); letter-spacing: 0; text-transform: none;/);
  assert.match(night, /\.vmx-clinical-seal \.vmx-seal-sub \{[^}]*opacity: 1;/);
});

test('the results screen reads the rung off the set and judges it with the app\'s own bar', () => {
  assert.match(results, /const stepId = ladderStepFor\(\{ mode, useTimer: Boolean\(useTimer\) \}\);/);
  assert.match(results, /ladderVerdict\(\{ stepId, correct: score\.correct, total: score\.total, passPct: PRACTICE_PASS_PCT \}\)/);
  assert.match(results, /sessionKind === 'redo'\n\s+\? \{ kind: 'redo'/, 'a redo round never climbs');
  assert.match(results, /<LadderStrip\n\s+done=\{verdict\.step\}/);
  // The ladder section sits after the stat grid and before the action stack,
  // so the score is still what the student sees first (UI-06).
  const stats = results.indexOf('<div className="vmx-stat-grid">');
  const ladder = results.indexOf('<section className="vmx-next-ladder"');
  const stack = results.indexOf('<div className="vmx-btn-row is-stack" style={{ gap: 8 }}>');
  assert.ok(stats > 0 && ladder > stats && stack > ladder);
  // Climbing a rung starts the next rung on the same subject; the exam rung is the whole subject.
  const launch = results.slice(results.indexOf('const launchStep = (id) => {'), results.indexOf('const openExamConfig'));
  assert.match(launch, /if \(id === 'exam'\) \{[\s\S]*topic: null/);
  assert.match(launch, /\.\.\.\(id === 'understand' \? \{ gentle: true \} : \{\}\)/);
  assert.equal(launch.includes('excludeIds'), false, 'the next rung re-tests the same material; only "ต่ออีก" excludes');
});
