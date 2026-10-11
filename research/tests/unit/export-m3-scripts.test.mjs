// The R script and the SPSS syntax for the M3a methods [M3-DESIGN.md 6], Thai and English comments: the curves with base
// R's nls in the log-EC50 form (the standard errors VetMock Research reports; drc only as an optional check that never
// stops the script and says it must be installed), logistf for Firth's correction, MASS::glm.nb for negative binomial
// regression with the halved test against Poisson, prcomp with the sign rule, the dCt t-test, the trapezoid areas, and
// anova.mlm with each within effect on its own contrasts. SPSS: NLR started at VetMock Research's estimates, GENLIN
// negative binomial, FACTOR, GLM with two within factors; Firth has no SPSS command and the syntax says so. Every script
// was also run in webR 0.6.0 (R 4.6.0) for the base-R methods; the report notes give the numbers. Nothing here runs a
// script. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analysedCsv } from '../../src/lib/export/analysed-data.js';
import { buildSps } from '../../src/lib/export/sps.js';
import { buildRScript } from '../../src/lib/export/rscript.js';
import { matchesR } from '../../src/lib/export/script-common.js';
import { tOf } from './export-helpers.mjs';
import { m3Case } from './report-m3-cases.mjs';

const input = (name, lang, envPatch = null) => {
  const c = m3Case(name);
  const data = analysedCsv(c.table, c.codebook, lang);
  const env = envPatch ? envPatch(structuredClone(c.env)) : c.env;
  return { analyses: [{ id: name, spec: c.spec, envelope: env }], codebook: c.codebook, csvName: `${name}.csv`, lang, t: tOf(lang), columns: data.columns, version: '0.2.0', date: '11 Oct 2026 CE' };
};
const R = (name, lang = 'en', patch = null) => buildRScript(input(name, lang, patch));
const S = (name, lang = 'en', patch = null) => buildSps(input(name, lang, patch));
const has = (text, part, why = '') => assert.ok(text.includes(part), `${why} missing:\n  ${part}\nin:\n${text}`);
const lacks = (text, part, why = '') => assert.ok(!text.includes(part), `${why} unexpected:\n  ${part}\nin:\n${text}`);
/** The value SPSS prints for a starting value: ten significant digits. */
const s10 = (x) => String(Number(x.toPrecision(10)));
/** An estimate from an envelope's parameters table. */
const est = (name, term, group) => {
  const tb = m3Case(name).env.tables.find((x) => x.id === 'parameters');
  const col = (c) => tb.columns.indexOf(c);
  return tb.rows.find((r) => r[col('term')] === term && (group === undefined || r[col('group')] === group))[col('estimate')];
};

