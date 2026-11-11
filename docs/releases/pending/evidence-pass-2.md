```js
{ kind: 'content', scope: 'multi', title: 'หน้าสไลด์ใต้เฉลยเพิ่มอีก 134 ข้อ', desc: 'ข้อสอบปลายภาคปี 5 เทอม 1 ทั้ง 10 วิชา มีหน้าสไลด์จริงที่ไฮไลต์บรรทัดตอบอยู่ใต้เฉลยแล้ว 953 ข้อ (จากเดิม 819) ทุกหน้าดูด้วยตาแล้วว่าบรรทัดที่ไฮไลต์บอกคำตอบจริง' }
```

# Answer evidence, second pass

Not a release on its own: the main session folds this branch into one.

## Before and after (questions with a slide, of this year's final pool)

| subject | questions | before | after |
|---|---|---|---|
| epidemiology | 355 | 150 | 184 |
| equine-medicine | 594 | 242 | 258 |
| equine-repro | 107 | 55 | 58 |
| food-industry | 61 | 22 | 36 |
| milk-meat-hygiene | 417 | 163 | 200 |
| one-health | 85 | 20 | 24 |
| swine-clinic | 166 (224 in the earlier registry) | 14 | 17 |
| zoonoses | 184 | 50 | 62 |
| aquatic-clinic | 229 | 53 | 60 |
| avian-medicine | 109 | 50 | 54 |
| all | 2,307 | 819 | 953 |

Swine's pool is 166 on main dd5b5539: the earlier registry was built on a bank
that counted 58 more of its questions in the final.

## The last reading

260 picks were looked at (their lines and question as text, and the page image
where the slide is a diagram, a table or a picture: 19 pages): 145 ok, 108
weak, 4 wrong, 3 keys in doubt. Only `ok` is published. They were the picks
whose blind reading was undecided (now drawn with `tocheck --states`), the
quotes found again, and the few picks whose highlight moved when the text was read
again (their earlier verdict no longer held, so they were judged afresh).

The rules held as written: a formula or a definition the key applies is `ok`
for a calculation; another worked example, a heading, a list that leaves out
part of an "all of these" key, a figure the question shows but the slide does
not, and a number the lines do not print are `weak`. Keys in doubt
(`zoonoses:106150`, `equine-medicine:202053`, `equine-medicine:207524`) are in
the owner's findings file with the slide's words; none of them shows a slide.

## Found again, and how

- The quote-not-found rows (136) were mostly a fault in matching, not in the
  model's pick: 82 quotes stood word for word on the page but over more than
  eight short lines (a cycle diagram, one-word bullets), and many Thai quotes
  failed on a text layer that split sara am ("จ านวน" for "จำนวน") or printed
  mathematical letters. `squash` now reads both, and a run of up to 14 lines
  holding 420 letters at most is kept. 55 of the 136 settled; 81 remain
  (quotes stitched from table cells far apart).
- Rows marked none or partial whose question cites a library page: the cited
  page was among the pages read for every one of them, and the model found
  it short of the key. Asking again would be shopping for an answer, so they
  were left.
- `catalog` could not be run: `SUPABASE_ACCESS_TOKEN` is not on this machine.
  The documents added to the library this week are therefore not in the
  pages read. The owner, or a session with the token, runs `catalog`, then
  `fetch`, `lines`, `vision --dry`, `find` and `tocheck` for the subjects
  below.

## What cannot be found, and why

A topic below either has no lecture document in the library catalogue this
run used, or its questions are not answered by the documents filed under it.
Counts are this year's final questions on that topic without a slide.

Likely in the library already (added this week, waiting for `catalog`):
- milk-meat-hygiene: ante- and post-mortem inspection (63), slaughter hygiene
  design (42), post-mortem cutting and grading (41), by Sirawit Pagdepanichkit.
- zoonoses: prion diseases (13).
- equine-medicine: POA equine (29).

Not in the library:
- swine-clinic (3 documents: PCV2, FMD and one other): ASF (29); pseudorabies,
  Nipah and Japanese encephalitis (25); CSF supplement (22); GI bacterial
  diseases: dysentery, ileitis, Clostridium, Yersinia, colibacillosis,
  Campylobacter (21); reproductive diseases: PRRS, parvovirus, brucellosis, MMA
  (16); spirochetes, greasy pig, swine pox, blood parasites (16); epidemic
  disease control and diagnostic approach (5).
- one-health: application of the One Health approach to livestock waste
  management (10).
- zoonoses: epidemiological approach to zoonoses (60; only other zoonoses decks
  exist); emerging zoonotic diseases and wildlife beyond Ebola and Nipah (16).
- aquatic-clinic: aquatic disease control with the 2015 Animal Epidemics Act
  (108; the library has the act's list of diseases, not the lecture).
- equine-medicine: neonatal and foal management (53).
- epidemiology: intro to veterinary epidemiology (6); basic concepts of
  epidemiology (22; only the outbreak deck is filed under it).
- avian-medicine: serology interpretation (14); vaccines, vaccination and
  vaccination programmes (11).

## Money

DeepSeek balance read by the pipeline: 93.36 CNY before, 91.26 CNY after,
read about 90 minutes apart; the account also serves production's tutor, so
not all of the 2.10 is this run. The pipeline's own count: about 520 paid
calls, 387,000 tokens in and 29,000 out, all off-peak (13:26 to about
13:45 UTC, Wednesday). No call was refused.

## Checks

- Every published page answers 200 at `slides.vetmock.com/e/<folder>/...`:
  791 pages over the ten subjects, none failed.
- Every published row's hash matches its question (`evidenceHash`): 953 rows,
  0 stale, 0 missing.
- `tests/unit/answer-evidence.test.mjs` (two new tests: the split sara am and
  math letters, and a fact over many short lines against a long run of long
  lines) and `npm run lint:data`: see the commit that adds this note.
