# Pending: Swine Medicine notes for the final (paper 23 Nov 2026)

## Changelog line (Thai, for the wave's release)

เพิ่มสรุป Swine Medicine ปลายภาคแปดหัวข้อจากสไลด์ของรายวิชา ตั้งแต่โรคระบบสืบพันธุ์และโรคทางเดินอาหารจากแบคทีเรีย ไปจนถึง CSF, ASF และ pseudorabies ทุกหัวข้ออ่านใน VetWiki ได้พร้อมแหล่งอ้างอิง และจุดที่สไลด์กับคาบเรียนให้ข้อมูลไม่ตรงกันมีป้ายบอกไว้

## For the reviewer

### What changed

- `src/data/notes-y5-swine-clinic.js` is new (`NOTES_Y5_SWINE_CLINIC`): the subject had only last year's seniors'
  summary. Eight topics, 64 sections, 408 body items, 8 flags, 2 tips.

  | Topic | Sections | Decks and pages |
  |---|---|---|
  | swine-repro | 6 | Lecture note: Swine Medicine 2024 p.241-317; PRRS deck p.2-6, 17-20; classes of 2 and 9 Oct |
  | swine-ileitis-bacti | 12 | Swine Enteric Diseases p.2-131; classes of 1 and 7 Oct |
  | swine-csf | 8 | RK Slide - 6 November p.58-87 (two lines from the CSF supplement of 2568, named as such) |
  | swine-prv-je | 9 | RK Slide - 6 November p.1-19, 42-57 |
  | swine-greasypig | 6 | RK Slide - 6 November p.20-41 |
  | swine-control-dx | 5 | PRRS deck p.7-16; Lecture note: Swine Medicine 2024 p.318-333; class of 9 Oct |
  | swine-trichinosis | 6 | โรคทริคิโนซิส (Trichinosis) p.1-15 |
  | swine-asf | 12 | African Swine Fever p.1-78 |

- The new file is registered in the four places a notes file needs: `src/data/note-corpus.js` (lecture file first,
  the Vet 85 file after it), `src/lib/vetwiki/index.js`, an exact `manualChunks` rule in `vite.config.js`
  (`data-notes-y5-swine-clinic`) and `scripts/apply-note-corrections.mjs`.
- `src/lib/vetwiki/verification-swine-clinic.js` is new (one checked claim for each of the 64 sections), merged in
  `verification.js` after the Epidemiology overlay; 47 works appended to `sources.js` (45 PubMed records, 2 pages).
  `tests/unit/vetwiki-sources-work.test.mjs` pins 2,154 to 2,201 for them.
- `tests/unit/wiki-review-fixes.test.mjs`: the test of "an article with no checked point" opened swine-asf, which
  now has a lecture note and 12 checked points. It opens avian-intro, the one article left with none (a single
  exempt section of a senior summary). The assertions are unchanged.
- Regenerated: notes registry, wiki topic registry and keys, runtime and search data of swine-clinic, citation
  index, shelf, and the counts in `README.md` and `docs/content-inventory.md` (38 note files, 412 topics, 4,233
  sections; 242 governed topics, 1,961 governed sections, 3,402 claims, 2,201 works).
  `bank-registry.generated.js` and `q-counts.js` changed only in their build timestamp and were left out.
- No release number taken and no changelog file: the wave takes one.

### What was checked

- **Second reading.** Each draft was read line by line against its pages by a reader who had not written it:
  8 sheets, 1,298 lines, 161 not passed (126 fix, 20 add, 13 cut, 2 unclear). All 161 are settled, each with before,
  after and why in the work folder (`C:/dev/vetmock-notes-work/swine-clinic/review/decisions.md`): 148 as the
  reader wrote them, 12 with the reader's fact and another wording, 1 not followed (a line that only said a page
  is a set of photographs was cut, not rewritten). Five more changes carry out decisions taken for this batch
  (the two MMA pointers, a class named in one source line, one heading's minute range, and one pointer reworded to
  use the title a reader sees). Rows that change a fact were looked at again on 44 page images, and every changed
  class line was read in the recording's transcript at its minute.
