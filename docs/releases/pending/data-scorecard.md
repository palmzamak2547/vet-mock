# Data scorecard (pending, no release number)

Notes for the reviewer. Nothing here reaches a student: no changelog line, no release number.

## What it adds

- `scripts/scorecard.mjs` and `npm run scorecard`: the six data properties (organised, correct,
  linked, retrievable, stable, predictive) as one number each, with the counts behind it. `--json`
  adds every defect id; `--backtest` prints the past-paper backtest per subject and per paper;
  `--full` also runs lint:exam-recurrence. About 25 s, no install, writes nothing.
- `scripts/lib/backtest.mjs`: hides each recorded paper in turn and measures how much of it Panic
  Mode's band order (`panicRank`) would have covered in a topic's first 10, against a shuffle, with
  exact hypergeometric expectations. Two windows (leave-one-out, earlier cohorts only) and two
  meanings of a match (the recurrence generator's `sameItem`, and a sibling at its first gate).
- `tests/unit/scorecard.test.mjs`: pins the shape (six properties, a headline, two to eight counts,
  `subject:id` defect ids) and the arithmetic (hypergeometric cases, band order against shuffle,
  the forward window never seeing a later cohort), never today's values.
- `docs/DATA-INTEGRITY-ROADMAP.md`: a "Scorecard" section, how to run it and the numbers on 15 Nov.

## What it reuses rather than recomputes

The delivery gate, `q-counts.js`, `exam-recurrence.generated.js`, the evidence index, `exam-scope.js`,
`buildExamPool` / `panicPool`, and the exported checks of `lint:provenance` (`checkFigures`),
`lint:source-docs` (`checkSourceDocs`), `lint:citation-moments` (`checkCitationMoments`),
`lint:dupes` (`exactDuplicateGroups`, `checkNearDuplicates`), `lint:evidence` (`lintEvidence`) and
`regen-exam-recurrence.mjs` (`fingerprint`, `sameItem`, `sittingOf`). The Stable number runs the
lint:data guards themselves as child processes.

## Things to check in review

- The definitions of the six headlines (the roadmap section states each). The two judgment calls:
  unknown paper scope counts only where the subject sits a paper this year (AGENTS.md rule 10), and a
  senior compilation's `sourcePages` is a link (Linked) but not a primary source (Correct).
- Stable reads a guard that fails to import a package as "not run", so a bare checkout does not
  report five false reds; CI, with `npm ci`, runs them all.
- The scorecard's own unit test takes about 8 s (it loads the bank and runs every bank-derived
  property once).

## Numbers on 15 Nov 2026 (main 77d2cbe8)

Organised 48.9%, Correct 22.4%, Linked 32.5%, Retrievable 98.7%, Stable 94.9% (one red before the
first commit was lint:untracked naming these new files), Predictive 1.09x over 45 papers with no
subject conclusive.

## Not in this branch

No bank, notes or wrap-up file is changed. The defects behind the numbers, ranked by reach with an
owner and a guard for each, are in the data findings file of the hunt workspace
(`C:/dev/vetmock-hunt/data/FINDINGS.md`).
