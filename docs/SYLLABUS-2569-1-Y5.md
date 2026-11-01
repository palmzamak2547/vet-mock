# Year-5 syllabi, 2569-1: the evidence for the midterm and final split

Palm, 1 Nov 2026: "นำcourse syllabus แต่ละรายวิชามาmapก็ได้นะ จะแยกกลางภาคกับปลายภาคแม่นขึ้น". This file records which document each Year-5 course's syllabus came from, what it says about the two papers, and how it compares with each topic's `examScope` in `src/data/curriculum.js`.

The data itself is `src/data/course-syllabi.js` (term, then year, then subject): every session with its date, lecturers, the curriculum topics it taught, and any change the class announced. `src/lib/course-docs.js` reads it for the two downloadable pages, and it is shaped for the per-term teaching map planned after the finals (memory `per-term-teaching-map-after-finals`): topic to sessions to lecturers to paper.

## Sources, checked 1 Nov 2026

Every file was read on MyCourseVille through the read-only bridge, or from the library's copy of the same MCV upload where MCV refused the download (403). The raw pages and PDFs are kept outside the repo in `C:\dev\vetmock-syllabus-data` (they carry the account holder's name, so they are never committed).

| Course | Document used | Year it states | Note |
|---|---|---|---|
| 3106510 Equine Med & Surg | MCV syllabus print view | 2026 (2569) | 18 sessions; no room, so the faculty's weekly timetable gives VET6 807 |
| 3107507 Swine Medicine | MCV announcement "ตารางสอนวิชา อายุรศาสตร์สุกร" (2 Jul 2026) | 2569 | The print view has no sessions; the announcement is the schedule |
| 3107508 Epidemiology | MCV syllabus print view | no year field; every date is 2026 | No assessment table; the faculty exam table has only a final |
| 3107510 Avian Medicine | "ตารางเรียนค่ะ" (library `c1408e7a1ae3839e`, MCV 403) | 2569 | States the windows itself: midterm 4 Aug to 15 Sep, final 6 Oct to 17 Nov |
| 3107520 Aquatic Medicine | MCV syllabus print view, plus the course's Schedule page for the lecturer of each session | 2569 | Score split per lecturer |
| 3107522 CPS (POA) | MCV syllabus print view | 2026 | No paper in the faculty exam table |
| 3108515 Equine Repro | MCV syllabus print view | 2026 | The course home still labels its syllabus "2025/1"; the print view's year and dates are 2026 |
| 3109501 FIQC | "Course Agenda (Updated Sep29)" (library `592a1d011e39dec2`, MCV 403), plus the print view's score table | 2569 | The agenda supersedes the print view: HACCP and export standards moved to 14 Oct (สมพิศ จุลลาบุตรดี) |
| 3109502 One Health | "Course syllabus One Health" PDF (MCV) | 2569 | The print view mixes six 2025 rows into the list and a partial score table, so it was not used |
| 3109503 Milk & Meat | "Course schedule" PDF (MCV) | 2569 | The 30 Sep cleaning session sits under the meat heading, after the midterm |
| 3109504 Zoonoses | "syllabus zoonosis" PDF (MCV) | 2569 | The print view is the 2568 one (dates in 2025), so the PDF was used |

Thai PDF text layers here lose their tone marks (tone-mark ratio 0.02 to 0.045 against about 0.1 for clean Thai), so every PDF was rendered and read as an image, never from its text layer.

Changes to the plan come from the class LINE group ("cuvet86 official!", export up to 28 Oct 2026), each with the day it was posted: Zoonoses 9 Oct moved to 13 Nov; Zoonoses coronavirus moved from 14 to 28 Aug; Equine Repro had no class on 3, 10 and 17 Sep (two lectures a class before the midterm); Aquatic biosecurity moved from 13 Oct to 17 Nov; Swine 16 and 23 Oct made up on 1 and 7 Oct at 14:00; Avian 29 Sep cancelled (HIPRA activity to 17 Nov) and Niwat's 27 Oct session moved to 19 and 26 Oct 09:00; One Health 16 Sep cancelled; Epid's 28 Sep content is not examined; CPS 19 Aug moved to 20 Aug; Milk's milk-quality session continued on 2 Sep; Epid's first lecture shortened with a make-up on 10 Aug, and 14 Sep afternoon was self-study.

## What each paper covers

