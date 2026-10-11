// An R script that re-runs each analysis of the report on the exported analysed-data CSV with base R and
// named packages (stats, survival, pROC, epiR, sandwich, survey, psych, multcomp, pwr; M3a adds logistf and MASS,
// and drc as an optional check that is never loaded unless it is installed), VetMock Research's
// numbers written as comments above each block. It says the numbers matched R 4.6.0 only for a method
// whose envelope is verified against the 'r-4.6.0' fixtures; otherwise it asks the reader to compare. The
// app shows the code and hands it over as a download; it never runs it [M2-DESIGN.md 6.4]. OWNER: report role.
import { getMethod } from '../runtime/catalog.js';
import { columnIndex, envNumbers, valueNamer, matchesR, num6, oneLine, rolesOf, scriptAnalyses, wrapComment } from './script-common.js';
// The M3a script comments (i18n/report-m3.js), registered when this lazily loaded writer loads.
import '../../workspace/report/words-m3.js';

/** An R string literal. */
export const rq = (s) => `"${String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\u0000-\u001f\u007f\u2028\u2029]/g, ' ')}"`;
const rvec = (xs) => `c(${xs.map(rq).join(', ')})`;
const lvl = (spec) => spec?.options?.confLevel ?? 0.95;
const alt = (spec) => (spec?.options?.alternative && spec.options.alternative !== 'two.sided' ? `, alternative = ${rq(spec.options.alternative)}` : '');

/** R helpers written once at the top when an analysis needs them. */
const HELPERS = {
  icc: [
    '# ICC by one-way ANOVA (farms as groups), as VetMock Research computes it',
    'icc_anova <- function(y, g) {',
    '  ok <- !is.na(y) & !is.na(g); y <- as.numeric(y[ok]); g <- factor(g[ok])',
    '  k <- nlevels(g); N <- length(y); ni <- as.numeric(table(g))',
    '  msb <- sum(ni * (tapply(y, g, mean) - mean(y))^2) / (k - 1)',
    '  msw <- sum((y - ave(y, g))^2) / (N - k)',
    '  n0 <- (N - sum(ni^2) / N) / (k - 1)',
    '  c(icc = (msb - msw) / (msb + (n0 - 1) * msw), k = k, N = N, n0 = n0)',
    '}',
  ],
  dunn: [
    '# Dunn (1964) z on mean ranks with the tie correction; pairs later level minus earlier level',
    'dunn_test <- function(y, g, adjust = "holm") {',
    '  ok <- !is.na(y) & !is.na(g); y <- y[ok]; g <- droplevels(factor(g[ok]))',
    '  r <- rank(y); N <- length(y); ti <- table(y); tie <- sum(ti^3 - ti) / (12 * (N - 1))',
    '  mr <- tapply(r, g, mean); n <- table(g); lv <- levels(g); out <- NULL',
    '  for (i in seq_len(length(lv) - 1)) for (j in (i + 1):length(lv)) {',
    '    z <- unname((mr[j] - mr[i]) / sqrt((N * (N + 1) / 12 - tie) * (1 / n[i] + 1 / n[j])))',
    '    out <- rbind(out, data.frame(pair = paste(lv[j], "-", lv[i]), z = z, p = 2 * pnorm(-abs(z))))',
    '  }',
    '  out$p.adjusted <- p.adjust(out$p, method = adjust)',
    '  out',
    '}',
  ],
  gamesHowell: [
    '# Games-Howell: Welch standard error and df per pair, p from the studentized range',
    'games_howell <- function(y, g, conf.level = 0.95) {',
    '  ok <- !is.na(y) & !is.na(g); y <- y[ok]; g <- droplevels(factor(g[ok]))',
    '  m <- tapply(y, g, mean); v <- tapply(y, g, var); n <- tapply(y, g, length); lv <- levels(g); k <- length(lv); out <- NULL',
    '  for (i in seq_len(k - 1)) for (j in (i + 1):k) {',
    '    d <- unname(m[j] - m[i]); se <- unname(sqrt(v[i] / n[i] + v[j] / n[j]))',
    '    df <- unname((v[i] / n[i] + v[j] / n[j])^2 / ((v[i] / n[i])^2 / (n[i] - 1) + (v[j] / n[j])^2 / (n[j] - 1)))',
    '    q <- qtukey(conf.level, k, df) / sqrt(2)',
    '    out <- rbind(out, data.frame(pair = paste(lv[j], "-", lv[i]), diff = d, lower = d - q * se, upper = d + q * se,',
    '      p = ptukey(abs(d) / se * sqrt(2), k, df, lower.tail = FALSE)))',
    '  }',
    '  out',
    '}',
  ],
};

// M3a helpers [M3-DESIGN.md 3.1]: the curve fits use base R's nls in the log-EC50 form (C2, C3), so the standard
// errors are VetMock Research's s^2 (J'J)^-1; data go into a frame with fixed names (X, Y, grp) so a column called
// b, c, d, e or g can never clash with a parameter.
HELPERS.curve = [
  '# Starting values for a 4PL in the log-EC50 form, worked out as VetMock Research does: bottom c and top d from the',
  '# lowest and highest mean response, e from the concentration nearest the half-way response, b > 0 when the response falls',
  'start4 <- function(x, y) {',
  '  m <- tapply(y, x, mean); xs <- as.numeric(names(m)); pos <- xs > 0',
  '  list(b = if (m[which.max(xs)] < m[which.min(xs)]) 1 else -1, c = min(m), d = max(m),',
  '       e = log(xs[pos][which.min(abs(m[pos] - (min(m) + max(m)) / 2))]))',
  '}',
  '# A delta-method interval on the log scale, transformed back (fn gives a log concentration from the parameters)',
  'delta_exp <- function(fit, fn, level = 0.95) {',
  '  p <- coef(fit); est <- fn(p)',
  '  g <- sapply(seq_along(p), function(j) { h <- 1e-6 * max(abs(p[[j]]), 1e-3); u <- p; l <- p; u[j] <- p[j] + h; l[j] <- p[j] - h; (fn(u) - fn(l)) / (2 * h) })',
  '  se <- sqrt(drop(t(g) %*% vcov(fit) %*% g)); tq <- qt(1 - (1 - level) / 2, df.residual(fit))',
  '  c(estimate = exp(est), lower = exp(est - tq * se), upper = exp(est + tq * se))',
  '}',
  '# AICc as VetMock Research reports it: n log(RSS / n) + 2K + 2K(K + 1) / (n - K - 1), K = parameters + 1',
  'aicc <- function(fit) { n <- length(residuals(fit)); K <- length(coef(fit)) + 1; n * log(deviance(fit) / n) + 2 * K + 2 * K * (K + 1) / (n - K - 1) }',
  '# Parameters with intervals estimate +- t (residual df) x SE, as VetMock Research gives them',
  'nls_table <- function(fit, level = 0.95) { se <- sqrt(diag(vcov(fit))); tq <- qt(1 - (1 - level) / 2, df.residual(fit)); cbind(estimate = coef(fit), se = se, lower = coef(fit) - tq * se, upper = coef(fit) + tq * se) }',
];
HELPERS.readX = [
  '# The concentration of a sample read off the curve, with the interval of the curve only; NA outside the standard curve',
  'read_x <- function(fit, y0, level = 0.95) {',
  '  p <- coef(fit)',
  '  if (y0 <= min(p[["c"]], p[["d"]]) || y0 >= max(p[["c"]], p[["d"]])) return(c(estimate = NA, lower = NA, upper = NA))',
  '  delta_exp(fit, function(q) { g <- if ("g" %in% names(q)) q[["g"]] else 1; q[["e"]] + log(((q[["d"]] - q[["c"]]) / (y0 - q[["c"]]))^(1 / g) - 1) / q[["b"]] }, level)',
  '}',
];
HELPERS.auc = [
  '# Area under one animal\'s curve by the trapezoidal rule on its own times; "first" measures from its first value',
  'auc_trap <- function(t, y, baseline = "zero") {',
  '  o <- order(t); t <- t[o]; y <- y[o]',
  '  if (baseline == "first") y <- y - y[1]',
  '  sum(diff(t) * (head(y, -1) + tail(y, -1)) / 2)',
  '}',
];

