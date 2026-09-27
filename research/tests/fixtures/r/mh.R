# Mantel-Haenszel [M1-DESIGN.md 7.16]. mantelhaen.test gives the MH odds ratio with the
# Robins-Breslow-Greenland interval and the CMH chi-square with and without continuity. The MH risk
# (prevalence) ratio with the Greenland-Robins (1985, Biometrics 41:55) variance is written in base R.
#
# Homogeneity (review round 3). Each test sums a named set of strata and takes its df from that set:
# - Woolf, RR/PR and OR: Jewell (2004) Statistics for Epidemiology eq 10.3, sum w (ln E - ln E_w)^2 with
#   ln E_w the inverse-variance weighted mean of the SAME strata. This is what epiR does (cran/epiR
#   R/epi.2by2.R, version 2.0.98, lines 1583-1589: lnRR.s. <- sum(wRR. * lnRR.) / sum(wRR.);
#   wRR.homog <- sum(wRR. * (lnRR. - lnRR.s.)^2); lines 1596-1602 for the OR, where epiR adds 0.5 to
#   every cell). The strata: RR/PR those with a positive in both groups; OR those with no empty cell.
#   The earlier version of this file centred the RR test on ln(RR_MH) of every informative stratum,
#   the same mistake as the engine, so it could not catch it.
# - Breslow-Day (Breslow and Day 1980, IARC Sci Publ 32) at OR_MH with Tarone's correction (Tarone 1985,
#   Biometrika 72:91), over the informative strata (both groups and both outcomes present), df =
#   informative strata - 1: a stratum whose a is fixed by its margins adds exactly 0. The earlier version
#   counted every stratum in df, as epiR does when given uninformative strata (its na.rm drops their NaN
#   terms but n.strata still counts them, lines 1630-1643).
# epiR itself (webR's epiR, version stored in _meta.packages) runs epi.2by2(method = "cohort.count") on the
# strata with a positive in both groups: epi.2by2 stops ("missing value where TRUE/FALSE needed") on a set
# with an empty cell, and those strata are all informative. Its wRR.homog, wOR.homog (with its 0.5) and
# bOR.homog are stored under `epiR`, and this script stops unless its own formulas give the same numbers on
# those strata, so the hand-written Woolf and Breslow-Day formulas are checked against epiR's code here.
# DescTools::BreslowDayTest does not load in webR 0.6.0 (its dependency rootSolve is not in
# repo.r-wasm.org). Strata with fewer than two animals are dropped before any of this, as the engine
# does (mantelhaen.test refuses them). Strata indexes in the output are 0-based, as the engine reports them.
# packages: epiR
source("_common.R")
source("_serosurvey.R")
rs_require("epiR")

# Woolf: inverse-variance weights w, centre the weighted mean of the same logs.
woolf <- function(l, w) {
  lw <- sum(w * l) / sum(w)
  x2 <- sum(w * (l - lw)^2)
  list(X2 = x2, df = length(l) - 1, p = pchisq(x2, length(l) - 1, lower.tail = FALSE))
}
woolfRR <- function(S) {
  a <- sapply(S, `[`, 1); b <- sapply(S, `[`, 2); c <- sapply(S, `[`, 3); d <- sapply(S, `[`, 4)
  woolf(log((a / (a + b)) / (c / (c + d))), 1 / (1 / a - 1 / (a + b) + 1 / c - 1 / (c + d)))
}
woolfOR <- function(S) {
  a <- sapply(S, `[`, 1); b <- sapply(S, `[`, 2); c <- sapply(S, `[`, 3); d <- sapply(S, `[`, 4)
  woolf(log((a * d) / (b * c)), 1 / (1 / a + 1 / b + 1 / c + 1 / d))
}
mhOR <- function(S) {
  a <- sapply(S, `[`, 1); b <- sapply(S, `[`, 2); c <- sapply(S, `[`, 3); d <- sapply(S, `[`, 4)
  T <- a + b + c + d
  sum(a * d / T) / sum(b * c / T)
}
# Breslow-Day at `or` over the strata given (all informative), with Tarone's correction; the expected
# cell by uniroot, independent of the engine's closed-form root.
breslowDay <- function(S, or) {
  bd <- 0; sumDiff <- 0; sumVar <- 0
  for (s in S) {
    a <- s[1]; n1 <- s[1] + s[2]; n0 <- s[3] + s[4]; mk <- s[1] + s[3]
    lo <- max(0, mk - n0); hi <- min(n1, mk)
    stopifnot(lo < hi)
    f <- function(x) x * (n0 - mk + x) - or * (n1 - x) * (mk - x)
    ea <- uniroot(f, c(lo, hi), tol = 1e-12)$root
    va <- 1 / (1 / ea + 1 / (n1 - ea) + 1 / (mk - ea) + 1 / (n0 - mk + ea))
    bd <- bd + (a - ea)^2 / va
    sumDiff <- sumDiff + (a - ea); sumVar <- sumVar + va
  }
  k <- length(S)
  tarone <- bd - sumDiff^2 / sumVar
  list(
    breslowDay = list(X2 = bd, df = k - 1, p = pchisq(bd, k - 1, lower.tail = FALSE)),
    tarone = list(X2 = tarone, df = k - 1, p = pchisq(tarone, k - 1, lower.tail = FALSE))
  )
}
as3 <- function(S) as.table(array(unlist(lapply(S, function(s) matrix(s, 2, byrow = TRUE))), dim = c(2, 2, length(S))))
triple <- function(x) list(X2 = unname(x[[1]]), df = unname(x[[2]]), p = unname(x[[3]]))
same <- function(x, y, tol) stopifnot(isTRUE(all.equal(unname(x), unname(y), tolerance = tol)))

