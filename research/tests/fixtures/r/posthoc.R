# Post hoc comparisons on `three` (levels A, B, C) [M2-DESIGN.md 3.1.4]. Rows in R's order, later level
# minus earlier.
# - Dunn (1964) after Kruskal-Wallis: z on mean ranks with the tie correction. Pinned from the base-R
#   formula; FSA::dunnTest and dunn.test::dunn.test must give the same |z| and p (stopifnot).
# - Games-Howell (1976): Welch SE and df per pair, p = ptukey(|d| / SE sqrt 2, k, df, lower.tail = FALSE).
#   Base R formula; PMCMRplus::gamesHowellTest does not load in webR (Rmpfr missing), named fallback.
# - Dunnett against control A, two-sided: mvtnorm::pmvt with TVPACK(abseps = 1e-15) through inclusion-exclusion
#   of the one-sided box, critical value by uniroot(tol = 1e-14). DescTools::DunnettTest does not load in
#   webR (rootSolve missing); multcomp::glht(mcp(g = 'Dunnett')) must agree within 1e-6 (its Genz-Bretz
#   integration is randomised, seed fixed) and mvtnorm GenzBretz(maxpts = 2e6, abseps = 1e-9) within 1e-9.
# - adjust.pValues gains Sidak (single step, -expm1(m log1p(-p))) and BH (p.adjust).
# packages: mvtnorm, FSA, dunn.test, multcomp
source("_common.R")
source("_data.R")
rs_require(c("mvtnorm", "FSA", "dunn.test", "multcomp"))

y <- three_long$y; g <- three_long$g; N <- length(y); k <- nlevels(g)
pr <- combn(k, 2)
lab <- apply(pr, 2, function(ij) paste0(levels(g)[ij[2]], "-", levels(g)[ij[1]]))
cases <- list()

# Dunn
rk <- rank(y); ni <- as.numeric(table(g)); Rbar <- as.numeric(tapply(rk, g, mean))
ties <- table(y); s2 <- N * (N + 1) / 12 - sum(ties^3 - ties) / (12 * (N - 1))
z <- apply(pr, 2, function(ij) (Rbar[ij[2]] - Rbar[ij[1]]) / sqrt(s2 * (1 / ni[ij[1]] + 1 / ni[ij[2]])))
praw <- 2 * pnorm(-abs(z))
invisible(capture.output(fsa <- FSA::dunnTest(y ~ g, method = "none")$res))
stopifnot(isTRUE(all.equal(sort(abs(fsa$Z)), sort(abs(z)), tolerance = 1e-12)), isTRUE(all.equal(sort(fsa$P.unadj), sort(praw), tolerance = 1e-12)))
invisible(capture.output(dd <- suppressWarnings(dunn.test::dunn.test(y, g, method = "none", altp = TRUE))))
stopifnot(isTRUE(all.equal(sort(abs(dd$Z)), sort(abs(z)), tolerance = 1e-12)), isTRUE(all.equal(sort(dd$altP), sort(praw), tolerance = 1e-12)))
cases[["dunn.three"]] <- case("Dunn z = (mean rank later - earlier) / sqrt((N(N+1)/12 - sum(t^3 - t)/(12(N-1))) (1/n_i + 1/n_j)); p.adjust", "closed",
  list(pairs = arr(lab), z = arr(z), pRaw = arr(praw), pHolm = arr(p.adjust(praw, "holm")), pBonferroni = arr(p.adjust(praw, "bonferroni")),
    pBH = arr(p.adjust(praw, "BH")), meanRanks = arr(Rbar), tieTerm = s2), data = "three")

# Games-Howell
m <- as.numeric(tapply(y, g, mean)); v <- as.numeric(tapply(y, g, var))
gh <- sapply(seq_len(ncol(pr)), function(c) { i <- pr[2, c]; j <- pr[1, c]
  d <- m[i] - m[j]; se <- sqrt(v[i] / ni[i] + v[j] / ni[j])
  df <- (v[i] / ni[i] + v[j] / ni[j])^2 / ((v[i] / ni[i])^2 / (ni[i] - 1) + (v[j] / ni[j])^2 / (ni[j] - 1))
  q <- abs(d) / se * sqrt(2); crit <- qtukey(0.95, k, df) / sqrt(2)
  c(d, se, df, q, ptukey(q, k, df, lower.tail = FALSE), d - crit * se, d + crit * se, crit) })