/** A finite number from an envelope as R code, else NA. */
const rnum = (x) => (typeof x === 'number' && Number.isFinite(x) ? String(x) : 'NA');
/** A number the envelope carries for one column key (Pfaffl's amplification factors), else null. */
const effOf = (env, key) => {
  const e = env?.spec?.options?.efficiency;
  const x = e && typeof e === 'object' ? e[key] : null;
  return typeof x === 'number' && Number.isFinite(x) ? x : null;
};

/** The 4PL or 5PL model formula in the log-EC50 form, on the fixed names X and Y; `i` indexes a parameter per group. */
function curveFormula(five, { i = '', e = null } = {}) {
  const ee = e || `e${i}`;
  return `Y ~ c${i} + (d${i} - c${i}) / (1 + exp(b${i} * (log(X) - ${ee})))${five ? `^g${i}` : ''}`;
}

/** R code for the standard curve, dose-response curves and curve equations (nls). */
function rCurves(spec, env, ix, t) {
  const v = ix.v;
  const o = spec.options || {};
  const one = (role) => rolesOf(spec, role)[0] || null;
  const level = lvl(spec);
  const code = [];
  const helpers = ['curve'];
  const ctl = 'control = nls.control(maxiter = 200)';
  const cm = (key) => wrapComment(t(key)).map((l) => `# ${l}`);
  code.push(...cm('report.script.nlsWhy'));
  if (spec.method === 'nls.equation') {
    code.push(`s <- data.frame(X = a$${v(one('x'))}, Y = a$${v(one('outcome'))}); s <- s[complete.cases(s), ]`);
    const eq = ['decay', 'growth'].includes(o.equation) ? o.equation : 'michaelisMenten';
    if (eq === 'michaelisMenten') code.push(`fit <- nls(Y ~ Vmax * X / (Km + X), data = s, start = list(Vmax = max(s$Y), Km = median(s$X)), ${ctl})`);
    else if (eq === 'decay') {
      code.push('st <- getInitial(Y ~ SSasymp(X, Asym, R0, lrc), data = s)  # starting values from R\'s self-starting model');
      code.push(`fit <- nls(Y ~ (Y0 - Plateau) * exp(-K * X) + Plateau, data = s, start = list(Y0 = st[["R0"]], Plateau = st[["Asym"]], K = exp(st[["lrc"]])), ${ctl})`);
    } else {
      code.push('st <- coef(lm(log(Y) ~ X, data = s[s$Y > 0, ]))  # starting values from the log-linear line');
      code.push(`fit <- nls(Y ~ Y0 * exp(k * X), data = s, start = list(Y0 = exp(st[[1]]), k = st[[2]]), ${ctl})`);
    }
    code.push('summary(fit)');
    code.push(...cm('report.script.nlsCi'));
    code.push(`nls_table(fit, level = ${level})`);
    if (eq !== 'michaelisMenten') {
      const k = eq === 'decay' ? 'K' : 'k';
      code.push(`ck <- nls_table(fit, level = ${level})[${rq(k)}, ]; c(${eq === 'decay' ? 'half_life' : 'doubling_time'} = log(2) / ck[["estimate"]], lower = log(2) / ck[["upper"]], upper = if (ck[["lower"]] > 0) log(2) / ck[["lower"]] else Inf)`);
    }
    code.push('c(R2 = 1 - deviance(fit) / sum((s$Y - mean(s$Y))^2), residual_SD = summary(fit)$sigma, AICc = aicc(fit))');
    return { code, packages: [], helpers };
  }
  const five = o.model === '5pl';
  const g = spec.method === 'nls.doseResponse' ? one('group') : null;
  if (!g) {
    code.push(`s <- data.frame(X = a$${v(one('x'))}, Y = a$${v(one('outcome'))})`);
    if (spec.method === 'nls.fourPL') code.push('u <- s[is.na(s$X) & !is.na(s$Y), ]  # the samples to read off the curve');
    code.push('s <- s[complete.cases(s), ]  # the standards');
    code.push(`fit4 <- nls(${curveFormula(false)}, data = s, start = start4(s$X, s$Y), ${ctl})`);
    if (five) code.push(`fit <- nls(${curveFormula(true)}, data = s, start = c(as.list(coef(fit4)), g = 1), ${ctl})  # the 5PL starts from the 4PL`);
    else code.push('fit <- fit4');
    code.push('summary(fit)  # e is the log of the IC50 or EC50 in the 4PL; SEs are s^2 (J\'J)^-1');
    code.push(`nls_table(fit, level = ${level})`);
    code.push(five
      ? `delta_exp(fit, function(p) p[["e"]] + log(2^(1 / p[["g"]]) - 1) / p[["b"]], level = ${level})  # IC50 or EC50 and its interval`
      : `delta_exp(fit, function(p) p[["e"]], level = ${level})  # IC50 or EC50 and its interval`);
    code.push('c(R2 = 1 - deviance(fit) / sum((s$Y - mean(s$Y))^2), residual_SD = summary(fit)$sigma, AICc = aicc(fit))');
    if (five) code.push('anova(fit4, fit)  # extra sum-of-squares F test of the 5PL against the 4PL', 'c(AICc_5PL = aicc(fit), AICc_4PL = aicc(fit4))');
    if (spec.method === 'nls.fourPL') {
      helpers.push('readX');
      code.push(`if (nrow(u)) cbind(response = u$Y, t(sapply(u$Y, function(y0) read_x(fit, y0, level = ${level}))))`);
    }
    code.push(...cm('report.script.drc'));
    code.push('# install.packages("drc")');
    code.push(`if (requireNamespace("drc", quietly = TRUE)) print(drc::ED(drc::drm(Y ~ X, data = s, fct = drc::${five ? 'LL2.5' : 'LL2.4'}()), 50, interval = "fls", level = ${level}))`);
    return { code, packages: [], helpers };
  }
  // One curve per group with one residual variance: nls with a parameter per group (indexed by grp).
  const levels = ix.col(g)?.levels || [];
  code.push(`s <- data.frame(X = a$${v(one('x'))}, Y = a$${v(one('outcome'))}, G = a$${v(g)}); s <- s[complete.cases(s), ]`);
  code.push(`s$G <- droplevels(factor(s$G${levels.length ? `, levels = ${rvec(levels)}` : ''})); s$grp <- as.integer(s$G)`);
  code.push('st <- lapply(split(s, s$G), function(z) start4(z$X, z$Y)); sv <- function(k) unname(sapply(st, `[[`, k))');
  const i = '[grp]';
  code.push(`fit4 <- nls(${curveFormula(false, { i })}, data = s, start = list(b = sv("b"), c = sv("c"), d = sv("d"), e = sv("e")), ${ctl})`);
  if (five) {
    code.push('p4 <- coef(fit4); pk <- function(k) unname(p4[grep(paste0("^", k, "[0-9]+$"), names(p4))])');
    code.push(`fit <- nls(${curveFormula(true, { i })}, data = s, start = list(b = pk("b"), c = pk("c"), d = pk("d"), e = pk("e"), g = rep(1, nlevels(s$G))), ${ctl})`);
  } else code.push('fit <- fit4');
  code.push('summary(fit)  # one residual variance; parameters numbered by group in level order');
  code.push(`nls_table(fit, level = ${level})`);
  code.push(five
    ? `for (j in seq_len(nlevels(s$G))) print(c(group = j, delta_exp(fit, function(p) p[[paste0("e", j)]] + log(2^(1 / p[[paste0("g", j)]]) - 1) / p[[paste0("b", j)]], level = ${level})))`
    : `for (j in seq_len(nlevels(s$G))) print(c(group = j, delta_exp(fit, function(p) p[[paste0("e", j)]], level = ${level})))`);
  code.push('summary(fit)$sigma  # the residual SD shared by the groups');
  if (o.compare === 'ec50') {
    const shared = five
      ? 'Y ~ c[grp] + (d[grp] - c[grp]) / (1 + exp(b[grp] * (log(X) - (l50 - log(2^(1 / g[grp]) - 1) / b[grp]))))^g[grp]'
      : curveFormula(false, { i, e: 'e' });
    const start = five
      ? 'list(b = pk("b"), c = pk("c"), d = pk("d"), l50 = mean(pk("e")), g = rep(1, nlevels(s$G)))'
      : 'list(b = sv("b"), c = sv("c"), d = sv("d"), e = mean(sv("e")))';
    code.push(`restricted <- try(nls(${shared}, data = s, start = ${start}, ${ctl}))  # one IC50 or EC50 for every group`);
  } else if (o.compare === 'all') {
    code.push(`one4 <- try(nls(${curveFormula(false)}, data = s, start = start4(s$X, s$Y), ${ctl}))`);
    code.push(five ? `restricted <- if (inherits(one4, "try-error")) one4 else try(nls(${curveFormula(true)}, data = s, start = c(as.list(coef(one4)), g = 1), ${ctl}))  # one curve for every group` : 'restricted <- one4  # one curve for every group');
  }
  // A restricted model may not converge (VetMock Research then shows no test); try() keeps the rest of the script running.
  if (o.compare === 'ec50' || o.compare === 'all') code.push('if (!inherits(restricted, "try-error")) { print(anova(restricted, fit)); print(c(AICc_separate = aicc(fit), AICc_restricted = aicc(restricted))) }  # extra sum-of-squares F test');
  if (env?.values?.ic50Ratio || env?.values?.ec50Ratio) {
    code.push(five
      ? `delta_exp(fit, function(p) (p[["e2"]] + log(2^(1 / p[["g2"]]) - 1) / p[["b2"]]) - (p[["e1"]] + log(2^(1 / p[["g1"]]) - 1) / p[["b1"]]), level = ${level})  # the ratio, second group over the first`
      : `delta_exp(fit, function(p) p[["e2"]] - p[["e1"]], level = ${level})  # the ratio, second group over the first`);
  }
  return { code, packages: [], helpers };
}

