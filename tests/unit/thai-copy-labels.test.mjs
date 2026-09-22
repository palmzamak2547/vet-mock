// ============================================================
// thai-copy-labels.test.mjs — study-screen copy that told the student
// something false, or told it in the wrong language
// ============================================================
// These are JSX text and attribute strings; the app is not mounted headless,
// so they are pinned at the source, the way the rest of this suite pins copy.
// Each test names what a student saw before the fix.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { updateStreak } from '../../src/hooks/utils.js';
import { isFlashcardCompatible } from '../../src/hooks/sr-filter.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const count = (src, needle) => src.split(needle).length - 1;

// ── Practice feedback banner ────────────────────────────────────────────────

test('the wrong-answer banner never says the answer is marked with a tick', () => {
  const src = read('src/components/Question.jsx');
  const start = src.indexOf('function InstantFeedback(');
  assert.ok(start > 0, 'InstantFeedback must still exist');
  const body = src.slice(start, start + src.slice(start).search(/\r?\n\}\r?\n/));

  // A true/false statement that is false shows its เฉลย as "✗ False", so a
  // banner promising a ✓ mark sat directly above an ✗. It also read "ถูกถูก".
  assert.ok(!body.includes('ทำเครื่องหมาย ✓'), 'the banner still points at a ✓ that a False answer does not have');
  assert.ok(!body.includes('ถูกถูก'));
  assert.ok(body.includes("'✗ ยังไม่ใช่ ดูเฉลยด้านล่าง'"), 'the wrong branch points at the เฉลย row instead');
  assert.ok(body.includes("'✓ คุณตอบถูก'"), 'the right branch is pinned by e2e and stays');

  // "ด้านล่าง" is only true while every caller hands over a correct answer and
  // the row renders on a miss. Both callers do; the true/false one says ✗ False.
  assert.match(body, /\(alwaysShowCorrect \|\| !ok\) && correctNode != null/);
  const callers = src.split('<InstantFeedback').slice(1).map((s) => s.slice(0, s.indexOf('/>')));
  assert.equal(callers.length, 2, 'MCQ and true/false are the two callers');
  for (const caller of callers) assert.match(caller, /correctNode=\{/);
  assert.ok(callers[1].includes("correctIsTrue ? '✓ True' : '✗ False'"));
});

// ── Home ────────────────────────────────────────────────────────────────────

test('the home practice cards describe their sets in words, not a semester id', () => {
  const home = read('src/views/HomeView.jsx');
  assert.ok(!home.includes('ตรง {SEMESTER.id}'), 'the card printed "ตรง 2569-1"');
  assert.ok(home.includes('{scopeLabel} {currentScopeCount} ข้อ, เฉลยตรวจแล้ว ตรงกับสไลด์เทอมนี้'));
  assert.ok(!home.includes('หลักฐานสูง แต่ไม่ใช่ข้อสอบยืนยัน'));
  assert.ok(home.includes('{scopeLabel} {highPredictionCount} ข้อ, มีหลักฐานหลายทาง แต่ยังเป็นการคาดเดา'));
});

test('the streak-freeze notice says a day was skipped and the run still counts', () => {
  const home = read('src/views/HomeView.jsx');
  assert.ok(!home.includes('ระบบรักษาสถิติการเรียนต่อเนื่อง'), 'the old line never said what happened');
  assert.ok(home.includes('เว้นไป 1 วัน แต่ยังนับต่อเนื่องให้ {freezeNotice.streak} วัน'));

  // The notice fires on exactly this event: one skipped day on a run of 5+.
  const DAY = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const saved = updateStreak(today.getTime() - 2 * DAY, 6, null);
  assert.equal(saved.freezeJustUsed, true);
  assert.equal(saved.streak, 7);
  // The freeze re-arms once a run breaks, so the copy may not promise it is
  // a one-time save.
  const broken = updateStreak(today.getTime() - 4 * DAY, 9, today.getTime() - 10 * DAY);
  assert.equal(broken.freezeUsedAt, null);
  const notice = home.slice(home.indexOf('{freezeNotice && ('), home.indexOf('{quickStats.streak > 0 && ('));
  assert.ok(!notice.includes('ครั้งเดียว'));
});

test('the daily-question row calls itself ข้อวันนี้ throughout', () => {
  const home = read('src/views/HomeView.jsx');
  const row = home.slice(home.indexOf('function DailyQRow('));
  assert.ok(row.includes('ข้อวันนี้{status.completed'), 'the button label is the name');
  assert.ok(!row.includes('daily streak'), 'the counter beside it was English');
  assert.ok(row.includes('ตอบข้อวันนี้ติดกัน {streak} วัน'));
  // Kept apart from the study-streak card, which counts something else.
  assert.ok(!row.includes('วันต่อเนื่อง'));
  assert.ok(!row.includes('ตอบถูกใน Daily Q'), 'the class-pulse tooltip used a second name');
  assert.ok(row.includes('`${pulse.correct}/${pulse.total} ตอบถูกในข้อวันนี้`'));
});