cases[["gamesHowell.three"]] <- case("Games-Howell in base R: ptukey(|d|/SE sqrt 2, k, Welch df, lower.tail = FALSE); CI d -/+ qtukey(0.95, k, df)/sqrt 2 SE", "closed",
  list(pairs = arr(lab), diff = arr(gh[1, ]), se = arr(gh[2, ]), df = arr(gh[3, ]), q = arr(gh[4, ]), p = arr(gh[5, ]),
    lower = arr(gh[6, ]), upper = arr(gh[7, ]), crit = arr(gh[8, ])),
  data = "three", confLevel = 0.95, iterativeValues = arr(c("p", "lower", "upper", "crit")))

# Dunnett, control A
mse <- sum((y - ave(y, g))^2) / (N - k); dfe <- N - k
d <- m[2:3] - m[1]; se <- sqrt(mse * (1 / ni[2:3] + 1 / ni[1])); tt <- d / se
lam <- sqrt(ni[2:3] / (ni[2:3] + ni[1])); R <- outer(lam, lam); diag(R) <- 1
cdf <- function(u1, u2) if ((is.infinite(u1) && u1 < 0) || (is.infinite(u2) && u2 < 0)) 0 else
  mvtnorm::pmvt(lower = c(-Inf, -Inf), upper = c(u1, u2), df = dfe, corr = R, algorithm = mvtnorm::TVPACK(abseps = 1e-15))[1]
box <- function(c) cdf(c, c) - cdf(-c, c) - cdf(c, -c) + cdf(-c, -c)
padj <- sapply(tt, function(t) 1 - box(abs(t)))
crit <- uniroot(function(c) box(c) - 0.95, c(1, 10), tol = 1e-14)$root
pg <- sapply(tt, function(t) 1 - mvtnorm::pmvt(lower = rep(-abs(t), 2), upper = rep(abs(t), 2), df = dfe, corr = R,
  algorithm = mvtnorm::GenzBretz(maxpts = 2e6, abseps = 1e-9)))
stopifnot(max(abs(pg - padj)) < 1e-9)
set.seed(20260928)
gl <- summary(multcomp::glht(aov(y ~ g, data = three_long), linfct = multcomp::mcp(g = "Dunnett")))
stopifnot(max(abs(unname(gl$test$pvalues) - padj)) < 1e-6, isTRUE(all.equal(unname(gl$test$tstat), unname(tt), tolerance = 1e-12)))
cases[["dunnett.three.controlA"]] <- case("mvtnorm::pmvt(TVPACK(abseps = 1e-15)) by inclusion-exclusion; critical value by uniroot(tol = 1e-14)", "closed",
  list(pairs = arr(c("B-A", "C-A")), diff = arr(unname(d)), se = arr(unname(se)), t = arr(unname(tt)), df = dfe, lambda = arr(unname(lam)),
    p = arr(padj), crit = crit, lower = arr(unname(d - crit * se)), upper = arr(unname(d + crit * se))),
  data = "three", controlLevel = "A", confLevel = 0.95,
  tolByValue = list(p = "dunnettP", crit = "dunnettCrit", lower = "dunnettCrit", upper = "dunnettCrit"))

pv <- c(0.01, 0.04, 0.03, 0.005)
cases[["adjust.sidakBH"]] <- case("-expm1(m log1p(-p)); p.adjust(p, 'BH')", "closed",
  list(sidak = arr(-expm1(length(pv) * log1p(-pv))), bh = arr(p.adjust(pv, "BH"))), input = arr(pv))
pv2 <- c(0.2, 0.001, 0.049, 0.5, 0.012, 0.03)
cases[["adjust.sidakBH.six"]] <- case("-expm1(m log1p(-p)); p.adjust(p, 'BH')", "closed",
  list(sidak = arr(-expm1(length(pv2) * log1p(-pv2))), bh = arr(p.adjust(pv2, "BH"))), input = arr(pv2))

rs_emit("posthoc", c("posthoc.dunn", "posthoc.gamesHowell", "posthoc.dunnett", "adjust.pValues"), cases,
  packages = c("mvtnorm", "FSA", "dunn.test", "multcomp"),
  notes = paste("Dunn: base-R formula, FSA 0.10.1 dunnTest and dunn.test 1.4.0 agree in |z| and p (stopifnot).",
    "Games-Howell: base-R formula (PMCMRplus::gamesHowellTest does not load in webR 0.6.0: Rmpfr is not in repo.r-wasm.org).",
    "Dunnett: TVPACK is deterministic; tolerance 1e-8 absolute on p and 1e-8 relative on the critical value and the interval (M2-DESIGN.md 3.1.4).",
    "DescTools::DunnettTest does not load in webR (rootSolve missing); multcomp 1.4-30 glht agrees within 1e-6 (randomised, seed 20260928), GenzBretz within 1e-9.",
    "Dataset three is M1-DESIGN.md section 7's (scipy-crosscheck.json datasets)."))