/** R code for the area under the curve, qPCR, the efficiency of a dilution series and PCA. */
function rLabMore(spec, env, ix, t) {
  const v = ix.v;
  const o = spec.options || {};
  const one = (role) => rolesOf(spec, role)[0] || null;
  const level = lvl(spec);
  const code = [];
  const packages = [];
  const helpers = [];
  const cm = (key, params) => wrapComment(t(key, params)).map((l) => `# ${l}`);
  switch (spec.method) {
    case 'calc.auc': {
      helpers.push('auc');
      const y = v(one('outcome'));
      const s = v(one('subject'));
      const tm = v(one('time'));
      const g = one('group') ? v(one('group')) : null;
      const gl = g ? ix.col(one('group'))?.levels || [] : [];
      code.push(`b <- a[complete.cases(a[, ${rvec([y, s, tm, ...(g ? [g] : [])])}]), ]`);
      code.push(`ar <- do.call(rbind, lapply(split(b, as.character(b$${s})), function(z) data.frame(animal = z$${s}[1], ${g ? `group = as.character(z$${g}[1]), ` : ''}times = nrow(z), area = if (nrow(z) >= 2) auc_trap(z$${tm}, z$${y}, ${rq(o.baseline === 'first' ? 'first' : 'zero')}) else NA)))`);
      code.push('ar <- ar[!is.na(ar$area), ]; ar  # animals measured at fewer than 2 times are left out');
      if (g) {
        code.push(`ar$group <- droplevels(factor(ar$group${gl.length ? `, levels = ${rvec(gl)}` : ''}))`);
        code.push(`tapply(ar$area, ar$group, function(x) c(n = length(x), mean = mean(x), sd = sd(x), lower = mean(x) - qt(1 - (1 - ${level}) / 2, length(x) - 1) * sd(x) / sqrt(length(x)), upper = mean(x) + qt(1 - (1 - ${level}) / 2, length(x) - 1) * sd(x) / sqrt(length(x))))`);
        code.push(...cm('report.script.aucDirection'));
        code.push(`if (nlevels(ar$group) == 2) t.test(area ~ group, data = ar, var.equal = FALSE, conf.level = ${level}) else summary(aov(area ~ group, data = ar))`);
      } else code.push(`t.test(ar$area, conf.level = ${level})  # the mean area and its interval`);
      break;
    }
    case 'qpcr.relative': {
      const target = one('outcome');
      const refs = rolesOf(spec, 'items');
      const g = v(one('group'));
      const control = spec.levels?.controlLevel ?? ix.col(one('group'))?.levels?.[0] ?? null;
      code.push(`b <- a[complete.cases(a[, ${rvec([v(target), ...refs.map(v), g])}]), ]`);
      if (o.method === 'pfaffl') {
        const all = [target, ...refs];
        const effs = all.map((k) => effOf(env, k));
        code.push(`E <- c(${all.map((k, i) => `${v(k)} = ${rnum(effs[i])}`).join(', ')})  # amplification factors per cycle (Pfaffl)`);
        code.push(`b$dCt <- b$${v(target)} * log2(E[[${rq(v(target))}]]) - rowMeans(sweep(as.matrix(b[, ${rvec(refs.map(v))}, drop = FALSE]), 2, log2(E[${rvec(refs.map(v))}]), "*"))  # efficiency-weighted dCt`);
      } else code.push(`b$dCt <- b$${v(target)} - rowMeans(b[, ${rvec(refs.map(v))}, drop = FALSE])  # target Ct minus the mean reference Ct (Livak)`);
      code.push(`b$grp <- relevel(factor(b$${g}), ref = ${rq(control)})  # the calibrator first`);
      code.push('tapply(b$dCt, b$grp, mean)');
      code.push(...cm('report.script.qpcrTests'));
      if ((env?.tests || []).some((x) => x.id === 'anova')) {
        // three or more groups: one-way ANOVA on dCt and Dunnett against the calibrator (multcomp)
        packages.push('multcomp');
        code.push('summary(aov(dCt ~ grp, data = b))');
        code.push(`dn <- glht(aov(dCt ~ grp, data = b), linfct = mcp(grp = "Dunnett")); summary(dn); ci <- confint(dn, level = ${level})$confint; ci  # ddCt`);
        code.push('cbind(fold = 2^-ci[, "Estimate"], lower = 2^-ci[, "upr"], upper = 2^-ci[, "lwr"])');
      } else {
        code.push(`tt <- t.test(b$dCt[b$grp == levels(b$grp)[2]], b$dCt[b$grp == levels(b$grp)[1]], var.equal = ${o.test === 'pooled' ? 'TRUE' : 'FALSE'}, conf.level = ${level}); tt`);
        code.push('ddct <- unname(tt$estimate[1] - tt$estimate[2]); c(ddCt = ddct, lower = tt$conf.int[1], upper = tt$conf.int[2])');
        code.push('c(fold = 2^-ddct, lower = 2^-tt$conf.int[2], upper = 2^-tt$conf.int[1])');
      }
      break;
    }
    case 'qpcr.efficiency': {
      code.push(`fit <- lm(${v(one('outcome'))} ~ ${v(one('x'))}, data = a); summary(fit)`);
      code.push(`sl <- coef(fit)[[2]]; ci <- confint(fit, level = ${level})[2, ]`);
      code.push('E <- c(estimate = 10^(-1 / sl), lower = 10^(-1 / ci[[1]]), upper = 10^(-1 / ci[[2]])); E  # amplification factor per cycle');
      code.push('100 * (E - 1)  # efficiency %');
      break;
    }
    case 'mv.pca': {
      const items = rolesOf(spec, 'items').map(v);
      code.push(`X <- na.omit(a[, ${rvec(items)}]); nrow(X)`);
      code.push(`p <- prcomp(X, scale. = ${o.scale === false ? 'FALSE' : 'TRUE'})  # ${o.scale === false ? 'covariance' : 'correlation'} matrix`);
      code.push(...cm('report.script.pcaSigns'));
      code.push('sg <- apply(p$rotation, 2, function(w) sign(w[which.max(abs(w))])); p$rotation <- sweep(p$rotation, 2, sg, "*"); p$x <- sweep(p$x, 2, sg, "*")');
      code.push('summary(p)  # standard deviations and proportions of variance');
      code.push('p$sdev^2  # eigenvalues');
      code.push('p$rotation  # loadings');
      code.push('head(p$x)  # scores');
      code.push('biplot(p, scale = 1)');
      const comp = (env?.tables || []).find((tb) => tb.id === 'components');
      const ei = comp ? comp.columns.indexOf('eigenvalue') : -1;
      if (ei >= 0) code.push(`# ${oneLine(t('report.script.ours', { numbers: '' }).trim())} eigenvalues ${comp.rows.map((r) => num6(r[ei])).join(', ')}`);
      break;
    }
    default:
      return null;
  }
  return { code, packages, helpers };
}

