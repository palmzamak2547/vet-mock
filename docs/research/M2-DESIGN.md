# VetMock Research M2: the contract every M2 builder codes against

Written by the M2 architect on 2026-09-28 in the worktree `C:\Users\palmz\Desktop\vmu\research-m1`, branch
`research/m2`, cut from main `fd09a0cc` (M1 as shipped on https://research.vetmock.com). Order of authority when
texts disagree: this file, then `docs/research/M1-DESIGN.md` (the shipped contract: envelope, spec, registry,
catalogue, recipe, i18n, fixtures, guardrails; M2 extends it and never forks it), then
`work/research-studio/BUILD.md`, `competitor-gaps.md` (M2 = D1 M2 part, D2, D5, D6 M2 part, D7), `GOAL.md` section 8
(the M2 row), `methods.md` sections 3 to 6 and `engine.md` sections 4 to 7. `work/` means
`C:\Users\palmz\Desktop\vet-mock\work\`. Notes of each role go to `work/loop-2026-09-26/research-m2/<role>.md`.

The product is **VetMock Research**. Never write "Research Studio" or "the Studio" in anything a person reads
(M1 code comments that still say "Studio" are not user-facing and need not change).

What exists after the architect's commit (listed in section 14 with owners):
- the registration points restructured so each area writes its own files (section 2); M1 behaviour and all
  727 M1 unit tests unchanged and green, `npm run build` green;
- stub modules for every M2 method, recipe helper, exporter, chart module and screen, each with its final
  exported signature and JSDoc, each throwing `not implemented: <module>.<fn>` (screens render
  `common.notBuilt`); every stub file says `STUB(m2)` so the release check can find the leftovers;
- seven new dictionary files (`lab`, `models`, `measure`, `data`, `graphs`, `tools`, `trust`), registered;
- M2 catalogue rows with owners; routes, panes and rail items for every M2 screen;
- `fflate 0.7.5` installed (exact pin) with its licence notice; the SPSS fixtures in `tests/fixtures/sav/`.

---

## 1. Decisions taken here (reversible, each with its reason)

| # | Decision | Why |
|---|---|---|
| B1 | Every M2 area plugs into M1's registration points through `research/src/lib/runtime/areas/` (section 2). | Two builders would otherwise edit `spec.js`, `registry.js`, `registered.js`, `run.js` and `epi/design.js` at once. The area files carry options, guard membership, design offers and registration; the shared files only merge. |
| B2 | Method names stay in `i18n/runtime.js` under `runtime.method.*` (catalogue `nameKey`), as in M1. Every other M2 word lives in its area's dictionary. | The landing's chart and the public methods page read names without the workspace dictionaries; one place for names avoids a rename in two files. |
| B3 | A new design, "laboratory or animal experiment" (`experiment`), is added by the lab area. | 220 of 698 CUVET methods sections run ANOVA and 113 randomise or blind (competitor-gaps.md section 2); a lab experiment is neither a trial nor a cross-sectional survey, and ARRIVE 2.0 asks for its own items. |
| B4 | Two new farm routes: `survey` (design-based interval, farms as sampling units) for `freq.proportion`, and `robust` (cluster-robust SE) for the GLMs. Each appears in the G1 panel only when its owner adds it to `routes` in the area file (with its fixture green). | methods.md M9 lists "cluster-robust or survey-design standard errors" among the valid routes; GOAL.md's M2 row asks for a design-based CI "if it passes a survey package fixture". Without `robust`, G1 would stop every logistic regression on farm data. |
| B5 | Repeated-measures ANOVA covers one within factor, with or without one between factor (split-plot). Two within factors wait for M3. | What CUVET lab papers call "two-way RM ANOVA" is mostly group x time; two within factors need a second sphericity test per effect and are rare in the evidence. |
| B6 | Kaplan-Meier, ROC and Bland-Altman charts ship in M2 with their methods (D6 put them in M3). | A survival analysis, ROC analysis or Bland-Altman analysis without its figure sends the student back to Prism for the figure. The chart kit makes each a small addition. |
| B7 | Dunnett p-values and critical values by numerical integration (a two-dimensional integral), never by simulation. | With every comparison sharing the control the correlation is lambda_i lambda_j; the integral is deterministic and matches R's `mvtnorm` TVPACK to 1e-15 on the fixture (section 3.1.4). |
| B8 | No new homogeneity test for RR/PR on sparse farm strata (carried item 1). A note fires instead (section 12.1). | No reference implementation of a score or exact homogeneity test for RR exists to pin against (epiR and DescTools give Woolf and Breslow-Day only); a home-grown test without a fixture breaks the number rule. |
| B9 | The design-effect route takes ICC and mean farm size from the analysed rows (carried item 2, section 12.2). | Every number a route prints must be reproducible from the rows the result uses; that is what the provenance line promises. |
| B10 | Examples and fixtures that the browser loads are JS modules under `src/data/`, not files in `public/`. | `research/vercel.json` rewrites every unknown path to `index.html`, and the CSP must not change. |
| B11 | Exports are built on the device only; each download is a `download` log entry with `egress: 'none'`. | M1 rule (section 14 there), unchanged. |
| B12 | Only `fflate 0.7.5` is added (section 13). The .sav reader, the Word writer, the TIFF encoder, the expression parser, the PRNG and the numerical methods are small own implementations. | Each alternative on npm is either large, unmaintained, or evaluates code (expression libraries); the own versions are pinned by fixtures. |
| B13 | The seeded generator is PCG32 (section 7), seed recorded with every list; nothing claims that R's `sample()` would draw the same list. | A documented algorithm with published reference output, reproducible in any language from the seed. |

## 2. How M2 plugs in (owner of the merge rules: data)

`research/src/lib/runtime/areas/` (architect, now owned as below):

| File | Owner | Holds |
|---|---|---|
| `index.js` | data | merges the option files: `AREA_DEFAULTS`, `AREA_ALLOWED`, `AREA_EXTEND_DEFAULTS`, `AREA_EXTEND_ALLOWED`, `AREA_G1_SUBJECT`, `AREA_DESIGN_FREE`, `AREA_DESIGNS`, `AREA_ROUTES`, `areaOffers(designId)`; throws at load on an id or option defined twice |
| `impl.js`, `registered.js` | data | merge the areas' implementations and shipped ids |
| `<area>.options.js` | the area's role | `defaults`, `allowed` (valibot), `extendDefaults` / `extendAllowed` (options added to methods the area does not own, e.g. Hodges-Lehmann on the M1 rank tests), `g1Subject`, `designFree`, `offers` (design id -> method ids), `designs` (new design rows), `routes` (farm routes it runs) |
| `<area>.impl.js` | the area's role | method id -> `{ impl, module, fn }` |
| `<area>.registered.js` | the area's role | the ids that ship; add one only after its fixture test is green and the injected-wrong-value proof is in the notes |

Areas: `lab` (lab role), `models` (models), `measure` (measure), `plan` (ui-tools). The merge points:
`spec.js` (`DEFAULT_OPTIONS`, `ALLOWED`, `DESIGN_IDS`), `registry.js` (`CANDIDATES`, `IMPLEMENTED`),
`registered.js` (`REGISTERED`), `run.js` (`G1_SUBJECT`, `CLUSTER_ROUTE_ORDER`), `epi/design.js` (`DESIGNS`,
`DESIGN_FREE_METHODS`). An `extend*` entry that sets a default on an M1 method changes M1 envelopes (a new key in
`provenance.options`): the role that adds it updates the M1 tests that pin options, in the same commit.

Also added to the shared contract by the architect (data owns these files from now on):
- `ROLE_NAMES` += `factorB`, `subject`, `event`, `items` (array), `test2`. The M1 role `time` is animal-time;
  M2 uses it as follow-up time (Kaplan-Meier) and as the Poisson offset (log taken inside), one concept.
- `LEVEL_NAMES` += `controlLevel` (Dunnett).
- `CLUSTER_ROUTES` += `survey`, `robust`; `FARM_AWARE` in `run.js` likewise (the method carries the route out
  itself, as with `deff`).
- `MethodOutput.warnings` (registry.js JSDoc): warnings a method raises from its own fit (G14, G23); `run.js`
  merges them into `guard.warnings`.
- `Provenance.rowsDropped[].reason` gains `'incomplete'` (repeated measures: an animal without every time),
  `'unmatched'` (merge), `'separation'` is not a drop (it is a finding). The data role updates `types.js`.
- `DesignPane` lists only offered methods that ship (`getMethod(id).shipped`), so an M2 method appears on a design
  the day its owner registers it, not before.

## 3. Methods

General rules from M1-DESIGN.md section 7 hold unchanged: upper tails from complement functions (exception A8,
the studentized range); undefined values are `null` with a `reasonKey` (`lab.undefined.*`, `models.undefined.*`,
`measure.undefined.*`), printed "—" with the sentence; rows with a missing value in a role dropped and counted
per column; tolerances: closed forms 1e-10 relative; iterative fits 1e-6 relative; uniroot-based values within
R's uniroot tolerance; a value that is mathematically zero but printed by R as 1e-15 is compared with an
absolute 1e-10. Each module's fixture test must fail on an injected wrong value once (command and red output in
the notes). Every method that assumes independent animals is in its area's `g1Subject` (herd guardrail).

**Fixture sources.** Every number below was computed on 28 Sep 2026 by the architect with R 4.6.0 (2026-04-24)
in webR 0.6.0 under Node (packages from repo.r-wasm.org: mvtnorm 1.2.4, pwr 1.3.0, survival 3.8.6, sandwich
3.1.1, survey 4.5, pROC 1.19.0.1, psych 2.6.5, haven 2.5.5), printed with `sprintf('%.17g')`. The rparity role
turns each block into `research/tests/fixtures/r/<name>.R` and `r/out/<name>.json` (same numbers expected; a
difference is a finding, not a silent update) with `_fixture: { family: 'r-4.6.0', kind: 'pin', methods }`.
Datasets `two`, `paired`, `three`, `corr`, `quantiles` are M1-DESIGN.md section 7's. Made-up datasets are
labelled ข้อมูลสมมุติ / made-up data wherever they are shown.

New literal datasets (rparity writes each into its R script and into the SciPy cross-check where SciPy can):
- `rm` (made-up): eight animals x four times T1..T4, animals 1-4 group A, 5-8 group B:
  `45 50 55 70 | 42 42 45 60 | 36 41 43 62 | 39 35 40 53 | 51 55 59 70 | 44 49 56 65 | 40 48 51 58 | 47 53 57 71`.
- `roc` (made-up): 30 animals, status 1 for the first 12. `marker1` = 0.82 1.10 0.95 1.43 0.66 1.25 0.90 1.58
  0.71 1.02 1.37 0.88 | 0.35 0.52 0.41 0.78 0.29 0.60 0.47 0.93 0.38 0.55 0.44 0.69 0.31 0.83 0.50 0.62 0.40
  0.72; `marker2` = 12.1 15.4 9.8 18.2 11.5 14.0 8.9 16.7 13.3 10.2 17.1 12.8 | 9.5 11.2 8.1 13.6 7.4 10.9 9.9
  12.5 8.8 10.4 7.9 11.8 9.1 14.2 10.1 8.4 12.0 9.6.
- `items` (made-up): twelve respondents x five Likert items, rows `4 5 4 4 5 | 3 3 4 3 3 | 5 5 5 4 5 |
  2 3 2 2 3 | 4 4 3 4 4 | 3 2 3 3 2 | 5 4 5 5 4 | 2 2 1 2 3 | 4 4 4 5 4 | 3 4 3 3 3 | 1 2 2 1 2 | 4 3 4 4 5`.
- `sep` (made-up): y 0 0 0 0 0 1 1 1 1 0 1 0, x a a a a a b b b b c c c.
- R's own datasets, written out by the script: `warpbreaks` (Tippett 1950), `infert` (Trichopoulos et al.
  1976), `aml` (survival package; Miller 1981), RoundingTimes (the `?friedman.test` example; Hollander and Wolfe
  1973, p. 140), the Dobson (1990) p. 93 counts in `?glm`.
- `doctors`: deaths and person-years of British doctors by smoking and age (Doll and Hill, as tabulated by
  Breslow and Day 1987): smokers 32/52407, 104/43248, 206/28612, 186/12663, 102/5317; non-smokers 2/18790,
  12/10673, 28/5710, 28/2585, 31/1462 for ages 35-44 to 75-84. These counts were typed from memory by the
  architect; the rparity role checks each against a primary copy before committing, and the expected numbers
  below are R's on these literal counts either way.
- `pefr`: the first reading of each meter in Bland and Altman 1986 (Lancet 327(8476):307-10, Table 1): Wright
  494 395 516 434 476 557 413 442 650 433 417 656 267 478 178 423 427; mini Wright 512 430 520 428 500 600 364 380
  658 445 432 626 260 477 259 350 451. Mean difference and SD reproduce the paper's printed -2.1 and 38.8; the
  rparity role checks the 34 values against the paper's table.
- The serosurvey (`tests/fixtures/serosurvey/`, M1-DESIGN.md 8.6).

### 3.1 Lab (owner: lab; `lib/stats/*` except `format.js`; area `lab`)

#### 3.1.1 `anova.twoWay` (`stats/anova2.js`)
Roles: `outcome` (number), `group` (factor A), `factorB`. Options: `ssType` `'III'` (default; sum-to-zero contrasts,
SPSS UNIANOVA) or `'II'`; `interaction` true (default) or false; `posthoc` `'none'` (default) or `'tukey'`
(Tukey HSD on each main effect with the model's residual mean square, offered only when every cell has the same
n; otherwise a note `lab.note.tukeyUnbalanced` and no comparisons). Outputs: tests `A`, `B`, `AB` (F, dfPair, p);
values partial eta squared per effect; tables `anova` (SS, df, MS, F, p, residual row), `cellMeans` (n, mean, SD
per cell), `marginalMeans`, `tukeyA`, `tukeyB`. Guardrails: G1 (in `g1Subject`), G7 note when both main effects
and the interaction are tested, G8 on non-significant effects, G21 when a subject role repeats (use
`anova.repeated`). Fixtures (R `drop1(lm(breaks ~ wool * tension), . ~ ., test = 'F')` under `contr.sum`; Type II
by model comparison):
- Balanced `warpbreaks`, Type III: SS wool 450.6666666666697, tension 2034.2592592592646, wool:tension
  1002.777777777781; F 3.7652883611186607, 8.4980466483580539, 4.1890689668510595; p 0.058212975959558919,
  0.00069262093671342711, 0.02104419072786275; residual SS 5745.1111111111059 on 48 df.
- Unbalanced `warpbreaks[-c(1, 20, 37), ]` (51 rows), Type III: SS 667.85294117646936, 2272.3153594771284,
  1011.0506535947716; F 5.839167155309763, 9.9336458638570093, 4.4199054947824985; p 0.019791796727819198,
  0.00026711718104196493, 0.017678776764186867; residual 5146.8611111111122 on 45 df. Type II: SS
  667.85294117646754, 2198.0020814479622, 1011.0506535947743; F 5.8391671553097506, 9.6087781980001292,
  4.4199054947825127; p 0.019791796727819323, 0.00033502067145797901, 0.017678776764186641 (sequential Type I
  wool SS is 628.9, which neither type prints).
- Tukey, balanced, `interaction: false` (R `TukeyHSD(aov(breaks ~ wool + tension), 'tension')`), later minus
  earlier: M-L -9.9999999999999858, CI -19.353420726843524 to -0.6465792731564477, p 0.03362621891137918; H-L
  -14.722222222222214, -24.075642949065752 to -5.3688014953786762, p 0.0011217877170325297; H-M
  -4.7222222222222285, -14.075642949065767 to 4.6311985046213096, p 0.44742102143145668. With `interaction: true`
  (`aov(breaks ~ wool * tension)`): p 0.022855398402122584, 0.00055953922179385884, 0.40494419624975098; CIs
  -18.819647156951035 to -1.1803528430489365, -23.541869379173264 to -5.902575065271165, -13.541869379173278 to
  4.0974249347288207.

#### 3.1.2 `anova.repeated` (`stats/anovarm.js`)
Roles: `outcome`, `subject`, `time` (the within factor), `group` (between, optional). Long data (one row per
animal and time; the reshape step makes it from wide). An animal without every time is dropped whole, reason
`'incomplete'`. Options: `sphericity` `'gg'` (default), `'hf'`, `'none'` (which corrected p the sentence uses;
all three are always in the table); `mauchly` true. The Huynh-Feldt epsilon is R's (`anova.mlm`: with `n` the
residual df, `((n + 1) p GG - 2) / (p (n - p GG))`, which is the Lecoutre 1991 correction when there is a between
factor), capped at 1 for the p-value and printed uncapped with a note. Mauchly is shown as a diagnostic and never
switches the correction. Outputs: tests `time`, `group`, `groupTime`; values `epsGG`, `epsHF`; tables `anova`,
`means` (per time and group with 95% CI). Fixtures (R `summary(aov(y ~ time + Error(subj/time)))`,
`anova(lm(W ~ 1), X = ~1, test = 'Spherical')`, `mauchly.test`):
- One-way on `rm`: F 102.72400756143638 on 3 and 21 df, p 1.0361278220094827e-12; SS time 1940.7500000000011,
  error 132.25000000000045 (subjects 1005 on 7 df); GG epsilon 0.74295583007441612, p 6.3544922112661984e-10;
  HF epsilon 1.1060225141756919 (capped: p = uncorrected, 1.0361278220094201e-12 from `anova.mlm`); Mauchly W
  0.3520329452001959, p 0.31497508421335702.
- Split-plot on `rm` with group: between (group) F 4.3165098374679403 on 1 and 6 df, p 0.083007513791233611;
  time F 134.61849710982574 on 3 and 18 df, p 1.619958068333379e-12; group x time F 3.1734104046242431, p
  0.049394457641948691; GG epsilon 0.60829446256719732 (p time 2.5655093460439428e-08, interaction
  0.08498711332553617); HF epsilon 0.86019024252514142 (p 5.0612477592230915e-11, 0.059819340748629969); Mauchly
  W 0.34779913618299102, p 0.42625680860736054. The interaction's p moves from 0.049 to 0.085 with the correction:
  the result sentence names the correction it used (a pin for the report role too).

#### 3.1.3 `test.friedman` (`stats/friedman.js`)
Roles: `outcome`, `group` (treatments or times), `subject` (blocks). A block with any missing value is dropped
whole. Fixture: RoundingTimes (22 x 3): chi-squared 11.142857142857142 on 2 df, p 0.003805040775511363 (R's help
page prints 11.143 and 0.003805; Hollander and Wolfe 1973 p. 140).

#### 3.1.4 Post hoc (`stats/posthoc.js`, `stats/mvt.js`)
Tables list pairs in R's order, later level minus earlier. On `three` (levels A, B, C):
- `posthoc.dunn` (after Kruskal-Wallis; options `adjust` `holm` default, `bonferroni`, `bh`, `none`): Dunn (1964)
  z on mean ranks with the tie correction `N(N+1)/12 - sum(t^3 - t)/(12(N-1))`. B-A z 3.071648878177335, C-A
  1.6575109380998472, C-B -1.5987038901905439; raw p 0.0021287997492868008, 0.097416219307379912,
  0.10988641282605553; Holm 0.0063863992478604024, 0.19483243861475982, 0.19483243861475982; Bonferroni
  0.0063863992478604024, 0.29224865792213972, 0.32965923847816658; BH 0.0063863992478604024,
  0.10988641282605553, 0.10988641282605553 (formula in base R; the rparity role adds FSA or dunn.test if the webR
  repository has them).
- `posthoc.gamesHowell` (Games and Howell 1976; Welch SE and df per pair, p = `ptukey(|d|/SE sqrt 2, k, df,
  lower.tail = FALSE)`, CI with `qtukey(conf, k, df)/sqrt 2`): B-A diff 5.6666666666666679, SE
  1.3333333333333333, df 8.5191347753743756, q 6.0104076400856554, p 0.0061227773509222594, CI
  1.9049750114342983 to 9.4283583218990366; C-A 3, 1.2909944487358056, 8.571428571428573, 3.2863353450309969,
  0.1057300616054494, -0.63789789428938004 to 6.63789789428938; C-B -2.6666666666666679, 1.2018504251546631,
  10.69620253164557, 3.137858162210946, 0.11290435458703274, -5.926382425667188 to 0.59304909233385228.
- `posthoc.dunnett` (control `levels.controlLevel`; two-sided only): pooled MSE on 15 df; lambda
  0.7385489458759964, 0.76376261582597338; B-A diff 5.6666666666666679, SE 1.3204937348218293, t
  4.2913241594677132, adjusted p 0.0012076754107012144; C-A 3, 1.2769010104452851, 2.3494381909478088,
  0.05803904825531514; two-sided 95% critical value 2.4281518529165904; CIs 2.4603073576942944 to
  8.8730259756390417 and -0.10050955450378574 to 6.1005095545037857. Reference: `mvtnorm::pmvt` with
  `TVPACK(abseps = 1e-14)` through inclusion-exclusion of the one-sided box, root found by `uniroot(tol = 1e-14)`;
  `GenzBretz(maxpts = 2e6, abseps = 1e-9)` agrees to 2e-16. `stats/mvt.js` integrates over the chi variable and one
  normal (Gauss-Kronrod or tanh-sinh, error below 1e-10); tolerance 1e-8 absolute on p, 1e-8 relative on the
  critical value. SciPy 1.17.1 `scipy.stats.dunnett` is the cross-check.
- `adjust.pValues` gains `sidak` and `bh` (lab's `extendAllowed`): for p = 0.01, 0.04, 0.03, 0.005: Sidak
  (single-step, `-expm1(m log1p(-p))`) 0.03940399, 0.15065344, 0.11470719, 0.019850499375; BH 0.02, 0.04, 0.04,
  0.02 (R `p.adjust(method = 'BH')`).
- Not added (competitor-gaps D1): Newman-Keuls, Fisher's LSD; Tamhane T2 and Dunnett T3 wait for a request.

#### 3.1.5 Diagnostics (`stats/normality.js`)
Shown beside a t-test, ANOVA or regression result and never used to switch tests (methods.md anti-pattern 2); a
sentence says so under the panel. `diag.shapiro` (Royston 1995, AS R94, as R `shapiro.test`; roles `outcome`,
`group` optional; option `on` `'residuals'` default or `'groups'`; n outside 3..5000 gives null with
`lab.undefined.shapiroN`): `two.g1` W 0.9634429275632348, p 0.84218478817386655; `two.g2` W 0.99148531053242916,
p 0.99828865494813035; `quantiles` W 0.95223780578850037, p 0.73375964349156608 (with ties); residuals of
`y ~ g` on `three` W 0.95069928258865433, p 0.43609214517293049; n = 3 (1, 2, 4) W 0.96428571428571419, p
0.6368868450289632 (the exact n = 3 branch); RoundingTimes column 1 (n = 22, the n >= 12 polynomial) W
0.94677759274081952, p 0.27226113315470202. Q-Q points (R `qqnorm`: `ppoints(n)` = (i - 3/8)/(n + 1/4) for
n <= 10, else (i - 1/2)/n) for `two.g1`, in data order: -0.85249503427469386, -1.4342001596863794,
0.85249503427469386, 0.15250597424624424, 0.47278912099226722, -0.15250597424624437, -0.47278912099226728,
1.4342001596863794. `diag.brownForsythe` (Levene on absolute deviations from the group median; option `center`
`'mean'` gives the classic Levene): `three` F 0.013312624805857532 on 2 and 15 df, p 0.9867872413739025.

#### 3.1.6 Hodges-Lehmann (`stats/hodges-lehmann.js`, options on the M1 rank tests)
`test.mannWhitney` and `test.wilcoxonSignedRank` gain `estimate` `'hodges-lehmann'` (default) or `'none'`
through lab's `extendDefaults`/`extendAllowed`; the estimate and interval come before the p-value. R
`wilcox.test(conf.int = TRUE)`, exact when n < 50 without ties: `two` (g1 vs g2) estimate -1.2999999999999998, CI
-1.8999999999999995 to -0.75 (W 1, p 9.1411856117738465e-05 as M1); `paired` (before minus after) estimate
0.60000000000000053, CI 0.27500000000000036 to 0.94999999999999929 (V 52). With ties R uses the normal
approximation for the interval; the rparity role adds a tied case.

#### 3.1.7 Power (`stats/power.js`, `stats/noncentral.js`)
All `input.kind: 'params'`, design-free; `solveFor` `'n'` (default, n rounded up once at the end as in M1) or
`'power'`; `sigLevel` 0.05; optional `m` and `icc` multiply n by the design effect 1 + (m - 1) ICC as M1's
`ss.*` do, shown as its own step. G9 stays: power after the data are in is refused. Fixtures:
- `power.anova` (R `power.anova.test`): groups 3, between.var 1, within.var 3, power 0.80 gives n
  15.495620170448651 per group (16); groups 4, n 5, same variances gives power 0.35355942381530236.
- `power.tTest` (R `power.t.test`, noncentral t): delta 1, sd 1, power 0.9 gives n 22.021097703851229 per group;
  n 20 gives power 0.86895280169249778; paired, delta 0.8, sd 1, power 0.8 gives n 14.302803316243569 pairs. This
  replaces "t-based alternative shown from R's numbers" of M1-DESIGN.md 7.22 with a computed one.
- `power.correlation` (pwr 1.3.0 `pwr.r.test`, which adds r/(2(n - 1)) to atanh r): r 0.3, power 0.8 gives n
  84.073639782287657 (85); n 50 gives power 0.57155584186020802 (the same formula in base R agrees exactly).
- `power.regression` (pwr `pwr.f2.test`, noncentral F with lambda = f2 (u + v + 1)): u 3, f2 0.15, power 0.8
  gives v 72.705826559965331 (n = v + u + 1 = 76.7, 77); v 100 gives power 0.91701094492672186.
`stats/noncentral.js` follows R's `pnt` (AS 243) and `pnbeta` (AS 226 with Frick's correction); fixtures are R
`pt(q, df, ncp)` and `pf(q, df1, df2, ncp)` values the rparity role adds to `dist.R`, including a tail below 1e-10.

### 3.2 Models (owner: models; `lib/models/*`; area `models`)

#### 3.2.1 `reg.logistic`, `reg.poisson` (`models/glm.js`, `design-matrix.js`, `profile.js`)
IRLS with R's `glm.control` (stop when |dev - dev_old| / (|dev| + 0.1) < 1e-8, at most 25 iterations; not converged
gives status `'invalid'` with `models.invalid.notConverged`). Treatment contrasts against the codebook reference
level (else the first level in codebook order); the reference of each categorical term is printed in the table
and the methods sentence (engine.md 6.2: SPSS's default reference differs). Options: `ciMethod` `'profile'`
(default, R 4.6.0 `confint`) or `'wald'`. Roles: `outcome` (logistic: binary with `outcomePositive`; Poisson: a
count), `covariates[]`, `time` (Poisson only: animal-time, log offset). Outputs: values per coefficient (B with
CI, SE) and per term OR or IRR (exp B with the exponentiated interval); tests: Wald z per coefficient, LR test per
term (`drop1(test = 'LRT')`); values `deviance`, `nullDeviance`, `aic`, `events`, `epv` (events per variable,
logistic). Findings raised by the method (`MethodOutput.warnings`): G14 when events per variable < 10, or on
separation; G23 (Poisson) when the Pearson X2 / df > 1.5 (overdispersion: negative binomial is M3). Separation
rule: after convergence, a covariate level (or a numeric side) whose outcome is all 0 or all 1 with fitted
probabilities within 1e-8 of 0 or 1: every coefficient is null with `models.undefined.separation`, table
`separation` lists the levels, and the note points to merging levels (Firth is M3). Fixtures:
- `infert`, `case ~ education + spontaneous + induced` (reference 0-5yrs): B -1.7575272109631253,
  0.10993295391420295, -0.024403746560772273, 1.2035703573286154, 0.42666176242710718; SE 0.72755513804897609,
  0.7062773630725252, 0.70369771942855708, 0.21211274186503806, 0.20917386756388373; z -2.4156618777734691,
  0.15565124929951113, -0.03467930318232311, 5.6742011193953479, 2.0397469693330623; p 0.01570663909925081,
  0.87630792610803498, 0.97233546466686771, 1.3933735603978068e-08, 0.041375534136207037; deviance
  279.40832678527994 (null 316.17111081640439, 247 to 243 df); AIC 289.40832678527994; 4 iterations. Profile CI
  lower -3.2926875747358588, -1.2284929186579414, -1.3598875961184582, 0.79934407307651922, 0.017897006192241043;
  upper -0.39083492883591003, 1.5948330297144704, 1.4542526120175536, 1.6338061439368232, 0.84130277644193319.
  Wald CI lower -3.1835090783061855, -1.2743452408038658, -1.4036259326437157, 0.78783702261109956,
  0.016688515494944156; upper -0.33154534362006527, 1.4942111486322716, 1.3548184395221712, 1.6193036920461312,
  0.83663500935927027. LR tests: education 0.20365204850219243 on 2 df, p 0.90318667057845425; spontaneous
  36.686328672678826, p 1.3874907704431718e-09; induced 4.1847053957883418, p 0.04079030160962243. The rparity
  script writes the 248 rows it used into its JSON so the JS test reads the same data.
- `sep`: R stops after 19 iterations with fitted 1.170226493278249e-09 for level a and 0.99999999882977353 for
  b (estimates -20.6, 41.1, 19.9 with SE near 1e4): our output is the separation finding above, not those numbers.
- Dobson (1990) p. 93, `counts ~ outcome + treatment`, Poisson: B 3.0445224377234221, -0.45425527227759499,
  -0.29298712468147264, 1.2175105494406915e-15, 8.4376949234834533e-16 (the last two are zero: absolute 1e-10);
  SE 0.17089865150402353, 0.20217075668348164, 0.19274234353221614, 0.19999999794829701, 0.19999999849087371;
  deviance 5.1291410770011421 on 4 df (null 10.581445863750867 on 8); AIC 56.761318401957674; profile CI lower
  2.6958215017628859, -0.85770183816504375, -0.67536959741377034, -0.39325482952822782, -0.39325482952821195;
  upper 3.3665558134153772, -0.062558400107820489, 0.082440893487319533, 0.39325482952822732, 0.39325482952821206.
- `doctors`, `deaths ~ smoke + age + offset(log(py))`: B -7.9193257118335181, 0.3545356372520756,
  1.4840070063221547, 2.6275051184702436, 3.3504927851732704, 3.7000964518368953; SE 0.19176124165067826,
  0.10737404389349577, 0.19510283736630457, 0.1837267029344673, 0.18479861756764018, 0.19221896879703682; deviance
  12.132366396287912 on 4 df; Pearson X2 11.155333197363998 (2.79 per df: G23 fires); IRR smoking
  1.4255185428556596, profile CI 1.160878440037854 to 1.769203349468877, Wald 1.1549838698130384 to
  1.759421208500745.

#### 3.2.2 Farm route `robust` (`models/robust.js`)
Cluster-robust covariance as `sandwich::vcovCL(fit, cluster = ~farm, type = 'HC0')` (sandwich 3.1.1, default
`cadjust`: G / (G - 1)); Wald intervals and z tests only (profile needs a likelihood the route does not have; the
option is forced to `'wald'` with a note). Offered for `reg.logistic` and `reg.poisson` (and `reg.ols` if the lab
role adds it with an HC1 fixture). Fixture: serosurvey rows with a known age and vaccine answer (670 cows, 49
farms), `pos ~ age24 + vacNo + herd` (age24 = age in months >= 24; vacNo = not vaccinated in the last 6 months;
herd = herd size): B -1.2399476033053185, 0.9424636331977192, -0.32221018767534881, -0.018270420443850171; model
SE 0.33800373824495417, 0.23757769837614479, 0.25966664183101812, 0.0066046240653819871 (deviance
648.10943271047802); robust SE (HC0, G/(G-1)) 0.31996387430171991, 0.23472541740711333, 0.33635775445723487,
0.0065955115084228464; without the G/(G-1) factor 0.31668210678694814, 0.23231791358681853, 0.33290784013697594,
0.0065278634482820661; HC1 0.32068370395009155, 0.23525348425542439, 0.33711446577236753, 0.0066103495733147105.
When the fixture is green the models role adds `'robust'` to `routes` and the measure role adds it to the G1 panel
(`clusterPanel`), enabled for the GLMs.

#### 3.2.3 `surv.kaplanMeier` (`models/survival.js`)
Roles: `time` (follow-up), `event` (binary; `outcomePositive` names the event level; the other level is censored),
`group` (optional). Options: `confType` `'log'` (default, R), `'log-log'` (SAS), `'plain'`; `test` `'logrank'`
(default) or `'none'`. Median survival with R's interval rule (the times where the lower and upper bounds cross
0.5); an interval bound that does not exist is `null` with `models.undefined.noUpper`, printed "ไม่มีขอบบน" /
"no upper limit" as M1's open bounds. The last step to 0 has SE and bounds null. G22 (censored animals dropped or
time-to-event analysed as binary) is a note on the survival pane and a warning when a logistic outcome is named
like death with a `time` column in the codebook. Fixtures (`aml`, survival 3.8-6; the script checks its literal
data equal the package's `aml`):
- Maintained: times 9, 13, 18, 23, 31, 34, 48; at risk 11, 10, 8, 7, 5, 4, 2; events 1 each; surv
  0.90909090909090906, 0.81818181818181812, 0.71590909090909083, 0.61363636363636354, 0.49090909090909085,
  0.36818181818181817, 0.18409090909090908; log CI lower 0.75413384508152548, 0.61924898739936352,
  0.48842628742212846, 0.37686705950167976, 0.25485995119931731, 0.15487711789719105, 0.035917898489185258; upper
  1, 1, 1, 0.99915760022847266, 0.94558495520042918, 0.87526067814390762, 0.94352576947455202; median 31 (CI 18
  to no upper limit).
- Nonmaintained: times 5, 8, 12, 23, 27, 30, 33, 43, 45; at risk 12, 10, 8, 6, 5, 4, 3, 2, 1; events 2, 2, 1, 1,
  1, 1, 1, 1, 1; surv 0.83333333333333337, 0.66666666666666674, 0.58333333333333337, 0.48611111111111116,
  0.38888888888888895, 0.29166666666666674, 0.19444444444444448, 0.097222222222222238, 0; median 23 (8 to no upper
  limit). Standard errors (R `std.err`, of the survival) and the log-log and plain bounds for both groups: in the
  architect's run log `work/loop-2026-09-26/research-m2/architect.md`; rparity pins all.
- Log-rank: X2 3.3963886989776011 on 1 df, p 0.065339322040505132; observed 7, 11; expected 10.689335992300725,
  7.3106640076992759.

### 3.3 Measure (owner: measure; `lib/epi/*`; area `measure`)

#### 3.3.1 `roc.delong` (`epi/roc.js`)
Roles: `test` (a number), `reference` (binary truth, `referencePositive`), `test2` (optional: a second test on the
same animals). Options: `direction` `'higher-positive'` (default) or `'lower-positive'`; never `auto` (an AUC below
0.5 would be flipped silently); `ciMethod` `'delong'`; `youden` true. AUC = Mann-Whitney U / (n1 n0); DeLong
interval on the AUC scale, clipped to 0..1 as pROC does (a clipped bound is noted); the paired comparison of two
correlated curves by DeLong's z. Thresholds as pROC (midpoints between sorted values, plus -Inf and Inf); the
Youden cut-off reports every tied best threshold and carries a G13 note (a cut-off chosen on these animals
overstates Se and Sp; methods.md M7). The design board's `blocked` row "ROC is M2" goes away when this ships
(measure edits `design.js`). Fixtures (pROC 1.19.0.1, `roc(status, m, levels = c(0, 1), direction = '<')`):
- marker1 AUC 0.93981481481481477 (= 203 / 216), DeLong CI 0.86308940086300334 to 1 (clipped), variance
  0.0015324358325447653; marker2 AUC 0.79629629629629628, CI 0.62885018582518026 to 0.9637424067674123, variance
  0.0072988417214996729; covariance 0.00099281669270776061; paired DeLong z 1.7346057517933702, p
  0.082810660012126128, CI of the difference -0.018645781421119306 to 0.30568281845815648.
- Youden for marker1: two tied thresholds, 0.64 (Se 1, Sp 0.72222222222222221) and 0.80 (Se 0.83333333333333337,
  Sp 0.88888888888888884). The full coordinate list (31 thresholds with Se and Sp) is in the architect's run log.

#### 3.3.2 `agree.blandAltman` (`epi/blandaltman.js`)
Roles: `raterA` (method A), `raterB` (method B), numbers. Options: `scale` `'absolute'` (A - B), `'percent'`
(100 (A - B) / mean) or `'ratio'` (A / B on the log scale, back-transformed); `loaMultiplier` 1.96 (default) or 2
(the 1986 paper); `loaCi` `'approx'` (SE of a limit sqrt(3 s^2 / n), t on n - 1 df; Bland and Altman 1986, 1999) or
`'none'`; `proportionalBias` true (regression of difference on mean, shown as a diagnostic). G16 routes agreement
here instead of Pearson. Fixtures (`pefr`, base R): mean difference -2.1176470588235294 (CI -22.048837696645165
to 17.813543578998107), SD 38.765129873607378; limits with 1.96: -78.097301611093997 and 73.862007493446924
(their CIs -112.61913645114221 to -43.575466771045782 and 39.34017265339871 to 108.38384233349514; SE
16.284611795031498); with 2: -79.647906806038293 and 75.412612688391221 (the paper prints -79.7 and 75.5 from the
rounded -2.1 and 38.8); proportional bias slope 0.028687445152549246, p 0.74949853364929397; percent: mean
-1.1583141283896237, SD 12.098394716494981, limits -24.871167772719787 to 22.55453951594054; ratio: geometric mean
ratio 0.98828462576765741, limits 0.77826742885989553 to 1.2549754304372234.

#### 3.3.3 `rel.cronbach` (`epi/cronbach.js`)
Roles: `items[]` (two or more numeric columns; rows with a missing item dropped and counted). Options: `ciMethod`
`'feldt'` (default) or `'none'`. Outputs: alpha with the Feldt (1965) interval, standardized alpha, item-rest
correlation and alpha if dropped per item. Fixtures (`items`; base R formula, psych 2.6.5 `alpha` agrees):
alpha 0.94618055555555558, Feldt CI 0.87613325929912034 to 0.98232950151725773; standardized 0.9460883028988506;
alpha if dropped 0.9151943462897526, 0.94300116324156646, 0.93624161073825507, 0.92808219178082185,
0.94300116324156646; item-rest r 0.9511012772444225, 0.79872974488773252, 0.83996244722706359,
0.88366066133078569, 0.79872974488773252.

#### 3.3.4 Farm route `survey` (`epi/survey.js`) for `freq.proportion`
Design-based proportion with farms as the primary sampling units (Taylor linearisation, t on clusters - 1 df),
interval `surveyCi` `'logit'` (default, R `svyciprop`'s default) or `'mean'` (Wald). Measure adds `surveyCi` to
`freq.proportion` through `extendDefaults`/`extendAllowed` and updates the M1 option pins in the same commit.
Fixture (serosurvey, 728 cows, 49 farms; survey 4.5 `svydesign(ids = ~farm, data)` with equal weights):
p 0.20054945054945056, SE 0.019357772665495494, df 48; logit CI 0.16443086136746465 to 0.24230113067616335; mean
CI 0.16162803999801706 to 0.23947086110088406.

#### 3.3.5 Carried items owned by measure: sections 12.1 and 12.2.

### 3.4 Planning methods (owner: ui-tools; `lib/plan/*`; area `plan`)
`design.randomisation` and `design.sampling`, section 7. Design-free, not in `g1Subject` (lists of units, not
tests of animals).

## 4. Recipe steps and the project log (owner: data; `lib/intake/*`)

New `STEP_KINDS` (recipe.js), each validated by `validateStep`, described by `describeStep` (one sentence for the
log and the methods paragraph), and replayed deterministically by `applyRecipe(raw, codebook, steps, sources)`.
`sources` is new: `{ [datasetId]: { raw, codebook, steps } }` for the other datasets a step names; the engine op
`apply` gains `payload.sources`, and the fingerprint covers them (the merged rows are in the table it hashes).

### 4.1 `merge`
Params `{ sourceDatasetId, sourceRev, leftKey, rightKey, columns: [source keys] }`. Many-to-one only (a farm file
into an animal file): duplicate right keys reject the step with the list. Unmatched left rows are kept with the
brought columns missing, reason code 6 `unmatched` (new in `missing.js`), and counted; unmatched right keys are
listed. The UI shows the report and asks before saving. Brought columns get keys `m1`, `m2` and codebook entries
copied from the source (level `farm` by default). A second file enters a project through the import pane with
`purpose: 'merge'` or `'double-entry'`; the project record's `datasetIds[]` holds it (M1 already has the array).

### 4.2 `reshape-long`, `reshape-wide`
Long: `{ idColumns, stubs: [{ target, columns }], timeTarget, times }` (one row per animal and time; row ids
`r7.1`, `r7.2`); wide: `{ idColumn, timeColumn, valueColumns }` (row id = the first row of the group; two rows
with the same id and time reject the step with the list). A step after a reshape refers to the new row ids.

### 4.3 `aggregate`
`{ by, summaries: [{ column, fn, level?, target }] }` with `fn` in `mean`, `median` (type 7), `sum`, `min`, `max`,
`count`, `any`, `all`, `first`, `proportion` (share of a level). Rows `a1..aK` in `Intl.Collator('th')` order of
the group key. G1's `aggregate` route keeps its own M1 code; the step is for the student's own farm table.

### 4.4 `compute` (expression grammar and fixed function list, `lib/intake/expr.js`)
Params `{ target: 'dK', expression, type }`. The text is parsed on every replay by a tokenizer and a Pratt parser;
nothing is evaluated as code (no `eval`, no `new Function`, no `with`). Grammar:

    expr    := orExpr
    orExpr  := andExpr ('or' andExpr)*
    andExpr := notExpr ('and' notExpr)*
    notExpr := 'not' notExpr | cmp
    cmp     := add (('<' | '<=' | '>' | '>=' | '==' | '!=') add)?
    add     := mul (('+' | '-') mul)*
    mul     := unary (('*' | '/') unary)*
    unary   := '-' unary | pow
    pow     := atom ('^' unary)?
    atom    := number | column | call | '(' expr ')'
    column  := '{' any text but '}' '}'  (a column name as in the header, or its key c3, d2)
    call    := name '(' (expr (',' expr)*)? ')'
    number  := digits ('.' digits)? (Thai digits accepted and converted)

Functions (fixed list): `abs`, `sqrt`, `ln`, `log10`, `exp`, `round(x, digits)` (half away from zero, stated),
`floor`, `ceil`, `min(...)`, `max(...)`, `sum(...)`, `mean(...)` (over the arguments of one row), `if(cond, a, b)`,
`isMissing(x)`, `daysBetween(dateA, dateB)`, `monthsBetween(birth, event)` (numbers.json's rule, as `derive-age`).
Comparisons give 1 or 0. A missing operand gives a missing result with the operand's reason; division by zero,
`sqrt` of a negative, `ln` of a non-positive give reason 5 (invalid) and are listed with row ids. Parse errors
carry a key (`data.expr.*`) and a character position. Fixtures: a table of expressions with expected values
written beside them (percent inhibition `100 * (1 - {OD} / {OD control})`, weight gain, BMI-style ratios,
precedence cases `-2^2` = -4, `2^3^2` = 512, errors), plus a test that the parser rejects `constructor`,
`__proto__`, `this`, backticks and any identifier not in the list.

### 4.5 `exclude-where` and exclusions with a written reason
`{ conditions, combine, category }` + `reason` (required text). `category` in `ineligible`, `lost`,
`protocol-deviation`, `measurement-error`, `duplicate`, `other` (STROBE-Vet item 13 and ARRIVE item 3). M1's
`row-exclude` gains an optional `category`. Values outside the codebook range are flagged on the clean pane for
review; there is no delete-by-outlier-test button (competitor-gaps D1). A filter stays a subset for one analysis;
an exclusion removes rows from the study, and the flow counts it (4.7).

### 4.6 Double-entry comparison (`lib/intake/double-entry.js`)
Two files of the same forms typed by different people, matched by a key column; every differing cell listed by
key, row ids and column (text compared after `cleanCell`, never after type conversion so "1.0" vs "1" shows); keys
only in one file and duplicate keys listed. The student settles each difference with a `cell-edit` step (the
reason names the paper form). Logged as `compare` with counts only. Fixture: two small CSVs under
`tests/fixtures/intake/double-*.csv` with the expected difference list beside them.

### 4.7 Project log and STROBE-Vet
`LOG_KINDS` += `dataset-add`, `compare`, `randomise`, `sample` (lists drawn; the log holds the seed and settings,
never the list), and `download` gains the export format. Recipe steps stay `recipe` entries with the step kind.
No log entry carries a cell value. The STROBE-Vet flow (`workspace/report/flow.js`, report role) reads the raw row
count, every `row-exclude` and `exclude-where` step (count, category, reason), filters, per-analysis missing
drops and `rowsUsed`, and draws the participant flow (item 13) as a report figure; `strobe.js` (report role) marks
items 13, 14(b) and 12(c) done from it.

## 5. The SPSS reader (owner: data; `lib/intake/sav.js`)

Scope: `.sav` uncompressed and bytecode-compressed, `.zsav` (zlib blocks inflated with fflate), little and big
endian (layout code 2 or 3). Records 1, 2 (with continuation records, missing values: up to three discrete, a
range, or a range plus one value), 3/4 (value labels), 6 (documents, ignored with a note), 7 subtypes 3 (character
code), 4 (sysmis, highest, lowest), 11 (measure level), 13 (long names), 14 (very long strings), 20 (encoding
name), 21 (long string value labels), 22 (long string missing values), 999. Other subtypes are skipped and
counted. Encoding: record 7.20's name through `TextDecoder` (UTF-8, windows-874/TIS-620, others the browser
knows), else 7.3's code page (874 -> windows-874, 65001 -> UTF-8), else ask the student as for CSV. Dates:
formats DATE, ADATE, EDATE, SDATE, JDATE, DATETIME are seconds since 1582-10-14; days = seconds / 86400 -
141428. Output feeds the M1 pipeline as a RawTable: numeric cells as shortest round-trip text; a value with a
label becomes the label text (a conversion "value labels applied" with examples, so the grid and every report
read as the student labelled them in SPSS); user-missing values are proposed as missing codes and their reason is
asked (G26), exactly as for CSV; SYSMIS is a blank; variable labels fill `labelTh` (Thai script) or `labelEn`;
measure levels hint the codebook type. Size cap 50 MB; the reader runs in the worker. Fixtures:
`tests/fixtures/sav/` (committed now: three haven 2.5.5 files, `expected.json`, the generator), plus a legacy
windows-874 file the data role builds with a small writer in the test. PSPP is not installed; if the data role
installs it outside the repo, a PSPP-written file is a welcome second source.

## 6. Exports (owner: report; `lib/export/*`, `workspace/report/*`)

All built in the browser from `buildReportModel` (report-model.js): headings, paragraphs (M1's generated text),
tables (values from envelopes, formatted by `format.js`), figures (SVG from the chart kit), the flow diagram, the
references cited and the provenance lines. Hidden PII columns never appear. Heavy exporters load lazily (only when
their button is pressed): never in the landing or the first workspace chunk (a build test checks the chunk graph).

1. **.docx** (`docx.js`, fflate `zipSync`): `[Content_Types].xml`, `_rels/.rels`, `word/document.xml`,
   `word/styles.xml`, `word/settings.xml`, `word/_rels/document.xml.rels`, `word/media/figN.png`,
   `docProps/core.xml` and `app.xml`. Tables are real `w:tbl` with a header row marked `w:tblHeader` (repeats on
   each page), numbers right-aligned with tabular figures, a caption paragraph above and the provenance line
   below. Figures: PNG at 300 dpi (graphs' rasterizer, pHYs set) placed inline with `wp:extent` in EMU = width mm x
   36000. Thai text in the complex-script slot (`w:rFonts w:cs="TH Sarabun New"`, `w:lang w:bidi="th-TH"`,
   Latin in Calibri), so Word shows Thai without a missing-font box on a Thai Windows. Fixtures: unzip with fflate
   in the test and check every part is listed in `[Content_Types].xml`, every XML part is well formed (a strict
   small parser in the test), table cell text equals the envelope's formatted values, image extents match
   width x 36000 and the PNG pHYs says 11811 px/m; the report role opens one sample with python-docx and Word (or
   LibreOffice) once and writes what it saw in its notes.
2. **HTML** (`html.js`): one self-contained file, inline CSS, inline SVG figures, `lang` on the root, no external
   request of any kind (the test scans for `http`, `src=`, `@import`, `url(`).
3. **SPSS syntax** (`sps.js`): `GET DATA /TYPE=TXT /FILE='<name>.csv' /ENCODING='UTF8' /DELIMITERS=","
   /QUALIFIER='"' /ARRANGEMENT=DELIMITED /FIRSTCASE=2 /VARIABLES=...`, value labels and missing values from the
   codebook, then per analysis the matching command (T-TEST, ONEWAY with POSTHOC, UNIANOVA with /METHOD=SSTYPE(3),
   GLM repeated measures, CROSSTABS with /STATISTICS=CHISQ RISK, NPAR TESTS, CORRELATIONS, NONPAR CORR, REGRESSION,
   LOGISTIC REGRESSION with /CONTRAST(...)=Indicator(first), GENLIN for Poisson with offset, KM with /COMPARE,
   ROC, RELIABILITY /MODEL=ALPHA), each preceded by comments with VetMock Research's numbers and the known SPSS
   differences from engine.md 6.2 (reference level, Levene centre, Yates, profile vs Wald intervals). Methods SPSS
   has no command for (DeLong paired comparison, Dunnett from summary data, true prevalence) get a comment that says
   so. The CSV it reads is the "analysed data" export (rows in use, codebook order, hidden PII left out).
4. **R script** (`rscript.js`): `read.csv(..., fileEncoding = 'UTF-8-BOM')`, factors with the codebook's levels and
   reference, then base R and named packages (stats, survival, pROC, epiR, sandwich, survey, psych) per analysis,
   with the Studio's numbers as comments. It says "these numbers matched R 4.6.0 in VetMock Research's tests" only
   for a method whose envelope `verified` includes `r-4.6.0`; otherwise "compare with the numbers above".
5. **RIS and BibTeX** (`cite.js`): the references a report cites (from `src/data/references.js`, every DOI
   checked on Crossref with the date written) and the software citation (trust's `src/data/cite.js`). Fixture: a
   known article rendered to both formats, compared with a hand-written expected string; imported once into Zotero
   by the report role (notes).

## 7. Planning tools and the seeded generator (owner: ui-tools; `lib/plan/*`, tool screens)

**Generator** (`random.js`): PCG32 (O'Neill 2014, `pcg32_random_r` of pcg-c-basic): 64-bit state and increment,
multiplier 6364136223846793005, output XSH RR; seeding exactly as `pcg32_srandom_r(seed, seq)` (state = 0, inc =
2 seq + 1, step, state += seed, step). Implemented with BigInt or two 32-bit halves. Reference output for seed 42,
sequence 54 (the pcg32-demo's): `0xa15c02b7 0x7b47f409 0xba1d3330 0x83d2f293 0xbfa4784b 0xcbed606e` (checked by the
architect with an independent BigInt implementation). Bounded integers in [0, n) by rejection with threshold
`(2^32 - n) mod n` (as `pcg32_boundedrand_r`, no modulo bias); shuffles by Fisher-Yates from the last index down.
The seed is the student's number, or one drawn from `crypto.getRandomValues` and shown before the list is made;
the default stream is 54. Every list states the algorithm, seed, stream and settings in its CSV header rows and
in the envelope; nothing claims R's `sample()` would reproduce it.

**`design.randomisation`**: `simple` (each unit drawn independently with the arm ratio), `block` (permuted blocks;
each block size drawn uniformly from `blockSizes`, which must be multiples of the ratio sum; arms within a block
shuffled), `stratified-block` (independent block sequences per stratum, strata in the order typed). Blinding
codes: one per unit, 4 letters from an alphabet without look-alikes (A C D E F H J K L M N P R T U V W X Y, 19
letters) plus 2 digits, drawn without repeats from the same generator after the list; the key file (code -> arm)
is a separate download. Fixtures: the PCG32 reference output above; property tests (every block balanced, every
code unique, 10,000 seeds give arm shares within binomial limits); golden lists for three settings written by a
second implementation in Python (`tests/fixtures/plan/golden.py`, its own PCG32, run by the ui-tools role and
committed with its output) that the JS must equal.

**`design.sampling`**: the project dataset is the frame (one row per farm or animal). `simple` (without
replacement, Fisher-Yates prefix), `systematic` (interval k = N / n, random start in [0, k), selecting
floor(start + i k)), `stratified` (allocation `proportional`, rounding by largest remainder, or `equal`). Output
table `selected` (row id, stratum, order drawn); the selection can be saved as a filter step. Same fixture
discipline as above.

**Power screen** (`/app/tools/power`, PowerTool.jsx) runs `power.*` (3.1.7) with the design-effect step;
**randomisation screen** (`/app/tools/randomise`, RandomiseTool.jsx); **sampling pane** (`/app/p/<id>/sampling`).

## 8. The chart kit (owner: graphs; `workspace/charts/*`, `lib/export/tiff.js`, FiguresPane)

### 8.1 API
`buildChart(kind, input, opts) -> model` (pure: scales, axes, marks, legend, the data table beside the chart,
and an accessible summary sentence), `<Chart model>` draws it, `chartToSvg(model, { theme })` gives standalone SVG
(colours inlined). Every number on a chart (tick labels, annotations) comes from the input the engine produced or
from the scale functions; a chart never computes a statistic that is not in an envelope or a pinned chart helper.
Scales: linear, log (ratios; ticks at 1-2-5 decades, the null line at 1), date. `niceTicks` thins ticks so labels
never collide at the given pixel width (fixes carried item 7). Colours: the Okabe-Ito eight, with a shape per
group as well as a colour (colour-blind safe, non-colour status); the tokens' ink and paper for light, dark and
print themes. Text in Sarabun; axis titles from the codebook names and units. Reduced motion: charts do not
animate. The data table is always rendered beside or under the chart (fit.md D17).

### 8.2 Charts and their rules
- `dot` (the default for group comparisons, Weissgerber 2015): every animal shown, laid out by a deterministic
  beeswarm (no random jitter), with the mean and 95% CI (or median and IQR, following the result) as a bar.
- `box`: quartiles type 7 (the same numbers the tables print; R's `boxplot` uses hinges, and the footnote says
  which), whiskers to the most extreme point within 1.5 IQR, every point beyond drawn and never removed.
- `violin`: Gaussian KDE with R's `bw.nrd0` (0.9 min(SD, IQR/1.34) n^(-1/5)), evaluated directly (not R's binned
  FFT), cut at 3 bandwidths, with the dots over it. Pins: bandwidth equal to R `bw.nrd0` on `two.g1`, `three`
  and RoundingTimes (rparity), density within 1e-3 of R `density()` at its grid (R bins).
- `scatter`: points, OLS line and the 95% confidence band of the mean (R `predict(lm, interval = 'confidence')`
  on `corr`, rparity pin).
- `timeCourse`: mean and 95% t interval per time and group, thin lines per animal optional (from `anova.repeated`
  tables).
- `epiCurve`: counts by day, ISO 8601 week (Monday start) or month; empty bins drawn as zero. Pins: `isoWeek` of
  2026-01-01 is 2026 W1 (Thursday), of 2026-12-28 is 2026 W53, of 2027-01-01 is 2026 W53 (Python `isocalendar`).
- `forest`: strata and pooled estimates on a log scale, the null line, each CI printed beside; from the MH
  envelope's per-stratum table (measure adds `strata` with estimate and Wald CI per stratum, null where undefined).
- `estimation` (Gardner-Altman): both groups' points and the mean difference with its CI on a floating axis.
- `ciFunction`: p across effect sizes, `p(theta) = 2 Phi(-|ln est - ln theta| / SE)` on the working scale; pin:
  numbers.json `assoc.mh.pFunction` (14 points, MH PR 2.17392147567125, SE 0.2002407915579817), and p = 1 - conf
  exactly at the CI bounds.
- `kaplanMeier`: steps with censor ticks, optional CI band, the number-at-risk table under the axis.
- `roc`: the step curve, the diagonal, AUC with its CI in the legend, the Youden point(s) marked.
- `blandAltman`: points (mean, difference), bias and limits as lines with their CIs as bands.
- `ci`: M1's CI plot (`ci-plot.js`, `CiPlot.jsx`) moves under the kit's scales.

### 8.3 Export and figures
SVG; PNG at 300 or 600 dpi for a width in mm (M1); **TIFF** (8-bit RGB, LZW, XResolution/YResolution rational
= dpi, ResolutionUnit inch; lazy chunk), pinned by decoding with a small reader in the test and once with Pillow
12.2.0 in the notes; **vector PDF** through the browser's print dialog from a print view whose `@page` size equals
the figure size in mm; **multi-panel figures** (FiguresPane, `composeFigure`): panels from saved results in a grid
with A, B, C labels, at 90, 140 or 190 mm (Elsevier's single, 1.5 and double column artwork widths) or a typed
width. No CMYK (journals convert; add it if a journal asks). The rasterizer is shared with the Word export.

## 9. Languages (i18n areas and owners)

| File | Prefix | Owner | Holds |
|---|---|---|---|
| `i18n/common.js` | `common.` | ui-analysis | as M1, plus `common.notBuilt` (stub screens) |
| `i18n/terms.js` | `term.` | ui-analysis | one term per concept; add new glosses (Type III, sphericity, hazard, AUC, limits of agreement, alpha) here first |
| `i18n/workspace.js` | `ws.` | ui-analysis | every workspace screen word (M1) and the rail, route, role and design words M2 added |
| `i18n/report.js` | `report.` | report | methods and results templates, export words |
| `i18n/landing.js`, `entrance.js` | `landing.`, `entrance.` | trust | front door and entrance |
| `i18n/intake.js` | `intake.` | data | import, conversions, recipe step descriptions (M1) |
| `i18n/stats.js` | `stats.` | lab | M1 stats words |
| `i18n/epi.js` | `epi.` | measure | M1 epi words, designs, guardrails |
| `i18n/runtime.js` | `runtime.` | data | engine and store messages, families, method names (B2), notes |
| `i18n/lab.js` | `lab.` | lab | lab options, result labels, `lab.undefined.*`, the experiment design |
| `i18n/models.js` | `models.` | models | model and survival words, `models.undefined.*` |
| `i18n/measure.js` | `measure.` | measure | ROC, Bland-Altman, Cronbach, survey route, sparse note |
| `i18n/data.js` | `data.` | data | .sav, merge, reshape, aggregate, compute (`data.expr.*`), exclusions, double entry |
| `i18n/graphs.js` | `graphs.` | graphs | chart words, figure layout, export |
| `i18n/tools.js` | `tools.` | ui-tools | data-tool panes, power, randomisation, sampling, examples on the project list |
| `i18n/trust.js` | `trust.` | trust | /methods, /cite, /guide |

Rules (M1-DESIGN.md 4.3 and the task brief): every visible string in Thai (default) and English from these files,
in plain words a fourth-year veterinary student understands on first read, in both languages; statistics terms stay
English with a short Thai gloss once per screen from `term.*`; one term per concept (ปรับตามฟาร์ม, ดาวน์โหลด,
ส่งออกนอกเครื่อง, นิสิต never นักศึกษา, รูปแบบการศึกษา for design); Thai words from `src/data/glossary.js` when it has
them; no calques, no middle dot, no star glyph, no ellipsis, no tool or AI names, Arabic digits, dates with their
era; made-up data labelled ข้อมูลสมมุติ / made-up data. The tests `i18n-dictionaries` (both languages, prefix,
banned characters), `i18n-terms` (one word per concept) and `workspace-i18n-coverage` (every key the screens build)
apply to every new file.

## 10. Routes, panes and the rail (owner: ui-analysis for router.js, App.jsx, Project.jsx, Rail.jsx)

### 10.1 Routes
| Path | Route | Screen (owner) |
|---|---|---|
| `/app/p/<id>/lab` | pane | LabPane.jsx (ui-analysis) |
| `/app/p/<id>/models` | pane | ModelsPane.jsx (ui-analysis) |
| `/app/p/<id>/survival` | pane | SurvivalPane.jsx (ui-analysis) |
| `/app/p/<id>/measure` | pane | MeasurePane.jsx (ui-analysis) |
| `/app/p/<id>/figures` | pane | FiguresPane.jsx (graphs) |
| `/app/p/<id>/merge`, `reshape`, `aggregate`, `compute`, `clean`, `compare`, `sampling` | panes | `screens/tools/*` (ui-tools) |
| `/app/tools/power`, `/app/tools/randomise` | tools | `screens/tools/PowerTool.jsx`, `RandomiseTool.jsx` (ui-tools) |
| `/methods`, `/cite`, `/guide` | public pages, their own lazy root `pages/Public.jsx` | trust |

Rail (Rail.jsx `RAIL`): data (import, codebook, data), prepare data (merge, reshape, aggregate, compute, clean,
compare), analysis (design, prevalence, association, lab, models, survival, measure, Table 1), report (report,
figures), tools (sample size, power, randomisation, sampling). Items needing data stay disabled until a dataset is
confirmed, as in M1.

### 10.2 Analysis panes (ui-analysis)
The four new panes follow AnalysisPane's pattern (design first, method list from the design's offers filtered to
the pane, role pickers from `METHOD_UI`, options from the spec lists, estimate and CI before p, the G1 panel before
any result, save and freeze, provenance line, copy and CSV). ui-analysis adds `METHOD_UI` entries for the lab,
models and measure methods (`pane: 'lab' | 'models' | 'survival' | 'measure'`); `METHOD_UI` entries for tool
methods come from `method-ui-tools.js` (ui-tools). The diagnostics panel (Shapiro, Q-Q, Brown-Forsythe) sits beside
t-test, ANOVA and regression results as a collapsed panel with the sentence that it does not change the test.

### 10.3 Tool screens (ui-tools)
Power (four calculators, the design-effect step, G9 refusal after data), randomisation and blinding (list, seed,
CSV with the settings in its header rows, key file separate), the data-tool panes of section 4 (each shows a
preview and the report before saving the step), the import pane's `.sav` and second-file paths, the codebook
screen's English label per category (carried item 4), and examples on the project list.

## 11. Trust pages and learning (owner: trust; `pages/*`, `landing/**`, `entrance/**`, `src/data/{cite,examples}.js`, `scripts/regen-verified.mjs`)

1. `/methods`: every catalogue method with its name, status (ships, milestone), the fixture families it passes
   and, for each, the fixture files and their sources (R version and packages, NIST dataset, course item, paper and
   page). Data only from `catalog.js`, `verified.generated.js` and a new `fixtures.generated.js` that
   `scripts/regen-verified.mjs` writes (per method: `{ family, file, source }` from each fixture's `_fixture`
   block, which gains a `source` sentence); `--check` fails when stale.
2. `/cite`: the citation line for the running release (`src/data/cite.js`: version, year, URL, access date, DOI
   null until one is minted; never invented), RIS and BibTeX downloads through report's `cite.js`.
3. `/guide`: a short guide in plain Thai and English (raw file to report; what G1, G3, G5, G7, G8, G14, G26 mean;
   warnings fire from the data, not from a checklist the student ticks).
4. Examples (`src/data/examples.js` and `src/data/examples/*.js`, written by `scripts/make-examples.mjs` with the
   PCG32 generator and a recorded seed): the serosurvey, a two-way lab experiment, a repeated-measures growth study,
   a survival study, two biomarkers for ROC, two analysers for Bland-Altman, a questionnaire; each made-up and
   labelled so on every screen; offered on the project list (ui-tools shows them).
5. Landing: `preloadWorkspace()` (`src/preload.js`) on pointerdown and focus of every landing link into `/app`
   (carried item 6); the 320 px header wordmark (carried item 8); the chart's status labels keep reading
   `familyStatus()`, so M2 families flip to "now" as their methods register.

## 12. Carried from M1 review round 3 (owners and decisions)

1. **Homogeneity on sparse farm strata** (measure). Decision B8: no new test. When a Woolf or Breslow-Day test sums
   fewer than half of the strata, or fewer than 5, the result carries the note `measure.note.sparseStrata` ("the
   test used only {used} of {total} farms; with so few, a large p-value does not show that the farms agree") and
   G12 sentences never read the p-value as agreement. Pin: serosurvey vaccine x ELISA within-farm route, Woolf over
   10 of 49 strata: the note fires; age x ELISA Breslow-Day over 43 of 49: it does not.
2. **Design-effect rows** (measure). Decision B9: ICC and mean farm size from the analysed rows. The DEFF route
   computes them on `rowsUsed`; `nIcc` then equals the rows used and the G1 panel line reads "from 682 animals in
   49 farms". Prevalence on all 728 is unchanged (ICC 0.050578532266689236, DEFF 1.7008739471241223). New pins
   (check.py's estimator on the rows each 2x2 uses; measure updates numbers.json `assoc.deffPR` and check.py in the
   same commit): age x ELISA (716 rows): ICC 0.05140138547901361, m 14.612244897959183, DEFF 1.6996882472347363,
   DEFF-widened PR CI 1.2725237769644218 to 3.5064211360247777 (was 1.272298891572946 to 3.507040914046339 from
   728); not vaccinated vs vaccinated (682 rows): ICC 0.04322155871911217, m 13.918367346938776, DEFF
   1.5583519728407755 (the review's 0.0432, 13.92, 1.56), crude PR 0.8690146418678274, DEFF-widened CI
   0.5291898421963481 to 1.4270614958260435.
3. **PD display** (ui-analysis, `format.js` and result-model.js). One display on screen: percentage points with a
   real minus (U+2212) in the values table, the CI plot and the paragraphs; CSV stays a numeric proportion with
   hyphen-minus.
4. **English category labels** (ui-tools on the codebook screen; report reads them). The codebook's levels already
   carry `labelEn` (types.js); the screen gets an English label field per category, and English paragraphs use it
   (falling back to the value with the M1 note when empty).
5. **Whole ratios** (ui-analysis, `format.js`): a parameter the student typed as a whole number (controls per case,
   groups) prints as a whole number ("1", not "1.00"); estimated ratios keep their decimals.
6. **Loading beat before the entrance** (trust): `preloadWorkspace()` on pointerdown/focus of landing links to
   `/app`. The landing herd does not carry over into the entrance: dropped for M2 (the landing unmounts on
   navigation; carrying dot positions would couple two lazy roots for a sub-second effect).
7. **Narrow CI plots** (graphs): `niceTicks` with a minimum label gap replaces the fixed base ticks of `ci-plot.js`.
8. **320 px wordmark** (trust): both parts of the wordmark show at 320 px (smaller type, not hidden).
9. **WebKit persistence flake** (ui-tools, Projects.jsx). Likely cause from reading the code: the create form is a
   controlled input whose submit handler reads React state (`newName`), and the projects list can remount right
   after a fresh build (film veil, entrance hold, owner gate), so Enter can arrive when the state is empty and the
   handler returns silently. Make the submit read the input's own value (`new FormData(e.currentTarget)`), keep the
   button enabled state from the same value, and prove it with 20 WebKit runs after a fresh build in the notes.

## 13. Dependencies

Installed by the architect in `research/` only, exact pin: **fflate 0.7.5** (MIT, the root app's version; zip for
.docx, zlib inflate for .zsav). `npm ls fflate` shows `fflate@0.7.5`; notice on /licenses (`licenses/notices.js`);
adoption recorded in `docs/oss-adoption-audit-2026-08-21.md`. Considered and not added: `docx` (npm; large, an API
over the same XML we need to control for Thai fonts and table headers), UTIF.js (TIFF; a 60-line LZW encoder is
enough), expression evaluators such as expr-eval (history of prototype-pollution advisories; a fixed-grammar
parser is smaller), `spss-reader`-style packages (unmaintained, no .zsav, no encoding records), jStat and
simple-statistics (engine.md 4: lower accuracy than stdlib). No `eval`, `new Function` or WebAssembly in M2; the
research CSP stays as shipped.

## 14. File ownership (every file belongs to exactly one role)

Roles: lab, models, measure, data, report, graphs, ui-analysis, ui-tools, trust, rparity. The architect's files
(`research/package.json`, `research/package-lock.json`, this document) go to the orchestrator: a dependency change
or a contract change goes through it. Cross-role imports are allowed (read the other role's exported signature,
never edit its file); a needed change goes into your notes for its owner.

| Role | Files |
|---|---|
| lab | `research/src/lib/stats/*` except `format.js` (M1 files and anova2, anovarm, friedman, posthoc, mvt, normality, noncentral, power, hodges-lehmann), `src/lib/runtime/areas/lab.{options,impl,registered}.js`, `src/i18n/stats.js`, `src/i18n/lab.js`, `tests/unit/stats-*.test.mjs` (except `stats-format`), `tests/unit/lab-*.test.mjs` |
| models | `src/lib/models/*`, `src/lib/runtime/areas/models.{options,impl,registered}.js`, `src/i18n/models.js`, `tests/unit/models-*.test.mjs` |
| measure | `src/lib/epi/*` (M1 files: design, guardrails, mh, twobytwo, cluster, frequency, diagnostic, kappa, samplesize, labels, _table; new roc, blandaltman, cronbach, survey), `src/lib/runtime/areas/measure.{options,impl,registered}.js`, `src/i18n/epi.js`, `src/i18n/measure.js`, `tests/fixtures/course/*`, `tests/fixtures/serosurvey/*`, `tests/unit/epi-*.test.mjs`, `tests/unit/measure-*.test.mjs` |
| data | `src/lib/intake/*` (with sav, expr, transform, double-entry), `src/lib/store/*`, `src/lib/auth/*`, `src/lib/runtime/*` except `export.js`, `paragraphs.js` and the area files of other roles (so: types, protocol, catalog, registry, registered, verified.generated, spec, envelope, run, engine-core, engine.worker, client, fingerprint, provenance, sw-register, `areas/index.js`, `areas/impl.js`, `areas/registered.js`), `src/sw/*`, `src/main.jsx`, `src/i18n/index.js`, `src/i18n/intake.js`, `src/i18n/runtime.js`, `src/i18n/data.js`, `build/*`, `vite.config.js`, `vercel.json`, `index.html`, `playwright.config.js`, `public/manifest.webmanifest`, `tests/fixtures/intake/*`, `tests/fixtures/sav/*`, `tests/unit/{intake,store,runtime,data,no-egress,catalog,i18n-dictionaries,prefs}-*.test.mjs` and `tests/unit/{catalog,no-egress,i18n-dictionaries}.test.mjs`, `tests/e2e/{research-network-silence,research-offline,research-persistence,research-headers}.spec.js` |
| report | `src/workspace/report/*` (build, result-words, strobe, flow), `src/workspace/screens/ReportPane.jsx`, `src/lib/runtime/export.js`, `src/lib/runtime/paragraphs.js`, `src/lib/export/*` except `tiff.js`, `src/data/references.js`, `src/i18n/report.js`, `src/styles/report.css` (new if needed), `tests/unit/{report,export}-*.test.mjs` |
| graphs | `src/workspace/charts/*`, `src/workspace/components/{CiPlot.jsx,ChartExport.jsx,ci-ticks.js,Herd.jsx}`, `src/workspace/lib/{ci-plot.js,herd.js}`, `src/workspace/screens/FiguresPane.jsx`, `src/lib/export/tiff.js`, `src/i18n/graphs.js`, `src/styles/charts.css` (new), `tests/unit/{graphs,workspace-ci-ticks}-*.test.mjs` and `tests/unit/workspace-ci-ticks.test.mjs` |
| ui-analysis | `src/App.jsx`, `src/router.js`, `src/workspace/Workspace.jsx`, `src/workspace/ws-context.js`, `src/workspace/components/*` except the graphs files above, `src/workspace/lib/*` except `method-ui-tools.js`, `ci-plot.js`, `herd.js`, `grid-model.js`, `import-questions.js`, `sample-size.js`, `course-examples.js`, `files.js`, the screens `AnalysisPane`, `DesignPane`, `Table1Pane`, `SavedResult`, `Project`, `LabPane`, `ModelsPane`, `SurvivalPane`, `MeasurePane`, `Licenses`, `src/lib/stats/format.js`, `src/styles/{tokens,base,workspace}.css`, `src/i18n/{common,terms,workspace}.js`, `tests/unit/{router,i18n-glossary,i18n-terms,i18n-plural,stats-format}.test.mjs`, `tests/unit/workspace-*.test.mjs` (except ci-ticks), `tests/e2e/research-workspace-*.spec.js` |
| ui-tools | `src/lib/plan/*`, `src/lib/runtime/areas/plan.{options,impl,registered}.js`, `src/workspace/screens/{ImportPane,CodebookPane,DataPane,Projects,SampleSize}.jsx`, `src/workspace/screens/pending-file.js`, `src/workspace/screens/useProject.js`, `src/workspace/screens/tools/*`, `src/workspace/lib/{method-ui-tools,grid-model,import-questions,sample-size,course-examples,files}.js`, `src/i18n/tools.js`, `src/styles/tools.css` (new), `tests/fixtures/plan/*`, `tests/unit/{tools,plan}-*.test.mjs` |
| trust | `src/landing/**`, `src/entrance/**`, `src/pages/**`, `src/preload.js`, `src/licenses/**`, `src/data/{cite.js,examples.js,cuvet-methods.json}`, `src/data/examples/*`, `scripts/regen-verified.mjs`, `scripts/make-examples.mjs` (new), `src/lib/runtime/fixtures.generated.js` (new, generated), `public/icons/*`, `public/fonts/*`, `public/film/*`, `src/styles/landing.css`, `src/styles/pages.css` (new), `src/i18n/{landing,entrance,trust}.js`, `tests/unit/{landing,trust}-*.test.mjs`, `tests/e2e/research-landing-*.spec.js` |
| rparity | `tests/fixtures/r/**`, `tests/fixtures/crosscheck/**`, `tests/fixtures/published/**`, `scripts/r-parity/**`, `.github/workflows/research-r-parity.yml`, `tests/unit/rparity-*.test.mjs` |

`tests/e2e/research-journey.spec.js` belongs to the integrator of the orchestrating workflow (M1 section 18); a role
that needs a journey change writes it in its notes.

## 15. Gates and running things

- Unit: `npm test` and `npm run test:utc` in `research/` green; `node scripts/regen-verified.mjs --check` current.
- Build: `npm run build` green; the heavy exporters (`docx.js`, `tiff.js`, `sav.js`) are separate lazy chunks, not in
  the landing chunk or the first workspace chunk (a unit test reads the Vite manifest).
- E2E: `npm run e2e` on the four projects; the network-silence spec runs every registered method including M2.
- Release check: `git grep -n "STUB(m2)" research/src` prints nothing; every M2 catalogue row either ships or is
  moved to a later milestone by the orchestrator.
- Shared machine: ports 43100 to 43199 only (dev 43110, preview 43111, e2e 43121 or `RESEARCH_E2E_PORT`), never
  41731; stop what you start; never kill what you did not start; no npm install/uninstall (the orchestrator owns
  the lockfile); no push; commits with `git -c user.name=palmzamak2547 -c user.email=palmzamak2547@gmail.com`,
  plain messages, no Co-Authored-By or agent trailer (public repo).
- The main VetMock app is untouched (nothing outside `research/`, `docs/research/` and
  `.github/workflows/research-*.yml`); `research/` may import read-only from `../src`.
