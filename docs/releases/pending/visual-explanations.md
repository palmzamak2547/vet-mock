```js
// Changelog line for the wave release (src/data/changelog/<ver>.js)
{ kind: 'feature', scope: 'system', title: 'เฉลย 8 ข้อมีภาพอธิบาย', desc: 'ตาราง 2x2 ที่บอกว่าอ่านตามแถวหรือตามคอลัมน์ ช่วงความเชื่อมั่นที่ครอบค่า 1 กราฟแท่ง ลำดับขั้นตอน เส้นเวลา และแถบช่วงของ kappa ภาพค่อยๆ ปรากฏตามลำดับเหตุผลหลังตอบ ตัวเลขทุกตัวมาจากเฉลยเดิม และเสียงอ่านยังอ่านเหมือนเดิม' }
// headline: 'เฉลยบางข้อมีภาพอธิบาย'
```

# Figures in explanations (prototype)

A first, small layer of drawn figures under the answer, on eight real questions, for the owner to
look at before anything is rolled out. Nothing changes for a question without a figure, nothing
changes while a timed paper is being taken, and nothing about scoring.

## What a student sees

After answering one of the eight in practice, the explanation carries one figure, drawn on a
lighter paper with a faint rule grid, in the app's own type and colours:

| Kind | Question | What it shows at a glance |
|---|---|---|
| `twobytwo` | 214560 | sensitivity and specificity read **down a column**: a rail from the counted cell to the column total |
| `twobytwo` | 214561 | the same herd, PPV and NPV read **along a row** |
| `interval` | 213503 | OR 2.19, its interval 0.51 to 9.43 on a log scale (labelled so on the axis), a ring where it crosses the dashed line at 1 |
| `bars` | 214650 | sample size at four confidence levels, 384 marked; replaces the table that listed them |
| `flow` | 214602 | outbreak steps 2, 4, 5, 7 (broken links where steps are skipped), step 7 marked |
| `flow` | 214562 | testing in series against in parallel, side by side, series marked; the paragraph stays above it |
| `scale` | 214565 | kappa 0.460 inside the moderate band 0.40 to 0.59 (the only band the explanation gives) |
| `timeline` | 105571 | the foal's 1-2-3 rule, hours after birth, 2 hours marked; the rule's sentence stays above it |

One accent means "this answers": the sage the correct option already wears. Labels sit on their
marks; there is no legend. Beside a figure the house headers ❌ and 💡 are drawn as line icons
(geometry from Kubai Icons, MIT).

The reveal follows the reasoning: the data is there from the first frame, then what the reasoning
uses (cells, the interval, the rail), then the result one step (180 ms) later. It plays once, only
for an answer given just now, and only when the figure is in view. Reduced motion, the app's own
motion setting, a review list or an answer seen again show the finished figure.

## How

- **Syntax.** A fenced block in `explain` (or `passage`):

  ```
  ```figure twobytwo
  cols: มดลูกอักเสบ | ปกติ
  row: ฉีดยาคุมกำเนิด | 10 | 6
  row: ไม่ฉีดยาคุมกำเนิด | 5 | 12
  calc: OR = (10 x 12)/(6 x 5) = 120/30 = 4
  ```
  ```

  One `key: value` a line, cells split by `|`, a trailing `| key` marks the answer. Parser:
  `src/lib/figure-spec.js`; `splitBlocks` returns `{ type: 'figure', fig }`.
- **The voice and the AI never see it.** An explanation with a figure keeps its paragraph in
  `explainSay` (`wholeExplain`), as 5.206.0 set up; `tablesToSpeech` and the Anki export drop the
  block.
- **Lint.** `lint:question-figures` (in `lint:data`) fails on a figure in a stem or option, a figure
  without `explainSay`, any number or label that the stem, passage, options or `explainSay` do not
  hold, a calc whose arithmetic does not give its result, an interval whose estimate is outside its
  bounds, more than one answer mark or one the key and stem do not hold, more marks than read at a
  glance, and a figure that restates a table in the same text.
- **Loading.** `FigureSlot.jsx` holds the phone-fitted height (`figureHeight`) and lazy-loads
  `ExplainFigure.jsx` with `styles-figure.css`. The chunk is asked for while a practice question
  that carries a figure is read, never during a timed paper. Measured: JS 3.71 KB gzip, CSS 2.77 KB
  gzip. First-load CSS grew only by the reserved box. `perf:budget` passes with no budget raised.
