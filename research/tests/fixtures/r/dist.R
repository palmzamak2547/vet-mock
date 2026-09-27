# Distribution functions [M1-DESIGN.md 7.1; engine.md 4]: the upper tails the engine computes from
# complement functions, the quantiles behind every interval, and engine.md's hard cases.
# Each case records the R call; `args` are the arguments in R's order.
# packages:
source("_common.R")

cases <- list()
add <- function(id, call, tol, fn, args, value) {
  cases[[id]] <<- case(call, tol, list(value = value), fn = fn, args = arr(args))
}

# normal
for (z in c(0, 1.959963984540054, 3, 5, 10, 37.5)) {
  add(sprintf("pnormUpper(%s)", format(z)), sprintf("pnorm(%s, lower.tail = FALSE)", format(z, digits = 17)), "closed", "pnormUpper", z, pnorm(z, lower.tail = FALSE))
}
add("pnormLower(-3)", "pnorm(-3)", "closed", "pnormLower", -3, pnorm(-3))
add("pnormTwoSided(2.5)", "2 * pnorm(-abs(2.5))", "closed", "pnormTwoSided", 2.5, 2 * pnorm(-2.5))
for (p in c(0.975, 0.8, 0.995, 1e-10)) {
  add(sprintf("qnorm(%s)", format(p)), sprintf("qnorm(%s)", format(p)), "closed", "qnorm", p, qnorm(p))
}

# t
tt <- list(c(2.1, 8), c(6, 3), c(15, 30), c(-5.493662518652961, 13.914408480898441), c(0.5, 1))
for (a in tt) {
  add(sprintf("ptTwoSided(%s, %s)", format(a[1]), format(a[2])), sprintf("2 * pt(-abs(%s), %s)", format(a[1], digits = 17), format(a[2], digits = 17)), "closed", "ptTwoSided", a, 2 * pt(-abs(a[1]), a[2]))
  add(sprintf("ptUpper(%s, %s)", format(a[1]), format(a[2])), sprintf("pt(%s, %s, lower.tail = FALSE)", format(a[1], digits = 17), format(a[2], digits = 17)), "closed", "ptUpper", a, pt(a[1], a[2], lower.tail = FALSE))
}
for (a in list(c(0.975, 1), c(0.975, 5), c(0.975, 9), c(0.975, 16), c(0.975, 13.914408480898441), c(0.995, 3), c(0.025, 30))) {
  add(sprintf("qt(%s, %s)", format(a[1]), format(a[2])), sprintf("qt(%s, %s)", format(a[1]), format(a[2], digits = 17)), "closed", "qt", a, qt(a[1], a[2]))
}

# chi-square
for (a in list(c(3.841459, 1), c(30, 1), c(100, 1), c(16.030928230129575, 1), c(9.571909571909572, 2), c(9.4433060515873, 2), c(0.5, 10))) {
  add(sprintf("pchisqUpper(%s, %s)", format(a[1]), format(a[2])), sprintf("pchisq(%s, %s, lower.tail = FALSE)", format(a[1], digits = 17), format(a[2])), "closed", "pchisqUpper", a, pchisq(a[1], a[2], lower.tail = FALSE))
}
for (a in list(c(0.025, 14), c(0.975, 16), c(0.95, 1), c(0.975, 2))) {
  add(sprintf("qchisq(%s, %s)", format(a[1]), format(a[2])), sprintf("qchisq(%s, %s)", format(a[1]), format(a[2])), "closed", "qchisq", a, qchisq(a[1], a[2]))
}

# F
for (a in list(c(9.211448598130833, 2, 15), c(1, 3, 20), c(50, 1, 8))) {
  add(sprintf("pfUpper(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), sprintf("pf(%s, %s, %s, lower.tail = FALSE)", format(a[1], digits = 17), format(a[2]), format(a[3])), "closed", "pfUpper", a, pf(a[1], a[2], a[3], lower.tail = FALSE))
}
add("qf(0.95, 2, 15)", "qf(0.95, 2, 15)", "closed", "qf", c(0.95, 2, 15), qf(0.95, 2, 15))

# beta (Clopper-Pearson bounds)
for (a in list(c(0.025, 1, 20), c(0.975, 2, 19), c(0.025, 49, 2), c(0.025, 1, 5000), c(0.025, 17, 163), c(0.975, 18, 162))) {
  add(sprintf("qbeta(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), sprintf("qbeta(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), "closed", "qbeta", a, qbeta(a[1], a[2], a[3]))
}

# binomial: the engine's pbinomLower(k) is P(X <= k) (R pbinom(k)); pbinomUpper(k) is P(X >= k)
# (R pbinom(k - 1, lower.tail = FALSE)).
for (a in list(c(5, 20, 0.5), c(0, 20, 0.3), c(3, 1000, 0.001))) {
  add(sprintf("pbinomLower(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), sprintf("pbinom(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), "closed", "pbinomLower", a, pbinom(a[1], a[2], a[3]))
  add(sprintf("pbinomUpper(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), sprintf("pbinom(%s - 1, %s, %s, lower.tail = FALSE)", format(a[1]), format(a[2]), format(a[3])), "closed", "pbinomUpper", a, pbinom(a[1] - 1, a[2], a[3], lower.tail = FALSE))
}

# studentized range: R computes the upper tail as 1 - ptukey (M1-DESIGN.md A8); numerical quadrature
for (a in list(c(3.5, 3, 15), c(5.0, 3, 15), c(2.0, 4, 30))) {
  add(sprintf("ptukeyUpper(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), sprintf("ptukey(%s, %s, %s, lower.tail = FALSE)", format(a[1]), format(a[2]), format(a[3])), "iterative", "ptukeyUpper", a, ptukey(a[1], a[2], a[3], lower.tail = FALSE))
}
# qtukey is a secant search inside R (eps 1e-4 on the quantile); the 0.90 case is the one TukeyHSD uses
# for conf.level = 0.9 in anova.R
for (a in list(c(0.95, 3, 15), c(0.90, 3, 15), c(0.95, 4, 30))) {
  add(sprintf("qtukey(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), sprintf("qtukey(%s, %s, %s)", format(a[1]), format(a[2]), format(a[3])), "iterative", "qtukey", a, qtukey(a[1], a[2], a[3]))
}

# log gamma and log binomial coefficient
for (x in c(0.5, 10, 100.5)) add(sprintf("lgamma(%s)", format(x)), sprintf("lgamma(%s)", format(x)), "closed", "lgamma", x, lgamma(x))
for (a in list(c(20, 5), c(1000, 500))) add(sprintf("lchoose(%s, %s)", format(a[1]), format(a[2])), sprintf("lchoose(%s, %s)", format(a[1]), format(a[2])), "closed", "lchoose", a, lchoose(a[1], a[2]))

rs_emit("dist", character(0), cases,
  notes = "Distribution functions behind every Tier A method (a helper module, so no catalogue method is declared here). engine.md hard cases: pchisq(100, 1, lower.tail = FALSE) about 1.524e-23 must not come out as 0.")
