# One proportion [M1-DESIGN.md 7.5]: Wilson (prop.test without continuity), exact Clopper-Pearson
# (binom.test), Wald and Agresti-Coull (formulas in base R; Agresti and Coull 1998, Am Stat 52:119),
# and the exact Poisson interval for a rate (poisson.test).
# packages:
source("_common.R")

z <- qnorm(0.975)
wilson <- function(x, n) unname(prop.test(x, n, correct = FALSE)$conf.int[1:2])
exact <- function(x, n) unname(binom.test(x, n)$conf.int[1:2])
wald <- function(x, n) { p <- x / n; se <- sqrt(p * (1 - p) / n); c(p - z * se, p + z * se) }
agresti <- function(x, n) { nt <- n + z^2; pt <- (x + z^2 / 2) / nt; se <- sqrt(pt * (1 - pt) / nt); c(pt - z * se, pt + z * se) }

cases <- list()
for (xn in list(c(17, 179), c(0, 20), c(20, 20), c(146, 728), c(1, 5000), c(10, 20), c(7, 18))) {
  x <- xn[1]; n <- xn[2]
  cases[[sprintf("%d/%d", x, n)]] <- case(
    sprintf("prop.test(%1$d, %2$d, correct = FALSE)$conf.int; binom.test(%1$d, %2$d)$conf.int; Wald and Agresti-Coull by formula", x, n),
    "closed",
    list(p = x / n, wilson = ci_of(wilson(x, n)), exact = ci_of(exact(x, n)), wald = ci_of(wald(x, n)), agrestiCoull = ci_of(agresti(x, n))),
    x = x, n = n, confLevel = 0.95)
}
# 90% and 99% intervals for one case
for (cl in c(0.9, 0.99)) {
  zz <- qnorm(1 - (1 - cl) / 2)
  cases[[sprintf("17/179 at %s", format(cl))]] <- case(
    sprintf("prop.test(17, 179, correct = FALSE, conf.level = %1$s); binom.test(17, 179, conf.level = %1$s)", format(cl)), "closed",
    list(wilson = ci_of(prop.test(17, 179, correct = FALSE, conf.level = cl)$conf.int[1:2]), exact = ci_of(binom.test(17, 179, conf.level = cl)$conf.int[1:2]),
      wald = ci_of(17 / 179 + c(-1, 1) * zz * sqrt(17 / 179 * (1 - 17 / 179) / 179))),
    x = 17, n = 179, confLevel = cl)
}
# exact Poisson interval for a rate
for (ct in list(c(7, 1089), c(0, 500), c(25, 1200.5))) {
  pt <- poisson.test(ct[1], ct[2])
  cases[[sprintf("rate %s/%s", format(ct[1]), format(ct[2]))]] <- case(
    sprintf("poisson.test(%s, %s)", format(ct[1]), format(ct[2])), "closed",
    list(rate = unname(pt$estimate), ci = ci_of(pt$conf.int[1:2])), count = ct[1], time = ct[2], confLevel = 0.95)
}

rs_emit("proportion", c("freq.proportion", "freq.incidenceRate"), cases,
  notes = "Wilson = prop.test(correct = FALSE); exact = binom.test (Clopper-Pearson); Wald and Agresti-Coull written in base R with z = qnorm(0.975); rates from poisson.test (exact, chi-square quantiles).")