/** R code for repeated measures with a second within factor: anova.mlm on the wide matrix, each effect on its own contrasts. */
function rRepeated2(spec, ix) {
  const v = ix.v;
  const one = (role) => rolesOf(spec, role)[0] || null;
  const y = v(one('outcome'));
  const s = v(one('subject'));
  const A = v(one('time'));
  const B = v(one('factorB'));
  const g = one('group') ? v(one('group')) : null;
  const la = ix.col(one('time'))?.levels || [];
  const lb = ix.col(one('factorB'))?.levels || [];
  const code = [];
  code.push(`b <- a[complete.cases(a[, ${rvec([y, s, A, B, ...(g ? [g] : [])])}]), ]`);
  code.push(`b$${A} <- factor(b$${A}${la.length ? `, levels = ${rvec(la)}` : ''}); b$${B} <- factor(b$${B}${lb.length ? `, levels = ${rvec(lb)}` : ''}); b$${s} <- factor(b$${s})`);
  code.push(`idata <- data.frame(${A} = factor(rep(levels(b$${A}), each = nlevels(b$${B})), levels = levels(b$${A})), ${B} = factor(rep(levels(b$${B}), times = nlevels(b$${A})), levels = levels(b$${B})))`);
  code.push(`b$cell <- paste(b$${A}, b$${B}, sep = ".")`);
  code.push(`W <- reshape(b[, c(${rq(s)}, "cell", ${rq(y)})], idvar = ${rq(s)}, timevar = "cell", direction = "wide")`);
  code.push(`Y <- as.matrix(W[, paste(${rq(y)}, idata$${A}, idata$${B}, sep = ".")]); keep <- complete.cases(Y); Y <- Y[keep, ]  # animals measured at every combination`);
  code.push(g ? `grp <- factor(b$${g}[match(W$${s}[keep], b$${s})]); fit <- lm(Y ~ grp)` : 'fit <- lm(Y ~ 1)');
  code.push(`anova(fit, M = ~${A}, X = ~1, idata = idata, test = "Spherical")  # ${A}: F, Greenhouse-Geisser and Huynh-Feldt p`);
  code.push(`anova(fit, M = ~${A} + ${B}, X = ~${A}, idata = idata, test = "Spherical")  # ${B}`);
  code.push(`anova(fit, M = ~${A} * ${B}, X = ~${A} + ${B}, idata = idata, test = "Spherical")  # ${A} x ${B}`);
  if (g) code.push('anova(fit, M = ~1, X = ~0, idata = idata, test = "Spherical")  # between the groups');
  code.push(`mauchly.test(fit, M = ~${A}, X = ~1, idata = idata); mauchly.test(fit, M = ~${A} + ${B}, X = ~${A}, idata = idata); mauchly.test(fit, M = ~${A} * ${B}, X = ~${A} + ${B}, idata = idata)`);
  return code;
}

/** The epiR method for a study design. */
const epiMethod = (design) => (design === 'cross-sectional' ? 'cross.sectional' : design === 'case-control' ? 'case.control' : 'cohort.count');

/**
 * R code for one analysis, and the packages and helpers it needs.
 * @returns {{ code: string[], packages: string[], helpers: string[], note?: string }}
 */