| Course | Midterm | Final | Score split stated |
|---|---|---|---|
| Avian | sessions 4 Aug to 15 Sep (7) | 6 Oct to 17 Nov (6) | midterm 54, final 46, per lecturer |
| Aquatic | 4 Aug to 15 Sep (7) | 29 Sep to 17 Nov (8) | midterm 49, final 46, report 5, per lecturer |
| Equine Med | 6 Aug to 17 Sep | 1 Oct to 19 Nov; its POA part draws on every topic (class LINE, 16 Sep) | 40, 50, attendance 10 |
| Equine Repro | lectures 1-6 | from 1 Oct, plus the stallion clinical exam (taught in Lecture 8-9, not on 17 Sep) | not stated |
| FIQC | 19 Aug to 9 Sep | 14 Oct to 11 Nov | 40, 40, workshop 15, attendance 5 |
| Milk & Meat | milk hygiene, 5 Aug to 16 Sep | meat hygiene from 30 Sep, with the milk-cleaning session | not stated |
| One Health | 5 Aug to 16 Sep (6 periods) | 30 Sep to 18 Nov (8 periods) | by teaching hours (class LINE, 28 Oct) |
| Swine | sessions 1-7 (AN, PA) | sessions 8-15 (PA, SW, RK) | not stated |
| Zoonoses | 7 Aug to 18 Sep | 2 Oct to 20 Nov | attendance 10, report 10, both papers 80 |
| Epidemiology | none | the whole course except 28 Sep | not stated |
| CPS | none | none | not stated |

## Compared with `examScope` (curriculum.js at `7d9890f2`)

No topic is scoped to the paper its 2569 sessions are not on: `scopeConflicts()` returns nothing, and `tests/unit/course-syllabi.test.mjs` keeps it so. The disagreements are all of one kind, a topic the curriculum puts on both papers or on neither where the syllabus puts its session on one:

| Topic | curriculum | 2569 syllabus | Why it stays (or what would settle it) |
|---|---|---|---|
| `avian-intro` | both | midterm (25 Aug) | It holds 84 questions, many on final-only content (duck diseases, ORT, Campylobacter, mycotoxicosis). Scoping it midterm would drop those from the final. Re-file them to their topics first, then scope it midterm. Sent to vet-86. |
| `milk-cleaning` | both | final (30 Sep) | Mid 86's set F asks it (curriculum comment). Final is covered either way. |
| `eqrepro-stallion-infect` | both | final (22 Oct) | Mare infectious disease (3 Sep, lecture 5-6, before the midterm) has no topic of its own and may sit here. Needs a look at its questions. |
| `zoo-epi-approach` | both | final (taught 13 Nov) | Contested evidence per the curriculum comment; the class moved it to 13 Nov, still after the midterm. |
| `zoo-eid-wildlife` | both | final (20 Nov, "Emerging threat") | Four questions came from a deck examined at the midterm (curriculum comment, which also says 14 Nov where the syllabus says 20 Nov). |
| `swine-pornchalit-set` | both | midterm (PA's 28 Aug to 18 Sep) | PA's repro and control sessions after the midterm have topics of their own; the set may still hold questions from them. |
| 7 Equine Med midterm topics | both | midterm | The final's POA part draws on every topic (class LINE). Correct as is. |
| `epidem-eid-pandemic`, `epidem-economics` | continuous | final by date | Not examined (class LINE, 27 Sep). Correct as is. |

Topics with no 2569 session: 10 Equine Med topics (acupuncture, tendon, colic surgery, Farabella, tumours, RVF, LapOVE, ortho, pythium, neonatal) stay `final` with "ไม่มีคาบหัวข้อนี้ในประมวลรายวิชา 2569"; 5 Epid topics and `oh-integrating-epi` are `continuous`. These are the curriculum's own call and were left alone.

Nothing in `curriculum.js` or the banks was edited by this work: every disagreement is a reasoned `both`, and the one that is wrong for the students (`avian-intro`) is a filing fix in the bank, which belongs to the vet-86 lane.

Lecturers the syllabi name where the curriculum has TBD (for vet-86): `poa-intro` วชิรา หุ่นประสิทธิ์; `poa-edema` สิริลักษณ์ สุรเชษฐพงษ์; `poa-respiratory` ณัฐวรรณ ตั้งมหากุล; `poa-jaundice` กฤษฎา บุญอร่ามเรือง; `poa-red-urine` and `poa-pale-mm` วชิรา หุ่นประสิทธิ์; `poa-exotic` ธวัช เล็กดำรงศักดิ์; `poa-derm` and `poa-pupd` ชัยยศ ธารรัตนะ; `poa-anorexia` ปุญญมณี แหยมเกตุ.

## Next term

Add `SYLLABI['2569-2'][5]` (and other years) the same way: the course's own document first, the MCV print view only when its year and dates are this term's, every PDF read as an image, changes only from a dated class announcement. The schedule page lists a year's documents only when the current `SEMESTER.id` has them, so last term's stay in the file and leave the page by themselves.
