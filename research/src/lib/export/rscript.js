// An R script that re-runs each analysis of the report on the exported analysed-data CSV with base R and
// named packages (stats, survival, pROC, epiR, sandwich, survey, psych, multcomp, pwr), VetMock Research's
// numbers written as comments above each block. It says the numbers matched R 4.6.0 only for a method
// whose envelope is verified against the 'r-4.6.0' fixtures; otherwise it asks the reader to compare. The
// app shows the code and hands it over as a download; it never runs it [M2-DESIGN.md 6.4]. OWNER: report role.
import { getMethod } from '../runtime/catalog.js';
import { columnIndex, envNumbers, valueNamer, matchesR, oneLine, rolesOf, scriptAnalyses, wrapComment } from './script-common.js';

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
  const list = scriptAnalyses(input.analyses);
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