function rCode(spec, env, ix, t) {
  const v = ix.v;
  const o = spec.options || {};
  const lv = spec.levels || {};
  const one = (role) => rolesOf(spec, role)[0] || null;
  const c = (role) => `a$${v(one(role))}`;
  const is = (role, level) => `(${c(role)} == ${rq(level)})`;
  const level = lvl(spec);
  const route = spec.cluster?.route && spec.cluster.route !== 'none' ? spec.cluster.route : null;
  const farm = spec.cluster?.column ? v(spec.cluster.column) : null;
  const packages = [];
  const helpers = [];
  const code = [];
  const need = (p) => { if (!packages.includes(p)) packages.push(p); };
  const covs = rolesOf(spec, 'covariates').map(v);
  const formula = (lhs) => `${lhs} ~ ${covs.length ? covs.join(' + ') : '1'}`;
  const pos = lv.outcomePositive;
  switch (spec.method) {
    case 'freq.proportion':
    case 'freq.incidenceRisk': {
      code.push(`x <- sum(${is('outcome', pos)}, na.rm = TRUE); n <- sum(!is.na(${c('outcome')}))`);
      if (route === 'survey') {
        need('survey');
        code.push(`des <- svydesign(ids = ~${farm}, data = a[!is.na(${c('outcome')}), ])`);
        code.push(`svyciprop(~I(${v(one('outcome'))} == ${rq(pos)}), des, method = ${rq(o.surveyCi === 'mean' ? 'mean' : 'logit')}, level = ${level})`);
        break;
      }
      if (route === 'deff') {
        helpers.push('icc');
        code.push(`ic <- icc_anova(${is('outcome', pos)}, a$${farm}); deff <- 1 + (ic[["N"]] / ic[["k"]] - 1) * ic[["icc"]]`);
        code.push(`p <- x / n; se <- sqrt(deff * p * (1 - p) / n); p + c(-1, 1) * qnorm(1 - (1 - ${level}) / 2) * se`);
        break;
      }
      if (route === 'aggregate') {
        code.push(`farms <- aggregate(pos ~ farm, data = data.frame(pos = ${is('outcome', pos)}, farm = a$${farm}), FUN = any)`);
        code.push('x <- sum(farms$pos); n <- nrow(farms)');
      }
      if (o.ciMethod === 'exact') code.push(`binom.test(x, n, conf.level = ${level})$conf.int`);
      else if (o.ciMethod === 'wald') code.push(`x / n + c(-1, 1) * qnorm(1 - (1 - ${level}) / 2) * sqrt(x / n * (1 - x / n) / n)`);
      else if (o.ciMethod === 'agresti-coull') code.push(`z <- qnorm(1 - (1 - ${level}) / 2); nt <- n + z^2; pt <- (x + z^2 / 2) / nt; pt + c(-1, 1) * z * sqrt(pt * (1 - pt) / nt)`);
      else code.push(`prop.test(x, n, conf.level = ${level}, correct = FALSE)$conf.int  # Wilson score interval`);
      code.push('x / n');
      break;
    }
    case 'freq.truePrevalence': {
      need('epiR');
      code.push(`x <- sum(${is('outcome', pos)}, na.rm = TRUE); n <- sum(!is.na(${c('outcome')}))`);
      code.push(`epi.prev(pos = x, tested = n, se = ${o.se ?? 'NA'}, sp = ${o.sp ?? 'NA'}, method = ${rq(o.apparentCiMethod === 'exact' ? 'c-p' : 'wilson')}, units = 1, conf.level = ${level})`);
      break;
    }
    case 'freq.incidenceRate': {
      const cnt = spec.input?.counts || {};
      code.push(`poisson.test(${cnt.cases ?? 'NA'}, ${cnt.animalTime ?? 'NA'}, conf.level = ${level})`);
      break;
    }
    case 'desc.summary': {
      const g = one('group');
      code.push(g ? `tapply(${c('outcome')}, ${c('group')}, summary)` : `summary(${c('outcome')})`);
      code.push(g ? `tapply(${c('outcome')}, ${c('group')}, sd, na.rm = TRUE)` : `sd(${c('outcome')}, na.rm = TRUE)`);
      code.push(`quantile(${c('outcome')}, c(0.25, 0.5, 0.75), type = ${o.quantileType ?? 7}, na.rm = TRUE)`);
      break;
    }
    case 'desc.table1': {
      const cols = rolesOf(spec, 'covariates').map(v);
      const g = one('group');
      if (cols.length) code.push(g ? `by(a[, ${rvec(cols)}], ${c('group')}, summary)` : `summary(a[, ${rvec(cols)}])`);
      else code.push('summary(a)');
      break;
    }
    case 'cluster.iccDeff': {
      helpers.push('icc');
      const y = pos != null ? is('outcome', pos) : c('outcome');
      code.push(`ic <- icc_anova(${y}, a$${farm || v(one('cluster'))}); ic`);
      code.push(`m <- ${o.clusterSize === 'n0' ? 'ic[["n0"]]' : 'ic[["N"]] / ic[["k"]]'}; 1 + (m - 1) * ic[["icc"]]  # design effect`);
      break;
    }
    case 'epi.twoByTwo':
    case 'epi.mantelHaenszel': {
      need('epiR');
      const e = lv.exposureLevel;
      const r = lv.referenceLevel;
      const strata = spec.method === 'epi.mantelHaenszel' ? rolesOf(spec, 'strata').map(v) : route === 'mh-within' && farm ? [farm] : [];
      code.push(`b <- subset(a, ${v(one('exposure'))} %in% ${rvec([e, r])} & !is.na(${v(one('outcome'))}))`);
      const ex = `factor(b$${v(one('exposure'))} == ${rq(e)}, levels = c(TRUE, FALSE))`;
      const ou = `factor(b$${v(one('outcome'))} == ${rq(pos)}, levels = c(TRUE, FALSE))`;
      if (strata.length) {
        code.push(`tab <- table(${ex}, ${ou}, ${strata.length === 1 ? `b$${strata[0]}` : `interaction(${strata.map((s) => `b$${s}`).join(', ')}, drop = TRUE)`})`);
        code.push(`epi.2by2(dat = tab, method = ${rq(epiMethod(spec.design))}, conf.level = ${level})`);
        code.push(`mantelhaen.test(tab, correct = ${o.cmhContinuity === false ? 'FALSE' : 'TRUE'})`);
      } else {
        code.push(`tab <- table(${ex}, ${ou}); tab`);
        code.push(`epi.2by2(dat = tab, method = ${rq(epiMethod(spec.design))}, conf.level = ${level})`);
      }
      break;
    }
    case 'test.chisq':
      code.push(`chisq.test(table(${c('exposure')}, ${c('outcome')}), correct = ${o.yates ? 'TRUE' : 'FALSE'})`);
      break;
    case 'test.fisher2x2':
      code.push(`tab <- table(factor(${c('exposure')}, levels = ${rvec([lv.exposureLevel, lv.referenceLevel].filter((x) => x != null))}), factor(${c('outcome')} == ${rq(pos)}, levels = c(TRUE, FALSE)))`);
      code.push(`fisher.test(tab, conf.level = ${level}${alt(spec)})`);
      break;
    case 'test.mcnemar':
      code.push(`tab <- table(${c('x')}, ${c('y')}); tab`);
      code.push(o.exact ? 'binom.test(tab[1, 2], tab[1, 2] + tab[2, 1])  # exact McNemar' : `mcnemar.test(tab, correct = ${o.continuityCorrection === false ? 'FALSE' : 'TRUE'})`);
      break;
    case 'test.trend':
      code.push(`b <- a[!is.na(${c('exposure')}) & !is.na(${c('outcome')}), ]`);
      code.push(`prop.trend.test(tapply(b$${v(one('outcome'))} == ${rq(pos)}, b$${v(one('exposure'))}, sum), table(b$${v(one('exposure'))}))`);
      break;
    case 'test.tTest': {
      const variant = o.variant || 'welch';
      if (variant === 'paired') code.push(`t.test(a$${v(one('x') || one('outcome'))}, a$${v(one('y'))}, paired = TRUE, conf.level = ${level}${alt(spec)})`);
      else if (variant === 'one-sample') code.push(`t.test(a$${v(one('outcome') || one('x'))}, mu = ${o.mu ?? 0}, conf.level = ${level}${alt(spec)})`);
      else code.push(`t.test(${v(one('outcome'))} ~ ${v(one('group') || one('exposure'))}, data = a, var.equal = ${variant === 'pooled' ? 'TRUE' : 'FALSE'}, conf.level = ${level}${alt(spec)})`);
      break;
    }
    case 'test.anova1':
    case 'posthoc.tukey':
      code.push(`fit <- aov(${v(one('outcome'))} ~ factor(${v(one('group'))}), data = a); summary(fit)`);
      if (spec.method === 'posthoc.tukey' || o.posthoc === 'tukey') code.push(`TukeyHSD(fit, conf.level = ${level})`);
      else if (/^pairwise-t-/.test(o.posthoc || '')) code.push(`pairwise.t.test(${c('outcome')}, ${c('group')}, p.adjust.method = ${rq(String(o.posthoc).replace('pairwise-t-', ''))})`);
      break;
    case 'adjust.pValues': {
      const ps = spec.input?.params?.p;
      if (Array.isArray(ps)) code.push(`p.adjust(c(${ps.join(', ')}), method = ${rq(o.method === 'bh' ? 'BH' : o.method || 'holm')})`);
      else return { code: [], packages, helpers, note: 'noCode' };
      break;
    }
    case 'test.mannWhitney':
      code.push(`wilcox.test(${v(one('outcome'))} ~ ${v(one('group'))}, data = a, conf.int = ${o.estimate === 'none' ? 'FALSE' : 'TRUE'}, conf.level = ${level}, exact = ${o.exact === 'exact' ? 'TRUE' : o.exact === 'normal' ? 'FALSE' : 'NULL'}, correct = ${o.continuityCorrection === false ? 'FALSE' : 'TRUE'}${alt(spec)})`);
      break;
    case 'test.wilcoxonSignedRank':
      code.push(`wilcox.test(${c('x')}, ${c('y')}, paired = TRUE, conf.int = ${o.estimate === 'none' ? 'FALSE' : 'TRUE'}, conf.level = ${level}, exact = ${o.exact === 'exact' ? 'TRUE' : o.exact === 'normal' ? 'FALSE' : 'NULL'}, correct = ${o.continuityCorrection === false ? 'FALSE' : 'TRUE'}${alt(spec)})`);
      break;
    case 'test.kruskalWallis':
      code.push(`kruskal.test(${v(one('outcome'))} ~ factor(${v(one('group'))}), data = a)`);
      break;
    case 'corr.pearson':
      code.push(`cor.test(${c('x')}, ${c('y')}, method = "pearson", conf.level = ${level}${alt(spec)})`);
      break;
    case 'corr.spearman':
      code.push(`cor.test(${c('x')}, ${c('y')}, method = "spearman", exact = ${o.exact === 'exact' ? 'TRUE' : o.exact === 'normal' ? 'FALSE' : 'NULL'}${alt(spec)})`);
      break;
    case 'reg.ols':
      code.push(`fit <- lm(${formula(v(one('outcome')))}, data = a); summary(fit)`);
      code.push(`confint(fit, level = ${level})`);
      break;
    case 'dx.accuracy':
      need('epiR');
      code.push(`tab <- table(factor(${c('test')} == ${rq(lv.testPositive)}, levels = c(TRUE, FALSE)), factor(${c('reference')} == ${rq(lv.referencePositive)}, levels = c(TRUE, FALSE)))`);
      code.push(`epi.tests(tab, conf.level = ${level})`);
      break;
    case 'agree.kappa':
      need('psych');
      code.push(`cohen.kappa(cbind(${c('raterA')}, ${c('raterB')}), alpha = ${Math.round((1 - level) * 1000) / 1000})  # prints unweighted and (quadratic) weighted kappa`);
      break;
    case 'agree.percent':
      code.push(`ok <- !is.na(${c('raterA')}) & !is.na(${c('raterB')}); x <- sum(${c('raterA')}[ok] == ${c('raterB')}[ok]); n <- sum(ok)`);
      code.push(`x / n; prop.test(x, n, conf.level = ${level}, correct = FALSE)$conf.int`);
      break;
    case 'anova.twoWay': {
      const y = v(one('outcome'));
      const A = v(one('group'));
      const B = v(one('factorB'));
      code.push(`b <- a[complete.cases(a[, ${rvec([y, A, B])}]), ]; b$${A} <- factor(b$${A}); b$${B} <- factor(b$${B})`);
      code.push('op <- options(contrasts = c("contr.sum", "contr.poly"))');
      if (o.interaction === false) code.push(`fit <- lm(${y} ~ ${A} + ${B}, data = b); drop1(fit, . ~ ., test = "F")`);
      else if (o.ssType === 'II') {
        code.push(`full <- lm(${y} ~ ${A} * ${B}, data = b); add <- lm(${y} ~ ${A} + ${B}, data = b)`);
        code.push(`ss <- c(A = deviance(lm(${y} ~ ${B}, data = b)) - deviance(add), B = deviance(lm(${y} ~ ${A}, data = b)) - deviance(add), AB = deviance(add) - deviance(full))`);
        code.push(`df <- c(A = nlevels(b$${A}) - 1, B = nlevels(b$${B}) - 1, AB = (nlevels(b$${A}) - 1) * (nlevels(b$${B}) - 1)); F <- (ss / df) / (deviance(full) / df.residual(full))`);
        code.push('cbind(SS = ss, df = df, F = F, p = pf(F, df, df.residual(full), lower.tail = FALSE))  # Type II');
      } else code.push(`fit <- lm(${y} ~ ${A} * ${B}, data = b); drop1(fit, . ~ ., test = "F")  # Type III`);
      if (o.posthoc === 'tukey') code.push(`TukeyHSD(aov(${y} ~ ${A}${o.interaction === false ? ' + ' : ' * '}${B}, data = b), conf.level = ${level})`);
      code.push('options(op)');
      break;
    }
    case 'anova.repeated': {
      if (one('factorB')) { code.push(...rRepeated2(spec, ix)); break; }
      const y = v(one('outcome'));
      const s = v(one('subject'));
      const tm = v(one('time'));
      const g = one('group') ? v(one('group')) : null;
      const times = ix.col(one('time'))?.levels || [];
      code.push(`b <- a[complete.cases(a[, ${rvec([y, s, tm, ...(g ? [g] : [])])}]), ]`);
      code.push(`b$${tm} <- factor(b$${tm}${times.length ? `, levels = ${rvec(times)}` : ''}); b$${s} <- factor(b$${s})`);
      code.push(`keep <- names(which(table(b$${s}) == nlevels(b$${tm})))  # animals measured at every time`);
      code.push(`b <- droplevels(b[b$${s} %in% keep, ])`);
      code.push(g ? `summary(aov(${y} ~ factor(${g}) * ${tm} + Error(${s} / ${tm}), data = b))` : `summary(aov(${y} ~ ${tm} + Error(${s} / ${tm}), data = b))`);
      code.push(`W <- reshape(b[, ${rvec([s, tm, y])}], idvar = ${rq(s)}, timevar = ${rq(tm)}, direction = "wide")`);
      code.push('Y <- as.matrix(W[, -1])');
      code.push(g ? `grp <- factor(b$${g}[match(W$${s}, b$${s})]); fit <- lm(Y ~ grp)` : 'fit <- lm(Y ~ 1)');
      code.push('anova(fit, X = ~1, test = "Spherical")  # Greenhouse-Geisser and Huynh-Feldt epsilons and corrected p');
      code.push('mauchly.test(fit, X = ~1)');
      break;
    }
    case 'test.friedman': {
      const y = v(one('outcome'));
      const g = v(one('group'));
      const s = v(one('subject'));
      code.push(`b <- a[complete.cases(a[, ${rvec([y, g, s])}]), ]; b$${g} <- factor(b$${g})`);
      code.push(`b <- droplevels(b[b$${s} %in% names(which(table(b$${s}) == nlevels(b$${g}))), ])  # complete blocks`);
      code.push(`friedman.test(${y} ~ ${g} | ${s}, data = b)`);
      break;
    }
    case 'posthoc.dunn':
      helpers.push('dunn');
      code.push(`dunn_test(${c('outcome')}, ${c('group')}, adjust = ${rq(o.adjust === 'bh' ? 'BH' : o.adjust || 'holm')})`);
      break;
    case 'posthoc.gamesHowell':
      helpers.push('gamesHowell');
      code.push(`games_howell(${c('outcome')}, ${c('group')}, conf.level = ${level})`);
      break;
    case 'posthoc.dunnett': {
      need('multcomp');
      const g = v(one('group'));
      code.push(`b <- a[!is.na(a$${v(one('outcome'))}) & !is.na(a$${g}), ]; b$${g} <- relevel(factor(b$${g}), ref = ${rq(lv.controlLevel)})`);
      code.push(`dn <- glht(aov(${v(one('outcome'))} ~ ${g}, data = b), linfct = mcp(${g} = "Dunnett")); summary(dn); confint(dn, level = ${level})`);
      break;
    }
    case 'diag.shapiro': {
      const g = one('group');
      if (!g) code.push(`shapiro.test(${c('outcome')})`);
      else if (o.on === 'groups') code.push(`tapply(${c('outcome')}, ${c('group')}, function(x) shapiro.test(x))`);
      else code.push(`shapiro.test(residuals(lm(${v(one('outcome'))} ~ factor(${v(g)}), data = a)))`);
      code.push(`qqnorm(${g && o.on !== 'groups' ? `residuals(lm(${v(one('outcome'))} ~ factor(${v(g)}), data = a))` : c('outcome')}); qqline(${g && o.on !== 'groups' ? `residuals(lm(${v(one('outcome'))} ~ factor(${v(g)}), data = a))` : c('outcome')})`);
      break;
    }
    case 'diag.brownForsythe': {
      const y = v(one('outcome'));
      const g = v(one('group'));
      code.push(`b <- a[!is.na(a$${y}) & !is.na(a$${g}), ]`);
      code.push(`b$dev <- abs(b$${y} - ave(b$${y}, b$${g}, FUN = ${o.center === 'mean' ? 'mean' : 'median'}))`);
      code.push(`anova(lm(dev ~ factor(${g}), data = b))  # ${o.center === 'mean' ? 'Levene (mean)' : 'Brown-Forsythe (median)'}`);
      break;
    }
    case 'reg.logistic':
    case 'reg.poisson': {
      const logistic = spec.method === 'reg.logistic';
      const y = v(one('outcome'));
      for (const k of rolesOf(spec, 'covariates')) {
        const cc = ix.col(k);
        const ref = spec.levels?.references?.[k] ?? cc?.reference ?? null;
        if (cc && cc.type !== 'number' && cc.levels.length) code.push(`a$${cc.name} <- ${ref ? `relevel(factor(a$${cc.name}, levels = ${rvec(cc.levels)}), ref = ${rq(ref)})` : `factor(a$${cc.name}, levels = ${rvec(cc.levels)})`}`);
      }
      const offset = !logistic && one('time') ? ` + offset(log(${v(one('time'))}))` : '';
      if (logistic) code.push(`a$y01 <- as.integer(a$${y} == ${rq(pos)})`);
      if (logistic && o.method === 'firth') {
        // Firth's correction (M3a, C9): logistf, profile penalised likelihood intervals (pl = TRUE) or Wald (pl = FALSE).
        need('logistf');
        code.push(...wrapComment(t('report.script.firthMl')).map((l) => `# ${l}`));
        code.push(`fit <- logistf(${formula('y01')}, data = a, pl = ${o.ciMethod === 'wald' ? 'FALSE' : 'TRUE'}, alpha = ${Math.round((1 - level) * 1000) / 1000}, control = logistf.control(maxit = 200, maxstep = 5, lconv = 1e-12, gconv = 1e-12, xconv = 1e-12), plcontrol = logistpl.control(maxit = 200, xconv = 1e-12, lconv = 1e-12))`);
        code.push('summary(fit)  # coefficients, intervals and p-values; the likelihood ratio test of the whole model is penalised');
        code.push('drop1(fit)  # the penalised likelihood-ratio test of each term');
        code.push('exp(cbind(OR = coef(fit), lower = fit$ci.lower, upper = fit$ci.upper))');
        break;
      }
      code.push(`fit <- glm(${formula(logistic ? 'y01' : y)}${offset}, family = ${logistic ? 'binomial' : 'poisson'}, data = a); summary(fit)`);
      code.push('drop1(fit, test = "LRT")');
      if (route === 'robust') {
        need('sandwich');
        code.push(`V <- vcovCL(fit, cluster = ~${farm}, type = "HC0"); se <- sqrt(diag(V))`);
        code.push(`z <- qnorm(1 - (1 - ${level}) / 2); cbind(B = coef(fit), SE = se, ${logistic ? 'OR' : 'IRR'} = exp(coef(fit)), lower = exp(coef(fit) - z * se), upper = exp(coef(fit) + z * se), p = 2 * pnorm(-abs(coef(fit) / se)))`);
      } else code.push(`exp(cbind(${logistic ? 'OR' : 'IRR'} = coef(fit), ${o.ciMethod === 'wald' ? `confint.default(fit, level = ${level})` : `confint(fit, level = ${level})`}))`);
      if (!logistic) code.push('sum(residuals(fit, type = "pearson")^2) / df.residual(fit)  # above 1.5 suggests overdispersion');
      break;
    }
    case 'surv.kaplanMeier': {
      need('survival');
      const g = one('group');
      code.push(`a$event01 <- as.integer(a$${v(one('event'))} == ${rq(pos)})`);
      code.push(`km <- survfit(Surv(${v(one('time'))}, event01) ~ ${g ? v(g) : '1'}, data = a, conf.type = ${rq(o.confType || 'log')}, conf.int = ${level}); summary(km); print(km)  # medians with their intervals`);
      if (g && o.test !== 'none') code.push(`survdiff(Surv(${v(one('time'))}, event01) ~ ${v(g)}, data = a)  # log-rank`);
      break;
    }
    case 'roc.delong': {
      need('pROC');
      const dir = o.direction === 'lower-positive' ? '>' : '<';
      const refPos = lv.referencePositive;
      code.push(`b <- a[!is.na(${c('reference')}), ]`);
      code.push(`r1 <- roc(b$${v(one('reference'))} == ${rq(refPos)}, b$${v(one('test'))}, levels = c(FALSE, TRUE), direction = ${rq(dir)}); auc(r1)`);
      code.push(`ci.auc(r1, conf.level = ${level}, method = "delong")`);
      if (o.youden !== false) code.push('coords(r1, "best", best.method = "youden", ret = c("threshold", "sensitivity", "specificity"), transpose = FALSE)');
      if (one('test2')) {
        code.push(`r2 <- roc(b$${v(one('reference'))} == ${rq(refPos)}, b$${v(one('test2'))}, levels = c(FALSE, TRUE), direction = ${rq(dir)})`);
        code.push('roc.test(r1, r2, method = "delong", paired = TRUE)');
      }
      break;
    }
    case 'agree.blandAltman': {
      const A = c('raterA');
      const B = c('raterB');
      const k = typeof o.loaMultiplier === 'number' ? o.loaMultiplier : 1.96;
      code.push(`ok <- complete.cases(${A}, ${B}); A <- ${A}[ok]; B <- ${B}[ok]; avg <- (A + B) / 2`);
      code.push(o.scale === 'percent' ? 'dif <- 100 * (A - B) / avg' : o.scale === 'ratio' ? 'dif <- log(A / B)' : 'dif <- A - B');
      code.push(`n <- length(dif); bias <- mean(dif); s <- sd(dif); loa <- bias + c(-1, 1) * ${k} * s`);
      code.push(`tq <- qt(1 - (1 - ${level}) / 2, n - 1); se_loa <- sqrt(3 * s^2 / n)`);
      code.push('list(bias = bias, bias_ci = bias + c(-1, 1) * tq * s / sqrt(n), sd = s, limits = loa,');
      code.push('  lower_ci = loa[1] + c(-1, 1) * tq * se_loa, upper_ci = loa[2] + c(-1, 1) * tq * se_loa)');
      if (o.scale === 'ratio') code.push('exp(c(bias, loa))  # geometric mean ratio and limits on the ratio scale');
      if (o.proportionalBias !== false) code.push('summary(lm(dif ~ avg))  # proportional bias: slope of the difference on the mean');
      break;
    }
    case 'rel.cronbach': {
      need('psych');
      const items = rolesOf(spec, 'items').map(v);
      code.push(`X <- na.omit(a[, ${rvec(items)}]); n <- nrow(X); k <- ncol(X)`);
      code.push('alpha_raw <- k / (k - 1) * (1 - sum(apply(X, 2, var)) / var(rowSums(X))); alpha_raw');
      code.push(`1 - (1 - alpha_raw) * qf(c(1 - (1 - ${level}) / 2, (1 - ${level}) / 2), n - 1, (n - 1) * (k - 1))  # Feldt interval`);
      code.push('psych::alpha(X)  # standardized alpha, item-rest correlations, alpha if dropped');
      break;
    }
    case 'power.anova': {
      const p = spec.input?.params || {};
      code.push(`power.anova.test(groups = ${p.groups ?? 'NA'}, between.var = ${p.betweenVar ?? 'NA'}, within.var = ${p.withinVar ?? 'NA'}, ${o.solveFor === 'power' ? `n = ${p.n ?? 'NA'}` : `power = ${p.power ?? 'NA'}`}, sig.level = ${o.sigLevel ?? 0.05})`);
      break;
    }
    case 'power.tTest': {
      const p = spec.input?.params || {};
      const type = o.type === 'paired' ? 'paired' : o.type === 'one.sample' || o.type === 'one-sample' ? 'one.sample' : 'two.sample';
      code.push(`power.t.test(delta = ${p.delta ?? 'NA'}, sd = ${p.sd ?? 1}, ${o.solveFor === 'power' ? `n = ${p.n ?? 'NA'}` : `power = ${p.power ?? 'NA'}`}, sig.level = ${o.sigLevel ?? 0.05}, type = ${rq(type)})`);
      break;
    }
    case 'power.correlation': {
      need('pwr');
      const p = spec.input?.params || {};
      code.push(`pwr.r.test(r = ${p.r ?? 'NA'}, ${o.solveFor === 'power' ? `n = ${p.n ?? 'NA'}` : `power = ${p.power ?? 'NA'}`}, sig.level = ${o.sigLevel ?? 0.05})`);
      break;
    }
    case 'power.regression': {
      need('pwr');
      const p = spec.input?.params || {};
      code.push(`pwr.f2.test(u = ${p.u ?? 'NA'}, f2 = ${p.f2 ?? 'NA'}, ${o.solveFor === 'power' ? `v = ${p.n != null && p.u != null ? p.n - p.u - 1 : 'NA'}` : `power = ${p.power ?? 'NA'}`}, sig.level = ${o.sigLevel ?? 0.05})  # n = v + u + 1`);
      break;
    }
    // M3a [M3-DESIGN.md 6]
    case 'nls.fourPL':
    case 'nls.doseResponse':
    case 'nls.equation':
      return rCurves(spec, env, ix, t);
    case 'calc.auc':
    case 'qpcr.relative':
    case 'qpcr.efficiency':
    case 'mv.pca':
      return rLabMore(spec, env, ix, t);
    case 'reg.negbin': {
      need('MASS');
      const y = v(one('outcome'));
      for (const k of rolesOf(spec, 'covariates')) {
        const cc = ix.col(k);
        const ref = spec.levels?.references?.[k] ?? cc?.reference ?? null;
        if (cc && cc.type !== 'number' && cc.levels.length) code.push(`a$${cc.name} <- ${ref ? `relevel(factor(a$${cc.name}, levels = ${rvec(cc.levels)}), ref = ${rq(ref)})` : `factor(a$${cc.name}, levels = ${rvec(cc.levels)})`}`);
      }
      const offset = one('time') ? ` + offset(log(${v(one('time'))}))` : '';
      const ctl = 'control = glm.control(epsilon = 1e-10, maxit = 50)';
      code.push(`fit <- glm.nb(${formula(y)}${offset}, data = a, ${ctl}); summary(fit)`);
      code.push('c(theta = fit$theta, SE = fit$SE.theta)');
      code.push(`exp(cbind(IRR = coef(fit), ${o.ciMethod === 'wald' ? `confint.default(fit, level = ${level})` : `confint(fit, level = ${level})`}))${o.ciMethod === 'wald' ? '' : '  # profile intervals with theta held at its estimate'}`);
      code.push(`pois <- glm(${formula(y)}${offset}, family = poisson, data = a)`);
      code.push('lr <- 2 * (as.numeric(logLik(fit)) - as.numeric(logLik(pois))); c(chisq = lr, p = 0.5 * pchisq(lr, 1, lower.tail = FALSE))  # against Poisson, p halved');
      code.push(`null <- glm.nb(${y} ~ 1${offset}, data = a, ${ctl}); x <- fit$twologlik - null$twologlik; c(chisq = x, df = length(coef(fit)) - 1, p = pchisq(x, length(coef(fit)) - 1, lower.tail = FALSE))  # the whole model`);
      code.push(...wrapComment(t('report.script.negbinDrop')).map((l) => `# ${l}`));
      code.push('for (tl in attr(terms(fit), "term.labels")) { m0 <- update(fit, paste(". ~ . -", tl)); x <- fit$twologlik - m0$twologlik; df <- length(coef(fit)) - length(coef(m0)); print(c(term = tl, chisq = x, df = df, p = pchisq(x, df, lower.tail = FALSE))) }');
      break;
    }
    case 'design.randomisation':
    case 'design.sampling':
      return { code: [], packages, helpers, note: 'list' };
    default:
      return { code: [], packages, helpers, note: 'noCode' };
  }
  const p = spec.input?.params || {};
  if (/^power\./.test(spec.method) && p.m != null && p.icc != null) code.push(...wrapComment(t('report.script.deffStep', { m: p.m, icc: p.icc })).map((l) => `# ${l}`));
  return { code, packages, helpers };
}

