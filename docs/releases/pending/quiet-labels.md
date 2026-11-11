```js
{ kind: 'fix', scope: 'system', title: 'หน้าโจทย์เงียบลง เห็นโจทย์เร็วขึ้น', desc: 'ก่อนตอบไม่มีป้ายที่มาหรือป้ายเตือนมาบังแล้ว แถบบนการ์ดเหลือแถวเดียว ป้าย "ข้อควรระวัง" ขึ้นพร้อมเฉลยเฉพาะข้อที่เฉลยยังเถียงกันอยู่ ถ้าตอบถูก ส่วน "ทำไมข้ออื่นผิด" จะพับไว้ แตะเปิดได้' },
```

# Quiet labels (pending, branch `claude/quiet-labels`)

Palm, 11 Nov 2026: "เรื่องพวกป้ายย้อนแย้ง อย่าให้มันเยอะไปจนน่ารำคาญนะครับ จุดอื่นๆด้วย ดูดีๆ".
The rule: a label earns a place on the card only when it changes what the student should do with
the answer. Everything else is a row of the source panel ("ดูเต็ม"), which opens after the answer.
The notices audit of the same day (items 7, 8 and 13) and the second review of pull request 208
added the header row, the source line before the answer, the caution chip's timing and the fold.

## Counts (the 8,836 questions a student can meet)

| Label | Before | After |
|---|---|---|
| Source row before the answer ("ที่มา ... ดูเต็มหลังเฉลย", disabled) | 8,836 | 0 |
| Source-scope note standing under the source line (all Year 5), before the answer too | 188 | 0 |
| Tag "(รุ่นนี้อยู่ปลายภาค)" / "(รุ่นนี้อยู่กลางภาค)" in the line, after the answer | 0 | 186 |
| Source-scope sentence in the opened panel only (the line names no paper) | 0 | 2 |
| Flag chip that belongs to its question | 23 questions, before and after the answer, timed papers included ("ข้อมูลขัดแย้ง, MAJOR" 8, "..., MINOR" 15) | 8, with the key only ("ข้อควรระวัง") |
| Stale flag chip left from an earlier question (live bug, fixed separately in pull request 208) | every question after a flagged one in the same set, one more per flagged question passed (6 on one card in a resumed set); not a fixed count, it depends on the set | 0 (that fix; `tests/e2e/quiet-labels.spec.js` checks the card after a flagged one) |
| Minor flag note as "หมายเหตุ" in the panel | 0 (it was there, plus the chip) | 15 |
| Cards with both the chip and the tag | n/a | 0 |
| "ทำไมข้ออื่นผิด" open after a correct answer | 2,388 | 88 (heading with words of its own, or the section opens the explanation); 2,300 fold |

Two effects made the chip look as if it were everywhere. The chip and the source line were sibling
children of one pane under the same key, so on the next question React kept the old chip's node: a
chip that was not the card's own, that opened nothing, and one more for each flagged question
passed. That is the stale-chip fix (keys `flag:` and `source:`, guard
`tests/unit/jsx-sibling-keys.test.mjs`), shipped on its own. This change is the other effect: of
the 23 chips that did belong to their questions, 15 were minor notes that change nothing a student
does with the answer, and all 23 showed before there was an answer to be careful with.

The 8 majors include `epidemiology:213524`, merged from `claude/bank-notes`.

## Header (one row), measured

24 fixed Year-5 MCQs a student meets (no passage, every 300th by subject and id; list in the
scratchpad `picks24.json`), first viewport, Chromium, stem top in CSS px:

| Viewport | Main (median, min to max) | Branch | Higher by |
|---|---|---|---|
| 375x812 | 234 (208 to 273) | 179 (179 to 179) | 55 |
| 320x700 | 257 (231 to 276) | 209 (206 to 209) | 48 |
| 187x406 (375 at 200% zoom) | 322 (273 to 390) | 301 (298 to 301) | 21 |

