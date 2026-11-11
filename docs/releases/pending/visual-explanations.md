```js
// Changelog line for the wave release (src/data/changelog/<ver>.js)
{ kind: 'feature', scope: 'system', title: 'เฉลย 9 ข้อมีภาพอธิบาย', desc: 'ตาราง 2x2 ที่บอกว่าสูตรใช้ช่องไหน ช่วงความเชื่อมั่นที่ครอบค่า 1 กราฟแท่ง ลำดับขั้นตอน เส้นเวลา และแถบช่วงของ kappa ภาพค่อยๆ ปรากฏตามลำดับเหตุผลหลังตอบ ตัวเลขทุกตัวมาจากเฉลยเดิม และเสียงอ่านยังอ่านเหมือนเดิม' }
// headline: 'เฉลยบางข้อมีภาพอธิบาย'
```

# Figures in explanations (prototype)

A first, small layer of drawn figures under the answer, on nine real questions, for the owner to
look at before anything is rolled out. Nothing changes for a question without a figure, nothing
changes while a timed paper is being taken, and nothing about scoring.

## What a student sees

After answering one of the nine in practice, the explanation carries one figure, drawn on a
lighter paper with a faint rule grid, in the app's own type and colours:

| Kind | Question | What it shows at a glance |
|---|---|---|
| `twobytwo` | 213520 | the four cells, the two the odds ratio multiplies filled, the two it divides by ringed, a small cross where they meet, and the formula as a real fraction |
| `twobytwo` | 214560 | sensitivity and specificity read **down a column**: a rail from the counted cell to the column total |
| `twobytwo` | 214561 | the same herd, PPV and NPV read **along a row** |
| `interval` | 213503 | OR 2.19, its interval 0.51 to 9.43 on a log scale, a ring where it crosses the dashed line at 1 |
| `bars` | 214650 | sample size at four confidence levels, 384 marked; replaces the table that listed them |
| `flow` | 214602 | outbreak steps 2, 4, 5, 7 (broken links where steps are skipped), step 7 marked |
| `flow` | 214562 | testing in series against in parallel, side by side, series marked |
| `scale` | 214565 | kappa 0.460 inside the moderate band 0.40 to 0.59 |
| `timeline` | 105571 | the foal's 1-2-3 rule, hours after birth, 2 hours marked |

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

Not done here: a figure in a passage is parsed and drawn but none of the nine uses one; the held
height is fitted to a 375 px phone, so on another width a figure whose drawing arrives late can
still move the text below it.

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
