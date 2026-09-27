# Mantel-Haenszel [M1-DESIGN.md 7.16]. mantelhaen.test gives the MH odds ratio with the
# Robins-Breslow-Greenland interval and the CMH chi-square with and without continuity. The MH risk
# (prevalence) ratio with the Greenland-Robins (1985, Biometrics 41:55) variance, the Woolf homogeneity
# test for the RR, the Breslow-Day statistic (Breslow and Day 1980, IARC Sci Publ 32) and Tarone's
# correction (Tarone 1985, Biometrika 72:91) are written in base R. DescTools::BreslowDayTest would be
# the package route, but DescTools does not load in webR 0.6.0 (its dependency rootSolve is not in
# repo.r-wasm.org), so the formula is the pin. Strata with fewer than two animals are dropped before
# any of this, as the engine does (mantelhaen.test refuses them).
# packages:
source("_common.R")
source("_serosurvey.R")

mh <- function(strata, conf = 0.95) {
  zz <- qnorm(1 - (1 - conf) / 2)
  keep <- vapply(strata, function(s) sum(s) >= 2, TRUE)
  S <- strata[keep]
  arr3 <- array(unlist(lapply(S, function(s) t(matrix(s, 2, byrow = TRUE)))), dim = c(2, 2, length(S)))
  m1 <- mantelhaen.test(arr3, correct = TRUE)
  m0 <- mantelhaen.test(arr3, correct = FALSE)
  a <- sapply(S, `[`, 1); b <- sapply(S, `[`, 2); c <- sapply(S, `[`, 3); d <- sapply(S, `[`, 4)
  n1 <- a + b; n0 <- c + d; T <- n1 + n0
  # MH RR (Greenland-Robins variance of log RR_MH)
  num <- sum(a * n0 / T); den <- sum(c * n1 / T)
  rr <- num / den
  seLogRR <- sqrt(sum((n1 * n0 * (a + c) - a * c * T) / T^2) / (num * den))
  # Woolf homogeneity of the stratum RRs (strata with a zero exposed or reference positive are skipped)
  ok <- a > 0 & c > 0
  lrr <- log((a / n1) / (c / n0))[ok]; w <- 1 / (1 / a - 1 / n1 + 1 / c - 1 / n0)[ok]
  woolf <- sum(w * (lrr - log(rr))^2)
  # Breslow-Day for the OR, in base R (Breslow and Day 1980, IARC 32), against OR_MH
  or <- unname(m1$estimate)
  bd <- 0; sumDiff <- 0; sumVar <- 0
  for (k in seq_along(S)) {
    mk <- a[k] + c[k]; lo <- max(0, mk - n0[k]); hi <- min(n1[k], mk)
    if (lo == hi) next
    f <- function(x) x * (n0[k] - mk + x) - or * (n1[k] - x) * (mk - x)
    ea <- uniroot(f, c(lo, hi), tol = 1e-12)$root
    va <- 1 / (1 / ea + 1 / (n1[k] - ea) + 1 / (mk - ea) + 1 / (n0[k] - mk + ea))
    bd <- bd + (a[k] - ea)^2 / va
    sumDiff <- sumDiff + (a[k] - ea); sumVar <- sumVar + va
  }
  tarone <- bd - sumDiff^2 / sumVar
  out <- list(
    kept = sum(keep), skipped = sum(!keep),
    informative = sum(vapply(S, function(s) (s[1] + s[2]) > 0 && (s[3] + s[4]) > 0 && (s[1] + s[3]) > 0 && (s[2] + s[4]) > 0, TRUE)),
    OR = list(value = or, ci = ci_of(m1$conf.int[1:2])),
    RR = list(value = rr, seLog = seLogRR, ci = ci_of(exp(log(rr) + c(-1, 1) * zz * seLogRR))),
    cmh = list(X2 = unname(m1$statistic), p = m1$p.value),
    cmhNoCorrection = list(X2 = unname(m0$statistic), p = m0$p.value),
    breslowDay = list(X2 = bd, df = length(S) - 1, p = pchisq(bd, length(S) - 1, lower.tail = FALSE)),
    tarone = list(X2 = tarone, df = length(S) - 1, p = pchisq(tarone, length(S) - 1, lower.tail = FALSE)),
    woolfRR = list(X2 = woolf, df = sum(ok) - 1, p = pchisq(woolf, sum(ok) - 1, lower.tail = FALSE))
  )
}

cases <- list()
three <- list(c(10, 20, 5, 25), c(8, 12, 6, 24), c(15, 5, 9, 11))
cases[["threeStrata"]] <- case("mantelhaen.test(array of [[10, 20], [5, 25]], [[8, 12], [6, 24]], [[15, 5], [9, 11]]) and the formulas in mh.R", "closed",
  mh(three), strata = lapply(three, function(s) list(arr(s[1:2]), arr(s[3:4]))), confLevel = 0.95,
  iterativeValues = arr(c("breslowDay", "tarone")))

sero <- lapply(seq_along(sero_farm), function(i) c(sero_a[i], sero_b[i], sero_c[i], sero_d[i]))
cases[["serosurvey.farmStrata"]] <- case("the same on the 49 farm strata of the serosurvey (age >= 24 months vs younger, ELISA positive)", "closed",
  mh(sero), strata = lapply(sero, function(s) list(arr(s[1:2]), arr(s[3:4]))), farms = arr(sero_farm), confLevel = 0.95,
  iterativeValues = arr(c("breslowDay", "tarone")))

rs_emit("mh", c("epi.mantelHaenszel"), cases,
  notes = paste("Strata: [[a, b], [c, d]] per stratum, rows exposed then reference. Breslow-Day and Tarone need the expected cell under OR_MH, found by uniroot at tol 1e-12, so they compare at the iterative tolerance.",
    "informative = strata with both exposure groups and both outcomes present. The Woolf homogeneity test for the RR uses only strata with a positive in both groups."))
