# Taking one exam subject from timetable to release

This is the workflow that put **Avian Medicine** and **One Health** into VetMock
for the 21 ก.ย. 2569 midterm (releases 5.125.0 → 5.126.3) and was repeated for
**Food Industry (FIQC)** and **Milk & Meat Hygiene** the following day. It is
written down here, in the repository, so that **any agent on any machine or any
account can pick a new subject up without being told the workflow again.**

Read it whole before starting a subject. Each phase ends in something checkable;
never start the next phase on an unchecked result.

The runnable helpers live on the owner's machine at
`work/exam-content-pipeline/` (untracked — `work/` is gitignored): `README.md`,
`scripts/` and `briefs/`. Each script carries an `SP` constant pointing at a
session scratchpad that has to be repointed. If that folder is not present,
everything below is specified tightly enough to rewrite the scripts from — they
are 60-120 lines each.

---

## 0. What you need from the student first

- **The exam timetable** (`ตารางสอบกลางภาค`) — the paper's date, time and room.
- **The course timetable** (`ตารางเรียน <course code>`) — one row per teaching
  day, with the topic and the lecturer. This is what the sessions are built from.
- **The senior compilations** for that subject, as PDFs. They usually have no
  text layer, so check with `pdftotext -enc UTF-8 file.pdf -` before assuming;
  when it comes back empty, read the pages as images with the Read tool's
  `pages` parameter, at most 20 pages a call.
- Anything the lecturer announced that is not in a recording (a class-chat
  screenshot, a deck cover).

## 1. Establish what the paper is

Inputs, in the order they settle a disagreement:

1. **The class announcement** of format and item count. An unannounced lecturer
   gets `announced: false` and a note saying a previous cohort recorded the
   format. Never present a guess as an announcement.
2. **The department timetable** → one `session` per teaching day, with the date
   and the recording id for that day.
3. **The recordings** — `src/data/video-summaries-<subject>.js`. The
   `examFormat` field holds what the lecturer said about the paper; `summary`
   carries `[mm:ss]` timestamps. These settle **what was taught**.
4. **Senior compilations** — evidence of what a previous paper asked, never
   evidence of fact.

Write it into `src/data/lecturer-sets.js`: subject → lecturers → sessions →
decks. A deck names its `cover` (an id into `LECTURE_COVERS` in `art.js`), its
`topics`, and optionally its `doc` (the `library_docs` slug, so the cover opens
the real slides). A lecturer may carry `lecturers: [a, b]` for a co-taught part
and `alsoFormats: ['tf']` when a previous round used another format.

**Check:** every lecturer resolves through `getInstructorByLecturerString`, and
every current-year recording names its lecturer in `instructor`. Run
`npm run regen:video-meta` after editing recordings. A missing cover degrades to
a blank tile, so covers are optional; a missing instructor shows no profile.

## 2. Author the questions, one job per lecturer

**Two background agents at a time. Four trips the limit.** Split by lecturer,
and inside a big lecturer split by recording: one job for fourteen diseases died
at the quota with nothing written, while five smaller jobs each landed
independently.

Give every job one brief that fixes the sources, the item shape, the id policy
and the refusal rules — `work/exam-content-pipeline/briefs/` holds the worked
ones (`fiqc-question-brief.md` is the shortest complete example). The brief must
say, in the agent's own instructions:

- **What already exists**, with the command that dumps the live bank, because
  the ingest drops a duplicate stem and a near-duplicate is wasted work.
- `sourceType` says how the item reached us: `past-paper`,
  `student-compilation` or `lecture-derived` for new work (`SOURCE_TYPES` in
  `src/data/exam-origins.js` lists every value in use and what each claims).
  `examOrigin` says whose paper it sat on. A new origin string needs an entry
  in `EXAM_ORIGINS` in the same file, filed by a person as `paper`,
  `aligned`, `source-doc` or `mock`, never guessed from its wording.
- The band marker `อิงแนวข้อสอบ` goes on an item written from what a
  compilation marked rather than from a paper: `student-compilation` with no
  `examOrigin`, or any item whose `examOrigin` is filed as `aligned`. It
  never goes in `examOrigin` of a `past-paper` item, which
  would say the item both was and was not sat. An item whose origin is filed
  as a paper does not need it, with one exception while `isPastPaperQuestion`
  still reads origins by regex: when `npm run lint:provenance` reports such a
  row in band 2, tag it, because the tag under-claims into band 1.
  `tests/unit/q-counts.test.mjs` fails a row that is both a sat paper and
  marked unless it names its paper; the fifty that do (avian, food industry,
  milk) were reviewed and stay as they are.
- `verified` cites the exact place checked: a recording id with `[mm:ss]`, or a
  compilation page.
- The guessable-answer rules from `docs/QUESTION-STANDARD.md`: no
  all-of-the-above family, options within about ±20% of each other's length,
  the answer index spread across positions, plausible-and-wrong distractors.
- No invention. A fact that two sources disagree on is dropped, not softened.

