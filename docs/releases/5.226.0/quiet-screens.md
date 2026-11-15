# Quiet screens (pending release notes)

Folded into a release by the main session; it takes the version number when the wave's pull request opens.

```
kind: feature  scope: system  คำแนะนำการใช้งานขึ้นครั้งเดียว: แต่ละหน้าบอกวิธีใช้ครั้งแรกที่เปิด แล้วไม่ขึ้นซ้ำอีก
kind: feature  scope: system  VetWiki อ่านสบายขึ้น: ที่มาและแหล่งอ้างอิงของแต่ละส่วนพับไว้ในแถวเดียว และจุดที่แหล่งอ้างอิงไม่ตรงกับที่สอนบอกไว้ตรงส่วนนั้นที่เดียว
kind: feature  scope: system  หน้าเลือกวิชาและหัวข้อโล่งขึ้น: สัดส่วนคะแนนอยู่ในหน้าของวิชา การ์ดหัวข้อบอกว่าเป็นข้อสอบเก่ากี่เปอร์เซ็นต์ และเหลือเฉพาะคำเตือนที่เปลี่ยนสิ่งที่ต้องอ่าน
kind: feature  scope: system  หน้าแรกเงียบขึ้น: ป้ายอัปเดตขึ้นเฉพาะเมื่อมีของใหม่ วันละครั้ง และหายไปเมื่อเปิดอ่าน ค่าเล่าเรียนเตือนเมื่อเหลือไม่เกิน 14 วัน และคาบเรียนบอกชื่อวิชา
kind: fix      scope: system  หน้าตั้งค่าข้อสอบบอกกติกานาฬิกาครั้งเดียว ตรงสวิตช์จับเวลา
```

## Notes

The owner, 11 Nov 2026: "เรื่องพวกป้ายย้อนแย้ง อย่าให้มันเยอะไปจนน่ารำคาญนะครับ จุดอื่นๆด้วย ดูดีๆ". The audit (one per screen, measured at 375x812 on main's production build) is the "before"; the rules adopted are in AGENTS.md, "Quiet screens". Item numbers are the audit's.

Before counts were measured on main (127.0.0.1:4331, same method as the audit: named non-content elements, each one's share of the first viewport). The after screenshots, the contact sheet and the after shares are taken after the push as one browser job; the counts below marked "after" are what the tests pin.

| Item | What | Before | After | Test |
|---|---|---|---|---|
| 1 | Feature tips | back every day, rotating; 17.8% of the wiki index first screen | once ever per device; a record from the old daily rule counts as seen | `first-tip.test.mjs` (a week, a year later), `first-tip.spec.js` (a week-old record), `how-to-content.test.mjs` (one hint per surface) |
| 2 | Wiki index header | lede 8.6% + four counters 8.3% | gone | `quiet-screens.spec.js`, `wiki-shelves.test.mjs` |
| 3 | Wiki article section rows | 36 meta rows on Rabies (4 x 9 sections) | 9 closed "แหล่งอ้างอิง" rows, report control inside | `quiet-screens.spec.js`, `smoke.spec.js` (chips opened through the row) |
| 4 | Conflict markers | per topic row, shelf volume, contents "!" + legend, header cell, list filter, footer count and button (4 extra marks on Rabies, 1 filter) | one note at the section, in plain Thai; points marked unchanged (202 in 91 topics) | `wiki-index-conflict-chip.test.mjs`, `wiki-review-fixes.test.mjs`, `quiet-screens.spec.js` |
| 5 | Grading chip on subject cards | 9 of 18 cards on this build (audit: 12 of 19) | 0; one closed row "สัดส่วนคะแนนและรูปแบบข้อสอบ" on the subject screen | `quiet-screens.spec.js`, `connected-study.spec.js` |
| 6 | Topic cards (equine, final) | 14 chips "ข้อสอบเก่า N/M, P%", 17 notes on 25 cards (5 of them caveats) | 14 chips "เป็นข้อสอบเก่า P%"; only caveats on cards (the 5, plus the 5 equine scope notes now flagged), the rest in one closed row | `topic-note-caveats.test.mjs`, `topic-count-custom-overlay.test.mjs`, `source-line-no-spoiler.test.mjs`, `quiet-screens.spec.js` |
| 9 | "ลองทำ 1 ข้อแรก" on first-time Home | twice (hero 2.4% + plan card) | once, on the plan card | `quiet-screens.spec.js` |
| 10 | Update chip and foot link | until the note was closed with ✕, with a count; version on the link | news only, one Home visit a day, no count, seen when the note opens; no version | `changelog-seen.test.mjs`, `update-note.spec.js` (open, leave without ✕, a day and a week later) |
| 11 | Exam settings | clock rule 3 times, "เฉลยหลังส่ง" twice, "6257" chip, change-subject hint | clock rule once at its switch, "เฉลยหลังส่ง" once, "ทั้งหมด 6,257 ข้อ", no hint; practice reason no longer repeats the line above | `config-ladder.test.mjs`, `decide.test.mjs`, `decide-for-student.spec.js`, `quiet-screens.spec.js` |
| 14 | Home rail | tuition "เหลือ 67 วัน"; "EQUINE MEDICINE AND SU… VET6 807" | tuition only in its last 14 days; course name from the app | `home-rail-quiet.test.mjs` |
| 15 | Loading hint, faculty stats line | on every cold load / under the faculty title | gone | `quiet-small.test.mjs` |

Data: five equine notes in `curriculum.js` ("ไม่มีคาบหัวข้อนี้ในประมวลรายวิชา 2569 แต่ไม่มีประกาศว่าตัดออกจากปลายภาค จึงยังนับเป็นเนื้อหาปลายภาค": equine-tendon, equine-colic-surgery, equine-ortho, equine-pythium, equine-neonatal) now carry `lecturerNoteKind: 'caveat'`, so they stay on their cards (accepted by the main session); `topic-note-caveats.test.mjs` holds that wording to the flag.

Changed from the brief: item 4's list filter went (it matched 91 of 224 topics, too wide to choose what to study; the section note serves the reader); item 6's notes moved to one closed row for the page, as there is no per-topic details view; item 10 marks the releases seen when the note opens (main session's decision), and the foot link no longer makes an old note unread again.

Not done here (outside the brief): the VetWiki article header strip (18.2% of its first screen), long caveat notes such as herd-health's claw-care note, the question header and pre-answer source toggle (other lanes).
