# Year-5 syllabi, 2569-1: the evidence for the midterm and final split

Palm, 1 Nov 2026: "นำcourse syllabus แต่ละรายวิชามาmapก็ได้นะ จะแยกกลางภาคกับปลายภาคแม่นขึ้น". This file records which document each Year-5 course's syllabus came from, what it says about the two papers, how the term actually ran, and how it compares with each topic's `examScope` in `src/data/curriculum.js`.

The data itself is `src/data/course-syllabi.js` (term, then year, then subject): every session with its date, lecturers, the curriculum topics it taught, and any change the class announced. `src/lib/course-docs.js` reads it for the two downloadable pages, and it is shaped for the per-term teaching map planned after the finals (memory `per-term-teaching-map-after-finals`): topic to sessions to lecturers to paper.

A syllabus is the plan. Palm, 1 Nov: "ข้อมูล syllabus บางทีก็เปลี่ยนได้ด้วย อย่าเชื่อทั้งหมด". Each session sits on the day it actually ran, from the strongest evidence: the cohort's own lecture recordings, whose titles carry the day taught (channel manifest fetched 1 Nov, listed to 27 Oct); then the class LINE group's announcements ("cuvet86 official!", export to 28 Oct), each with the day it was posted; then the course's document. The document's day stays on the row as `planned`, `held` marks a row the evidence shows ran, and `TERMS['2569-1'].evidenceUntil` (28 Oct) is where the evidence ends. A later class keeps the plan's day.

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

## The term as it ran (evidence to 28 Oct)