**Check:** an independent verify pass per job (a second agent, told to refute),
then the ingest script, which refuses the whole batch on any fault — schema,
forbidden tokens, stem dedupe against the live bank, id assignment, option
length ratio, answer-index clustering, true/false balance and run length.
Then `npm run lint:provenance` on the merged bank: it fails on an origin
nobody has filed, a `sourceType` outside the list, the short spelling
`อิงแนวสอบ` alone, and a row whose origin names a paper or exam guidance
but which Panic Mode would never show.

## 3. Fact-check what the lecturer said

A recording is the authority on *what was taught*, never on *what is true*.
Where the recording and the deck disagree on a fact, the deck wins; where
neither settles it, the item is dropped. The owner's standing decision is
**keep the lecturer's answer and add a reference note**, and fix only questions
that contradict their own cited source. `scripts/apply-fact-fixes.mjs` applies a
reviewed report by question id.

Where a **current** compilation visibly corrects an **older** one — a struck-out
number with a new one written beside it — check the new number against the
current-year recording and use it, and say in `explain` which figure is current.

## 4. Wrap-up page

One page per paper: every disease or session with the keywords that identify it,
what the lecturer stressed, and what a previous round tested. It is the
night-before read, so when the paper is the next morning this phase outranks
writing more questions.

- Author per recording chunk into `wrapup-<subject>-<chunk>.json`
  (`briefs/wrapup-*.md` fix the fields and the house rules), verify each chunk,
  merge, then ingest with `scripts/ingest-wrapup.mjs`.
- The ingest refuses unknown topics, an unknown lecturer id, an exam date that
  disagrees with `lecturer-sets.js`, an over-long bullet, a forbidden token, or
  **any bullet without a source**. So `lecturer-sets.js` must exist first.
- Register the subject in `src/data/exam-wrapups.js`; the view
  (`src/views/WrapUpView.jsx`), the topic-screen card and the Home strip are
  already generic.

**Check before shipping:** every question id cited as `examined` really carries
`sourceType` `past-paper` or `student-compilation`; an audit page cited alone
really holds an exam image rather than slide content.
`tests/unit/exam-wrapups.test.mjs` then enforces the shape on the shipped files.

## 5. Regenerate, gate, push, prove

Bump the version first, then regenerate **everything** derived before the
gate, or the gate fails one stale file at a time:

```
npm run regen:all
```

It runs every `regen:*` script once, each after the generators whose output
it imports (`regen:q-counts` reads the delivery list and the exam-paper table,
so it follows `regen:delivery` and `regen:exam-papers`), then
`regen:changelog`, which reads the bumped version, and `stats -- --write`
last. `tests/unit/regen-all-order.test.mjs` fails if a new generator or a new
import breaks that order. The gate never runs it: the gate's job is to find a
stale file, not to repair one.

Then `npm run gate` — all four Playwright projects, never a three-browser
subset. It runs about eighteen minutes, which outlives a ten-minute shell
timeout, so start it detached and watch its log.

Rules learned the hard way:

- **Never edit anything under `src/` after the gate's build step.** Playwright
  serves `dist/`, and the contrast lint compares `dist/index.html` against the
  newest mtime under `src/`. Restart the gate instead.
- **Never gate while authoring agents are running.** Nine failures in one
  evening were machine contention; all nine passed in isolation.
- **A red e2e step in the local gate is not yet a verdict.** The gate runs
  Playwright with the local defaults (half the cores as workers, no retry),
  which is harder than CI. On the `dist/` the gate just built,
  `npm run test:e2e:ci` runs the suite the way the Smoke e2e workflow does:
  Chromium on two workers, then WebKit and Firefox on one, one retry, and
  `test.only` refused. `npx playwright test --last-failed --workers=2` reruns
  only what the most recent Playwright run failed, so use it straight after
  the gate, before `npm run test:e2e:ci` overwrites that record. Neither
  replaces the gate; they settle what its red means.
- **CI runs in UTC.** A test that pins a clock with `+07:00` across midnight
  passes locally and fails on the runner.
- A failed GitHub check leaves the Vercel alias on the old build, whatever the
  deployment record says.

Production proof: the deployment record for the exact SHA, the version string
inside the served entry chunk, and a walked user flow in the browser.

---

## Standing content rules

No invented data. No middle dot. นิสิต, never นักศึกษา. Never claim what will be
on a paper. Never narrate a document or a person in student-facing text
("อาจารย์บอกว่า", "ในคลิป", "ในสไลด์", "ในชีท", "ตามสรุป") — provenance belongs
in `source`, `verified` and `explain`. A citation is stored raw and rendered
through `src/lib/source-label.js`, so the student reads "คาบ 1 (4 ส.ค.) นาที
12:34" while the pointer still traces back. The vocabulary lint
(`npm run lint:academic-safety`, chained into `npm run lint:all`) blocks the
words that would read as an integrity problem to faculty.

Exam scope is **topic-level**: midterm or final comes from the topic through
`src/lib/exam-scope.js`, never from a per-question field, and `examOrigin` names
the senior cohort's paper — it is not a scope marker.

## Related

- `docs/QUESTION-STANDARD.md` — the question contract itself
- `wiki/guides/content-pipeline.md` — the transcript → summary half
- `wiki/operations/testing-and-ci.md` — the gates in detail
- `STABILITY.md` — what must not regress