test('R: the standard curve is fitted with nls in the log-EC50 form, drc only as an optional check that says to install it', () => {
  const r = R('fourPL');
  has(r, 'fit4 <- nls(Y ~ c + (d - c) / (1 + exp(b * (log(X) - e))), data = s, start = start4(s$X, s$Y), control = nls.control(maxiter = 200))');
  has(r, 's <- data.frame(X = a$conc, Y = a$root)', 'fixed names, so a column called b, c, d or e cannot clash');
  has(r, 'u <- s[is.na(s$X) & !is.na(s$Y), ]  # the samples to read off the curve');
  has(r, 'delta_exp(fit, function(p) p[["e"]], level = 0.95)');
  has(r, 'read_x <- function(fit, y0, level = 0.95)');
  has(r, 't(sapply(u$Y, function(y0) read_x(fit, y0, level = 0.95)))');
  has(r, 'start4 <- function(x, y)');
  has(r, 'aicc <- function(fit)');
  has(r, 'if (requireNamespace("drc", quietly = TRUE)) print(drc::ED(drc::drm(Y ~ X, data = s, fct = drc::LL2.4()), 50, interval = "fls", level = 0.95))');
  has(r, '# install.packages("drc")');
  lacks(r, 'library(drc)', 'drc must never stop the script when it is not installed');
  for (const lang of ['th', 'en']) {
    const t = tOf(lang);
    const text = R('fourPL', lang).replace(/\n# /g, ' ');
    has(text, t('report.script.drc'), `${lang}: the drc comment`);
    has(text, t('report.script.nlsWhy'), `${lang}: why nls`);
    lacks(R('fourPL', lang), '[report.');
  }
  assert.equal(matchesR(m3Case('fourPL').env), true, 'verified against r-4.6.0, so the script may say the numbers matched');
  has(r, '#   IC50 = 3.05796 [2.69389, 3.47123]', "VetMock Research's numbers named in words, not as the internal id");
});

test('R: the 5PL starts from the 4PL, derives its EC50 by the delta method and is tested against the 4PL', () => {
  const r = R('fivePL');
  has(r, 'fit <- nls(Y ~ c + (d - c) / (1 + exp(b * (log(X) - e)))^g, data = s, start = c(as.list(coef(fit4)), g = 1)');
  has(r, 'delta_exp(fit, function(p) p[["e"]] + log(2^(1 / p[["g"]]) - 1) / p[["b"]], level = 0.95)');
  has(r, 'anova(fit4, fit)  # extra sum-of-squares F test of the 5PL against the 4PL');
  has(r, 'drc::LL2.5()');
});

test('R: dose-response curves share one residual variance (indexed parameters), the restricted fit cannot stop the script, the ratio by the delta method', () => {
  const r = R('doseEc50');
  has(r, 'fit4 <- nls(Y ~ c[grp] + (d[grp] - c[grp]) / (1 + exp(b[grp] * (log(X) - e[grp]))), data = s, start = list(b = sv("b"), c = sv("c"), d = sv("d"), e = sv("e"))');
  has(r, 's$G <- droplevels(factor(s$G, levels = c("control", "drug"))); s$grp <- as.integer(s$G)');
  has(r, 'restricted <- try(nls(Y ~ c[grp] + (d[grp] - c[grp]) / (1 + exp(b[grp] * (log(X) - e))), data = s, start = list(b = sv("b"), c = sv("c"), d = sv("d"), e = mean(sv("e")))');
  has(r, 'if (!inherits(restricted, "try-error")) { print(anova(restricted, fit));');
  has(r, 'delta_exp(fit, function(p) p[["e2"]] - p[["e1"]], level = 0.95)  # the ratio, second group over the first');
  const all = R('doseAll');
  has(all, 'one4 <- try(nls(Y ~ c + (d - c) / (1 + exp(b * (log(X) - e))), data = s, start = start4(s$X, s$Y)');
  has(all, 'restricted <- one4  # one curve for every group');
  const none = R('doseNone');
  lacks(none, 'restricted', 'no comparison asked');
  const five = R('dose5pl');
  has(five, '(l50 - log(2^(1 / g[grp]) - 1) / b[grp])', 'the 5PL shares the EC50 itself');
});

test('R: curve equations with their own forms, t intervals as VetMock Research gives them, half-life and doubling time from the rate', () => {
  has(R('michaelisMenten'), 'fit <- nls(Y ~ Vmax * X / (Km + X), data = s, start = list(Vmax = max(s$Y), Km = median(s$X))');
  const d = R('decay');
  has(d, 'fit <- nls(Y ~ (Y0 - Plateau) * exp(-K * X) + Plateau');
  has(d, 'c(half_life = log(2) / ck[["estimate"]], lower = log(2) / ck[["upper"]], upper = if (ck[["lower"]] > 0) log(2) / ck[["lower"]] else Inf)');
  has(R('growth'), 'fit <- nls(Y ~ Y0 * exp(k * X)');
  has(R('growth'), 'doubling_time = log(2) / ck[["estimate"]]');
  has(d, 'nls_table(fit, level = 0.95)');
  has(d.replace(/\n# /g, ' '), tOf('en')('report.script.nlsCi'));
});

test('R: the area under the curve per animal by the trapezoid, then Welch or one-way ANOVA, with the direction of the difference said', () => {
  const r = R('aucZero');
  has(r, 'auc_trap <- function(t, y, baseline = "zero")');
  has(r, 'area = if (nrow(z) >= 2) auc_trap(z$minute, z$glucose, "zero") else NA');
  has(r, 'ar <- ar[!is.na(ar$area), ]; ar  # animals measured at fewer than 2 times are left out');
  has(r, 't.test(area ~ group, data = ar, var.equal = FALSE, conf.level = 0.95)');
  has(r.replace(/\n# /g, ' '), tOf('en')('report.script.aucDirection'));
  has(R('aucFirst'), 'auc_trap(z$minute, z$glucose, "first")');
  has(R('aucOne'), 't.test(ar$area, conf.level = 0.95)  # the mean area and its interval');
});

test('R: qPCR computes dCt (Livak or Pfaffl with the efficiencies entered) and tests on dCt; Dunnett for three groups', () => {
  const r = R('livak');
  has(r, 'b$dCt <- b$target - rowMeans(b[, c("gapdh", "actb"), drop = FALSE])  # target Ct minus the mean reference Ct (Livak)');
  has(r, 'b$grp <- relevel(factor(b$arm), ref = "control")  # the calibrator first');
  has(r, 'tt <- t.test(b$dCt[b$grp == levels(b$grp)[2]], b$dCt[b$grp == levels(b$grp)[1]], var.equal = FALSE, conf.level = 0.95); tt');
  has(r, 'c(fold = 2^-ddct, lower = 2^-tt$conf.int[2], upper = 2^-tt$conf.int[1])');
  lacks(r, 'library(multcomp)', 'two groups need no Dunnett');
  const pf = R('pfaffl');
  has(pf, 'E <- c(target = 1.95, gapdh = 1.98, actb = 2)  # amplification factors per cycle (Pfaffl)');
  has(pf, 'b$dCt <- b$target * log2(E[["target"]]) - rowMeans(sweep(as.matrix(b[, c("gapdh", "actb"), drop = FALSE]), 2, log2(E[c("gapdh", "actb")]), "*"))');
  has(pf, 'var.equal = TRUE');
  const three = R('qpcrThree');
  has(three, 'library(multcomp)');
  has(three, 'dn <- glht(aov(dCt ~ grp, data = b), linfct = mcp(grp = "Dunnett"))');
  has(three, 'cbind(fold = 2^-ci[, "Estimate"], lower = 2^-ci[, "upr"], upper = 2^-ci[, "lwr"])');
  has(R('efficiency'), 'E <- c(estimate = 10^(-1 / sl), lower = 10^(-1 / ci[[1]]), upper = 10^(-1 / ci[[2]])); E  # amplification factor per cycle');
});

test('R: PCA with prcomp on the matrix asked for, the sign rule applied, eigenvalues as comments', () => {
  const r = R('pcaCorrelation');
  has(r, 'p <- prcomp(X, scale. = TRUE)  # correlation matrix');
  has(r, 'sg <- apply(p$rotation, 2, function(w) sign(w[which.max(abs(w))])); p$rotation <- sweep(p$rotation, 2, sg, "*"); p$x <- sweep(p$x, 2, sg, "*")');
  has(r, 'eigenvalues 2.48024, 0.989765, 0.356563, 0.17343');
  has(R('pcaCovariance'), 'p <- prcomp(X, scale. = FALSE)  # covariance matrix');
});

test('R: two within factors with anova.mlm, each effect on its own contrasts, and Mauchly per effect', () => {
  const r = R('rm2Between');
  has(r, 'idata <- data.frame(phase = factor(rep(levels(b$phase), each = nlevels(b$hour)), levels = levels(b$phase)), hour = factor(rep(levels(b$hour), times = nlevels(b$phase)), levels = levels(b$hour)))');
  has(r, 'anova(fit, M = ~phase, X = ~1, idata = idata, test = "Spherical")');
  has(r, 'anova(fit, M = ~phase + hour, X = ~phase, idata = idata, test = "Spherical")');
  has(r, 'anova(fit, M = ~phase * hour, X = ~phase + hour, idata = idata, test = "Spherical")');
  has(r, 'anova(fit, M = ~1, X = ~0, idata = idata, test = "Spherical")  # between the groups');
  has(r, 'grp <- factor(b$treatment[match(W$subj[keep], b$subj)]); fit <- lm(Y ~ grp)');
  lacks(r, 'Error(subj / phase)', 'not the one-within code');
  has(R('rm2Within'), 'fit <- lm(Y ~ 1)');
});

test("R: Firth's correction with logistf (profile or Wald) and drop1; negative binomial with MASS::glm.nb, theta, the halved test and the term refits", () => {
  const f = R('firthProfile');
  has(f, 'library(logistf)');
  has(f, '# install.packages(c("logistf"))');
  has(f, 'fit <- logistf(y01 ~ age + oc + vic + vicl + vis + dia, data = a, pl = TRUE, alpha = 0.05');
  has(f, 'drop1(fit)  # the penalised likelihood-ratio test of each term');
  lacks(f, 'family = binomial', 'not ordinary maximum likelihood');
  has(R('firthWald'), 'pl = FALSE');
  const nb = R('negbinProfile');
  has(nb, 'library(MASS)');
  has(nb, 'fit <- glm.nb(Days ~ Eth + Sex + Age, data = a, control = glm.control(epsilon = 1e-10, maxit = 50)); summary(fit)');
  has(nb, 'c(theta = fit$theta, SE = fit$SE.theta)');
  has(nb, 'exp(cbind(IRR = coef(fit), confint(fit, level = 0.95)))  # profile intervals with theta held at its estimate');
  has(nb, 'c(chisq = lr, p = 0.5 * pchisq(lr, 1, lower.tail = FALSE))  # against Poisson, p halved');
  has(nb, 'm0 <- update(fit, paste(". ~ . -", tl))');
  const w = R('negbinWald');
  has(w, 'fit <- glm.nb(Days ~ Eth + Sex + offset(log(py)), data = a');
  has(w, 'confint.default(fit, level = 0.95)');
  has(w, 'null <- glm.nb(Days ~ 1 + offset(log(py))');
});

for (const lang of ['th', 'en']) {
  const t = tOf(lang);
  test(`${lang}: SPSS: NLR for the curves, started at VetMock Research's estimates, with the zero dose and the unknowns handled`, () => {
    const s = S('fourPL', lang);
    has(s, `MODEL PROGRAM nl_b=${s10(est('fourPL', 'b'))} nl_c=${s10(est('fourPL', 'c'))} nl_d=${s10(est('fourPL', 'd'))} nl_e=${s10(est('fourPL', 'e'))}.`);
    has(s, 'DO IF (conc > 0).\r\nCOMPUTE PRED_ = nl_c + (nl_d - nl_c) / (1 + EXP(nl_b * (LN(conc) - nl_e))).\r\nELSE.\r\nCOMPUTE PRED_ = (nl_b > 0) * nl_d + (nl_b <= 0) * nl_c.\r\nEND IF.');
    has(s, 'NLR root /PRED PRED_ /CRITERIA SSCONVERGENCE 1E-12 PCON 1E-10 ITER 200.');
    has(s, 'COMPUTE nl_std = NOT MISSING(conc).\r\nFILTER BY nl_std.');
    has(s, 'IF (MISSING(conc) AND root > ');
    for (const k of ['report.script.spss.nlrStart', 'report.script.spss.nlrZero', 'report.script.spss.nlrEc50', 'report.script.spss.nlrUnknown']) has(s.replace(/\.\r\n\* /g, ' '), t(k).replace(/\.$/, '').slice(0, 30), k);
    for (const line of s.split('\r\n').filter((l) => l.startsWith('*'))) assert.ok(line.endsWith('.'), line);
    lacks(s, '[report.');
    const five = S('fivePL', lang);
    has(five, `**nl_g`);
    has(five.replace(/\.\r\n\* /g, ' '), t('report.script.spss.nlr5pl').slice(0, 30));
    const dose = S('doseEc50', lang);
    has(dose, "DO IF (arm = 'control' AND dose > 0).");
    has(dose, "ELSE IF (arm = 'drug').");
    has(dose, `nl_e2=${s10(est('doseEc50', 'e', 'drug'))}`);
    assert.equal(dose.split('NLR resp ').length - 1, 2, 'separate curves, then the shared IC50');
    has(dose, '(LN(dose) - nl_e)', 'the restricted model shares e');
    has(S('doseAll', lang), 'MODEL PROGRAM nl_b=');
    assert.equal(S('doseNone', lang).split('NLR resp ').length - 1, 1);
    has(S('michaelisMenten', lang), 'COMPUTE PRED_ = nl_vmax * conc / (nl_km + conc).');
    has(S('decay', lang), 'COMPUTE PRED_ = (nl_y0 - nl_plat) * EXP(-nl_k * time) + nl_plat.');
    has(S('growth', lang), 'COMPUTE PRED_ = nl_y0 * EXP(nl_k * time).');
  });

  test(`${lang}: SPSS: areas per animal, dCt, the efficiency regression, FACTOR, GLM with two within factors, GENLIN negative binomial`, () => {
    const a = S('aucZero', lang);
    has(a, 'AGGREGATE /OUTFILE=* MODE=REPLACE /BREAK=animal arm /auc_area=SUM(auc_piece) /auc_times=N.');
    has(a, 'IF (NOT auc_new) auc_piece = (minute - LAG(minute)) * ((glucose - auc_y0) + (LAG(glucose) - auc_y0)) / 2.');
    has(a, "T-TEST GROUPS=arm('control' 'treated') /VARIABLES=auc_area /CRITERIA=CI(.95).");
    has(S('aucFirst', lang), 'COMPUTE auc_y0 = LAG(auc_y0).');
    has(S('aucThree', lang), 'ONEWAY auc_area BY dose_n /STATISTICS DESCRIPTIVES.');
    has(S('livak', lang), 'COMPUTE qpcr_dct = target - MEAN.2(gapdh, actb).');
    has(S('livak', lang), "T-TEST GROUPS=arm('treated' 'control') /VARIABLES=qpcr_dct /CRITERIA=CI(.95).");
    has(S('pfaffl', lang), 'COMPUTE qpcr_dct = target * LN(1.95) / LN(2) - MEAN.2(gapdh * LN(1.98) / LN(2), actb * LN(2) / LN(2)).');
    has(S('qpcrThree', lang), 'ONEWAY qpcr_dct BY dose_n /STATISTICS DESCRIPTIVES /POSTHOC=DUNNETT(1) ALPHA(0.05).');
    has(S('efficiency', lang), 'REGRESSION /STATISTICS COEFF CI(95) R ANOVA /DEPENDENT ct /METHOD=ENTER log10input.');
    has(S('pcaCorrelation', lang), 'FACTOR /VARIABLES Murder Assault UrbanPop Rape /MISSING LISTWISE /PRINT INITIAL EXTRACTION /CRITERIA FACTORS(4) ITERATE(25) /EXTRACTION PC /ROTATION NOROTATE /METHOD=CORRELATION.');
    has(S('pcaCovariance', lang), '/METHOD=COVARIANCE.');
    const rm = S('rm2Between', lang);
    has(rm, 'CASESTOVARS /ID=subj treatment /INDEX=phase hour /GROUPBY=VARIABLE.');
    has(rm, 'GLM score.pre.1 score.pre.2 score.pre.3 score.pre.4 score.pre.5 score.post.1');
    has(rm, '/WSFACTOR=phase 3 Polynomial hour 5 Polynomial /METHOD=SSTYPE(3) /PRINT=DESCRIPTIVE ETASQ /WSDESIGN=phase hour phase*hour /DESIGN=treatment.');
    has(rm.replace(/\.\r\n\* /g, ' '), t('report.script.spss.rmSequential').slice(0, 30), 'unequal groups');
    lacks(S('rm2Within', lang).replace(/\.\r\n\* /g, ' '), t('report.script.spss.rmSequential').slice(0, 30), 'no groups: no sequential note');
    const nb = S('negbinProfile', lang);
    has(nb, 'GENLIN Days BY Eth Sex Age (ORDER=ASCENDING) /MODEL Eth Sex Age INTERCEPT=YES DISTRIBUTION=NEGBIN(MLE) LINK=LOG /CRITERIA CILEVEL=95 CITYPE=PROFILE');
    has(nb, 'DISTRIBUTION=POISSON LINK=LOG /PRINT FIT.');
    has(nb.replace(/\.\r\n\* /g, ' '), t('report.script.spss.negbin').slice(0, 30));
    has(S('negbinWald', lang), 'OFFSET=ln_time DISTRIBUTION=NEGBIN(MLE)');
    for (const name of ['aucZero', 'livak', 'pcaCorrelation', 'rm2Between', 'negbinProfile']) {
      const s = S(name, lang);
      lacks(s, '[report.', name);
      for (const line of s.split('\r\n').filter((l) => l.startsWith('*'))) assert.ok(line.endsWith('.'), `${name}: ${line}`);
    }
  });

  test(`${lang}: SPSS has no command for Firth's correction, and the syntax says so instead of fitting maximum likelihood`, () => {
    const s = S('firthProfile', lang);
    has(s.replace(/\.\r\n\* /g, ' '), t('report.script.spss.firth').replace(/\.$/, '').slice(0, 40));
    lacks(s, 'LOGISTIC REGRESSION VARIABLES', 'never the ML command for a Firth result');
  });
}

test('a hostile level or a broken number in an envelope never reaches the syntax as code', () => {
  // A group level with a quote and a command, and a parameter estimate that is not a finite number.
  const c = m3Case('doseEc50');
  const evil = "x' /FILE='c:\\evil'.\nHOST COMMAND=['calc']";
  const cb = structuredClone(c.codebook);
  cb.columns[0].levels = [{ value: 'control', labelTh: 'control', labelEn: 'control' }, { value: evil, labelTh: 'e', labelEn: 'e' }];
  const env = structuredClone(c.env);
  const pt = env.tables.find((x) => x.id === 'parameters');
  for (const r of pt.rows) if (r[0] === 'drug') r[0] = evil;
  const data = analysedCsv(c.table, cb, 'en');
  const mk = (e) => ({ analyses: [{ id: 'x', spec: c.spec, envelope: e }], codebook: cb, csvName: 'x.csv', lang: 'en', t: tOf('en'), columns: data.columns });
  const s = buildSps(mk(env));
  for (const line of s.split('\r\n')) {
    if (line.startsWith('*')) continue;
    assert.ok(!/HOST COMMAND/.test(line) || line.includes("''"), `the level is only ever inside a quoted string: ${line}`);
  }
  const r = buildRScript(mk(env));
  assert.ok(!r.split('\n').some((l) => /^HOST COMMAND/.test(l)), 'no line of the R script starts with the payload');
  const nan = structuredClone(c.env);
  nan.tables.find((x) => x.id === 'parameters').rows[0][3] = Number.NaN;
  const sn = buildSps(mk(nan));
  lacks(sn, 'NaN');
  lacks(sn, 'MODEL PROGRAM', 'without every starting value NLR is not written');
  has(sn.replace(/\.\r\n\* /g, ' '), tOf('en')('report.script.noCode').slice(0, 30));
});
