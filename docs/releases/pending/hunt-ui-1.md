# hunt-ui-1 (pending: no release number yet)

## เปลี่ยนอะไรบ้าง (สำหรับ changelog)

- ช่องพิมพ์ทุกช่องอ่านง่ายขึ้นบน iPhone: แตะช่องค้นหาวิชา ช่องจดโน้ต หรือช่องตั้งเป้าหมาย แล้วหน้าจอไม่ซูมเข้าเองอีก
- หน้าผลการฝึกอ่านสบายขึ้น: เส้นเกณฑ์บอกค่าครั้งเดียวและไม่ชิดคะแนน บรรทัดเวลาไม่มีช่องว่างแปลกก่อนจุลภาค
- ปุ่มและช่องพิมพ์ทุกที่ใช้ฟอนต์เดียวกับทั้งแอป เช่น ช่องเลือกเวลาอ่านในหน้าแรก ช่องค้นหาวิชา และตัวเลือกในบทเรียน Bench
- รายการแหล่งอ้างอิงใน VetWiki เรียงเลขหัวข้อย่อยได้สะอาดขึ้น ไม่มีจุลภาคลอยห่างจากตัวเลข
- ปฏิทินลงทะเบียนในหน้าตารางเรียนตัวใหญ่ขึ้น อ่านประเภทและวันที่ได้ชัด
- ความแม่นยำของแต่ละวิชาในหน้าแรก และชื่อผู้สอนของหัวข้อที่เปิดอยู่ในหน้าสรุป อ่านชัดขึ้นทั้งโหมดสว่างและโหมดมืด
- ปุ่มแสดงหัวข้อที่ยังไม่มีเนื้อหา และโลโก้มุมบนบนมือถือ กดง่ายขึ้น

## Reviewer notes (English)

Found by `scripts/screen-hunt.mjs` (`npm run hunt:screens`), a report-only walk added here: every route plus
a practice set to its results, a topic list for each year with content, a notes reader and the wiki, at 390
and 1280 px in light and dark, as a year-5 student on the real calendar. It gates nothing; the route sweep
stays the gate. Findings and pictures live outside the repo (`C:/dev/vetmock-hunt/ui/`).

Each fix has a guard shown failing on the old code first:

| Change | Guard |
| --- | --- |
| 19 text controls in 12 files drew at 14 or 15 px inline, under the 16 px iOS focus-zoom floor (subject search, review note, daily goal, cloze and highlight editors, video notes, comments, account, PDF, review queue) | `tests/unit/text-control-font-floor.test.mjs` (Babel over every .jsx; KNOWN: Question.jsx 1, RaceView.jsx 3, both inside a running set, left for a reviewed change) |
| Schedule's registration card: kind at 11 px with tracking, dates at 12 px | `tests/unit/inline-font-floor.test.mjs`, a per-file ratchet of inline font sizes under 14 px (100 today, only goes down) |
| A comma set off from its word: results pace line (flex gap), offline game best score, Lab measuring hint, OSCE timer | `tests/unit/comma-spacing.test.mjs` (KNOWN: Question.jsx 2, SmartGrader.jsx 1, scoring/exam surfaces) and `screen-hunt-wave1.test.mjs` for the class-styled pace row |
| Results bar: threshold printed three times, legend label at 50% under a mark at 60%, flag 2 px under the score line | `screen-hunt-wave1.test.mjs` |
| Bench answers in the browser's Arial at 13.33 px (`.vmx-check__option` had no `font: inherit`) | `screen-hunt-wave1.test.mjs` |
| Form controls in the browser typeface (Home daily-minutes picker, subject and library search, countdown strip, vitals row, cards tool, Lab): `:where(button, input, select, textarea) { font-family: inherit; }` | `screen-hunt-wave1.test.mjs` (reset present, before the first class rule) |
| Wiki sources: "อ้างในหัวข้อย่อย 01 , 03", the comma 8 px from a 44 px centred link box; the comma is dropped, the boxes space the numbers | `screen-hunt-wave1.test.mjs` |
| Home subject accuracy in fill tokens (2.97:1 light) | `screen-hunt-wave1.test.mjs` |
| Notes list, open topic: lecturer and size in ink-soft on the rose tint (2.72:1 dark) | `screen-hunt-wave1.test.mjs` (also proves the token pair) |
| "Show empty topics" row 23 px tall; phone header logo squeezed to 36 px | `screen-hunt-wave1.test.mjs` |

Layout (Rule 11): nothing moved place. The results card loses one label and gains 14 px above the bar, so the
flag reads as the bar's own caption rather than a fourth line of the score. Inputs grow by about 2 px in height.
The calendar labels drop their Latin tracking, which Thai should not carry. States: these are drawn the same
when loading, empty, failed or offline; none of the fixes adds a state.

Not touched, other owners: `src/views/WrapUpView.jsx`, bank, notes and wrap-up data.