- **Motion.** Opacity and transform only. Easing: a damped spring (response 0.35 s, damping 0.82,
  1.1% overshoot) sampled into `linear()`, 480 ms to settle; an engine without `linear()` gets the
  app's `--ease-out` over 300 ms. `@starting-style` fades the figure in; without it the figure just
  appears. A container query lets the 2x2 breathe on wide screens.

Not done here: a figure in a passage is parsed and drawn but none of the eight uses one; the held
height is fitted to a 375 px phone, so on another width a figure whose drawing arrives late can
still move the text below it.

## Review round 1 (data and code): what changed, and the guard on each

| Finding | Change | Guard |
|---|---|---|
| A passage figure could flag the answer before it is given | `highlightParts` and RichBlocks `passage` hand a passage figure over through `withoutKeys` | `lint:question-figures` refuses `| key` in a passage; `figure-spec.test.mjs` (hostile case and the whole bank), `figure-slot-fallback.test.mjs` (what the drawing receives) |
| A chunk that fails to load left a gap | `FigureSlot` reports the failure; RichBlocks then shows `explainSay` whole (every explanation surface passes it); with no paragraph the figure is written out in words; a module with no drawing counts as a failure; a figure the parser could not read whole is written out, never drawn half | `figure-slot-fallback.test.mjs` (the import throws) |
| Readers that cannot draw got the markup or lost the content | One helper, `readableText` / `explainText` / `passageText` (`rich-blocks.js`): `explainSay` where there is one, else the figure in words. Used by Anki, the provenance proof and build, question-standard, answer-leak, audit-coherence, lint-q-dupes, the glossary, recurrence and written-question generators, the glossary and source-conflict reports, video-analyse, wiki-link-candidates, SmartGrader and the VCA bank build | `figure-readers.test.mjs` lists every reader of `.explain` / `.passage` and fails on a new one |
| The lint caught 4 of 11 bad edits | Labels and numbers only from the stem, `say`, the passage and `explainSay` (never options); pairings the text makes (a step's number, an event's time, a bar's value, a band's bounds, an estimate before its interval); a 2x2's cells and headers against the passage's table, totals against their cells; a key required on bars, timeline, flow and scale, and refused when it reads like a wrong option; a redrawn passage table must add a reading | `figure-spec.test.mjs`; the review's `lintattack.mjs` |
| Parser gaps | A repeated single key, a ratio bound at or below 0, a non-number, an estimate outside its bounds, a negative bar, a span that ends before it starts are refused; a note must name the no-difference value and sit on a crossing interval | `figure-spec.test.mjs` |
| The speech test was weakened | Restored for every text; the explanations with a figure are named one by one and each must speak its `explainSay` | `rich-blocks.test.mjs` |
| The screen-reader description left things out | It now carries every cell, step detail, time, band bound, the note, the log axis, and names the answer's mark | rendered with the review's `aria.mjs` |
| Content | 213520's figure dropped (it redrew the passage's table and added no reading). 214562 and 105571 keep their full sentences above the figure. 214565 shows only the band the text gives. 213503's axis says it is logarithmic. 214560 and 214561 kept: the question is which denominator, and the rail down a column or along a row is the reading the table does not show | the lint's "adds no reading" rule |

What a machine cannot check: whether values the text gives as two parallel lists ("270, 471 และ 663 ... 90%, 97% และ 99% ตามลำดับ") are paired in that order, whether a label paraphrases faithfully, and whether a figure reads better than its text.

## Rollout candidates

A heuristic over the 12 Year-5 final banks (file name holds `y5` and `final`, 1,330 questions), reading
the passage, the stem and the spoken explanation. It names candidates; it does not judge that a figure
wins (measured on 11 Nov: of ten stems turned into tables, reviewers found three read better).

| Kind | Candidates | Rule |
|---|---|---|
| twobytwo | 29 | a table with two numeric columns over two rows, or Se/Sp/PPV/NPV/OR/RR beside a fraction |
| interval | 6 | a confidence interval with two bounds |
| bars | 37 | a 3 to 8 row table of values, or four or more percentages |
| timeline | 37 | three or more distinct time points |
| flow | 25 | two or more numbered steps, or two arrows |
| scale | 13 | kappa, a normal or reference range, a body condition score |

123 questions match at least one kind.

## Checks

- `npm run lint:data`, `npm run test:unit`.
- `tests/e2e/explain-figures.spec.js` on chromium-desktop, chromium-mobile, webkit-mobile and
  firefox-desktop: 4 passed.
- `npm run build` and `npm run perf:budget`: 9 routes within budget.