| Course | What ran on another day than planned | Evidence |
|---|---|---|
| Avian | The 1 Sep topics (IBD, neoplastic diseases, CIA), planned over 1 and 8 Sep, ran 1 Sep. Vaccines and serology, planned 10 and 17 Nov, ran 6 Oct. Duck diseases, planned 6 and 20 Oct, ran 20 Oct. Mycotic infections, planned the afternoon of 27 Oct, ran Mon 19 and 26 Oct 09:00-10:00. The HIPRA activity moves from 29 Sep to 17 Nov, and those who join it get 0.5% on top of the final's part taught by เกรียงวิชญ์. | Recordings (20 Oct: "AHRA Avian med: RA DVE DVH DTMUV GP AI"); class LINE 29 Aug, 28 Sep (the move), 28 Oct (the bonus) |
| One Health | Communication and collaboration, planned 9 and 16 Sep, ran 9 Sep (no class 16 Sep). Emerging diseases, planned 26 Aug, ran Thu 10 Sep 13:00-16:00 with what Zoonoses had left. AMR (planned 14 Oct) ran 30 Sep and foodborne diseases (planned 30 Sep) ran 14 Oct. Risk analysis and import risk, planned 7 Oct and 18 Nov, ran 7 Oct. | Recordings (10 Sep: "One health approach to combat emergind and reemerging"); class LINE 2 Sep, 9 Sep |
| Milk & Meat | Meat microbiology (planned 14 Oct) ran 7 Oct, and the introduction with seafood (planned 7 Oct) ran 14 Oct. The milk-quality class continued on 2 Sep. | Recordings; class LINE 27 Aug |
| Equine Med | GI 1 and 2, planned 27 Aug and 3 Sep, ran 27 Aug. Dermatology and wounds, planned 8 and 29 Oct, ran 8 Oct. Surgery concepts and anesthesia, planned 22 and 29 Oct, ran 22 Oct. | Recordings |
| Equine Repro | Two lectures a class before the midterm: lectures 1-2 on 6 Aug, 3-4 on 20 Aug, 5-6 on 27 Aug (planned 6 Aug to 10 Sep), and no class on 3, 10 and 17 Sep. The stallion anatomy and clinical exam, planned 17 Sep and 8 Oct, ran 8 Oct. Semen collection, AI and stallion infectious disease, planned 15 and 22 Oct, ran 15 Oct. All three of ศวิตา's classes (planned 29 Oct, 5 and 12 Nov) move to 29 Oct from the morning, the day her Equine Med content was already taught. | Class LINE 19 Aug, 23 Oct; recordings (8 Oct: "Anatomy function and clinical examination of stallion"; 15 Oct: "Semen collection and insemination + Infertility problem in stallion") |
| Zoonoses | Coronavirus, planned 14 Aug, ran 28 Aug with the emerging viruses class. Helminths (planned Fri 11 Sep) ran in the morning class of Thu 10 Sep, and rickettsiae (planned 28 Aug) ran that afternoon, 13:00-16:00. A make-up class ran the afternoon of 27 Oct; its topic is not known, so it sits on no paper. The epidemiological approach moves from 9 Oct (no class) to 13 Nov. | Class LINE 14 Aug, 2 Sep, 10 Sep, 30 Sep, 27 Oct; recordings ("Helminthic zoonoses", "Rickettsial zoonoses", both 10 Sep) |
| Swine | GI viral diseases and CNS, planned 7 and 21 Aug, ran 21 Aug. The musculoskeletal class, planned 18 Sep, ran with the mycoplasma class on 11 Sep, 13:00-16:00, and there was no class on 18 Sep. The two enteric bacterial classes, planned 23 Oct (16 and 23 Oct are holidays), ran 1 and 7 Oct 14:00-16:00. Reproductive diseases ran online on 2 Oct, 12:50-15:40. PRRS ran 9 Oct. | Class LINE 25 Aug, 10 Sep, 1 Oct; recordings ("Swine medicine III" on 11 Sep, "Swine enteric diseases", "Yersinia", "Reproductive diseases", "Porcine reproductive and respiratory syndrome") |
| Aquatic | Biosecurity, planned 13 Oct (a holiday), moves to 17 Nov. The 20 Oct class is given to นันทริกา ชันซื่อ from the class's slides, where the course table names ฐนิดา เหตระกูล. The 27 Oct class was recorded as "Marine mammal medicine". | Class LINE 20 Aug, 20 Oct; recordings |
| Epidemiology | The first lecture was cut to an hour, and its basic concepts were taught in the 10 Aug make-up, 09:00-12:00, before the measurement class. 14 Sep afternoon was self-study; the 28 Sep content (online) is not examined. The 19 Oct class ran, with group presentations in the Monday lab slot. | Class LINE 27 Jul, 14 Sep, 27 Sep, 19 Oct; recordings (10 Aug: "Basic concept in Epidemiology + Measurement") |
| FIQC | HACCP, planned 30 Sep, ran 14 Oct with สมพิศ, 14:00-18:00 with the export standards class. | Class LINE 29 Sep |
| CPS | The 19 Aug class moved to Thu 20 Aug, 15:00. The classes of 5 Aug and 16 Sep ran (an attendance call in the slot), and so did 26 Aug, 2, 9 and 30 Sep, 7 and 14 Oct (that class's homework posted the same day; jaundice the next morning). | Class LINE 19 Aug to 14 Oct |

Past classes with no recording or announcement yet read "ตามแผน" on the timetable: Epidemiology 26 Oct; CPS 21 and 28 Oct; Milk & Meat 5 Aug; One Health, FIQC and Milk & Meat on 28 Oct. Two Swine classes read "ยังไม่ทราบวัน": the 9 Oct control and diagnosis class (PRRS took that day) and the 16 Oct class (FMD, circovirus and others, planned on a holiday). Planned days whose content ran on another day hold no class here: Swine 7 Aug and 18 Sep, Equine Repro 13 Aug, 22 Oct, 5 and 12 Nov, Equine Med 3 Sep and 29 Oct, Zoonoses 11 Sep, Avian 10 Nov and One Health 18 Nov, besides the days the table above says were cancelled or moved. Whether a class meets on the later of them is not known.

## What each paper covers

| Course | Midterm | Final | Score split stated |
|---|---|---|---|
| Avian | 4 Aug to 15 Sep | 6 Oct to 3 Nov (the HIPRA activity on 17 Nov is no class of the paper; joining it adds 0.5%) | midterm 54, final 46, per lecturer |
| Aquatic | 4 Aug to 15 Sep | 29 Sep to 17 Nov | midterm 49, final 46, report 5, per lecturer |
| Equine Med | 6 Aug to 17 Sep | 1 Oct to 19 Nov; its POA part draws on every topic (class LINE, 16 Sep) | 40, 50, attendance 10 |
| Equine Repro | 6 to 27 Aug (lectures 1-6) | 1 to 29 Oct, the stallion clinical exam taught 8 Oct | not stated |
| FIQC | 19 Aug to 9 Sep | 14 Oct to 11 Nov | 40, 40, workshop 15, attendance 5 |
| Milk & Meat | milk hygiene, 5 Aug to 16 Sep | meat hygiene, 30 Sep to 18 Nov, with the milk-cleaning class on 30 Sep | not stated |
| One Health | 5 Aug to 10 Sep (6 periods) | 30 Sep to 11 Nov (8 periods) | by teaching hours (class LINE, 28 Oct) |
| Swine | 14 Aug to 11 Sep (AN, PA) | 1 Oct to 20 Nov (PA, SW, RK) | not stated |
| Zoonoses | 7 Aug to 18 Sep | 2 Oct to 20 Nov | attendance 10, report 10, both papers 80 |
| Epidemiology | none | the whole course, 3 Aug to 16 Nov, except 28 Sep | not stated |
| CPS | none | none | not stated |

## Compared with `examScope` (curriculum.js at `7d9890f2`)

No topic is scoped to the paper its 2569 sessions are not on: `scopeConflicts()` returns nothing, and `tests/unit/course-syllabi.test.mjs` keeps it so on every run, against whatever `curriculum.js` holds then. The term as it ran moved dates and order. One class crossed the midterm: the stallion anatomy and clinical exam (`eqrepro-male`), planned 17 Sep and taught 8 Oct, now sits on the final, and the unit test names it so a new crossing is looked at. The disagreements are all of one kind, a topic the curriculum puts on both papers or on neither where the syllabus puts its session on one:

| Topic | curriculum | 2569 syllabus | Why it stays (or what would settle it) |
|---|---|---|---|
| `avian-intro` | both | midterm (25 Aug) | It holds 84 questions, many on final-only content (duck diseases, ORT, Campylobacter, mycotoxicosis). Scoping it midterm would drop those from the final. Re-file them to their topics first, then scope it midterm. Sent to vet-86. |
| `milk-cleaning` | both | final (30 Sep) | Mid 86's set F asks it (curriculum comment). Final is covered either way. |
| `eqrepro-stallion-infect` | both | final (taught 15 Oct) | Mare infectious disease (lectures 5-6, taught 27 Aug, before the midterm) has no topic of its own and may sit here. Sent to vet-86. |
| `zoo-epi-approach` | both | final (moves to 13 Nov) | Contested evidence per the curriculum comment; the class moved it to 13 Nov, still after the midterm. |
| `zoo-eid-wildlife` | both | final (20 Nov, "Emerging threat") | Four questions came from a deck examined at the midterm (curriculum comment, which also says 14 Nov where the syllabus says 20 Nov). |
| `swine-pornchalit-set` | both | midterm (PA's 28 Aug to 11 Sep) | PA's repro and control sessions after the midterm have topics of their own; the set may still hold questions from them. |
| 7 Equine Med midterm topics | both | midterm | The final's POA part draws on every topic (class LINE). Correct as is. |
| `epidem-eid-pandemic`, `epidem-economics` | continuous | final by date | Not examined (class LINE, 27 Sep). Correct as is. |

Topics with no 2569 session: 10 Equine Med topics (acupuncture, tendon, colic surgery, Farabella, tumours, RVF, LapOVE, ortho, pythium, neonatal) stay `final` with "ไม่มีคาบหัวข้อนี้ในประมวลรายวิชา 2569"; 5 Epid topics and `oh-integrating-epi` are `continuous`. These are the curriculum's own call and were left alone.

Nothing in `curriculum.js` or the banks was edited by this work: every disagreement is a reasoned `both`, and the one that is wrong for the students (`avian-intro`) is a filing fix in the bank, which belongs to the vet-86 lane.

Lecturers the syllabi name where the curriculum has TBD (for vet-86): `poa-intro` วชิรา หุ่นประสิทธิ์; `poa-edema` สิริลักษณ์ สุรเชษฐพงษ์; `poa-respiratory` ณัฐวรรณ ตั้งมหากุล; `poa-jaundice` กฤษฎา บุญอร่ามเรือง; `poa-red-urine` and `poa-pale-mm` วชิรา หุ่นประสิทธิ์; `poa-exotic` ธวัช เล็กดำรงศักดิ์; `poa-derm` and `poa-pupd` ชัยยศ ธารรัตนะ; `poa-anorexia` ปุญญมณี แหยมเกตุ.

## Next term

Add `SYLLABI['2569-2'][5]` (and other years) the same way: the course's own document first, the MCV print view only when its year and dates are this term's, every PDF read as an image. Then put each class on the day the recordings or a dated class announcement show it ran, keep the document's day as `planned`, mark `held`, and set `TERMS[term].evidenceUntil` to the last day the evidence reaches. The schedule page lists a year's documents only when the current `SEMESTER.id` has them, so last term's stay in the file and leave the page by themselves.
