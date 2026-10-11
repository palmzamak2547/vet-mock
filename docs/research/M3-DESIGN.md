# VetMock Research M3a: the contract every M3a builder codes against

Written by the M3 architect on 2026-10-08 in the worktree `C:\Users\palmz\Desktop\vmu\research-1008`, branch
`claude/research-m3`, cut from main `63c16f36` (Research 0.1.3 as shipped on https://research.vetmock.com). Order of
authority when texts disagree: this file, then `docs/research/M2-DESIGN.md` (the shipped M2 contract: areas, chart
kit, languages, ownership; M3a extends it and never forks it), then `docs/research/M1-DESIGN.md`, then
`work/research-studio/competitor-gaps.md` (M3 = D1 M3 part, the M2 deferrals B5 and section 3.2.1, D6 M3 part).
`work/` means `C:\Users\palmz\Desktop\vet-mock\work\`. Notes of each role go to `work/loop-2026-10-08/research-m3/<role>.md`.

The product is **VetMock Research**. Never write "Research Studio" or "the Studio" in anything a person reads.

What exists after the architect's commit:
- this document;
- the R fixtures `research/tests/fixtures/r/{nonlinear,auc,qpcr,pca,anovarm2,firth,negbin}.R` with their outputs in
  `r/out/*.json`, generated with R 4.6.0 in webR 0.6.0 (`node research/scripts/r-parity/run-webr.mjs --only ...`),
  and the made-up datasets in `r/_data_m3.R`;
- ten NIST StRD nonlinear datasets in `research/tests/fixtures/stats/nist-strd-nls/` with their README and
  `fixture.json`.

Nothing in `research/src` changes in the architect's commit. Builders add code in their own files (section 8).

---

## 1. Decisions taken here (reversible, each with its reason)

| # | Decision | Why |
|---|---|---|
| C1 | M3 is cut in two. **M3a** ships the lab methods of competitor-gaps D1 (standard curves, dose-response, curve equations, area under the curve, qPCR, PCA), the M2 deferrals (two within factors, Firth, negative binomial) and their charts. **M3b** carries Tier B through webR (mixed models, Cox, GEE, ordinal, exact r x c), working together (shared snapshots, comments), the AI that turns a Thai question into an AnalysisSpec, the point map, REDCap and XLSForm codebooks, the extra reporting checklists, freedom from disease and Passing-Bablok/Deming. | M3a needs no owner decision, no new dependency and no data leaving the device. Each M3b item needs one: the AI provider budget (D9, Palm), the sync design (GOAL.md Q6), the webR licence page and its 30 MB download, map tiles from a server, or a checklist licence check. Mixed models are the most used M3 family (52 CUVET papers) and lead M3b. |
| C2 | Nonlinear standard errors are s^2 (J'J)^-1 at the least-squares solution (Gauss-Newton), the definition of R `nls`, NIST StRD's certified standard deviations and Prism's asymptotic SEs. | drc 3.0.1 takes them from a numerical Hessian of the RSS: on ryegrass its SE of the slope is 0.4651 against nls 0.4584. One definition across the module, pinned by NIST. drc stays a reference for fitted values and EC50 points. |
| C3 | The 4PL and 5PL are fitted in the log-EC50 form, f = c + (d - c) / (1 + exp(b (log x - e)))^g (drc LL2.4 with g = 1, LL2.5). EC50 and interpolated concentrations get delta-method intervals on the log scale with t on the residual df, then are exponentiated (asymmetric, as Prism's "log(agonist) vs response"). | Concentrations span decades; an interval symmetric in log units is the one that stays inside 0 and matches what lab papers report. |
| C4 | A zero concentration stays in the fit (it sits on an asymptote: log 0 = -Inf) and is drawn at an axis break. Rows with a missing concentration and a response are the unknowns of a standard curve and are interpolated, never dropped silently. | Vehicle and blank wells are part of every plate; Prism plots them at an axis break too. ELISA sheets list samples beside the standards in one column pair. |
| C5 | Interpolated concentrations carry the curve's uncertainty only. The result says so in one line. A response outside the fitted range (between bottom and top) is `null` with `lab.undefined.outsideCurve`, printed as "นอกช่วงของ standard curve" / "outside the standard curve". | drc's absolute ED does the same; an inverse prediction interval would also need the unknown's replicate variance, which most sheets do not carry. Extrapolating a sigmoid gives nonsense numbers. |
| C6 | Curve comparison is the extra sum-of-squares F test between nested least-squares fits that share one residual variance (shared EC50 against separate curves, and one curve against separate curves), with AICc beside it. The EC50 ratio between two curves uses the covariance of the joint separate fit. | Prism's default comparison; the F test is exact for linear models and the usual approximation for nonlinear ones (Motulsky and Christopoulos 2004). AICc gives the student the same decision without a p-value. |
| C7 | qPCR uses one framework (Hellemans et al. 2007): per sample log2 NRQ = -Ct_target log2 E_target + mean_i(Ct_ref_i log2 E_ref_i). With every E = 2 it is -dCt (Livak and Schmittgen 2001); reference genes combine by their geometric mean (Vandesompele et al. 2002). Tests run on log2 NRQ (dCt), never on fold changes (Yuan et al. 2006); fold changes and their intervals are 2 raised to the difference and its interval. | One code path for Livak, Pfaffl and several reference genes. Fold changes are log-normal; a t-test on them is the common error the guidance prevents. Sources verified on PubMed on 2026-10-08 (section 4.3). |
| C8 | PCA signs: in each component the loading of largest absolute value is positive, scores flip with it. | LAPACK builds disagree on signs; one rule makes the pin and the student's two runs agree. |
| C9 | Firth's correction is an option of `reg.logistic` (`method: 'firth'`), never switched on by the engine. The separation stop names it as a choice. | "Never switch a method behind the student's back" (methods.md anti-pattern 2). Firth answers separation, which M2 stops on. |
| C10 | Negative binomial regression is its own method (`reg.negbin`), offered where Poisson is. G23 (overdispersion) on a Poisson result names it. The test against Poisson halves the chi-square p-value (theta on the boundary). | Same roles and offset as Poisson; the boundary correction is the textbook test (Cameron and Trivedi 1998). |
| C11 | Two within factors extend `anova.repeated`: the role `factorB` is a second within-animal factor there. Each within effect gets its own Mauchly test and epsilons from its own orthonormal contrasts; the Huynh-Feldt epsilon uses M2's formula. | No new role name (the spec contract stays), one screen for repeated measures. M2's pinned HF formula keeps both cases consistent. |
| C12 | Area under the curve is a summary measure per animal (trapezoid on the animal's own times; total, or net of the animal's first value), followed by Welch's t-test (two groups) or one-way ANOVA (three or more) on the areas. | Matthews et al. 1990 (BMJ 300:230): analyse serial measurements by a summary per animal. Wolever's incremental area (area below baseline dropped) waits until someone asks; its several definitions would need a named choice. |
| C13 | No new dependency. Levenberg-Marquardt, Firth's penalised IRLS and profile, the negative binomial theta, the symmetric eigen decomposition and the per-effect contrasts are own code, pinned by fixtures. No `eval`, `new Function` or WebAssembly; the CSP stays as shipped. | M2 rule B12. Each of these is under 300 lines and has a reference implementation to pin against. |
| C14 | The catalogue keeps the ids it reserved for M3: `nls.fourPL` (standard curve), `nls.doseResponse` (dose-response), `qpcr.relative`, `mv.pca`; it adds `nls.equation`, `calc.auc`, `qpcr.efficiency`, `reg.negbin`. `mv.pca`'s name drops "and clustering" until clustering ships. | The landing chart counts families from these rows; reusing the ids flips standardCurve, doseResponse, qpcr and multivariate to "now" the day they register. |

## 2. How M3a plugs in

The area files of M2 (`research/src/lib/runtime/areas/`) are the only registration points. New methods go into
`lab.{options,impl,registered}.js` and `models.{options,impl,registered}.js`; the merge in `areas/index.js` is
unchanged. A method enters `<area>.registered.js` only after its fixture test is green and the injected-wrong-value
proof is in the role's notes (M2 rule).

Roles reuse M2's names (no change to `ROLE_NAMES`):

| Method | Roles |
|---|---|
| `nls.fourPL` | `x` concentration (number, at least 0; empty in the rows to interpolate), `outcome` response |
| `nls.doseResponse` | `x` dose or concentration, `outcome` response, `group` optional (one curve per level; the comparison needs two or more) |
| `nls.equation` | `x`, `outcome` |
| `calc.auc` | `subject` animal, `time` (number), `outcome`, `group` optional |
| `qpcr.relative` | `outcome` Ct of the gene of interest, `items` Ct of the reference genes (one or more), `group` with `controlLevel` (the calibrator group) |
| `qpcr.efficiency` | `x` log10 of the input amount, `outcome` Ct |
| `mv.pca` | `items` numbers (two or more), `subject` optional (point labels), `group` optional (point colours) |
| `anova.repeated` | as M2, plus `factorB` as a second within factor (data in long form: one row per animal per combination) |
| `reg.negbin` | as `reg.poisson`: `outcome` count, `covariates`, `time` (animal-time, log offset) |

Options (defaults first; valibot `allowed` lists in the area files):

| Method | Options |
|---|---|
| `nls.fourPL` | `model` '4pl', '5pl' |
| `nls.doseResponse` | `model` '4pl', '5pl'; `compare` 'none', 'ec50', 'all' (the screen sets 'ec50' when a group is chosen) |
| `nls.equation` | `equation` 'michaelisMenten', 'decay', 'growth' |
| `calc.auc` | `baseline` 'zero', 'first' |
| `qpcr.relative` | `method` 'livak', 'pfaffl'; `efficiency` record column key -> amplification factor (1.5 to 2.5; required for every gene when 'pfaffl'); `test` 'welch', 'pooled' |
| `qpcr.efficiency` | none |
| `mv.pca` | `scale` true (correlation matrix), false (covariance matrix) |
| `reg.logistic` | adds `method` 'ml', 'firth' (models area, own method) |
| `reg.negbin` | `ciMethod` 'profile', 'wald' |

Guard membership (`g1Subject`): `calc.auc`, `qpcr.relative`, `reg.negbin` (the comparisons assume independent
animals). `mv.pca`, the curve fits and `qpcr.efficiency` are descriptive or within one assay and stay out.

Design offers: `experiment` offers every M3a lab method and `reg.negbin`; `cross-sectional`, `cohort` and `trial`
offer `reg.negbin` and `mv.pca`; `descriptive` offers `mv.pca`. Question groups (`method-questions.js`, ui-analysis):

| id | pane | layout | methods |
|---|---|---|---|
| `standardCurve` | lab | `assay` | `nls.fourPL` |
| `doseResponse` | lab | `doseResponse` | `nls.doseResponse` |
| `curveEquation` | lab | `curve` | `nls.equation` |
| `areaUnderCurve` | lab | `repeated` | `calc.auc` |
| `geneExpression` | lab | `qpcr` | `qpcr.relative`, `qpcr.efficiency` |
| `manyMeasures` | lab | `multivariate` | `mv.pca` |
| `countOutcome` (M2) | models | `regression` | `reg.poisson`, `reg.negbin` |

## 3. Methods

General rules of M1-DESIGN.md section 7 and M2-DESIGN.md section 3 hold: undefined values are `null` with a
`reasonKey` (`lab.undefined.*`, `models.undefined.*`), printed "—" with the sentence; rows with a missing value in a
role are dropped and counted per column (except the standard curve's unknowns, C4); tolerances closed 1e-10
relative, iterative 1e-6 relative (fixture `tol` field); each module's fixture test fails once on an injected wrong
value, with the command and red output in the notes.

### 3.1 Lab (owner: lab; `lib/stats/*`; area `lab`)

#### 3.1.1 Nonlinear least squares (`stats/nls.js` core, `stats/curves.js` models)
- **Core.** Levenberg-Marquardt on the residuals with analytic Jacobians: lambda starts at 1e-3, x10 on a rejected
  step, /10 on an accepted one; stop when the relative change of every parameter is below 1e-10 and the relative
  RSS change below 1e-12, or after 200 iterations (status `'invalid'`, `lab.invalid.notConverged`). Covariance
  s^2 (J'J)^-1 by a QR of J (C2); a singular J'J (a parameter the data cannot determine) gives `lab.invalid.singular`.
  Parameter intervals est +- qt(0.975, df) SE. R^2 = 1 - RSS / TSS (printed as a description, never as a test).
- **Pin of the core:** the NIST StRD nonlinear sets in `stats/nist-strd-nls/` (README there): every certified
  parameter, standard deviation and residual sum of squares from both NIST starting points, log relative error at
  least 6 for the lower sets (Misra1a, Chwirut2, DanWood, Misra1b) and at least 5 for the higher sets (Rat42, Rat43,
  MGH09, Thurber, BoxBOD, Eckerle4) that converge; a higher set that does not converge from Start 1 must say
  `notConverged`, never print wrong numbers (record which in the notes).
- **4PL and 5PL** (C3, C4): gradient with the term u (log x - e) taken as 0 where u = 0 (a zero dose). Starting
  values: c and d from the lowest and highest mean responses, e from the log concentration nearest the half-way
  response, b = +1 if the response falls with dose else -1, g = 1. The direction names the potency: b > 0
  (response falls) prints IC50, b < 0 prints EC50.
- **`nls.fourPL`**: fits the rows with a concentration; interpolates the rows without one (C4, C5) with
  log x0 = e + log(((d - c)/(y0 - c))^(1/g) - 1) / b and the delta-method interval of `nonlinear.R`.
  Outputs: parameters with SE and CI, EC50 or IC50 with CI, R^2, residual SD, df; table `unknowns` (row, response,
  concentration, CI, or the reason); the curve and its 95% confidence band on a grid for the chart.
- **`nls.doseResponse`**: one fit per group (one residual variance across groups), EC50 per group; with `compare`
  'ec50' or 'all' the F test, both AICc values, and with two groups the EC50 ratio and its CI (C6).
- **`nls.equation`**: Michaelis-Menten (Vm, Km), one-phase decay (Y0, plateau, K, half-life = ln 2 / K with the
  interval from K's), exponential growth (Y0, k, doubling time = ln 2 / k likewise).
- Fixtures: `r/out/nonlinear.json` cases `ryegrass4pl`, `ryegrass5pl`, `michaelisMenten`, `decay`, `growth`,
  `compare` (datasets inside the JSON). Note in `ryegrass5pl`: drc's 5PL stops near, not at, the least-squares
  minimum (the 5PL is loosely determined there); nls's minimum is the pin and the JS must reach it.

#### 3.1.2 `calc.auc` (`stats/auc.js`)
Per animal, sorted by time, trapezoid rule; `baseline` 'first' subtracts the animal's first value (areas below
count negative). An animal with fewer than two times is dropped with reason `'incomplete'`. Animals with different
time sets are allowed (each uses its own times) and the result notes it. Comparison: Welch's t (two groups, the
difference second level minus first) or one-way ANOVA (three or more), reusing the M1 functions. Outputs: table
`areas` (animal, group, area), group means with CI, the test. Fixture: `r/out/auc.json` (`gtt`).

#### 3.1.3 `qpcr.relative`, `qpcr.efficiency` (`stats/qpcr.js`)
- `qpcr.relative` (C7): per sample log2 NRQ; groups compared against the calibrator (`controlLevel`): two groups by
  Welch's t (or pooled, option `test`), three or more by one-way ANOVA with Dunnett against the calibrator (M2
  `posthoc.dunnett` on the log2 NRQ). Outputs: table `samples` (row, group, dCt or log2 NRQ), per group the mean
  dCt; per comparison ddCt with CI and p, fold change 2^-ddCt with CI. A sample missing a reference Ct is dropped
  and counted. Guidance line (Thai and English, `lab.qpcr.guidance`): tests run on dCt; fold changes are shown,
  never tested. Fixtures: `r/out/qpcr.json` cases `livak`, `pfaffl`, `livakOneReference`.
- `qpcr.efficiency`: OLS of Ct on log10 input; slope with CI, R^2, E = 10^(-1/slope) with the interval mapped
  from the slope's, efficiency % = (E - 1) 100. A note fires outside 90 to 110% (MIQE's usual range: say "commonly
  used range", not a rule). Fixture: case `efficiency`.

#### 3.1.4 `mv.pca` (`stats/pca.js`)
Centre (and scale when `scale`) the complete rows (listwise; dropped rows counted), symmetric eigen decomposition
of the correlation or covariance matrix (cyclic Jacobi, sweeps until the off-diagonal norm is below 1e-14 of the
diagonal), sign rule C8. Outputs: per component eigenvalue, % variance, cumulative %; table `loadings`; table
`scores` (row label from `subject` when given); biplot coordinates as R `biplot.prcomp(scale = 1)`. The scree chart
draws eigenvalue 1 as a reference line for a correlation PCA only, with the sentence that it is not a rule.
Fixtures: `r/out/pca.json` cases `usarrestsScaled`, `irisCovariance`.

#### 3.1.5 `anova.repeated` with two within factors (`stats/anovarm.js`, extended)
When `factorB` is given, the data are reshaped to one row per animal with a column per combination (an animal
missing a combination is dropped, reason `'incomplete'`). Effects A, B, A x B within, and with `group` the between
effect and its interactions. For each within effect: F, df, uncorrected, GG and HF p (HF epsilon capped at 1 for
the p-value, printed uncapped), Mauchly's W and p, from that effect's orthonormal contrasts (C11). Fixture:
`r/out/anovarm2.json` cases `withinOnly`, `withBetween` (OBrienKaiser, car).

### 3.2 Models (owner: models; `lib/models/*`; area `models`)

#### 3.2.1 `reg.logistic` with `method: 'firth'` (`models/firth.js`)
Penalised likelihood l(beta) + 0.5 log|I(beta)| by Newton steps with the hat-matrix-adjusted score (Heinze and
Schemper 2002), step halving when the penalised likelihood falls, maximum step 5 (logistf), convergence 1e-10 on
the step and the score. Intervals by profile penalised likelihood (default) or Wald (`ciMethod`); p-values by
penalised likelihood ratio tests per coefficient, and per term for factors. The separation finding of M2 stays the
default path with `method: 'ml'`; its note now reads "merge levels, or use Firth's correction" and the screen offers
the switch. Fixtures: `r/out/firth.json` cases `sex2` (coefficients agree with Heinze and Schemper's published
analysis), `separation` (M2's `sep`: finite estimates and the term test).

#### 3.2.2 `reg.negbin` (`models/negbin.js`)
IRLS with the NB2 variance mu + mu^2 / theta alternating with theta by Newton on the score (MASS `theta.ml`),
starting from the Poisson fit; outer convergence on the log-likelihood (1e-10 relative). Outputs as Poisson (B, SE,
IRR with CI, profile intervals with theta held fixed, or Wald), theta with SE, the LR test against Poisson (C10),
term tests by refitting without the term (theta re-estimated). Fixtures: `r/out/negbin.json` cases `quine`
(Venables and Ripley's example) and `quineOffset` (made-up exposure as an offset).

## 4. Fixtures and sources

### 4.1 Files
| File | Methods | Source |
|---|---|---|
| `r/out/nonlinear.json` | `nls.fourPL`, `nls.doseResponse`, `nls.equation` | R 4.6.0 nls, drc 3.0.1; ryegrass (Inderjit et al. 2002), Puromycin treated (Treloar 1974), made-up `curves`, `decay`, `growth` |
| `stats/nist-strd-nls/*.dat` | the nonlinear core | NIST/ITL StRD (public domain), downloaded 2026-10-08 |
| `r/out/auc.json` | `calc.auc` | base R; made-up `gtt` |
| `r/out/qpcr.json` | `qpcr.relative`, `qpcr.efficiency` | base R; made-up `qpcr`, `dilution` |
| `r/out/pca.json` | `mv.pca` | prcomp; USArrests, iris |
| `r/out/anovarm2.json` | `anova.repeated` | anova.mlm, mauchly.test, car 3.1.5; OBrienKaiser |
| `r/out/firth.json` | `reg.logistic` (firth) | logistf 1.26.1; sex2 (Heinze and Schemper 2002), made-up `sep` |
| `r/out/negbin.json` | `reg.negbin` | MASS 7.3.65 glm.nb; quine (Aitkin 1978) |

The rparity role adds the new scripts to `.github/workflows/research-r-parity.yml`'s native run (drc, logistf
installed there) and to `tests/unit/rparity-*.test.mjs`. A difference between webR and native R is a finding.

### 4.2 Values to read before building (all in the JSON)
- ryegrass 4PL: b 2.982229644194941, EC50 3.0579547407968612 (CI 2.693885022736051 to 3.471227286183336); the
  unknown at response 4 interpolates to 3.13592591468284 (drc's absolute ED gives the same point).
- 5PL against 4PL on ryegrass: F 0.4434638662290878, p 0.513459983587455.
- curves: separate fits against one curve F 103.15791902427968; against a shared EC50 F 157.70647291391037; EC50
  ratio drug/control 2.807750690171167 (2.3852245622490647 to 3.305124415926367).
- qPCR Livak: ddCt -1.95, fold change 3.863745315699385 (3.1873475840974743 to 4.683683680773111); Pfaffl fold change
  3.6409387527178776; efficiency E 1.9695970803905143 (96.96%).
- PCA USArrests (correlation): sdev 1.5748782743912282, 0.9948694148177646, 0.5971291155025267, 0.4164493819539601.
- Two within factors, OBrienKaiser without a between factor: phase F 14.852, GG epsilon 0.772; hour F 21.631, GG
  0.498; phase x hour F 1.353, GG 0.513.
- Firth sex2: coefficients 0.12025, -1.10598, -0.06882, 2.26887, -2.11141, -0.78832, 3.09601 (intercept, age, oc,
  vic, vicl, vis, dia).
- NB quine: theta 1.2748926450535412 (SE 0.16103517877345283); LR against Poisson 1192.03.

### 4.3 Sources for the guidance text (verified on PubMed, 2026-10-08)
- Livak KJ, Schmittgen TD. Methods 2001;25(4):402-8. doi:10.1006/meth.2001.1262 (2^-ddCt).
- Pfaffl MW. Nucleic Acids Res 2001;29(9):e45. doi:10.1093/nar/29.9.e45 (efficiency-corrected ratio; open access).
- Vandesompele J et al. Genome Biol 2002;3(7):research0034. doi:10.1186/gb-2002-3-7-research0034 (geometric mean of
  reference genes; open access).
- Hellemans J et al. Genome Biol 2007;8(2):R19. doi:10.1186/gb-2007-8-2-r19 (NRQ framework; open access).
- Yuan JS et al. BMC Bioinformatics 2006;7:85. doi:10.1186/1471-2105-7-85 (tests on dCt: t-test, Wilcoxon,
  regression; open access).
- Schmittgen TD, Livak KJ. Nat Protoc 2008;3(6):1101-8. doi:10.1038/nprot.2008.73 is the usual citation for the
  comparative Ct method; its full text was not read here, so the guidance text does not cite it for statistics.
- Matthews JNS et al. BMJ 1990;300:230-5 (summary measures for serial data): the rparity role confirms the
  citation against PubMed before the guide cites it.

## 5. Charts (owner: graphs; the M2 chart kit)

New `buildChart` kinds, each pure, with its data table and accessible summary:
- `doseResponse`: points on a log x axis (zero doses at an axis break, labelled "0"), the fitted curve and its 95%
  confidence band from the envelope's grid, the EC50 or IC50 marked with its interval as a horizontal bar at the
  half-way response; one colour and shape per group.
- `standardCurve`: as `doseResponse`, plus each interpolated unknown drawn as a cross on the curve with dotted
  drop lines to both axes; unknowns outside the curve are listed under the chart, not drawn.
- `scree`: eigenvalue per component as dots joined by a line, cumulative % on the right axis.
- `biplot`: scores as points (labels from `subject` when there are 40 rows or fewer), loadings as arrows from the
  origin labelled by column name; the two scales as `biplot.prcomp`.
- `qpcrFold`: one dot per sample of 2^-(dCt - mean dCt of the calibrator) on a log2 axis by group, the group's
  geometric mean and CI as a bar, 1 as the reference line.
- `calc.auc` reuses `timeCourse` (one thin line per animal, the group mean bold) and adds the per-animal areas as a
  `dot` chart.
Pins: the band equals the fixture's `bandLower`/`bandUpper`; the qpcr dots equal 2^(log2 NRQ - calibrator mean).

## 6. Screens, words and the report

- **ui-analysis**: `METHOD_UI` entries for the eight methods (section 2 roles; `pane: 'lab'` or `'models'`), the six
  question groups and their layout drawings (`assay`, `doseResponse`, `curve`, `qpcr`, `multivariate`; `repeated`
  exists), the efficiency boxes for Pfaffl (one per chosen gene, typed as amplification factor or %, both accepted:
  values above 2.5 are read as % and divided), the `factorB` picker labelled as a second within factor on the
  repeated-measures screen, and the Firth switch beside the separation stop.
- **Languages** (M2-DESIGN.md section 9 rules, no exceptions): method names in `i18n/runtime.js` (data: rename
  `mv.pca` per C14; add the four new names); every other word in `i18n/lab.js` (lab), `i18n/models.js` (models),
  `i18n/graphs.js` (graphs), `i18n/workspace.js` (ui-analysis), `i18n/report.js` (report); new glosses in
  `i18n/terms.js` first: 4PL, EC50/IC50, interpolation, Hill slope, AICc, extra sum-of-squares F test, dCt and ddCt,
  amplification efficiency, reference gene, eigenvalue, loading, biplot, sphericity per effect, Firth's correction,
  overdispersion, theta. Thai: use `src/data/glossary.js` words when it has them; statistics terms stay English
  with a short Thai gloss once per screen.
- **Report** (report): methods sentences per method and variant (4PL or 5PL with the log-EC50 form and the SE
  definition; the comparison test; qPCR method, reference genes by codebook name, efficiencies; PCA matrix; Firth
  with profile penalised likelihood; NB with theta), results sentences (estimate and CI before p, IC50 or EC50 named
  by direction), R script and SPSS syntax exports where they exist (R: `nls`, `drc::drm`, `logistf`,
  `MASS::glm.nb`, `prcomp`, the dCt t-test; SPSS: NLR, GENLIN negative binomial, FACTOR; Firth has no SPSS command,
  the export says so).

## 7. Trust and learning (owner: trust)

- `/methods`: the M3a rows with their fixture families (from `fixtures.generated.js`; `regen-verified.mjs` reads
  the new `_fixture` blocks and the NIST `fixture.json`).
- Examples (`scripts/make-examples.mjs`, PCG32, recorded seed, made-up and labelled): an ELISA plate (eight
  standards in duplicate and twelve samples), a two-arm dose-response, a glucose tolerance test, a qPCR experiment
  with two reference genes, a herd-health panel for PCA.
- `/cite`: release 0.2.0 when M3a ships (`src/data/cite.js` record, `research/package.json` version), released date
  from the deploy commit.
- `/guide`: a short section per new family, including the qPCR guidance line and what an interpolated
  concentration's interval does not cover.

## 8. File ownership

As M2-DESIGN.md section 14, with these M3a files:

| Role | New or changed files |
|---|---|
| lab | `src/lib/stats/{nls,curves,auc,qpcr,pca}.js`, `src/lib/stats/anovarm.js` (two within factors), `areas/lab.*`, `src/i18n/lab.js`, `tests/unit/{stats,lab}-*.test.mjs` for these |
| models | `src/lib/models/{firth,negbin}.js`, `src/lib/models/glm.js` (method switch, shared IRLS pieces), `areas/models.*`, `src/i18n/models.js`, `tests/unit/models-*.test.mjs` for these |
| data | `src/lib/runtime/catalog.js` (rows, owners, C14), `src/i18n/runtime.js` (names), `src/lib/runtime/types.js` (new reasons), `areas/index.js` only if the merge needs it |
| graphs | `src/workspace/charts/{dose-response,standard-curve,scree,biplot,qpcr-fold}.js` and their tests, `src/i18n/graphs.js` |
| ui-analysis | `src/workspace/lib/{method-ui,method-questions,chart-inputs}.js`, `AnalysisPane.jsx` (method-specific boxes), layout drawings, `src/i18n/{workspace,terms}.js`, `tests/unit/workspace-*.test.mjs`, `tests/e2e/research-workspace-m3.spec.js` (new) |
| report | `src/workspace/report/*`, `src/lib/export/{rscript,sps}.js`, `src/i18n/report.js`, `tests/unit/{report,export}-*.test.mjs` |
| trust | `src/data/{cite,examples}.js`, `src/data/examples/*`, `scripts/make-examples.mjs`, `src/pages/**`, `src/i18n/trust.js`, `scripts/regen-verified.mjs` |
| rparity | `tests/fixtures/r/**`, `tests/fixtures/stats/nist-strd-nls/**`, `scripts/r-parity/**`, `.github/workflows/research-r-parity.yml`, `tests/unit/rparity-*.test.mjs` |

## 9. Gates

- Unit: `npm test` and `npm run test:utc` in `research/` green; `node scripts/regen-verified.mjs --check` current;
  every new fixture test seen failing once on an injected wrong value.
- Build: `npm run build` green; the new statistics stay out of the landing chunk (the catalogue imports no
  statistics code).
- E2E: `npm run e2e` on the four projects, plus the new M3 journeys (standard curve with unknowns, dose-response
  comparison, qPCR with two reference genes, PCA biplot, two within factors, Firth after a separation stop, NB);
  the network-silence spec runs every registered method including M3a.
- Production: the M3 journeys against `https://research.vetmock.com` after the deploy (`RESEARCH_BASE_URL`).
- Shared machine: ports 43100 to 43199; no npm install; commits as M2-DESIGN.md section 15 (plain messages, no agent
  trailer, public repo); nothing outside `research/`, `docs/research/` and `.github/workflows/research-*.yml`.

## 10. M3b (not built here; what each needs)

| Item | Needs |
|---|---|
| Mixed models, Cox, GEE, ordinal, exact r x c (Tier B) | webR 0.6.0 in its own worker (about 30 MB, cached), a licence page and source manifest (engine.md 2.8, 5.5 gates); the CSP gains `wasm-unsafe-eval` for that worker only |
| Shared snapshots and comments | the sync design (GOAL.md Q6) and Supabase tables with RLS |
| AI: Thai question to AnalysisSpec | Palm's provider and monthly budget (D9); only the codebook and the question leave the device |
| Point map | map tiles from a server (egress line in the CSP, the log entry) |
| REDCap dictionary, XLSForm codebooks | none beyond building it (data role) |
| STARD, GRRAS, REFLECT, ARRIVE 2.0, CONSORT | each checklist's licence checked before its items are copied |
| Freedom from disease, herd sensitivity | epiR `rsu.*` fixtures |
| Passing-Bablok, Deming | mcr fixtures |