// ── Spaced repetition ───────────────────────────────────────────────────────

test('the spaced-repetition start and finish screens label their numbers in Thai', () => {
  const s = read('src/views/SRSessionView.jsx');
  for (const en of ['>Total cards<', '>Total Cards<', '>Mastered<', "'Due tomorrow'", '>Due tomorrow<', '>Cards Reviewed<', 'next: {', 'SR pool', 'choice/lefts']) {
    assert.ok(!s.includes(en), `${en} is still on the review screen`);
  }
  assert.equal(count(s, '<div className="vmx-stat-lbl">การ์ดทั้งหมด</div>'), 2);
  assert.equal(count(s, '<div className="vmx-stat-lbl">จำได้แล้ว</div>'), 2);
  assert.ok(s.includes('<div className="vmx-stat-lbl">ถึงรอบพรุ่งนี้</div>'));
  assert.ok(s.includes("{remaining > 0 ? 'ค้างอีก' : 'ถึงรอบพรุ่งนี้'}"));
  assert.ok(s.includes('<div className="vmx-score-label">ทบทวนไปแล้ว</div>'));
  assert.ok(s.includes('ในรอบทบทวนมี <strong>{eligibleCount}</strong> ข้อ ไม่รวม <strong>{excludedCount}</strong> ข้อ'));
  // The date beside a card is the day it came due, which is today or earlier
  // for every card in a round; "รอบถัดไป 3 วันที่แล้ว" would contradict itself.
  assert.equal(count(s, 'ถึงรอบ {fmtDate(currentCard.nextReview)}'), 3);
  // Pinned by mochi-presence and motion-integration.
  assert.ok(s.includes("'เริ่ม Session →'"));
  assert.ok(s.includes('แสดงคำตอบ (Space)'));
});

test('the exclusion note on the review screen names every kind of question it leaves out', () => {
  // excludedCount is every question isFlashcardCompatible turns away, and that
  // includes written answers, which have no options at all. A note saying all
  // of them "need their options on screen" was false for those.
  assert.equal(isFlashcardCompatible({ type: 'short', q: 'อธิบายกลไก' }), false);
  assert.equal(isFlashcardCompatible({ type: 'essay', q: 'อธิบายกลไก' }), false);
  assert.equal(isFlashcardCompatible({ type: 'match' }), false);
  assert.equal(isFlashcardCompatible({ type: 'mcq', q: 'ข้อใดถูกต้อง' }), false);
  const s = read('src/views/SRSessionView.jsx');
  const start = s.indexOf('{excludedCount > 0 && (');
  const note = s.slice(start, s.indexOf(')}', start));
  assert.ok(note.includes('ไม่รวม <strong>{excludedCount}</strong> ข้อที่ทบทวนแบบการ์ดไม่ได้'),
    'the count is introduced by what all of its questions share');
  assert.ok(note.includes('ข้อเขียน'), 'written questions are part of the count and must be named');
  assert.ok(note.includes('ข้อจับคู่'));
});

// ── Screen-reader labels ────────────────────────────────────────────────────

test('screen readers hear Thai names on the glossary close button, charts, dialogs and fields', () => {
  const cases = [
    ['src/components/TermPopup.jsx', 'aria-label="Close"', 'aria-label="ปิด"'],
    ['src/views/DashboardView.jsx', 'aria-label="Learning curve per subject"', 'aria-label="กราฟความแม่นยำรายวิชา"'],
    ['src/views/DashboardView.jsx', 'aria-label="7-day study trend"', 'aria-label="กราฟการฝึก 7 วันล่าสุด"'],
    ['src/components/VoiceSettings.jsx', 'aria-label="Voice settings"', 'aria-label="ตั้งค่าเสียงอ่าน"'],
    ['src/components/OfflineGame.jsx', 'aria-label="Mini-game canvas"', 'aria-label="พื้นที่เล่นมินิเกม"'],
    ['src/components/VetCalculator.jsx', 'aria-label="Search drugs"', 'aria-label="ค้นหายา"'],
  ];
  for (const [file, before, after] of cases) {
    const src = read(file);
    assert.ok(!src.includes(before), `${file} still has ${before}`);
    assert.ok(src.includes(after), `${file} must carry ${after}`);
  }
});