mh <- function(strata, conf = 0.95) {
  zz <- qnorm(1 - (1 - conf) / 2)
  keep <- vapply(strata, function(s) sum(s) >= 2, TRUE)
  at <- which(keep) - 1 # 0-based indexes of the strata used
  S <- strata[keep]
  # mantelhaen.test's array is [outcome, exposure, stratum] here; the odds ratio does not change.
  arr3 <- array(unlist(lapply(S, function(s) t(matrix(s, 2, byrow = TRUE)))), dim = c(2, 2, length(S)))
  m1 <- mantelhaen.test(arr3, correct = TRUE)
  m0 <- mantelhaen.test(arr3, correct = FALSE)
  a <- sapply(S, `[`, 1); b <- sapply(S, `[`, 2); c <- sapply(S, `[`, 3); d <- sapply(S, `[`, 4)
  n1 <- a + b; n0 <- c + d; T <- n1 + n0
  # MH RR (Greenland-Robins variance of log RR_MH)
  num <- sum(a * n0 / T); den <- sum(c * n1 / T)
  rr <- num / den
  seLogRR <- sqrt(sum((n1 * n0 * (a + c) - a * c * T) / T^2) / (num * den))
  informative <- n1 > 0 & n0 > 0 & (a + c) > 0 & (b + d) > 0
  okRR <- a > 0 & c > 0 & (b > 0 | d > 0) # a positive in both groups (and a variance)
  okOR <- a > 0 & b > 0 & c > 0 & d > 0
  or <- unname(m1$estimate)
  stopifnot(isTRUE(all.equal(or, mhOR(S), tolerance = 1e-12)))
  bdt <- breslowDay(S[informative], or)
  # epiR on the strata with a positive in both groups, and this file's formulas on the same strata.
  E <- S[okRR]
  e <- suppressWarnings(epi.2by2(as3(E), method = "cohort.count", conf.level = conf))$massoc.detail
  wRR <- triple(e$wRR.homog); wOR <- triple(e$wOR.homog); bOR <- triple(e$bOR.homog)
  mine <- woolfRR(E)
  same(c(mine$X2, mine$df, mine$p), unlist(wRR), 1e-12)
  half <- lapply(E, function(s) s + 0.5)
  mineOR <- woolfOR(half)
  same(c(mineOR$X2, mineOR$df, mineOR$p), unlist(wOR), 1e-12)
  mineBD <- breslowDay(E, mhOR(E))$breslowDay
  same(c(mineBD$X2, mineBD$df, mineBD$p), unlist(bOR), 1e-9)
  list(
    kept = sum(keep), skipped = sum(!keep), informative = sum(informative),
    OR = list(value = or, ci = ci_of(m1$conf.int[1:2])),
    RR = list(value = rr, seLog = seLogRR, ci = ci_of(exp(log(rr) + c(-1, 1) * zz * seLogRR))),
    cmh = list(X2 = unname(m1$statistic), p = m1$p.value),
    cmhNoCorrection = list(X2 = unname(m0$statistic), p = m0$p.value),
    breslowDay = c(bdt$breslowDay, list(strata = arr(at[informative]))),
    tarone = bdt$tarone,
    woolfRR = c(woolfRR(S[okRR]), list(strata = arr(at[okRR]))),
    woolfOR = if (sum(okOR) >= 2) c(woolfOR(S[okOR]), list(strata = arr(at[okOR]))) else NULL,
    epiR = list(
      strata = arr(at[okRR]),
      wRR.homog = wRR,
      wOR.homog = wOR,
      bOR.homog = c(bOR, list(ORmh = mhOR(E)))
    )
  )
}

