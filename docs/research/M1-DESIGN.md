# Research Studio M1: the contract every builder codes against

Written by the architect role on 2026-09-27 in the worktree `research/m1` (cut from main `abb9b765`).
This file turns the spec into files, shapes and numbers. Order of authority when two texts disagree:
`work/research-studio/BUILD.md` (27 Sep), `competitor-gaps.md` (D1 to D9; M1 carries D4 a to d),
`work/loop-2026-09-26/research-m1-brief.md` (its "/app/research lazy view" line is superseded by the
subdomain), `GOAL.md`, `fit.md` (read "/app/research" as this `research/` app), `methods.md` sections 3
to 6, `engine.md` sections 4 to 7. Screen designs: the 13 workspace boards (`work/research-studio/workspace/`)
and the front door (`work/research-studio/design/`). Paths in this file are relative to the repo root
unless they start with `work/` (which means `C:\Users\palmz\Desktop\vet-mock\work\`, gitignored there).

What exists after the architect's commit: the `research/` app builds and serves a page on `/`, `/app`,
`/licenses` and deep links; every module below exists with its final exported signature and JSDoc, and
throws `not implemented` until its owner fills it; the dictionaries exist (common and terms seeded);
the dependencies are installed and pinned; five unit test files pass (i18n, glossary, no-egress,
catalogue, router); fixture seeds are committed (course, NIST, SciPy cross-check); the Europe PMC
evidence is committed. No builder touches `research/package.json`.

---

## 1. Decisions taken here (reversible, each with its reason)

| # | Decision | Why |
|---|---|---|
| A1 | Path routing with the History API, no router dependency (`research/src/router.js`) | Own origin, so no conflict with the main app's exact-match table; `research/vercel.json` rewrites unknown paths to `index.html`; deep links survive reloads and the service worker's navigation fallback; URLs carry only random UUIDs, never names or values (fit.md R10). Hash routing would work too but makes the landing's anchors and the scroll story fight the router. |
| A2 | `/` always shows the landing; returning students get a "ทำต่อ" (continue) action in the hero when `prefs.lastProjectId` exists, and the web app manifest's `start_url` is `/app` | On its own origin the landing is the public face and the search entry; redirecting returning users away from `/` would hide the front door and break links people share. The brief's "returning users land in the workspace" was written for the in-app view; an installed app still opens in the workspace. |
| A3 | Landing and workspace are separate lazy chunks; dictionaries are split per area and each lazy root registers its own | The front door must not download the grid, the engine client, the sign-in client or workspace strings. Measured scaffold: entry 8.9 KB + React 142.8 KB (45.7 KB gzip). |
| A4 | No Fraunces, no Google Fonts. The wordmark uses Sarabun 700. | The CSP is `font-src 'self'`; the brief (Q12) allows the app's Sarabun plus the mono stack only. The boards used Fraunces from Google Fonts for the wordmark; that does not ship. |
| A5 | Sarabun is served from the main app's `public/fonts` by `research/build/shared-fonts.mjs` at the same unhashed `/fonts/` paths, preloaded (400, 600) in `research/index.html` | One source of truth; the design traces showed Thai shaping and font fallback were about 70 percent of first layout, so preload matters. Vite prints "didn't resolve at build time" for the four `/fonts/*.woff2` URLs in `base.css`; that message is expected (the plugin emits them). |
| A6 | Theme: `data-theme="light"|"dark"` on `<html>`, set in `main.jsx` before the first render from `prefs.theme` (default: the system setting). Light is the design's paper stage, dark its dark stage. | CSP `script-src 'self'` forbids an inline bootstrap script. The main app's theme preference lives on another origin and cannot be read. |
| A7 | Sign-in is optional and never loaded on the landing's first paint. A guest works fully. | M1 computes everything on the device; nothing syncs; sign-in only scopes projects to an account on that device and moves guest projects on first sign-in (brief decision 11). |
| A8 | A studentized-range upper tail is `1 - cdf` | R's own `ptukey(lower.tail = FALSE)` is computed as `1 - ptukey` (R `src/nmath/ptukey.c`, `R_DT_val`), so matching R requires it; every other upper tail uses a complement function. |
| A9 | "Verified" needs a pin fixture (R 4.6.0, NIST, course, or the serosurvey numbers that an independent program checked); a SciPy cross-check alone never earns the badge | engine.md 6 names R and published sources as references; SciPy is a second implementation used to catch mistakes early. |
| A10 | `/licenses` page listing every shipped third-party package with its licence | Apache-2.0 (stdlib, SheetJS) asks for the notice to travel with the distributed code. |

## 2. Routes (owner: workspace; `research/src/router.js`, done)

| Path | Route | Chunk |
|---|---|---|
| `/` | landing | `landing/Landing.jsx` |
| `/app` | projects (with the entrance on first visit per device) | `workspace/Workspace.jsx` |
| `/app/p/<projectId>` | a project; opens `import` when it has no dataset, else `data` | workspace |
| `/app/p/<projectId>/<pane>` | pane in `import`, `codebook`, `data`, `design`, `prev`, `assoc`, `table1`, `report` | workspace |
| `/app/p/<projectId>/r/<analysisId>` | a saved result (frozen snapshot or live) | workspace |
| `/app/tools/sample-size` | sample size and power, no data file (the Course board) | workspace |
| `/licenses` | third-party licences | workspace |
| anything else | not found, with a link to `/` | workspace |

Ids are `crypto.randomUUID()`. A deep link to a project that is not in this browser shows a plain
sentence ("โปรเจกต์นี้ไม่ได้อยู่ในเบราว์เซอร์นี้" / "This project is not in this browser") with the
two ways to get it (open the project file, sign in on the device where it was made); never an error.

## 3. Look, motion and speed (owners: workspace for tokens and base, landing for motion)

- Tokens: `research/src/styles/tokens.css` (done), light and dark, from `design/story.js` `RS_PAL`
  and the boards' `STYLE`. Every selector is prefixed `.rs-`; no hex in JSX; landing-only tokens go
  in `landing.css` as `--rs-landing-*`.
- Type: Sarabun 400/500/600/700 for everything, the mono stack for codes and hashes; headings with Thai
  use line-height 1.2 to 1.3 and letter-spacing 0; tabular numerals (`.rs-num`) wherever numbers align.
- Targets 44 px; inputs 16 px on iOS; visible focus (3 px gold outline); non-colour status (icons and
  words beside colour); dialogs trap focus and close on Escape.
- Motion (both the front door and the workspace entrance), from `design/README.md` "What the traces
  taught": animate `transform` and `opacity` only; one rAF loop writing styles through refs, or CSS
  scroll-driven animation generated from the same layout function (`rsLayoutValues(t)`); no React
  state per frame; heavy layers kept at opacity >= 0.002 from load; no animated `clip-path` (use a
  counter-translated wipe); no SVG strokes on moving layers (CSS boxes and borders); no gradient on a
  fading layer (the halo lives in the shader); DPR capped at 2 for WebGL; pause the loop when the
  canvas is offscreen (IntersectionObserver) and on `visibilitychange` hidden; WebGL `webglcontextlost`
  and `webglcontextrestored` handled, with a still SVG fallback when WebGL is missing or lost;
  `prefers-reduced-motion: reduce` shows every layer still, with all its information (never hides a
  layer that carries information; memory `feedback_reduce-motion-blanket-disable-trap`).
- Numbers never animate as count-ups (fit.md D18): a mid-animation screenshot must never carry a
  number that was not computed.

## 4. Languages (owner of the mechanism: runtime; of each area: see 4.2)

### 4.1 Mechanism (`research/src/i18n/index.js`, done)
- `useT()` gives `{ lang, setLang, t }`; `t(key, params)` fills `{name}` placeholders.
- Thai by default; the ไทย/EN switch in the header calls `setLang`, which writes `prefs.lang`
  (`vmx-research-prefs-v1`) and `<html lang>`.
- `registerArea(area, dict)` at the top of each lazy root; a missing key renders `[key]` (visible in
  review) and warns in development.
- A component never contains a visible string; `aria-label`, `title`, `alt`, placeholder and
  document titles come from dictionaries too. Method names, option labels and guard messages are keys
  (`nameKey`, `reasonKey`), resolved in the component.

### 4.2 Areas, prefixes and owners

| File | Prefix | Owner | Holds |
|---|---|---|---|
| `i18n/common.js` | `common.` | workspace | header, language switch, generic states, not found |
| `i18n/terms.js` | `term.` | workspace | one term per concept, statistics glosses (4.4) |
| `i18n/workspace.js` | `ws.` | workspace | every workspace screen |
| `i18n/report.js` | `report.` | workspace | methods and results paragraph templates |
| `i18n/landing.js` | `landing.` | landing | front door |
| `i18n/entrance.js` | `entrance.` | landing | workspace entrance |
| `i18n/intake.js` | `intake.` | intake | import preview, conversions, codebook questions, step descriptions |
| `i18n/stats.js` | `stats.` | stats | stats method names, options, result labels, `stats.undefined.*` sentences |
| `i18n/epi.js` | `epi.` | epi | epi method names, designs (`epi.design.*`), guardrails (`epi.guard.G<n>.*`), sample size |
| `i18n/runtime.js` | `runtime.` | runtime | engine, store, auth, export, service-worker messages; family names; M2/M3 method names; provenance pieces |

Key shape: `<prefix><screen or group>.<item>` in lowerCamel segments, e.g. `intake.encoding.fallback874`,
`epi.guard.G1.title`, `stats.method.test.tTest.name`, `runtime.family.anova`.

### 4.3 Copy rules (tests/unit/i18n-dictionaries.test.mjs checks the mechanical ones)
- Plain words a fourth-year veterinary student understands on first read, in both languages. The
  English is written, not translated: same facts, natural English.
- Statistics terms stay English in both languages (t-test, odds ratio, 95% CI, p-value, ICC, design
  effect, Mantel-Haenszel, Welch, Wilson) with a short gloss once per screen from `term.*.gloss`.
- One term per concept: accounting for farms is "ปรับตามฟาร์ม"; a copy the student saves is
  "ดาวน์โหลด"; data leaving the device is "ส่งออกนอกเครื่อง"; the student is "นิสิต".
- No literal calques, no middle dot or bullet as a separator, no star glyph, no ellipsis (character or
  three dots), no tool or AI names, Arabic digits only, dates show their era ("25 ก.ย. 2569 (พ.ศ.)",
  "25 Sep 2026 CE").
- Thai words for statistics come from `src/data/glossary.js` when it has them (ความชุก, อุบัติการณ์,
  ความเสี่ยงสัมพัทธ์, ความไว, ความจำเพาะ, ค่าทำนายผลบวก, ค่าทำนายผลลบ); `tests/unit/i18n-glossary.test.mjs`
  keeps them identical. The glossary lacks odds ratio, confidence interval, p-value, kappa, ICC and design
  effect (methods.md 2.4): those stay English here, and adding them to the main glossary is a follow-up
  for the orchestrator (research/ never modifies `../src`).

### 4.4 Terms (`i18n/terms.js`, seeded)
Seeded: the glossary words above, the four fixed words, and glosses for odds ratio, 95% CI, p-value,
ICC, design effect and effective n. Add a term here before using a new Thai word anywhere.

## 5. Method catalogue (owner: runtime; `research/src/lib/runtime/catalog.js`, data done)

- `FAMILIES`: 38 families, each pointing to a count in a committed evidence file
  (`research/src/landing/evidence/`), so the landing chart and the catalogue use the same ids.
- `METHODS`: every method with `id`, `families[]`, `milestone` (`M1`, `M2`, `M3`, `later`), `owner`
  (M1 only), `nameKey`. M1 rows: `desc.summary`, `desc.table1`, `freq.proportion`,
  `freq.truePrevalence`, `freq.incidenceRisk`, `freq.incidenceRate`, `epi.twoByTwo`,
  `epi.mantelHaenszel`, `test.chisq`, `test.fisher2x2`, `test.mcnemar`, `test.trend`, `test.tTest`,
  `test.anova1`, `posthoc.tukey`, `adjust.pValues`, `test.mannWhitney`, `test.wilcoxonSignedRank`,
  `test.kruskalWallis`, `corr.pearson`, `corr.spearman`, `reg.ols`, `dx.accuracy`, `agree.kappa`,
  `agree.percent`, `cluster.iccDeff`, `ss.proportion`, `ss.twoProportions`, `ss.caseControl`,
  `ss.mean`, `ss.twoMeans`, `ss.paired`. M2 and M3 rows follow competitor-gaps.md D1 to D8.
- `getCatalog()` derives `shipped` (a row exists in `registry.js` `IMPLEMENTED`) and `verified`
  (shipped and at least one pin fixture family in `verified.generated.js`). Nobody types either flag.
- `familyStatus(id)`: `now` when any method in the family ships, else the earliest milestone
  (`M1` means planned for this release but not implemented yet), else `later`. The landing chart shows
  `now` as "มีใน Studio แล้ว" / "In the Studio now" and the rest as "M2" / "M3" / "ภายหลัง".

## 6. Design first (owner: epi; `research/src/lib/epi/design.js`, data done)

Seven designs: cross-sectional, cohort, case-control, clinical trial, diagnostic test evaluation,
agreement study, descriptive. Each row lists `offers` (method, and for 2x2 methods the measures), and
`blocked` with a reason key. `checkDesign(designId, methodId)` is called by `run.js` (G3). Key rules:
no risk, incidence, RR or RD from a case-control study (OR and the estimated attributable fractions only);
a cross-sectional 2x2 reports the prevalence ratio first with the prevalence odds ratio beside it (the
design board); true prevalence is offered wherever a proportion is, and G18 fires when the test's Se or Sp
is below 1; diagnostic designs offer accuracy measures, not association measures; agreement designs never
offer Pearson correlation (G16). Sample-size tools and `adjust.pValues` need no design.

## 7. Methods: definitions, options, outputs and fixtures (owners: stats 7.1 to 7.14, epi 7.15 to 7.22)

General rules for every method:
- Upper tails come from complement functions (`dist.js`), never `1 - cdf` (exception A8).
- An undefined value is `null` with a `reasonKey` (`stats.undefined.*` or `epi.undefined.*`) and prints
  "—" with the sentence; never 0. An infinite estimate or bound is `Infinity` (Fisher with a zero cell).
- Rows with a missing value in any role are dropped and counted per column with the reason
  (`provenance.rowsDropped`); rows excluded or filtered by a recipe step are counted separately.
- Tolerances: closed forms 1e-10 relative; iterative fits 1e-6 relative; uniroot-based values (Fisher
  conditional MLE and its interval, score intervals) within R's own `uniroot` tolerance, i.e.
  `|js - R| <= 2 * 1.220703125e-4 * max(1, |R|)` with the same interval, starting bracket and stopping rule.
- Fixture sources, in order of authority: R 4.6.0 through webR 0.6.0 in Node (the rparity role writes
  `research/tests/fixtures/r/<method>.R` and commits `r/out/<method>.json` with `%.17g` numbers and
  `sessionInfo()`), NIST StRD (`fixtures/published/nist/`), the course (`fixtures/course/epi-course-2026.json`),
  and the serosurvey numbers (`work/research-studio/workspace/numbers.json`, recomputed independently by
  `check.py` with SciPy, 47 of 47). The SciPy cross-check (`fixtures/crosscheck/scipy-crosscheck.json`,
  written by `scipy_crosscheck.py`, SciPy 1.17.1, NumPy 2.4.4, Python 3.14.4) is a second implementation
  for every method below; it never earns "verified" alone (A9).
- Each module's fixture test must fail when a wrong value is injected: once per module, change one
  expected number by 1e-6 relative (or flip one cell of the input) and show the test goes red; write the
  command and the red output into the role notes.

The datasets named below (`two`, `paired`, `three`, `corr`, `quantiles`) are defined literally in
`scipy_crosscheck.py` and copied into its JSON under `datasets`, so R and JS read the same numbers:
- `two`: g1 = 5.1, 4.9, 6.2, 5.8, 6.0, 5.5, 5.3, 6.4; g2 = 6.8, 7.1, 6.5, 7.4, 6.9, 7.8, 6.25, 7.0, 7.3, 6.6
- `paired`: before = 12.1, 14.3, 11.8, 13.5, 15.2, 12.9, 14.8, 13.1, 12.4, 14.0; after = 11.4, 13.9, 11.9, 12.2, 14.1, 12.0, 14.5, 12.3, 12.6, 13.25
- `three`: A = 23, 25, 21, 27, 24; B = 30, 28, 33, 29, 31, 27; C = 26, 24, 28, 25, 29, 30, 27
- `corr`: x = 1.2, 2.3, 3.1, 4.8, 5.0, 6.7, 7.1, 8.4, 9.0, 10.5; y = 2.1, 2.9, 3.8, 5.2, 4.9, 7.3, 6.8, 8.9, 9.5, 10.1
- `quantiles`: 2, 4, 4, 5, 7, 9, 10, 12
- serosurvey: the 728-cow, 49-farm made-up file `work/research-studio/workspace/data/serosurvey-2569.csv`
  (windows-874; see 8.6 for how it enters the repo).

### 7.1 Distributions (`stats/dist.js`)
Wrappers over the pinned stdlib kernels. Fixtures: R `pnorm`, `pt`, `pchisq`, `pf`, `qnorm`, `qt`,
`qchisq`, `qf`, `qbeta`, `ptukey`, `qtukey` with `lower.tail = FALSE` where relevant (rparity
`dist.R`), including engine.md's hard cases: upper chi-square at x = 3.841459 (0.049999994653),
x = 30 (4.3205e-8), x = 100 (1.524e-23, measured with stdlib `gammainc(50, 0.5, true, true)` =
1.5239706048320995e-23 on 27 Sep); two-sided t at t = 2.1, df = 8 (0.0689); t = 6, df = 3 (0.00927);
t = 15, df = 30 (1.75e-15); `qt(0.975, 1)` 12.7062 and `qt(0.975, 5)` 2.570581835636314 (stdlib, 27 Sep);
Clopper-Pearson `qbeta` cases `(0.025, 1, 20)`, `(0.975, 2, 19)`, `(0.025, 49, 2)`, `(0.025, 1, 5000)`.
Exact values come from rparity; the numbers in parentheses are engine.md's printed values (4 to 12
digits) and must agree to their printed digits.

### 7.2 Root finding (`stats/rootfind.js`)
Brent with R's `uniroot` defaults (`tol = .Machine$double.eps^0.25`, `maxiter = 1000`). Fixture: R
`uniroot(function(x) x^3 - x - 1, c(1, 2))$root` and `$iter` (rparity), reproduced to the same iteration count.

### 7.3 Descriptives (`stats/descriptive.js`, method `desc.summary`)
Options: `quantileType` 7 (R default) or 6 (SPSS). Outputs: n, missing, mean, sd (n - 1), se, min,
q1, median, q3, max. Fixtures: dataset `quantiles`: mean 6.625, sd 3.4615231989895516, se
1.2238332636200313; type 7 quartiles 4, 6, 9.25; type 6 quartiles 4, 6, 9.75 (SciPy/NumPy; R
`quantile(type = 7)` and `type = 6` via rparity). Serosurvey age in months (animals with a known age,
716): median 30, q1 21, q3 43 (numbers.json `table1.animals.all.age`, type 7); herd size over 49 farms:
median 41, q1 31, q3 52.

### 7.4 Table 1 (`stats/table1.js`, method `desc.table1`)
Options: `quantileType`, `summaries` per column (`median-iqr`, `mean-sd`, `n-percent`; `normalizeSpec`
fills it from the codebook type and writes it into the spec), `percentDenominator: 'known'`,
`showMissing: true`, `byLevel: true` (farm-level variables summarised over farms, animal-level over
animals). No p-values and no SE/CI (G10). Fixture: numbers.json `table1` (every cell: n, median and
quartiles, counts, missing and not-applicable splits by ELISA result).

### 7.5 One proportion (`stats/proportion.js`)
Methods `wilson` (default), `exact` (Clopper-Pearson), `wald`, `agresti-coull`; `poissonRateCi` for
rates. Fixtures (SciPy, R `binom.test` / `prop.test(correct = FALSE)` via rparity):
- 17/179 (course 107002): p 0.09497206703910614; Wilson 0.0601428000990762 to 0.14682042949210666;
  exact 0.05630278147792903 to 0.14770305111090992; Wald 0.052023318615052994 to 0.1379208154631593.
- 0/20: Wilson 0 to 0.16112515805281935; exact 0 to 0.1684334709830855; Wald degenerates to 0 to 0
  (report it, and the sentence says why Wald is not used near 0).
- 20/20: Wilson 0.8388748419471808 to 1; exact 0.8315665290169145 to 1.
- Serosurvey 146/728: p 0.20054945054945056; Wilson 0.17306883143205845 to 0.2311737203597186;
  Wald 0.17146311930519367 to 0.22963578179370744 (numbers.json, check.py).

### 7.6 t-tests (`stats/ttest.js`, method `test.tTest`)
Options: `variant` `welch` (default), `pooled`, `paired`, `one-sample`; `mu`; `alternative`;
`confLevel`. Outputs: t, df, p, mean difference with CI, SE. Fixtures (SciPy; R `t.test` via rparity):
- Welch, `two`: t -5.493662518652961, df 13.914408480898441, p 8.088294107263273e-05, difference
  -1.3149999999999986, CI -1.8286869946432929 to -0.8013130053567045.
- Pooled, `two`: t -5.593509717533816, df 16, p 4.037791979304387e-05, CI -1.8133767990493503 to
  -0.8166232009506469.
- Paired, `paired`: t 3.8387096774193568, df 9, p 0.003974368875812046, difference 0.5950000000000001,
  CI 0.24436563976627845 to 0.9456343602337217.
G6: a pair column in the codebook stops an independent test.

### 7.7 One-way ANOVA and post hoc (`stats/anova.js`, methods `test.anova1`, `posthoc.tukey`)
Options: `posthoc` `tukey` (default; Tukey-Kramer for unequal n), `pairwise-t-holm`,
`pairwise-t-bonferroni` (pooled SD, as R's `pairwise.t.test`), `none`. Fixtures, dataset `three`
(SciPy; R `summary(aov())`, `TukeyHSD()`, `pairwise.t.test()` via rparity): F 9.211448598130833,
df 2 and 15, p 0.002456709156183406. Tukey (R's order and sign, later level minus earlier):
B-A diff 5.666666666666668, p 0.0017497860615449667, CI 2.2367234719001616 to 9.096609861433175;
C-A diff 3.0, p 0.0792444153924241; C-B from the JSON. NIST StRD ANOVA sets are not in the repo yet;
rparity may add SiRstv and SmLs01 with certified values (engine.md 6.1) and a note in `published/`.

### 7.8 Multiplicity (`stats/padjust.js`, method `adjust.pValues`)
`holm` (default, G7), `bonferroni`, `none`. Fixture: p = 0.01, 0.04, 0.03, 0.005 gives Holm 0.03,
0.06, 0.06, 0.02 and Bonferroni 0.04, 0.16, 0.12, 0.02 (closed form; R `p.adjust` via rparity).

### 7.9 Rank tests (`stats/rank.js`)
`test.mannWhitney` (options `exact` auto/exact/normal, `continuityCorrection` true), R 4.6.0's rule
(the version the fixtures pin): exact when both n < 50, using the exact conditional distribution
even with ties; W = rank sum of x minus n1(n1 + 1)/2. `test.wilcoxonSignedRank`: exact when n < 50,
also with ties or zeros (R 4.6.0's conditional distribution); V = sum of positive ranks. `test.kruskalWallis`:
tie-corrected H. Fixtures (SciPy; R `wilcox.test`, `kruskal.test` via rparity):
- Mann-Whitney exact, `two`: W 1, p 9.141185611773847e-05.
- Mann-Whitney normal with ties and continuity, A vs B of `three`: W 0.5, p 0.010411098147110422.
- Signed rank exact, `paired`: V 52, p 0.009765625 (SciPy reports min(V+, V-) = 3; R reports V = 52).
- Kruskal-Wallis, `three`: H 9.4433060515873, df 2, p 0.008900453701972453.
Hodges-Lehmann estimates and intervals are M2.

### 7.10 Correlation (`stats/correlation.js`)
`corr.pearson`: r, t, df, p, Fisher-z CI. `corr.spearman`: rho, p by R's rules (exact algorithm AS 89
through `prho` when n < 1290 and no ties, t approximation otherwise); CI option `none` in M1. Fixtures,
dataset `corr`: Pearson r 0.9919020726268372, p 1.8631466008470498e-08, CI 0.9648533512385278 to
0.9981537652787887; Spearman rho 0.9757575757575757 (SciPy); Spearman p only from R (SciPy's t
approximation 1.4675e-06 is not R's default).

### 7.11 OLS (`stats/ols.js`, method `reg.ols`)
Householder QR; treatment contrasts against the codebook's reference level. Fixtures: NIST StRD
Longley (certified b0 = -3482258.63459582 with SD 890420.383607373, through b6 = 1829.15146461355 with
SD 455.478499142212), Norris, Wampler4 (`published/nist/nist.json`, LRE thresholds in its README);
simple regression on `corr`: slope 0.9128549130812948 (SE 0.04132462264967751), intercept
0.8463129549976767 (SE 0.2682887945869892), R^2 0.9838697216814152 (SciPy; R `summary(lm())` via rparity).

### 7.12 Chi-square and trend (`stats/chisq.js`)
`test.chisq`: Pearson r x c; option `yates` (default off; a visible switch for 2x2); expected counts and
the Cochran rule for G5. `test.trend`: R's `prop.trend.test` (weighted regression of x/n on scores;
scores `rank` = 1..k or typed). Fixtures:
- Serosurvey 2x2 [[116, 364], [27, 209]]: Pearson X2 16.030928230129575, p 6.231615503879597e-05;
  Yates X2 15.244605862236085, p 9.444611147584746e-05; smallest expected 47.134078212290504
  (numbers.json and SciPy agree).
- [[20, 15, 10], [10, 20, 25]]: X2 9.571909571909572, df 2, p 0.00834615115458955.
- Trend x = 15, 10, 8, 4 of n = 20 each, scores 1..4: X2 12.319296040226273, p 0.0004482997378110536
  (formula; R `prop.trend.test` via rparity).

### 7.13 Fisher exact 2x2 (`stats/fisher.js`, method `test.fisher2x2`)
Two-sided p sums tables with probability <= the observed times (1 + 1e-7) (R); conditional MLE odds
ratio and exact interval by uniroot (7.2). Fixtures:
- [[3, 1], [1, 3]]: p two-sided 0.48571428571428565 (= 34/70), p greater 0.24285714285714283
  (= 17/70, closed form); conditional MLE 6.4083 and CI 0.2117 to 621.93 (R's `fisher.test`, the pin;
  SciPy gives 6.408319658199663, 0.21173559544657844, 626.2435305888141: the upper bound differs
  because each stops its root search at its own tolerance, and the test compares with R within
  R's uniroot tolerance).
- [[7, 0], [2, 5]]: p two-sided 0.02097902097902098; MLE Infinity; CI 1.4494783668421345 to Infinity.
- Serosurvey 2x2: p two-sided 4.2061169585133306e-05; MLE 2.46402572083957; CI 1.548581946222003 to
  4.033498510763611.

### 7.14 McNemar (`stats/mcnemar.js`, method `test.mcnemar`)
b = 15, c = 5 (table [[30, 15], [5, 50]]): corrected X2 4.05, p 0.04417134490844271; uncorrected
X2 5.0, p 0.025347318677468325; exact binomial p 0.04138946533203125 (closed form; R `mcnemar.test`
via rparity).

### 7.15 2x2 measures (`epi/twobytwo.js`, method `epi.twoByTwo`)
Layout [[a, b], [c, d]]: rows exposed, reference; columns positive, negative. Measures by design (section 6).
Options: `orCi` `woolf` (default) or `exact` (Fisher, 7.13); `rrCi` `wald-log` (default) or `score`
(Koopman 1984); `rdCi` `wald` (default) or `newcombe` (Newcombe 1998 method 10); `zeroCell` `none`
(default: undefined ratios are null with a reason) or `haldane` (add 0.5 to every cell, named in the
provenance line). AFe = (RR - 1)/RR; AFp = (Rt - R0)/Rt; case-control AFe_est = (OR - 1)/OR and
AFp_est = AFe_est x a/(a + c). Fixtures:
- Serosurvey [[116, 364], [27, 209]] (numbers.json `assoc`; SciPy agrees): PR 2.112345679012346, CI
  1.431994065027821 to 3.1159376820150717, SE of log PR 0.19833583948263836; POR 2.466829466829467,
  CI 1.569739153376983 to 3.8765979719158725; PD 0.12725988700564972, Wald CI 0.07144003116402488 to
  0.18307974284727457, Newcombe 0.06802150039664043 to 0.1803240245853589.
- [[12, 8], [5, 15]]: RR 2.4, CI 1.0369277932994065 to 5.554870876468864; OR 4.5, Woolf CI
  1.1656343450444522 to 17.372514876633765; RD 0.35, Wald 0.06344951179183633 to 0.6365504882081636,
  Newcombe 0.04442262896591803 to 0.5778448205440445; AFe 0.5833333333333334; AFp 0.4117647058823529;
  AFe from OR 0.7777777777777778.
- Score (Koopman) RR intervals: R only (rparity; `PropCIs::riskscoreci` if the webR repository has
  PropCIs, otherwise the formula written in base R in the fixture script with the paper cited).
Cross-check: epiR `epi.2by2` with `method` "cross.sectional", "cohort.count", "case.control" (rparity).

### 7.16 Mantel-Haenszel (`epi/mh.js`, method `epi.mantelHaenszel`)
Options: `measure` OR or RR/PR (by design), `orCi` `rgb`, `rrCi` `greenland-robins`, `cmhContinuity`
true (R default), homogeneity Breslow-Day with Tarone (OR) or Woolf (RR). Strata with fewer than two
animals are skipped and counted. Fixtures:
- Serosurvey, farm as stratum (the G1 "within-farm" route; numbers.json `assoc.mh`): 49 strata, 43
  informative; MH PR 2.17392147567125, CI 1.4682451741496192 to 3.218763913269349; MH OR
  2.6515688949522516, CI 1.6526404613060854 to 4.254293519548609; CMH with continuity
  16.382834934533008, p 5.175177911709187e-05; without 17.235747016676015, p 3.3016512120473e-05.
- Three strata [[10, 20], [5, 25]], [[8, 12], [6, 24]], [[15, 5], [9, 11]] (formula in Python):
  OR_MH 2.8668767231193386, RGB CI 1.3748779953123802 to 5.97797198994088; CMH corrected
  7.02927293327764, p 0.008018790303037992; Breslow-Day 0.19007413066610213 (p 0.909339228882206);
  Tarone 0.19003357094252898. R pin: `mantelhaen.test` and Breslow-Day (DescTools
  `BreslowDayTest(correct = TRUE)` when available in webR, else the formula in base R) via rparity.

### 7.17 Frequency (`epi/frequency.js`)
- `freq.proportion` (apparent prevalence): 7.5; course 107002 17/179 = 9.5%; 107003 period 10/20 = 50%,
  point 7/18 = 38.89% (the denominator on that date).
- `freq.incidenceRisk`: new cases over the population at risk (prevalent animals removed); course
  107004: 20/(200 - 5) = 10.26% (0.10256410256410256).
- `freq.incidenceRate`: cases over animal-time with the exact Poisson interval; course 107006: 7/1,089
  animal-months = 6.4 per 1,000 (6.427915518824609), exact CI 2.584355419210161 to 13.243962682922293
  per 1,000 (SciPy chi-square quantiles; R `poisson.test(7, 1089)` via rparity).
- `freq.truePrevalence`: Rogan-Gladen (AP + Sp - 1)/(Se + Sp - 1), interval = the apparent interval's
  bounds transformed, clipped to 0..1 with a sentence when clipped; null with a reason when Se + Sp <= 1.
  Closed form: AP 0.2, Se 0.95, Sp 0.98 gives 0.19354838709677413. Serosurvey (numbers.json
  `prev.trueP`): 0.1941391941391941 with the DEFF-adjusted Wald bounds transformed, 0.1533502877291755
  to 0.2349281005492129. Methods that carry the uncertainty of Se and Sp (Reiczigel 2010; Bayesian) are M2.

### 7.18 Diagnostic accuracy (`epi/diagnostic.js`, method `dx.accuracy`)
Se, Sp, PPV, NPV, accuracy, prevalence in the sample (Wilson default or exact); LR+ and LR- with the
log method. Fixtures: course 107013/107015 (TP 90, FN 10, FP 60, TN 120): Se 0.9, Sp 2/3, accuracy 0.75,
PPV 0.6, NPV 0.9230769230769231, LR+ 2.7 (CI 2.174001767463347 to 3.3532631431602113), LR- 0.15
(CI 0.08256956466027612 to 0.2724975006538292); Wilson and exact intervals for each in the JSON.
Course 107014 (FeLV: 32, 8, 16, 944): Se 0.8, Sp 0.9833333333333333, LR+ 48 (CI 28.823822419131385
to 79.93388130474811). R pin: epiR `epi.tests` via rparity. G19 note on PPV and NPV.

### 7.19 Agreement (`epi/kappa.js`, methods `agree.kappa`, `agree.percent`)
Fixtures: 3x3 table [[20, 5, 1], [4, 15, 6], [1, 3, 25]]: po 0.75, kappa 0.6232634801036026, linear
weighted 0.6967608545830463, quadratic weighted 0.7667638483965014 (formula; R `irr::kappa2` via
rparity). 2x2 [[40, 9], [6, 45]]: po 0.85, kappa 0.6995192307692307, PABAK 0.7, prevalence index
0.05, bias index 0.03 (formula; epiR `epi.kappa` via rparity). Course 107027: 865/986 =
0.8772819472616633. Course 107023: kappa 0.65 falls in the course's band "substantial" (0.60 to 0.79);
the bands are shown as the course's, beside the number.

### 7.20 Guardrails (`epi/guardrails.js`)
The M1 set and severities are listed in the file (G1 to G13, G16 to G20, G24 to G26). Behaviour:
- G1 stop: a cluster column (codebook `clusterKey`) repeats among the rows used and `spec.cluster.route`
  is null. The envelope has status `stopped`, every p-value null with `epi.guard.G1.withheld`, and the
  G1 panel shows ICC, DEFF and effective n first (`clusterPanel`), then the routes: `mh-within` (farm as
  stratum; needs the exposure to vary inside farms), `deff` (DEFF-widened Wald intervals and the p-value
  from the same widened SE), `aggregate` (one row per farm; disabled with a reason when the exposure is
  measured on the animal), GEE and mixed models shown as M3. "Choose by design, not by result": routes
  are offered before any result is shown, and the chosen route is written into the methods paragraph.
- G2 stop: exposure constant within every cluster while the outcome is per animal: only `aggregate`.
- G3 stop from `checkDesign`. G6 stop: pair column present, independent test requested. G9 stop.
  G16 stop. G26 stop (import questions unanswered).
- Serosurvey fixture for G1 (numbers.json): ICC 0.05057853226668923, DEFF 1.7008739471241223 with
  m = 728/49 = 14.857142857142858, effective n 428.01525723344724; DEFF-widened Wald CI for the
  prevalence 0.1626157675881332 to 0.23848313351076791; DEFF-widened PR CI 1.272298891572946 to
  3.507040914046339.

### 7.21 Clustering (`epi/cluster.js`, method `cluster.iccDeff`)
ICC by the one-way ANOVA estimator with unequal cluster sizes (n0), DEFF = 1 + (m - 1) ICC with m the
mean cluster size (option: n0), effective n = n / DEFF. Fixtures: serosurvey (7.20); continuous
clusters F1 = 4.1, 3.8, 4.5, 4.0; F2 = 5.2, 5.0, 4.8; F3 = 3.1, 3.5, 3.3, 2.9, 3.6; F4 = 4.4, 4.9:
MSB 2.130190476190477, MSW 0.07930000000000004, n0 3.380952380952381, ICC 0.8843857163391446
(formula; R base formula via rparity). Course 107039: m 15, ICC 0.05 gives DEFF 1.70.

### 7.22 Sample size (`epi/samplesize.js`, methods `ss.*`)
Every result names its formula and shows the adjustment chain (base n, finite population correction,
DEFF, non-response), rounding up once at the end of each shown step as the course does. Course mode
reproduces the course; alternatives are shown beside it, never instead of it. Fixtures (course file;
unrounded values from the formulas; z(0.975) = 1.959963984540054, z(0.8) = 0.8416212335729143):
- 107029 case-control, OR 3, p0 0.25, 1:1: p1 0.5; course pooled 58.86659800761816 (59); Fleiss
  57.673436738908386 (58); Fleiss with continuity 65.42889646903588 (66). epiR `epi.sscc` via rparity.
- 107035 paired, d 0.8: 12.263874584920451 (13, normal approximation); t-based (`pwr::pwr.t.test`) via rparity.
- 107036 one mean, SD 0.5, margin 0.1: 96.04 with z = 1.96 as the course writes it, 96.03647051735314
  with exact z; 97 either way.
- 107038 FPC, n0 544, N 2,000: course form 427.84113252064486 (428); epiR form 427.67295597484275.
- 107039 DEFF 1.70, 428 x 1.70 = 727.6 (728). 107040 non-response 40%: 333.33 (334).
- Prevalence, p 0.5, d 0.05: 384.14588206941255 (385).

## 8. Intake (owner: intake; `research/src/lib/intake/*`)

### 8.1 Pipeline (`preview.js` `buildPreview`)
bytes -> `decodeBytes` (strict UTF-8 with BOM detection, UTF-16 LE by BOM, else windows-874; the reason
key names the first failing byte) or `xlsx.readSheet` (sheet picker, header row detection) -> header
row -> `cleanCell` on every cell (NFC, trim, collapse spaces, strip zero-width characters) -> per column
`inferColumn` (whole column), `findMissingCodes`, `sniffDates`, `detectPii` -> `proposeCodebook` ->
a list of `Conversion`s (encoding, Thai digits, BE years, two-digit years, 29 February, Excel date IDs,
missing codes, trims, invisible characters, NFC changes, type conflicts, PII) with at most five
examples each (row id, from, to) -> the `import-conversions` step the confirm button saves. Nothing is
converted silently: every conversion is listed before the student confirms, and questions without an
answer (era, date order, two-digit century, missing reason) block the confirm button (G26).

### 8.2 Thai data rules (methods.md 5.2 to 5.4)
Thai digits U+0E50 to U+0E59 become Arabic before numeric parsing; NFC never NFKC; `Intl.Collator('th')`
for category order; dates stored as days since 1970-01-01 (proleptic Gregorian, CE), never through
`new Date(string)`; BE years detected when four-digit years fall in 2400 to 2700 and confirmed per
column; two-digit years asked once per column ("8/8/69" with century 2500 reads BE 2569); 29 February is
checked in the calendar the rule names (29/02/2567 is valid as BE 2567 = CE 2024, invalid if "2567"
were read as a CE year); day-first unless a value settles otherwise; missing codes carry a reason
(unknown, not applicable, not recorded).

### 8.3 Codebook
Asked once at import, editable later, exported with every result: name, labels TH/EN, type, role,
level of organisation, unit, levels (order = ordinal order), reference level, positive level, missing
codes with reasons, range, PII kind, hidden flag; dataset-level unit of analysis and cluster column.
PII columns (names, phone numbers, 13-digit national IDs with checksum, addresses, LINE IDs, email) are
hidden from the grid and from every export by default and masked when shown.

### 8.4 Recipe steps (`recipe.js`)
The raw table is stored once and never changed; `applyRecipe(raw, codebook, steps)` replays the steps
in `seq` order. Row ids: `r1`..`rN` in source order; typed rows `n1`, `n2`.

| Kind | Params | Notes |
|---|---|---|
| `import-conversions` | `{ encoding, perColumn: { [key]: { thaiDigits, trim, nfc, invisible, dates: { order, era, twoDigitCentury, excelSystem } | null, missingCodes: [{code, reason}], cellFixes: [{ rowId, from, to, why }] } } }` | written by the confirm button; `cellFixes` carries accepted ID fixes (IDs Excel turned into dates or stripped of leading zeros) |
| `set-type` | `{ column, type }` | |
| `missing-code` | `{ column, code, reason }` | |
| `cell-edit` | `{ rowId, column, from, to }` | D4(a); `from` must equal the current value or the step is rejected |
| `row-add` | `{ rowId: 'nK', values: { [column]: text } }` | D4(a), paper questionnaires |
| `row-exclude` | `{ rowId }` | reason required |
| `recode` | `{ column, target, map: [{ from: [values], to }] }` | D4(b); `target` is a new derived key `dK` (the original stays) or the same key |
| `bin` | `{ column, target, cutpoints, closed: 'left'|'right', labels, cutSource: 'typed'|'literature'|'median'|'quantile' }` | D4(b); G13 reads `cutSource` |
| `reference` | `{ column, level }` | D4(b); sets the reference level |
| `filter` | `{ conditions: [{ column, op: 'eq'|'ne'|'in'|'lt'|'le'|'gt'|'ge'|'between'|'missing'|'present', value }], combine: 'and'|'or' }` | D4(b); reason required; filtered rows are counted as `filter` drops |
| `derive-age` | `{ birth, event, unit: 'months'|'days'|'years', target }` | months as numbers.json computes them |

`describeStep` gives one sentence per step for the project log and the methods paragraph.

### 8.5 WorkingTable
Column-major: numbers and dates in `Float64Array` (NaN = missing), categories as `Int32Array` level
indexes (-1 = missing) with `levels`, text as arrays; a `Uint8Array` of missing reasons per column;
`excluded` maps row id to the step that excluded or filtered it. Typed arrays are transferred to and
from the worker.

### 8.6 Fixtures for intake
- The serosurvey file enters the repo as `research/tests/fixtures/serosurvey/serosurvey-2569.csv`
  with `numbers.json` and `check.py` beside it, after one change: its phone column holds 49 made-up but
  plausible Thai mobile numbers, and the repo is public, so the intake role regenerates that column with
  numbers no operator assigns (for example the `000` prefix) and keeps the PII detector test on a
  phone shape it accepts; update `numbers.json` `file.bytes` and `file.sha256` and rerun `check.py`
  (the statistics do not use the phone column). Until then the file stays in `work/`.
- Pins: the numbers.json `conv` block (90 Thai-digit cells in farms F07, F21, F33; 1,429 BE date cells;
  15 two-digit-year cells, example "8/8/69"; three 29/02/2567 birth dates; missing codes per column; 10
  trailing-space cells in farm F27; Excel-date IDs "7-Apr" and "12-Apr"; PII columns ชื่อเจ้าของ and
  เบอร์โทร with 45 and 49 distinct values; windows-874, strict UTF-8 fails).
- Small synthetic files per rule (UTF-8 with and without BOM, UTF-16 LE, TIS-620 bytes, a zero-width
  space in "ไก่", SARA AM typed as NIKHAHIT + SARA AA, 1900 vs 1904 Excel serials, 29 February) with the
  expected result written beside each.

## 9. Storage, sign-in and privacy (owner: runtime; `research/src/lib/store/*`, `lib/auth/*`)

### 9.1 IndexedDB `vmx-research-v1`, version 1 (`db.js`)
Stores (keyPath `key` = `${owner}/${id}`; owner = `guest` or `u.<uuid>`): `projects` (index owner),
`datasets` (owner, project), `blocks` (owner, dataset; raw column blocks of 4,096 rows, key
`${owner}/${datasetId}:${col}:${block}`), `analyses` (owner, project), `log` (owner, project; key
`${owner}/${projectId}:${seq padded to 8}`). Open with a 3 s timeout (Safari private windows) and an
in-memory fallback the UI announces; a save is reported only on transaction `complete`; `blocked` and
`versionchange` close the connection and ask for a reload (`runtime.store.reloadNeeded`).

### 9.2 Records
Projects and datasets write compare-and-set on `rev` inside one readwrite transaction (two tabs cannot
overwrite each other). Datasets check `navigator.storage.estimate()` before writing and refuse when the
dataset would take more than half of what is left. Analyses may be frozen: a frozen snapshot keeps its
envelope and data fingerprint; after a recipe change it is labelled as computed on an earlier version
of the data, never recomputed silently. Deleting a project removes its datasets, blocks, analyses and
log in one transaction; "ลบข้อมูลวิจัยทั้งหมดในเครื่องนี้" removes this owner's records only.

### 9.3 Project log (`log.js`)
Append-only: import, recipe, analysis, freeze, download, project-import, claim, delete. Never cell
values. Every M1 entry has `egress: 'none'`; the rail's "ส่งข้อมูลออกนอกเครื่อง: ไม่มี" line reads it.

### 9.4 Project file (`project-file.js`)
Export: JSON (`format: 'vetmock-research-project'`, `version: 1`) with the project, datasets (raw
table, codebook, steps), analyses (envelopes via `serializeEnvelope`), and the log; file name
`<project name>-<YYYY-MM-DD>.vmresearch.json`; the project records `lastExportAt`. Import: size cap
50 MB, full valibot validation, a preview of what will be added, always a new project with new ids,
logged. PII columns travel inside the project file (it is the student's own backup); exports of tables
and data (CSV, Word, charts) leave hidden PII columns out.

### 9.5 Preferences (`prefs.js`, done)
One localStorage key, `vmx-research-prefs-v1`: `lang`, `theme`, `entranceSeen`, `lastProjectId`;
read and written in try/catch; never `localStorage.clear()`.

### 9.6 Health (`health.js`)
Storage mode, usage and quota, `persisted()`, and a Safari flag (seven-day rule outside an installed web
app) so the project list nudges a download. `navigator.storage.persist()` only from an explicit button.

### 9.7 Sign-in (`lib/auth/*`)
Supabase Auth with redirect (no popups; COOP `same-origin`), `redirectTo` `https://research.vetmock.com/app`
(the orchestrator adds `https://research.vetmock.com/**` to Supabase Redirect URLs). `useOwner()` returns
`guest` or `u.<id>`; the workspace remounts on owner change. On the first sign-in in a browser,
`claimGuestProjects` re-keys every guest record into the account in one transaction per project and
writes a `claim` log entry. Sign-out keeps the data on the device and says so beside a delete button.

### 9.8 No egress (tests/unit/no-egress.test.mjs, done; an e2e spec by runtime)
No `fetch`, XHR, WebSocket, EventSource, `sendBeacon` or `importScripts` anywhere except the service
worker template (same-origin static files) and `lib/auth` (Supabase Auth); Supabase imported only by
`lib/auth`; no import of the main app's network or sync modules; `lib/store/prefs.js` is the only file
that touches localStorage. The e2e spec `research-network-silence.spec.js` imports the serosurvey file,
runs every M1 method and asserts that no request left the origin.

## 10. The analysis contract (owner: runtime; `research/src/lib/runtime/*`)

### 10.1 AnalysisSpec (`spec.js`; typedef in `types.js`)
`{ specVersion: 1, method, input: { kind: 'dataset', datasetId, recipeRev } | { kind: 'counts', counts }
| { kind: 'params', params }, design, roles, levels, options, cluster: { route, column } }`.
Roles: `outcome`, `exposure`, `group`, `x`, `y`, `strata`, `cluster`, `pair`, `raterA`, `raterB`,
`test`, `reference`, `covariates[]`. Levels: `outcomePositive`, `exposureLevel`, `referenceLevel`,
`testPositive`, `referencePositive`, `order[]`. Options always include `confLevel` (default 0.95) and
`alternative` (`two.sided`, `less`, `greater`; default `two.sided`), plus the per-method table in
`DEFAULT_OPTIONS` (done in `spec.js`):

| Method | Options and allowed values (default first) |
|---|---|
| desc.summary | quantileType 7, 6 |
| desc.table1 | quantileType 7, 6; summaries {col: median-iqr, mean-sd, n-percent}; percentDenominator known; showMissing true; byLevel true |
| freq.proportion | ciMethod wilson, exact, wald, agresti-coull |
| freq.truePrevalence | apparentCiMethod wilson, exact, wald; clip true; params Se, Sp (0..1) |
| freq.incidenceRisk | ciMethod wilson, exact, wald |
| freq.incidenceRate | ciMethod exact-poisson; per 1000, 100, 1 |
| epi.twoByTwo | orCi woolf, exact; rrCi wald-log, score; rdCi wald, newcombe; zeroCell none, haldane |
| epi.mantelHaenszel | measure OR, RR; orCi rgb; rrCi greenland-robins; cmhContinuity true, false; homogeneity breslow-day-tarone (OR), woolf (RR) |
| test.chisq | yates false, true |
| test.fisher2x2 | alternative; confLevel |
| test.mcnemar | continuityCorrection true, false; exact false, true |
| test.trend | scores rank, or an array |
| test.tTest | variant welch, pooled, paired, one-sample; mu 0 |
| test.anova1 | posthoc tukey, pairwise-t-holm, pairwise-t-bonferroni, none |
| adjust.pValues | method holm, bonferroni, none |
| test.mannWhitney | exact auto, exact, normal; continuityCorrection true, false |
| test.wilcoxonSignedRank | exact auto, exact, normal; continuityCorrection true, false |
| test.kruskalWallis | (none) |
| corr.pearson | ciMethod fisher-z |
| corr.spearman | exact auto, exact, normal; ciMethod none |
| reg.ols | intercept true |
| dx.accuracy | ciMethod wilson, exact; lrCi log |
| agree.kappa | weights none, linear, quadratic |
| agree.percent | ciMethod wilson, exact |
| cluster.iccDeff | estimator anova-oneway; clusterSize mean, n0 |
| ss.proportion | z exact, course-1.96; fpc course, epiR, none; roundUp true |
| ss.twoProportions | formula pooled, fleiss, fleiss-cc; z; roundUp |
| ss.caseControl | formula course-pooled, fleiss, fleiss-cc; z; roundUp |
| ss.mean, ss.twoMeans, ss.paired | formula normal (t-based alternative shown from R's numbers); z; roundUp |

`normalizeSpec` writes every option into the spec; `validateSpec` rejects unknown methods, unknown
options and values outside these lists. `auto` choices are resolved by `normalizeSpec` and the resolved
value is what the envelope stores (for example `exact: 'auto'` becomes `'exact'` or `'normal'` with the
reason in a note).

### 10.2 ResultEnvelope (`envelope.js`; typedef in `types.js`)
`{ envelopeVersion: 1, status: 'ok'|'stopped'|'invalid', method: { id, family, milestone }, spec,
values: { [name]: { value, ci, ciLevel, ciMethod, se, reasonKey } }, tests: [{ id, statistic: { name,
value }, df, p, alternative, variant, reasonKey }], tables: [{ id, columns, rows }], guard: { stops,
warnings, notes }, provenance: { methodId, options, engineVersion, engineTier: 'A', rowsUsed,
rowsDropped: [{ reason, column, count }], dataFingerprint, recipeRev, computedAt, validatedAgainst },
verified }`. Numbers at full precision; formatting happens only at display (10.6). A stop leaves every
p-value null with `epi.guard.G1.withheld` (or the stop's own key). Value names per method are listed in
each module's JSDoc (e.g. `PR`, `POR`, `PD`, `RR`, `OR`, `RD`, `AFe`, `AFp`, `AFeEst`, `AFpEst`,
`estimate`, `icc`, `deff`, `nEff`). `serializeEnvelope` writes Infinity as the string `"Infinity"`.

### 10.3 Pipeline (`run.js`, `registry.js`)
`runAnalysis(spec, table, codebook)`: validate, normalise, `checkDesign`, `evaluateGuards`, and when
nothing stops, `IMPLEMENTED[method](spec, table)`; then `makeEnvelope` with provenance. A method appears
in `IMPLEMENTED` only when its fixture test is green (runtime adds the row). Every implementation
returns `{ status, values, tests, tables, used, dropped }`.

### 10.4 Fingerprint (`fingerprint.js`)
SHA-256 of a canonical CSV of the rows in use (keys in codebook order, rows in row-id order, shortest
round-trip numbers, CE dates as YYYY-MM-DD, level text, empty for missing, LF, UTF-8 without BOM,
RFC 4180 quoting). Stored in frozen snapshots and printed (first 8 hex) in the provenance line.

### 10.5 Provenance line (`provenance.js`)
Under every result and every exported table, from the envelope only, separators " | ":
`Welch t-test | 95% CI | ใช้ 716 แถว ตัดออก 12 แถว (อายุไม่ทราบ 12) | ข้อมูล 3f2a9c1b | Research Studio M1 (research-studio-m1-0.1.0)`,
and "ตรวจเทียบแล้ว" / "verified" only when `envelope.verified`. The tap-to-expand panel shows every option.

### 10.6 Number display (`stats/format.js`)
p: never 0, 0.000 or .000; below 0.001 "< 0.001"; otherwise three decimals with a leading zero; no
stars. Estimate and interval before p everywhere. Ratios below 10 with 2 decimals, 10 or more with 1;
percentages with 1 decimal; never more digits than the method's fixture tolerance proves. Null prints
"—" and its sentence. Arabic digits, en-US grouping. An open bound prints "ไม่มีขอบบน" / "no upper limit".

## 11. Engine: worker protocol (owner: runtime; `protocol.js`, `engine.worker.js`, `client.js`)

`createEngine()` starts `new Worker(new URL('./engine.worker.js', import.meta.url), { type: 'module' })`
and waits for `hello` (3 s). Requests `{ id, op, payload }`, replies `{ id, type: 'result'|'progress'|
'error', result | progress | error: { code, key, detail } }`. Ops: `hello`, `sheets` ({ bytes }),
`parse` ({ bytes, fileName, format, encoding, sheet, headerRow } -> ParsePreview, with progress),
`apply` ({ raw, codebook, steps } -> WorkingTable, typed arrays transferred), `run` ({ spec, table,
codebook } -> ResultEnvelope). File bytes are transferred, never copied. Watchdogs: hello 3 s, sheets
30 s, parse 60 s, apply 30 s, run 30 s; on expiry or cancel the client terminates the worker and starts
a new one on the next call. Fallback without module workers (iOS 14): the same pure modules on the main
thread, refusing inputs over 2 MB or 20,000 rows with `runtime.engine.tooLargeForFallback`. The
workspace starts the engine on entry and imports every workspace chunk then (fit.md R7), and disposes it
on unmount. Worker code uses `self.` for every global. Measured 27 Sep: a module worker importing the
stdlib kernels and SheetJS bundles to one 820 KB chunk and answers `hello` in Chromium.

## 12. Service worker (owner: runtime; `build/sw-plugin.mjs`, `src/sw/sw-template.js`, `sw-register.js`)

D4(d): research.vetmock.com has its own worker because `public/sw.js` cannot control another origin.
Static files only: precache `index.html`, `/assets/*`, `/fonts/*`, icons and the manifest; navigations
network-first with the cached `index.html` as the offline fallback; `/assets/*` and `/fonts/*`
cache-first; POST, other origins (Supabase included) and IndexedDB never touched. No `skipWaiting`
from the page and no reload of an open page: a new version takes over on the next visit. The plugin
replaces `self.__RS_PRECACHE__` and `self.__RS_SW_VERSION__` (sha-256 of the sorted list plus the
template, first 12 hex) and fails the build if either placeholder survives. `index.html`, the manifest and
the install icons are listed by name, because Vite's HTML plugin can emit `index.html` after this plugin
runs and `public/` never enters the bundle (without them the offline reload of `/app` failed). Registered after first paint,
only on https or localhost. E2E: `research-offline.spec.js` (visit, go offline, reload `/app`, open a
project, run an analysis).

## 13. Fixtures and the verified flag (owners: rparity for R, each builder for its own tests)

### 13.1 Layout
`research/tests/fixtures/`: `course/epi-course-2026.json` (done), `published/nist/` (done),
`crosscheck/scipy_crosscheck.py` and its JSON (done), `serosurvey/` (intake, 8.6), `r/<method>.R` and
`r/out/<method>.json` (rparity), `intake/` small files (intake).

### 13.2 R fixtures (rparity)
R 4.6.0 through webR 0.6.0 in Node, installed outside the repo (for example
`C:\Users\palmz\Desktop\vmu\webr-runner`), packages from repo.r-wasm.org; one script per method under
`tests/fixtures/r/`, each reading the literal datasets of section 7 (or R's own datasets, written out by
the script) and writing JSON with `sprintf('%.17g')` numbers, `R.version.string`, `webR` version and
`sessionInfo()` package versions. A runner `research/scripts/r-parity/run-webr.mjs` regenerates every
file; `--check` compares without writing. The CI parity workflow (`.github/workflows/research-r-parity.yml`,
r-lib/actions/setup-r pinned to 4.6.0) is the second check and is owned by rparity. When a package is not
in the webR repository, the script writes the formula in base R and cites the paper; the JSON says so.

### 13.3 Test shape
Each method's test reads its fixture files, computes with the module's pure core, and asserts per value
with the tolerance of section 7; it names the fixture family in the assertion message. The
injected-wrong-value proof is recorded once per module (section 7 general rules).

### 13.4 Declaring fixtures
JSON fixtures carry `_fixture: { family, kind: 'pin'|'crosscheck', methods: [...] }` (course and the
SciPy file have it; NIST's is in `published/nist/fixture.json`). Families: `r-4.6.0`, `nist-strd`,
`course-2026`, `serosurvey-numbers` (pins), `scipy-1.17.1` (crosscheck).

### 13.5 verified.generated.js (`scripts/regen-verified.mjs`, runtime)
Collects pin declarations whose file path is referenced by at least one `tests/unit/*.test.mjs`, writes
`VERIFIED[methodId] = [families]`, and `--check` fails when stale. The badge "ตรวจเทียบแล้ว" appears only
when `envelope.verified`.

## 14. Exports (owner: runtime `export.js`; UI by workspace)

D4(c): every table copies to the clipboard as an HTML table that Word keeps formatted (and TSV text),
and downloads as CSV with a UTF-8 BOM; every chart downloads as SVG (colours inlined, no CSS variables)
and PNG at 300 or 600 dpi for a chosen width in millimetres (pixels = width / 25.4 x dpi, with a pHYs
chunk). The data table sits beside every chart (fit.md D17). Hidden PII columns never appear in these
exports. Each download is a `download` log entry with `egress: 'none'` (a file the student saves is not
data leaving the device through VetMock).

## 15. Landing (owner: landing; `research/src/landing/*`)

### 15.1 Port of the front door
`work/research-studio/design/`: `engine.js` (WebGL herd: 728 dots in one `gl.POINTS` draw plus a ring
draw, positions for cloud, farm grid and table computed on the GPU and mixed by two uniforms, halo in the
shader, straight alpha with `blendFuncSeparate`), `story.js` (`rsLayoutValues(t)`, the CSS keyframe
generator, variants desktop and phone, `RS_T` accessible names), `main.template.html`,
`phone.template.html`, `standalone/*.html`, `check-herd.mjs`. Port into modules under
`research/src/landing/` (`herd/engine.js`, `herd/data.js`, `story/layout.js`, `story/keyframes.js`,
sections as components) with the rules of section 3. The stage follows the theme (paper for light,
dark for dark). All visible copy moves to `i18n/landing.js` in both languages.

### 15.2 Numbers on the landing
Every number printed on the page is computed from the herd data itself (seed 27953: 146 positives, ICC
0.051, DEFF 1.70, effective n 428, DEFF-adjusted Wald CI 16.3 to 23.8) or read from the committed
evidence; a unit test ports `check-herd.mjs` so the page cannot print a number its data stops
producing.

### 15.3 The chapter "what CUVET papers use"
From `src/landing/evidence/epmc-methods-2026-09-25.json` (`cuvet` block) and
`epmc-methods-2026-09-27.json` (`methods` block), joined through `catalog.js` `FAMILIES[].evidence`.
Bars to scale (the axis starts at 0, the largest bar is ANOVA, 220 of 698), sorted by count, each
labelled with the family name, the count and the share of 698, and its status from `familyStatus()`
(section 5). Printed with the chart: the base query, "698 full-text papers", the check date of each
file, "counted in the METHODS section; a paper can count in several families; a mention is not an
analysis", and links to the evidence files and the 27 Sep script on GitHub (the repo is public).
The chart animates in with the house motion rules (bars grow by `transform: scaleX` from their origin;
reduced motion shows them at full length), has an accessible table beside it, and never shows a count
that is not in the files. The 25 Sep file also has a `thai_vet` block (2,677 papers); it may appear as a
second series only if labelled as all Thai veterinary papers.

### 15.4 Other landing pieces
Hero with the herd; the scroll story (how it works, accuracy, the result card, privacy); the chart;
"ทำต่อ" when `prefs.lastProjectId` exists (A2); links to `/app` and `/licenses`; the language switch;
no third-party requests.

## 16. Workspace entrance (owner: landing; `research/src/entrance/Entrance.jsx`)
The first time `/app` opens on a device (`prefs.entranceSeen` false), a designed transition: the herd
from the landing settles into the project list's grid, then hands over to the real list. Skippable
(button and Escape), under 2.5 s, never blocks input to the list behind it once the list is ready,
still under reduced motion, and never prints a number that is not the student's own (the project count
comes from the store). Later visits go straight to the list with a short cross-fade. Same WebGL rules as
the landing, sharing `herd/engine.js`.

## 17. Workspace screens (owner: workspace; `research/src/workspace/*`)

The 13 boards in `work/research-studio/workspace/` (build.mjs holds each board's markup and copy):
Main (projects), Import, Codebook, Data (virtualised grid with `@tanstack/react-virtual`; converted cells
tinted, missing as a dash with the reason, PII hidden, derived columns marked; cell edits and typed rows
as recipe steps), Design, Prevalence (with the herd), Association (after a route is chosen; the phone
board shows the G1 stop state), Table 1, Report (methods and results draft in Thai and English, built by
`workspace/report/*` from envelopes and recipe steps, never typed numbers), Course (sample size, its own
short rail, no "ข้อมูลสมมุติ" chip), and the three phone screens. Top bar: wordmark, project crumb,
"คำนวณในเครื่องนี้", ไทย/EN, account. Rail: data (import, codebook, data), analysis (design, prevalence,
association, Table 1), report, tools (sample size), and the project log with the egress line and the file
fingerprint. A CI plot is hand-drawn SVG with a data table beside it; results show estimate and CI before
p. Copy starts from the boards and moves into `i18n/workspace.js` and `i18n/report.js`, both languages.

## 18. File ownership (every file belongs to exactly one role)

architect (this commit; handed over as shown): `research/package.json` and `package-lock.json`
(nobody edits them in M1; a new dependency goes through the orchestrator), `research/.gitignore`,
`research/playwright.config.js` (-> runtime), `research/vite.config.js` (-> runtime),
`research/vercel.json` (-> runtime), `research/index.html` (-> runtime), `docs/research/M1-DESIGN.md`
(this file; roles append decisions in their notes, the integrator folds them in).

| Role | Files |
|---|---|
| runtime | `research/build/shared-fonts.mjs`, `research/build/sw-plugin.mjs`, `research/src/main.jsx`, `research/src/i18n/index.js`, `research/src/i18n/runtime.js`, `research/src/lib/runtime/*` (types, protocol, catalog, registry, verified.generated, spec, envelope, run, engine.worker, client, fingerprint, provenance, export, sw-register), `research/src/lib/store/*`, `research/src/lib/auth/*`, `research/src/sw/sw-template.js`, `research/src/licenses/*` (the `/licenses` page and notices, rendered by the workspace route), `research/public/manifest.webmanifest`, `research/scripts/regen-verified.mjs`, `research/tests/unit/{i18n-dictionaries,no-egress,catalog,runtime-*,store-*,export-*,prefs-*}.test.mjs`, `research/tests/e2e/{research-network-silence,research-offline,research-persistence,research-headers}.spec.js` |
| intake | `research/src/lib/intake/*`, `research/src/i18n/intake.js`, `research/tests/fixtures/serosurvey/*`, `research/tests/fixtures/intake/*`, `research/tests/unit/intake-*.test.mjs` |
| stats | `research/src/lib/stats/*`, `research/src/i18n/stats.js`, `research/tests/unit/stats-*.test.mjs` |
| epi | `research/src/lib/epi/*`, `research/src/i18n/epi.js`, `research/tests/fixtures/course/*`, `research/tests/unit/epi-*.test.mjs` |
| workspace | `research/src/App.jsx`, `research/src/router.js`, `research/src/workspace/**`, `research/src/styles/tokens.css`, `research/src/styles/base.css`, `research/src/styles/workspace.css`, `research/src/i18n/{common,terms,workspace,report}.js`, `research/tests/unit/{router,i18n-glossary,report-*,workspace-*}.test.mjs`, `research/tests/e2e/research-workspace-*.spec.js` |
| landing | `research/src/landing/**` (including `evidence/`), `research/src/entrance/**`, `research/src/styles/landing.css`, `research/src/i18n/{landing,entrance}.js`, `research/public/icons/*`, `research/src/data/*` (generated evidence tables, e.g. `cuvet-methods.json` from `landing/evidence/build-cuvet-methods.mjs`), `research/tests/unit/landing-*.test.mjs`, `research/tests/e2e/research-landing-*.spec.js` |
| integrator | `research/tests/e2e/research-journey.spec.js` (the whole student journey on four browsers); cross-role fixes are recorded in `work/loop-2026-09-26/research-m1/integrator.md` |
| rparity | `research/tests/fixtures/r/**`, `research/tests/fixtures/crosscheck/**`, `research/tests/fixtures/published/**`, `research/scripts/r-parity/**`, `.github/workflows/research-r-parity.yml`, `research/tests/unit/rparity-*.test.mjs` |

Cross-role imports follow the direction runtime <- stats, epi, intake (pure libraries import only
`lib/runtime/types.js`, `lib/runtime/envelope.js` and each other: epi imports `stats/dist.js`,
`stats/proportion.js`, `stats/rootfind.js`, `stats/fisher.js`, `stats/chisq.js`); workspace and landing
import libraries, never the reverse. Only runtime edits `registry.js` (a method is registered when its
owner's fixture test is green).

## 19. Running things on this shared machine

- Ports 43100 to 43199 only: dev 43110 (`npm run dev`), preview 43111, e2e 43121 (override with
  `RESEARCH_E2E_PORT`); never 41731. Stop every server you start; never kill a process you did not start.
- `npm test` in `research/` runs `node --test "tests/unit/**/*.test.mjs"`; `npm run test:utc` runs it in
  UTC; `npm run e2e` runs Playwright from the root install with the four projects.
- No `npm install` in M1 builder roles; no push; no agent trailer in commits (public repo).
- Main app untouched except by the orchestrator (the command palette link to research.vetmock.com and
  the ignoreCommand that skips research-only pushes).

## 20. For the orchestrator (infra, not builder work)

- Vercel project with root directory `research`, framework Vite; keep "include files outside the root
  directory" on (the build reads `../src/data/glossary.js` in tests and `../public/fonts` in the build).
  `research/vercel.json` carries the build settings, the SPA rewrite, headers, the CSP
  (`connect-src 'self' https://mpovsdzdggvksmeehqfj.supabase.co`, no `wasm-unsafe-eval`) and an
  ignoreCommand that builds only when `research/`, `src/data/glossary.js` or `public/fonts` changed.
- Environment variables on that project: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (same values as
  the main app). Supabase Redirect URLs: add `https://research.vetmock.com/**`.
- The main app's ignoreCommand should skip pushes that only touch `research/` or `docs/research/`.
- Glossary follow-up in the main app: odds ratio, confidence interval, p-value, kappa, ICC, design effect.

## 21. Deviations from older text, noted
- fit.md's route, registration, OG cover and `src/styles-research.css` items do not apply: the Studio is
  its own app (BUILD.md, brief decision 2).
- fit.md 2.5 "worker-src 'self' blob:": the research CSP needs only `'self'`.
- engine.md 7's sample provenance line names webR; M1 lines name the Tier A engine version.
- The boards' wordmark font (Fraunces) is replaced by Sarabun 700 (A4).
