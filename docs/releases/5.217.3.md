# Pending: verdicts keep their own colours under every palette

```js
// Changelog line (Thai, what a student notices). kind / scope as in src/data/changelog.js.
{ kind: 'fix', scope: 'system', title: 'ข้อที่ตอบถูกเป็นสีเขียวทุกจานสี', desc: 'ในจานสีเชอร์รีและจานสีอื่น ข้อที่ตอบถูกเคยเปลี่ยนสีตามจานสีจนดูคล้ายข้อที่ผิด ตอนนี้ถูก ผิด และถูกบางส่วนใช้สีเดิมเสมอ และป้ายผิดอ่านชัดขึ้น' },
```

## Notes (English)

A palette re-points the accent tokens (`--clr-sage*`, `--clr-gold*`), and every right-answer mark read
them: under cherry a right answer turned red beside the rose of a wrong one; ocean, plum and mono made it
blue, purple or grey. Right and partly right now read `--clr-right*` and `--clr-part*`, defined once in
each theme block and set by no palette; wrong reads `--clr-rose*`, which no palette sets either; text on
`--clr-rose-soft` reads `--clr-rose-soft-text`. The places were derived by script, not listed by hand,
and reviewed twice (once from a colour-blind student's side).

Guard: `tests/unit/verdict-colours.test.mjs` (derived verdict rules across every stylesheet and the JSX,
:root aliases and fallback forms of the accent, mutation cases, the contrast of every verdict pair, the
token declarations allowed only in the two theme blocks and VetWiki's print block, no `setProperty`,
style key or `cssText` write of a verdict token, no rule mixing a verdict and an accent token). What it
cannot see is in its header.

Also, from the reviews: the timed exam's question map paints the current question in ink (it was the
colour of a wrong answer); the coverage bands keep the accent (coverage is not correctness); the bench
options carry a tick or a cross; a true/false card's key is a neutral pill; VetWiki printed from dark
resets the verdict text tokens. Not here: the True/False buttons' tick and cross after the key
(`Question.jsx`, the question card's lane).

### The table (WCAG 2.x ratio; colour blindness: Machado 2009 severity 1 on linear sRGB, ratio and OKLab dE x100)

| | light | dark |
|---|---|---|
| right-text on right-soft | 4.69 | 4.63 |
| rose-soft-text on rose-soft | 4.77 | 4.76 |
| part-text on part-soft | 4.86 | 4.72 |
| right-on on right | 6.01 | 6.62 |
| right-text on the card | 7.43 | 8.20 |
| rose-text on the card | 9.81 | 7.98 |
| right-soft against the card | 1.58 | 1.77 |
| rose-soft against the card | 2.06 | 2.43 |
| part-soft against the card | 1.38 | 1.79 |
| right/wrong soft, normal | 1.30, dE 12.8 | 1.37, dE 15.9 |
| right/wrong soft, protan | 1.42, dE 10.8 | 1.20, dE 5.5 |
| right/wrong soft, deutan | 1.23, dE 6.0 | 1.50, dE 9.5 |
| right/wrong soft, tritan | 1.29, dE 13.3 | 1.38, dE 17.1 |
| right/partly soft, normal | 1.15, dE 6.8 | 1.01, dE 6.7 |
| right/partly soft, protan | 1.10, dE 3.2 | 1.06, dE 1.5 |
| right/partly soft, deutan | 1.18, dE 5.6 | 1.06, dE 1.9 |
| right/partly soft, tritan | 1.15, dE 8.1 | 1.01, dE 8.4 |

Every reader of `--clr-rose-text` (129) sits on a page surface or a 12% rose tint, at 7.29 or more in light
and 5.44 or more in dark; the five that sat on rose-soft read `--clr-rose-soft-text`. Weak spot left: in
dark, right and partly-right soft pills are close under protanopia and deuteranopia (dE 1.5 and 1.9); their
glyphs (✓, ◐) carry the difference.

First load (cloud Build, 277e040d): CSS 46,640 B gz (budget 47,900), JS 225,328 (227,900); main's CSS
was 46,506 by the same build.