- **This year's pages, not last year's copies.** The CSF titer graphs follow this year's p.79-83: the dashed line
  sits at about 1:32 and crosses at day 21 and about day 31-32 (last year's supplement has 1:64, days 14 and 28).
  The lines carry no label, so the note gives their position and not a meaning; p.82 is named and not interpreted.
  The CSF vaccine strain table has its four pairs (p.86). Pseudorabies marker vaccines: the deleted genes
  highlighted on p.52 are gE, gI and TK, and gD stays a protective antigen. ASF p.23: cleaning takes the load from
  10^9 to 10^6, disinfection from 10^6 to 10^2. Ileitis timeline (p.9): disease peak to day 28, recovery from
  day 28. MMA (Swine Medicine 2024 p.307): 33% is a share of the causes, written so that it is not read as
  "suppresses prolactin by 33%".
- **Handwriting.** Four of the decks are annotated copies. Every line that rested on a previous owner's handwriting is
  gone or rewritten from the print: "Asia" on ASF p.14, "tonsil scraping" on Swine Medicine 2024 p.329, the lesion
  names on enteric p.114, the ring on p.30, the captions of p.83 and p.88.
- **Left out, not guessed.** "No vaccine for coccidiosis" (the transcript is empty there), the meaning of the
  unlabelled lines on CSF p.80 and of the graph on p.82, a result for the ASF contaminated-room experiment (p.46
  prints the design only), and a line on stopping mass vaccination that the class said of PCV2, not of PRRS.
- **Conflicts kept visible as flags naming the page and the minute (8):** PRRS abortion stage (PRRS deck p.3
  against the class of 9 Oct [32:39]); Lawsonia antigen sites (p.8 against 1 Oct [17:19]); Lawsonia vaccine, three
  flags (p.24 one live vaccine only against [34:39]; p.24 duration unknown against [36:34]; p.25 antibiotic-free
  days against [37:35]); sow diet fibre (p.77 above 4.5% against 7 Oct [30:19] above 5%); the CSF titer graphs;
  the ASF burial pit (p.77 prints both 650 and 640 pigs, with the arithmetic that gives 640).
- **MMA is taught in two decks.** Each deck's teaching stays in its own topic. The definition of the three words
  was the one fact both stated: it stays in swine-repro, and each topic points to the other.
- **swine-greasypig** holds only what the deck prints (its class is on 20 Nov); its summary names neither a class
  nor a file. No line in any of the eight notes says what a paper will ask.
- **Drafts and integration.** The draft check passes 8 of 8 with no warning. After integration no Thai digit is
  left in the notes or the claims.
- **Claims.** 64 of 64 sections carry one checked claim, 0 exempt, 0 left: 50 on PubMed records, 12 on works already
  registered (a CSF review 6, the WOAH Terrestrial Manual 3, the MSD Veterinary Manual 2, the Animal Epidemics Act
  1) and 2 on new pages (CDC DPDx trichinellosis, the WOAH technical disease card for ASF). Every quote was found
  again in its source fetched afresh: 59 by script (9 of them in PMC full text), 4 in PDFs, 1 in the Act's Word
  file. Where a source and a deck differ, the claim rests on another statement of the section and the difference
  is listed in the work folder (`verify/V1-notes.md` to `V4-notes.md`).

### Gates

Run on this branch, on the committed tree:

- `npm run lint:data`, the whole chain: pass. Wiki coverage 1,792 of 1,792 verifiable sections backed, 169 exempt;
  generated stats current; no untracked source file.
- The notes and wiki unit suites named for a notes change (`notes-copy`, `vetwiki`, `vetwiki-runtime`,
  `vetwiki-registry`, `vetwiki-sources-work`, `data-chunk-rules`, `note-corpus`): 40 of 40.
- Also run, because they read notes or name this subject: 23 further notes and wiki suites (187 of 187 after the
  fixture above moved; before it, 186 and the one failure described above) and 18 suites that name swine-clinic
  or one of its topics (167 of 167).

Left to the wave fold: the full unit suite, the production build, `lint:dist`, `perf:budget` (the wiki topic
registry grows by 8 topics and 64 sections) and the walk.

### For a person to decide

- Where a published source differs from what a deck prints, the note follows the deck. The differences found
  while checking claims are listed in `verify/V1-notes.md` to `V4-notes.md` of the work folder, for example:
  chlorhexidine 5% for greasy pig (the MSD manual says 0.05%), K99 and 987P listed under post-weaning E. coli,
  edema disease at 10-20 days after weaning, thiabendazole as the drug for trichinosis, Isospora suis sporulation
  in 4-6 days, vaccination listed for porcine brucellosis, and Lawsonia first grown in 1995 (published 1993).
- The CSF note keeps two lines from last year's supplement (the ratio and log2 table, the vaccine curve), which
  this year's deck does not have and the library does not hold.
- The line on mass vaccination of sows belongs to a PCV2 note; swine-pcv2 and swine-fmd have no lecture note yet.