No overlap between any two header parts at any size; every control 44px; no horizontal scroll.
The 100px target is not reachable inside the card: the card starts at y 110 (the exam header and
progress bar above it are ExamView's), and one 44px row with 12px above and below puts the stem at
179. The remaining 45px are above the card: the 28px gap between the progress bar and the card, and
the 44px exam-header row. At 375px the meta line has about 66px and shows only "ปรนัย…"; its full
words are in the tree, in the title, and unfold on a tap. At 200% zoom the exam header itself (exit,
counter and timer) overlaps, as before this change (the other lane's item); the card header wraps
its controls onto three rows and does not overlap.

What the remaining 45px would take, in `src/views/ExamView.jsx` and its styles (another lane's
files, left as they are): close the 28px between the progress bar and the card to about 12px
(about 16px), and fold the progress bar into the bottom edge of the exam-header row instead of a
row of its own (about 18px with its margin); the exit, counter and timer stay where they are.

## The rules and their tests

1. **Nothing of the source before the answer.** `QSourceChip.jsx` returns null until the key is on
   screen; it arrives below the answer area. Tests: `source-line-no-spoiler.test.mjs` "before the
   answer the source chip renders nothing at all" (whole bank) and "the source line arrives with the
   key"; `tests/e2e/source-line-spoiler.spec.js` (no source in the accessibility tree before the
   answer; the stem and the options do not move when it arrives; it sits below the options).
2. **The source-scope note never stands on the card.** After the answer the line gets a tag only
   where its own text names the other paper: `originPaperTag(question, line)` in
   `src/lib/exam-scope.js`, on the exported `paperNamedIn(text)`. The line then wraps rather than
   cutting off the paper's name the tag corrects. The sentence is the panel's "หมายเหตุ" row. Tests:
   "the source-scope note never stands on the card", "the paper tag shows after the answer, and only
   where the line itself names the other paper" (real bank); `exam-scope.test.mjs` "the line tag
   names this year's paper".
3. **The chip is for a disputed answer only, with the key only.** `cautionChipShown(flag)`
   (`src/lib/source-line.js`) is true for `severity: 'major'` alone. `FlagChip` renders nothing
   before the key, and sits in the verdict panel under the key (so its arrival moves no option),
   with 10px of air, a 44px target, "ข้อควรระวัง", and its sources as "แหล่งที่มา" in the card's
   14px text. A minor note is the panel's "หมายเหตุ" row; a major note is not repeated there.
   Delivery unchanged. Tests: "the caution chip never shows before the key, in practice or
   mid-exam, and opens with it" (every major, practice and exam, answered and not), "the caution
   chip is for a disputed key only"; e2e `quiet-labels.spec.js`.
4. **One caution per card.** With the chip, the tag stays in the panel. Test: "one caution per card".
5. **Header on one row.** `.vmx-q-head` (Question.jsx, styles.css): the meta line truncates at the
   left, the controls stay right; wrap-reverse puts the line under them when both do not fit.
   Tests: `style-metrics-floors.test.mjs` UI-07 and UI-18 (the line is one ellipsised line; the
   controls are still circles); measurements above.
6. **"ทำไมข้ออื่นผิด" folds after a correct answer.** `src/lib/explain-fold.js` cuts the explanation
   where it already breaks (paragraphs); a native `details` row, closed, holds that one paragraph.
   A miss or a reveal without an answer keeps it open. Read-aloud, the coach and the export read the
   field and are unchanged. Test: `tests/unit/explain-fold.test.mjs` over the real bank (the parts
   joined are the text; the verdict, the key and the opening paragraph are never inside the fold;
   a miss shows the section open).
7. **epidemiology:213524** note shortened to two sentences, both facts kept, key unchanged.
8. **Flag notes reworded** where they were plainly internal text (list below).
9. **The panel names topics, not tag slugs.** `tagTopicLabels` (`src/lib/source-line.js`): a tag
   that is a topic id shows as the topic's label under "หัวข้อ"; slugs are dropped, and the row with
   them. Test: "the panel names topics by their labels and prints no working slug" (real bank).
10. **Review follows the same rule.** `ReviewView.jsx`: a major flag is the caution ("ข้อควรระวัง"),
    a minor one a quiet "หมายเหตุ" line, both 14px with sources as "แหล่งที่มา". Test: "Review applies
    the same rule".
11. **Merged main (5.213.1).** Its keys (`flag:`, `source:`), `data-flag-chip` (now on the chip's
    button, valued by severity), `focusPassage` and SmartPassage's open-during-render are kept.
    `flag-chip-own-question.spec.js` walks the whole topic under this branch's rule: no chip before
    the key on any question, and with the key a chip exactly on the majors.
    `passage-opens-with-the-tap.test.mjs` now checks behaviour (SmartPassage mounted with effects
    off, closed, a new `openSignal` must bring the table back in that render; it fails on an
    effect-based open) and keeps the check that no effect depends on `openSignal`.

## The 23 flag notes

Changed (wording only, never the claim):

| Question | Was | Now |
|---|---|---|
| com5:532 (major), com5:568 | "ข้อสอบข้อสอบเก่าบางฉบับ..." | "ข้อสอบเก่าบางฉบับ..." (doubled word) |
| livestock-pathology:8235 (major) | "Vet 81 group ตอบ D (Liver failure) แต่ commentary พี่ปอ + textbook ตอบ E (...)" | "Vet 81 ตอบ Liver failure แต่คำอธิบายของรุ่นพี่และตำราตอบ ผิดทุกข้อ เพราะ liver failure ก็ทำให้เกิด PU/PD ได้" (option letters are wrong on a shuffled card) |
| livestock-pathology:8254 | "Vet 81 ตอบ Prototheca, commentary พี่ปอ ชี้ Pythium — morphology ..." | "Vet 81 ตอบ Prototheca แต่คำอธิบายของรุ่นพี่ชี้ไปที่ Pythium ลักษณะที่กลมและมีแคปซูลเข้ากับ Prototheca มากกว่า" |
| livestock-pathology:8214 | "... แต่ Vet 81 key ตอบ B" | "... แต่เฉลยของ Vet 81 ตอบ" + the option's text |
| com1:90011 | "TJ key marks Expiratory dyspnea; classic teaching = extrathoracic→inspiratory; ..." | Thai, same claims |
| com1:90025 | "Original Q stem subtle: hypokalemia is common ... per TJ key" | Thai, same claims |
| comp-repro-clinic:8410 | "Vet 81 answer 8-12 hr; current AAHA 2020 guideline = 6-8 hr" | "เฉลยของ Vet 81 คือ 8-12 ชั่วโมง แนวทาง AAHA 2020 ปัจจุบันให้ 6-8 ชั่วโมง" |
| comp-repro-clinic:8442 | "Vet 81 answer: ovarian US — but current consensus = serum progesterone. Updated answer ..." | Thai, same claims |
| comp-repro-clinic:8447 | "Past paper key marks 2 answers (...). Single best answer = dystocia (...)" | Thai, same claims |
| vca:8001 | "Vet 83 noted "All are incorrect" suggesting Q ambiguous — answer = pair containing PCV-2" | "Vet 83 บันทึกว่าผิดทุกข้อ แปลว่าโจทย์อาจกำกวม ข้อนี้ใช้คู่ที่มี PCV-2 เป็นคำตอบ" |
| vca:8005 | "multiple options arguably PM changes; (D) selected per Vet 83 key" | "หลายตัวเลือกอาจนับเป็นการเปลี่ยนแปลงหลังตายได้ ข้อนี้ใช้ Putrefaction, algor mortis (decomposed) ตามเฉลยของ Vet 83" |
| epidemiology:213524 (major) | three clauses | "ตารางเปรียบเทียบในสไลด์จัดการวัดความชุก ณ จุดเวลาเดียวให้ cross-sectional study เฉลยในคลังคือ cohort study ซึ่งยังไม่ได้ยืนยันกับผู้สอน" |

Left as written (readable Thai already): com5:592 (major), milk-meat-hygiene:104776 and 105751
(major), swine-clinic:8023 and 8042 (major), avian-medicine:105871 and 109012, swine-clinic:105591
and 8020, com5:614.

Needs a person with the course content (not changed):
- **comp-repro-clinic:8410** (a bank doubt for the owner, not wording): "ก่อนผ่าตัดทำหมันสุนัข/แมว ควร
  อดอาหาร (NPO) นานเท่าใด". The note says the current guideline (AAHA 2020) is 6-8 hours, but the key
  is "8–12 ชั่วโมง" and no option says 6-8. Either the key or the options are out of date.
- **com5:614**: opens with the file label "COM V FINAL 86 (ข้อสอบเก่า)"; a plainer opening would be
  "ข้อสอบเก่าบางฉบับ", but which paper it was is evidence, so it stays.
- **livestock-pathology:8214 and 8254**: they say which side a senior's commentary takes; whether the
  key should follow it is a content call.

## Seen on the card, not in this change

- 74 cards' before-answer source line used to name the other paper ("ข้อสอบเก่า Vet 85 กลางภาค" on a
  final question); with no source row before the answer that is gone too.
- The opened panel's "แท็ก" row printed internal slugs, and Review printed every flag with 11px
  sources: both fixed here (rules 9 and 10).