cases <- list()
three <- list(c(10, 20, 5, 25), c(8, 12, 6, 24), c(15, 5, 9, 11))
cases[["threeStrata"]] <- case("mantelhaen.test(array of [[10, 20], [5, 25]], [[8, 12], [6, 24]], [[15, 5], [9, 11]]), the formulas in mh.R and epiR::epi.2by2", "closed",
  mh(three), strata = lapply(three, function(s) list(arr(s[1:2]), arr(s[3:4]))), confLevel = 0.95,
  iterativeValues = arr(c("breslowDay", "tarone")))

# Review round 2: |sum a - sum E| = 0.262, below 0.5, so the CMH continuity correction is that, not 0.5.
small <- list(c(5, 5, 5, 6), c(4, 6, 5, 5))
cases[["continuityBelowHalf"]] <- case("mantelhaen.test(array of [[5, 5], [5, 6]], [[4, 6], [5, 5]]), the formulas in mh.R and epiR::epi.2by2", "closed",
  mh(small), strata = lapply(small, function(s) list(arr(s[1:2]), arr(s[3:4]))), confLevel = 0.95,
  iterativeValues = arr(c("breslowDay", "tarone")))

sero <- lapply(seq_along(sero_farm), function(i) c(sero_a[i], sero_b[i], sero_c[i], sero_d[i]))
cases[["serosurvey.farmStrata"]] <- case("the same on the 49 farm strata of the serosurvey (age >= 24 months vs younger, ELISA positive)", "closed",
  mh(sero), strata = lapply(sero, function(s) list(arr(s[1:2]), arr(s[3:4]))), farms = arr(sero_farm), confLevel = 0.95,
  iterativeValues = arr(c("breslowDay", "tarone")))

# Review round 3: the within-farm route for vaccine x ELISA, where the Woolf test centred on RR_MH read
# 30.75 on 9 df (p 0.0003) and the textbook test on the same 10 farms reads 9.77 (p 0.37).
vac <- lapply(seq_along(sero_farm), function(i) c(sero_va[i], sero_vb[i], sero_vc[i], sero_vd[i]))
cases[["serosurvey.vaccineFarmStrata"]] <- case("the same on the 49 farm strata of the serosurvey (not vaccinated in the last 6 months vs vaccinated, ELISA positive)", "closed",
  mh(vac), strata = lapply(vac, function(s) list(arr(s[1:2]), arr(s[3:4]))), farms = arr(sero_farm), confLevel = 0.95,
  iterativeValues = arr(c("breslowDay", "tarone")))

rs_emit("mh", c("epi.mantelHaenszel"), cases, packages = "epiR",
  notes = paste("Strata: [[a, b], [c, d]] per stratum, rows exposed then reference. Breslow-Day and Tarone need the expected cell under OR_MH, found by uniroot at tol 1e-12, so they compare at the iterative tolerance.",
    "informative = strata with both exposure groups and both outcomes present. Each homogeneity block lists the strata it summed (0-based indexes into strata) and its df is their number minus 1:",
    "Woolf RR over the strata with a positive in both groups, Woolf OR over the strata with no empty cell, Breslow-Day and Tarone over the informative strata.",
    "Woolf is centred on the inverse-variance mean of the strata it sums (Jewell 2004 eq 10.3, epiR). The epiR block is epi.2by2(method = 'cohort.count') on epiR.strata: wRR.homog as it is,",
    "wOR.homog after epiR adds 0.5 to every cell, bOR.homog at the MH odds ratio of those strata (ORmh); the script stops unless its own formulas give these numbers."))
