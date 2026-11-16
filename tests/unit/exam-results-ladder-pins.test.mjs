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

// 5.235.0: sticky at every size, not only on a phone (the iPad in landscape
// lost its start under a long ปรับเอง), above the bottom bar where there is one,
// on the page's own background (docs/DESIGN_SYSTEM.md, Action rows).
test('the config start bar stays in reach at every size, above the bottom bar', () => {
  const at = night.indexOf('.vmx-config-actions {\n  position: sticky;');
  assert.ok(at > 0, 'the start bar is sticky');
  const bar = night.slice(at, night.indexOf('}', at));
  assert.match(bar, /bottom: calc\(var\(--vmx-bottom-nav-h, 0px\) \+ env\(safe-area-inset-bottom, 0px\)\);/);
  assert.match(bar, /background: var\(--clr-bg\);/);
  // Not a phone-only rule: the last media block before it is closed.
  const media = night.lastIndexOf('@media', at);
  assert.ok(media < 0 || night.indexOf('\n}\n', media) < at, 'the sticky start bar is not limited to one width');
});

test('the instant verdict and the results seal speak Thai, with no English kicker or bullet', () => {
  assert.equal(question.includes('CLINICAL VERDICT'), false);
  assert.equal(question.includes("'APPROVED'"), false);
  // The verdict is the Thai headline alone: the Mochi stamp beside it, with
  // its ถูกแล้ว and ลองอีกที label, went in 5.189.2 (Palm: "ดูแปลกตา").
  // A partly right fill-in item says how many blanks were right instead (headline).
  assert.match(question, /\{headline \|\| \(ok \? '✓ คุณตอบถูก' : '✗ ยังไม่ใช่ ดูเฉลยด้านล่าง'\)\}/);
  for (const gone of ["'ลองอีกที'", "'ถูกแล้ว'", 'vmx-mochi-stamp--', 'slot="feedback"']) {
    assert.equal(question.includes(gone), false, `${gone} is back on the verdict`);
  }
  for (const gone of ['CLINICAL BENCHMARK ATTAINED', 'DIAGNOSTIC REFINEMENT NEEDED', 'RUBRIC SELF-EVALUATION', '% PASS', '<span>• เฉลี่ย']) {
    assert.equal(results.includes(gone), false, `${gone} is back`);
  }
  // 5.282.0: the seal is the verdict word in the score card; the bar's one tick reads "60%".
  assert.match(results, /: reached \? 'ถึงเกณฑ์ซ้อมแล้ว' : 'ยังไม่ถึงเกณฑ์ซ้อม'/);
  assert.match(results, /<div className="vmx-benchmark-flag">\{PRACTICE_PASS_PCT\}%<\/div>/);
  assert.match(night, /\.vmx-clinical-seal \{ font-family: var\(--vmx-sans\); letter-spacing: 0; text-transform: none;/);
  assert.match(night, /\.vmx-clinical-seal \.vmx-seal-sub \{[^}]*opacity: 1;/);
});

test('the results screen reads the rung off the set and judges it with the app\'s own bar', () => {
  assert.match(results, /const stepId = ladderStepFor\(\{ mode, useTimer: Boolean\(useTimer\) \}\);/);
  assert.match(results, /ladderVerdict\(\{ stepId, correct: score\.correct, total: score\.total, passPct: PRACTICE_PASS_PCT \}\)/);
  assert.match(results, /sessionKind === 'redo'\n\s+\? \{ kind: 'redo'/, 'a redo round never climbs');
  assert.match(results, /<LadderStrip\n\s+done=\{verdict\.step\}/);
  // The score card comes first, then the one filled button, and the ladder
  // strip only after the actions (5.282.0, results-design direction 1).
  const card = results.indexOf('<section className={`vmx-res-card');
  const thumb = results.indexOf('<div className={`vmx-res-thumb');
  const ladder = results.indexOf('<section className="vmx-next-ladder"');
  assert.ok(card > 0 && thumb > card && ladder > thumb);
  // Climbing a rung starts the next rung on the same subject; the exam rung is the whole subject.
  const launch = results.slice(results.indexOf('const launchStep = (id) => {'), results.indexOf('const openExamConfig'));
  assert.match(launch, /if \(id === 'exam'\) \{[\s\S]*topic: null/);
  assert.match(launch, /\.\.\.\(id === 'understand' \? \{ gentle: true \} : \{\}\)/);
  assert.equal(launch.includes('excludeIds'), false, 'the next rung re-tests the same material; only "ต่ออีก" excludes');
});

// Below the pass line on the same rung the student is sent to the misses first: since 5.282.0 that is
// the filled button itself, with the rung as the next step (the sentence under the ladder went), read
// off the rendered screen in tests/unit/results-calm.test.mjs.
