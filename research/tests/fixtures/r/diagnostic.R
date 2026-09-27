# Diagnostic accuracy [M1-DESIGN.md 7.18]: Se, Sp, PPV, NPV, accuracy and prevalence with Wilson and
# exact intervals; LR+ and LR- with the log method (Simel, Samsa and Matchar 1991, J Clin Epidemiol
# 44:763). The pin is written in base R; epiR::epi.tests (methods "exact" and "wilson") is stored
# beside it as a second program's answer.
# packages: epiR
source("_common.R")
rs_require("epiR")

wilson <- function(x, n) unname(suppressWarnings(prop.test(x, n, correct = FALSE))$conf.int[1:2])
exact <- function(x, n) unname(binom.test(x, n)$conf.int[1:2])
z <- qnorm(0.975)

cases <- list()
dx <- function(id, TP, FN, FP, TN) {
  n <- TP + FN + FP + TN
  props <- list(Se = c(TP, TP + FN), Sp = c(TN, TN + FP), PPV = c(TP, TP + FP), NPV = c(TN, TN + FN),
    accuracy = c(TP + TN, n), prevalence = c(TP + FN, n))
  vals <- lapply(props, function(v) list(value = v[1] / v[2], wilson = ci_of(wilson(v[1], v[2])), exact = ci_of(exact(v[1], v[2]))))
  se <- TP / (TP + FN); sp <- TN / (TN + FP)
  lp <- se / (1 - sp); ln <- (1 - se) / sp
  slp <- sqrt(1 / TP - 1 / (TP + FN) + 1 / FP - 1 / (FP + TN))
  sln <- sqrt(1 / FN - 1 / (TP + FN) + 1 / TN - 1 / (FP + TN))
  vals$LRpos <- list(value = lp, ci = ci_of(exp(log(lp) + c(-1, 1) * z * slp)))
  vals$LRneg <- list(value = ln, ci = ci_of(exp(log(ln) + c(-1, 1) * z * sln)))
  tab <- as.table(matrix(c(TP, FP, FN, TN), 2, byrow = TRUE))
  ex <- suppressWarnings(epi.tests(tab, method = "exact"))$detail
  wi <- suppressWarnings(epi.tests(tab, method = "wilson"))$detail
  pick <- function(d, s) ci_of(unlist(d[d$statistic == s, c("est", "lower", "upper")]))
  cases[[id]] <<- case(sprintf("diagnostic formulas on TP %d, FN %d, FP %d, TN %d; epiR::epi.tests", TP, FN, FP, TN), "closed", vals,
    counts = list(TP = TP, FN = FN, FP = FP, TN = TN), confLevel = 0.95,
    epiR = list(
      exact = list(se = pick(ex, "se"), sp = pick(ex, "sp"), pvPos = pick(ex, "pv.pos"), pvNeg = pick(ex, "pv.neg"), lrPos = pick(ex, "lr.pos"), lrNeg = pick(ex, "lr.neg")),
      wilson = list(se = pick(wi, "se"), sp = pick(wi, "sp"), pvPos = pick(wi, "pv.pos"), pvNeg = pick(wi, "pv.neg"))))
}
dx("course107013", 90, 10, 60, 120)
dx("course107014.felv", 32, 8, 16, 944)
dx("small", 18, 2, 3, 27)

rs_emit("diagnostic", c("dx.accuracy"), cases, packages = "epiR",
  notes = "epiR tables are [[TP, FP], [FN, TN]] (test in rows, disease in columns); its values are stored as est, lower, upper.")