/**
 * @param {{ analyses: any[], codebook: any, csvName: string, lang?: 'th'|'en', t?: (k: string, p?: any) => string,
 *   columns?: import('./analysed-data.js').ScriptColumn[]|null, version?: string, date?: string, title?: string }} input
 * @returns {string}
 */
export function buildRScript(input) {
  const t = input.t || ((k) => k);
  const lang = input.lang || 'th';
  const ix = columnIndex(input.codebook, input.columns || null, lang);
  const list = scriptAnalyses(input.analyses, input.codebook);
  const blocks = [];
  const packages = [];
  const helpers = [];
  list.forEach((a, i) => {
    const row = getMethod(a.spec?.method);
    const name = row && t(row.nameKey) !== `[${row.nameKey}]` ? t(row.nameKey) : a.spec?.method;
    const r = rCode(a.spec, a.env, ix, t);
    for (const p of r.packages) if (!packages.includes(p)) packages.push(p);
    for (const h of r.helpers) if (!helpers.includes(h)) helpers.push(h);
    const lines = ['', `## ${i + 1}. ${name}`];
    lines.push(`# ${t('report.script.ours', { numbers: '' }).trim()}`);
    for (const n of envNumbers(a.env, valueNamer(ix, t, a.env))) lines.push(`#   ${n}`);
    if (r.note === 'list') {
      const p = a.spec?.input?.params || {};
      for (const l of wrapComment(t('report.script.list', { seed: p.seed ?? a.spec?.options?.seed ?? '', stream: p.stream ?? a.spec?.options?.stream ?? 54 }))) lines.push(`# ${l}`);
    } else if (r.note === 'noCode') {
      for (const l of wrapComment(t('report.script.noCode'))) lines.push(`# ${l}`);
    } else {
      lines.push(`# ${matchesR(a.env) ? t('report.script.matched') : t('report.script.compare')}`);
      if (a.spec?.cluster?.route === 'aggregate' && !['freq.proportion', 'freq.incidenceRisk'].includes(a.spec.method)) for (const l of wrapComment(t('report.script.routeNotRe'))) lines.push(`# ${l}`);
      if (a.spec?.input?.kind === 'dataset' || !a.spec?.input) lines.push('a <- d');
      lines.push(...r.code);
    }
    blocks.push(lines.join('\n'));
  });
  const head = [
    `# ${t('report.script.headR', { csv: input.csvName })}`,
    ...wrapComment(t('report.script.notRun')).map((l) => `# ${l}`),
    `# ${t('report.script.madeWith', { version: input.version || '', date: input.date || '' })}`,
    ...wrapComment(t('report.script.csvNote')).map((l) => `# ${l}`),
  ];
  if (packages.length) head.push(`# ${t('report.script.packages', { packages: packages.join(', ') })}`, `# install.packages(${rvec(packages)})`);
  for (const p of packages) head.push(`library(${p})`);
  head.push('', `d <- read.csv(${rq(input.csvName)}, fileEncoding = "UTF-8-BOM", na.strings = "", stringsAsFactors = FALSE, check.names = FALSE)`);
  for (const c of ix.list) {
    if (c.type === 'date') head.push(`d$${c.name} <- as.Date(d$${c.name})`);
    else if (c.levels.length && ['binary', 'nominal', 'ordinal'].includes(c.codebookType)) {
      head.push(`d$${c.name} <- factor(d$${c.name}, levels = ${rvec(c.levels)}${c.codebookType === 'ordinal' ? ', ordered = FALSE' : ''})${c.reference ? `; d$${c.name} <- relevel(d$${c.name}, ref = ${rq(c.reference)})` : ''}`);
    }
  }
  for (const h of helpers) head.push('', ...HELPERS[h]);
  // Every element is one line: nothing read from the project can break a comment or a string onto a new line.
  return `${head.map(oneLine).join('\n')}\n${blocks.map((b) => b.split('\n').map(oneLine).join('\n')).join('\n')}\n`;
}
