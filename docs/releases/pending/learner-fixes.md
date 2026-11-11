# Pending: practice and exam flow fixes (learner hunt, 11 Nov 2026)

## State at push
- Every item is committed on its own (items 2, 5 and 10 have a follow-up commit each; item 11 is its own commit), merged with origin/main at 99cefe68 (after 5.213.1: main's two chip keys, `focusPassage` and `SmartPassage` kept exactly as main has them).
- Checked locally before the push: the unit tests that read a changed file (see Runs). The before-reproductions below were measured on main's production build.
- Not run locally, by the wave's plan: the e2e specs. CI runs them on four engines. Specs added or changed: `tests/e2e/learner-flow.spec.js` (new), `tests/e2e/study-reminder.spec.js`, `tests/e2e/motion-integration.spec.js`.
- Unproven until CI and the after-probes: every "After" below that names e2e; the double-tap counts on the branch against main; the results page's first-viewport share after the change and whether the mascot keeps the first action above 812 px (the e2e asserts it; if it fails, the mascot goes); the item 8 storage timing on WebKit.

```js
// changelog lines (kind, scope, title, desc)
{ kind: 'fix', scope: 'system', title: 'ข้อเติมคำบอกเฉลยในโหมดฝึก', desc: 'เติมครบทุกช่องแล้วกดตรวจคำตอบ จะเห็นว่าถูกหรือยัง คำที่ถูกของแต่ละช่อง และเหตุผล ส่วนโหมดสอบยังไม่แสดงอะไรจนกว่าจะส่ง' },
{ kind: 'fix', scope: 'system', title: 'แตะสองครั้งไม่ข้ามข้อ', desc: 'แตะข้อถัดไปเร็วสองครั้ง กดปุ่มลัดซ้ำ หรือปัดซ้ำ จะไปทีละข้อเสมอ ไม่ข้ามข้อที่ยังไม่ได้เห็น' },
{ kind: 'fix', scope: 'system', title: 'ออกจากชุดถามแบบเดียวกันทุกทาง', desc: 'กดออกหรือกดย้อนกลับของเบราว์เซอร์ จะเห็นคำถามเดียวกัน ชุดถูกเก็บไว้ที่หน้าแรกให้ทำต่อได้ภายใน 6 ชั่วโมง' },
{ kind: 'fix', scope: 'system', title: 'หน้าผลลัพธ์เห็นคะแนนและขั้นต่อไปทันที', desc: 'คะแนนกับสิ่งที่ควรทำต่ออยู่ในจอแรก เกณฑ์ 60% บอกครั้งเดียว และการตั้งเตือนเหลือแถวเดียว กดเลือกเวลาเมื่อต้องการ' },
{ kind: 'fix', scope: 'system', title: 'ข้อจับคู่บอกวิธีตอบตรงกับหน้าจอ', desc: 'โจทย์จับคู่ไม่บอกให้ลากการ์ดแล้ว เพราะทุกหน้าจอเลือกคำตอบจากเมนูของแต่ละข้อ' },
{ kind: 'fix', scope: 'system', title: 'จอแคบและซูมใหญ่ใช้ได้', desc: 'ขยายตัวอักษร 200% บนมือถือ ปุ่มบนการ์ดข้อสอบไม่ล้นจอ และสวิตช์เวลาเฉลยของข้อจับคู่ไม่บีบจนอ่านยาก' },
{ kind: 'fix', scope: 'system', title: 'เวลาสอบไม่เพิ่มเมื่อเปลี่ยนนาฬิกาเครื่อง', desc: 'ตั้งเวลาเครื่องย้อนหลังระหว่างสอบไม่ได้เวลาเพิ่ม และคำตอบในโหมดสอบถูกบันทึกทันทีที่แตะ' },
{ kind: 'fix', scope: 'system', title: 'พิมพ์คำตอบภาษาไทยที่หน้าตาเหมือนเฉลยได้คะแนน', desc: 'สระอำที่พิมพ์เป็นนิคหิตกับสระอา และวรรณยุกต์ที่พิมพ์ก่อนสระบนหรือล่าง นับเป็นคำเดียวกับเฉลยแล้ว ทั้งข้อเติมคำและข้อตอบสั้น' },
{ kind: 'fix', scope: 'system', title: 'วันนี้เริ่มเที่ยงคืนเวลาไทยทุกที่', desc: 'โจทย์ประจำวัน XP วันนี้ ภารกิจ และเป้าหมายรายวัน นับวันเดียวกับวันต่อเนื่อง แม้เครื่องตั้งเขตเวลาอื่น' },
```

Each item below: the reproduction on the main build (production build of `ef993a0e`, served at 127.0.0.1:4331) before, the same reproduction after, and the guard that keeps the class of bug out. Probe scripts are outside the repository (the session scratchpad, `learner-fixes/`).

## 1. Fill-in items gave no feedback in practice
- Before: aquatic-clinic 202455 in a practice set, four blanks typed (one wrong): no verdict, no key, no explanation, no check control; the timed paper the same (`fill-before.out`).
- Fix (`src/components/Question.jsx`): in practice a ตรวจคำตอบ button, enabled once every blank holds text (Enter in a blank does the same). It shows the verdict, the right blanks, the explanation, the figure and the answer slide, opens the source line and the conflict note (`keyShown`), and locks the blanks for the rest of the page load (`FILL_CHECKED`), as a matching row locks. A timed paper (`revealAnswer` false) gets no button and nothing.
- After: verdict "ยังไม่ใช่", the four blanks listed, เหตุผล shown, blanks read-only; in a timed paper no button and no panel.
- Guard: `tests/unit/reveal-every-type.test.mjs` walks every type the bank holds (mcq, tf, fill, match, short, essay) through the real card: answered and every reveal control pressed, practice must show a key and open the source chip, a timed paper must show none and offer no control. A type the bank gains with no entry fails. Against the old card it fails on fill (`surg2#3: answered in practice (pressed: nothing) and no key on screen`). `source-line-no-spoiler` and `thai-copy-labels` pins follow the third caller. e2e: `learner-flow.spec.js` (item 1 block).

## 2. A double tap on ข้อถัดไป skipped a question
- Before: in a 14-question timed paper, 6 double clicks on ข้อถัดไป moved 1, 1, 2, 1, 2, 1 questions; the next key pressed twice moved 2 (`dbl-before.out`). The hunt saw 1 to 3 twice.
- Fix (`src/hooks/useExamSession.js`): the session's navigation holds a move from the tap until the frame after the one that paints the new question; `nextQ`, `prevQ` and `jumpToQ` refuse a move while it is held, so the button, the keyboard, the swipe and the map are covered. Held only for a move that changes the question; the time-out advance does not take it.
- After: unproven until CI; the spec records every step (four double clicks on next, the next key twice three times, next and a map cell in one task twice, two double clicks on previous) and requires each to be one question. The same spec is to be run against main's build in the after-probe job, where it must fail.
- Guard: `learner-flow.spec.js` double-clicks next and previous and presses the next key twice.

## 3. Two exit dialogs for one action
- Before: X: "ออกจากชุดนี้? ความคืบหน้า 1 จาก 14 ข้อ จะถูกเก็บไว้ที่หน้าแรก ... ภายใน 6 ชั่วโมง ... เก็บไว้แล้วออก / ทำต่อ"; Back: "ออกจากชุดนี้? ความคืบหน้าจะถูกเก็บไว้ให้กลับมาทำต่อได้ ออกจากชุด / ยกเลิก".
- Fix: `src/lib/exit-set.js` is the one dialog; ExamView's X and App's Back guard both spread it. Leaving still parks the set as before.
- Guard: `tests/unit/exit-set-one-dialog.test.mjs` (both callers, no literal exit dialog in either file); e2e opens both and compares the text.

## 4. Results card: flag on the score line, stray space
- Before: the "เกณฑ์ 60%" flag overlapped the "n / m ถูก" line by 5 px (375 and 320, light and dark); the time chip read "เวลารวม 1:18 , เฉลี่ย 26 วิ/ข้อ" (`results-before.out`).
- Fix: the flag hangs from the bar (`bottom: calc(100% + 2px)`) with 36 px reserved above the bar; the time is one text run.
- Guard: e2e measures flag to line in light and dark and reads the chip as one phrase.

## 5. A matching stem says drag, the card shows menus
- Finding: the sentence is in the bank's text, not the component; the card draws one menu per row on every width and its own hint already says เลือกคำตอบ จากเมนูตัวเลือก. 26 matching stems carry it: aquatic-clinic 202471; avian-medicine 206144, 206145, 206151, 206155; equine-medicine 202394; milk-meat-hygiene 203001-203007, 207133, 207134, 207148-207150, 207204-207206, 207262-207265; vet-pharm-2 53001.
- Fix (owner decision, 11 Nov): the stored stems stay (an edit renames the read-aloud clip and drops the answer slide); the card drops the exact clause when it draws a matching stem (`src/lib/match-stem.js` `displayStem`, used by `Question.jsx` for the heading only). "(ลากการ์ดขวาไปวาง)" goes; "(ลากการ์ดขวาไปวาง มีตัวลวง 2 ตัว)" and "(ลากการ์ดขวาไปวาง — มีตัวลวง 2 ตัว)" show as "(มีตัวลวง 2 ตัว)". The voice and the evidence hash still read the whole stored stem (`wholeStem`), and no phrase is highlighted in a shortened stem. The clause has only these three forms, so the removal is exact; Review and the SR card still print the stored stem.
- Guard: `tests/unit/match-stem-instruction.test.mjs`: over all 26, the displayed stem no longer mentions dragging, keeps its distractor note and loses nothing else, and `wholeStem` is the stored stem; other types and other wordings are untouched; the list may only shrink, a new stem that says drag fails, and the test fails if the card can drag again.

## 6. The reveal switch wrapped into a blob on a phone
- Fix: the switch's labels keep one line and it takes its own line when it does not fit beside the hint; under 300 px the labels may wrap rather than overflow.
- Guard: e2e opens 202471 at 375 px and holds the switch to one row (< 56 px).

## 7. Below 250 CSS px the card ran off the screen
- Before at 188 px: tools from x = -77, the pill over ออก, ข้อถัดไป to x = 192 (`dbl-before.out`, `narrow-188-before.png`).
- Fix: under 280 px the tools wrap in the card's flow, the header puts ออก and the position side by side with the rest below, and previous and next take a row each. 280 px and up unchanged.
- Guard: e2e at 188 px on four engines: every tool, the pill and both buttons inside the screen, no sideways scroll.

## 8. An answer lost in a hard kill (suspected: confirmed)
- Before: answer, next, answer at a student's pace in a timed paper, storage read from a second tab at the moment of a kill: the second answer was missing 50, 200 and 400 ms after the tap and present at 800 and 1,500 ms (`kill-before.out`): the 500 ms trailing write inside the 3 s throttle.
- Fix (`src/App.jsx`): in a timed exam each tap is written just after its paint; typed answers (short, essay, fill) keep the throttle; practice unchanged.
- Cost (CPU 4x, 390x844, main build): one write of a 50-question paper 95 KB, median 6.7 ms, max 16 ms; 100 questions 194 KB, median 15.7 ms, max 46.5 ms. It runs after the tap has painted, never inside it.
- Guard: e2e answers two questions in a row and reads storage two frames later.

## 9. The exam clock and the device clock (lead: confirmed)
- Before: a timed paper with 100 s left showed 3,697 s after the page's wall clock was set back an hour; the deadline watch would not fire for an hour. A time zone change does nothing (Date.now() is an instant). A wrong device date and the streak: a clock a day ahead adds a day and the run resets to 1 when the clock comes back (`updateStreak` in `hooks/utils.js`, diff -1 falls to the reset); two days ahead spends the freeze; a day back on a day already counted resets to 1. Reported, not changed.
- Fix (`src/lib/exam-clock.js`): the exam's time advances by whichever of the wall clock and `performance.now()` moved further, step by step, never backwards. A clock set back adds nothing; a sleep that stops the monotonic clock still counts (the existing "resumed timer expires after a suspended interval" spec holds); a clock set forward counts too, as it cannot be told from a sleep. The session, the on-screen clock and the deadline watch read it. A saved record keeps a wall-clock deadline beside `savedAt` (`deadlineOnWall`), so the stored format and `resumedDeadline` are unchanged and old parked sets resume as before. Scoring untouched.
- What a student who moves the device clock during a timed paper now gets:

  | During the paper | Before | Now |
  |---|---|---|
  | Clock set back an hour | an hour more on the countdown, no auto-submit for an hour | nothing: the countdown keeps its own time and submits on time |
  | Clock set forward an hour | an hour less: the paper submits at once | the same: a forward jump cannot be told from the phone sleeping, so it counts |
  | Time zone changed | nothing | nothing |
  | Phone locked or asleep | the time runs on | the time runs on |
  | Set parked, clock changed, set resumed | the time left when parked | the time left when parked |

- Known limit, not changed (owner decision): the streak takes the device's date. A date one day ahead adds a day, and the run resets to 1 when the clock comes back (`updateStreak` in `src/hooks/utils.js`: a negative day difference falls to the reset); two days ahead with a run of 5 or more spends the freeze; a day back on a day already counted resets to 1; a synced copy with a future `lastDate` wins (`mergeStreak`). Fixing it takes a trusted date: the day written by the server (a `now()` on the sync RPC, or a Date header from `/api` read once per session and kept as an offset), with the streak computed from that offset and a guard that refuses a `lastDate` later than the server day.

- Guard: `tests/unit/exam-clock-device-time.test.mjs` (clock back, back across expiry, sleep, zone change, monotone, park and resume after a clock change, and the call sites); `exam-clock.test.mjs` now owns `performance.now` too; e2e sets a page's clock back an hour mid-paper.

## 10. "Today" (lead: confirmed, routed through one function)
- Bangkok day already: the streak (`updateStreak`, `streakShown`), Home's วันนี้ count, the week strip, Profile's today, SR due tomorrow, the timetable. Device day: the daily question (pick, tick, its own streak, the 7-day share grid), quests, the XP chip's วันนี้, the daily goal card; also the heatmap, the Dashboard 7- and 14-day charts, badges, Pomodoro and first-tip. On a UTC phone between 00:00 and 07:00 Bangkok the streak and Home had moved to the new day while the daily question, quests and XP had not. There is no 28-day student figure (the only 28 is the timetable's paper grouping, Bangkok already).
- Fix: `src/lib/study-day.js` (`dayKey`, `dayKeyBefore`, `dayKeyStart`) serves the daily question, its history, quests, XP, the daily goal card and the badges' longest day run (a one-line swap, in memory only), and `study-record.js` re-exports its `dayKey`. Keys keep their YYYY-MM-DD shape. Left on the device day, because each is more than a one-line change: the 53-week heatmap (weeks aligned to the device's Sunday), the Dashboard 7- and 14-day charts (their day labels are printed in the device's zone, so a Bangkok start would be labelled the day before on a UTC phone), Pomodoro (two helpers that must move together, and its stored sessions), first-tip (a once-a-day hint), and the hour-of-day badges.
- Guard: `tests/unit/one-study-day.test.mjs` checks the five at both midnights under UTC, Bangkok and Los Angeles against the streak's day, and fails if one of those files computes a device day again.

## 11. Results page: score and next step first
- Before at 375x812 (practice set, first set of the day): 41.3% of the first viewport non-content (year pill 31 px, mascot 84, verdict stamp 48, time chip 33, streak card 77, reminder offer 62 of its 432); 60% printed three times on the card; the first action at y = 1,741 (more than two screens down). 320x812: 38.0%, first action at 1,908.
- Fix (`ResultsView.jsx`, `ReminderPicker.jsx`): no year pill; the practice mark stated once (the flag on the bar; the seal says reached or not, the legend keeps 0% and 100%, the ladder note names no number); the first thing to do (redo the misses, the climb, or more of the same) drawn right under the score, the rest of the panel where it was; the reminder is one row (เลือกเวลา opens the picker, ไม่ต้อง ends it for good, as any answer did). The mascot stays: with it the score and the first action fit 812 px at 375 and 320. No number, scoring, saved result or review target changed.
- After: to be measured on the branch build in the after-probe job (same script, `results-share.mjs`).
- Guard: e2e at 375x812 and 320x812 on four engines: the score and the first action inside the first viewport, 60% once on the card; `study-reminder.spec.js` holds the offer to one row until asked.

## 12. A typed Thai look-alike of the key was marked wrong (from the scoring-invariants work)
- Before: a fill key น้ำ typed as น + ้ + ํ + า (SARA AM as NIKHAHIT plus SARA AA), or กิ่ง typed with MAI EK before SARA I, scored ผิด: NFC joins neither (`thai-spelling-scoring.test.mjs` keeps the old scorer beside the new one and shows the first case wrong on it).
- Fix (`src/hooks/utils.js`, the one module `isCorrect` lives in, which `api/_lib/exam-scoring.js` imports for the leaderboard's re-score): one step, `thaiSpelling`, in `normFill` (fill-in blanks) and `keywordText` (short-answer keywords and SmartGrader's checklist), applied to the answer and the key alike: NIKHAHIT + SARA AA (with a tone mark before, between or after the NIKHAHIT) becomes SARA AM, and a tone mark or thanthakhat before a vowel above or below its consonant moves after it. Nothing else in the comparison changed.
- Proof it only adds matches: all 418 typed questions in the bank (29 fill, 389 short), answered with their own key, their unordered blanks reversed, the model answer and the keywords: the same verdict from the scorer with and without the step, 0 changed; every fill key retyped in the other spelling scores as its key does. Latin drug names and numbers: unchanged verdicts.
- Reach: 266 typed questions have SARA AM in their key, 339 a tone or thanthakhat on a vowel above or below (counted by the test).
- Other places that compare typed text, not changed: the search palette (`CommandPalette.jsx`, its own lowercase match), the faculty search (`FacultyView.jsx`, `toLowerCase().includes`, and `instructor-lookup.js` with NFKC), the library and in-document search (`lib/thai-search.js` `fold`, which can drop marks), and the SR flashcards (self-graded, no typed comparison). Note for the fold: `claude/structural-guards` lists both cases in `KNOWN_FAILURES` of `scoring-invariants.test.mjs`, whose rows fail once fixed ("fixed? then delete its KNOWN_FAILURES row"): delete those two rows when the branches meet.
- Guard: `tests/unit/thai-spelling-scoring.test.mjs`.

## Runs
- Local, no lock (the lane was held): the 133 unit files that read a changed file, 1,163 tests; 7 failed at first, all in harnesses that build the session hook or count the card's panels (two vm harnesses lacked `examNow`, one placed its student with a jump that the move hold now holds, one counted two figure panels where fill-in makes three); fixed in the tests, then 0 failed. The full unit suite, `lint:data`, the build, `perf:budget` and `lint:dist` run in the cloud Build job.
- e2e: CI, four engines (not run locally).
- After-probes (one browser job after the push): to follow.
