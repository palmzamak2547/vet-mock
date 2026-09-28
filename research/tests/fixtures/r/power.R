# Power and sample size [M2-DESIGN.md 3.1.7]: power.anova.test and power.t.test (base R, noncentral F and t),
# pwr 1.3.0 pwr.r.test (atanh with the r/(2(n - 1)) bias term) and pwr.f2.test (noncentral F with
# lambda = f2 (u + v + 1)). Power at a given n is a noncentral distribution value (iterative tolerance);
# an n or v solved by uniroot has R's uniroot tolerance. The base-R formulas for the pwr cases are written out
# too and must agree with pwr to 1e-10 or the script stops.
# packages: pwr
source("_common.R")
rs_require("pwr")

cases <- list()
pa <- power.anova.test(groups = 3, between.var = 1, within.var = 3, power = 0.80)
cases[["anova.n"]] <- case("power.anova.test(groups = 3, between.var = 1, within.var = 3, power = 0.80)", "uniroot",
  list(n = pa$n, nCeiling = ceiling(pa$n)), groups = 3, betweenVar = 1, withinVar = 3, power = 0.8, sigLevel = 0.05, closedValues = arr("nCeiling"))
pa2 <- power.anova.test(groups = 4, n = 5, between.var = 1, within.var = 3)
cases[["anova.power"]] <- case("power.anova.test(groups = 4, n = 5, between.var = 1, within.var = 3)", "iterative",
  list(power = pa2$power), groups = 4, n = 5, betweenVar = 1, withinVar = 3, sigLevel = 0.05)
pa3 <- power.anova.test(groups = 5, n = 12, between.var = 0.4, within.var = 2.5)
cases[["anova.power.five"]] <- case("power.anova.test(groups = 5, n = 12, between.var = 0.4, within.var = 2.5)", "iterative",
  list(power = pa3$power), groups = 5, n = 12, betweenVar = 0.4, withinVar = 2.5, sigLevel = 0.05)

pt1 <- power.t.test(delta = 1, sd = 1, power = 0.9)
cases[["t.twoSample.n"]] <- case("power.t.test(delta = 1, sd = 1, power = 0.9)", "uniroot",
  list(n = pt1$n, nCeiling = ceiling(pt1$n)), type = "two.sample", delta = 1, sd = 1, power = 0.9, sigLevel = 0.05, closedValues = arr("nCeiling"))
pt2 <- power.t.test(n = 20, delta = 1, sd = 1)
cases[["t.twoSample.power"]] <- case("power.t.test(n = 20, delta = 1, sd = 1)", "iterative",
  list(power = pt2$power), type = "two.sample", n = 20, delta = 1, sd = 1, sigLevel = 0.05)
pt3 <- power.t.test(delta = 0.8, sd = 1, power = 0.8, type = "paired")
cases[["t.paired.n"]] <- case("power.t.test(delta = 0.8, sd = 1, power = 0.8, type = 'paired')", "uniroot",
  list(n = pt3$n, nCeiling = ceiling(pt3$n)), type = "paired", delta = 0.8, sd = 1, power = 0.8, sigLevel = 0.05, closedValues = arr("nCeiling"))
pt4 <- power.t.test(n = 15, delta = 0.8, sd = 1.2, type = "paired")
cases[["t.paired.power"]] <- case("power.t.test(n = 15, delta = 0.8, sd = 1.2, type = 'paired')", "iterative",
  list(power = pt4$power), type = "paired", n = 15, delta = 0.8, sd = 1.2, sigLevel = 0.05)

rpow <- function(n, r, a = 0.05) {
  tt <- qt(a / 2, n - 2, lower.tail = FALSE); rc <- sqrt(tt^2 / (tt^2 + n - 2))
  zr <- atanh(r) + r / (2 * (n - 1)); zrc <- atanh(rc)
  pnorm((zr - zrc) * sqrt(n - 3)) + pnorm((-zr - zrc) * sqrt(n - 3))
}
pr1 <- pwr::pwr.r.test(r = 0.3, power = 0.8)
pr2 <- pwr::pwr.r.test(n = 50, r = 0.3)
stopifnot(isTRUE(all.equal(pr2$power, rpow(50, 0.3), tolerance = 1e-12)))
cases[["correlation.n"]] <- case("pwr::pwr.r.test(r = 0.3, power = 0.8)", "uniroot", list(n = pr1$n, nCeiling = ceiling(pr1$n)),
  r = 0.3, power = 0.8, sigLevel = 0.05, closedValues = arr("nCeiling"))
cases[["correlation.power"]] <- case("pwr::pwr.r.test(n = 50, r = 0.3); base R formula agrees", "closed", list(power = pr2$power),
  r = 0.3, n = 50, sigLevel = 0.05)

fpow <- function(u, v, f2, a = 0.05) { lam <- f2 * (u + v + 1); pf(qf(a, u, v, lower.tail = FALSE), u, v, lam, lower.tail = FALSE) }
pf1 <- pwr::pwr.f2.test(u = 3, f2 = 0.15, power = 0.8)
pf2 <- pwr::pwr.f2.test(u = 3, v = 100, f2 = 0.15)
stopifnot(isTRUE(all.equal(pf2$power, fpow(3, 100, 0.15), tolerance = 1e-12)))
cases[["regression.v"]] <- case("pwr::pwr.f2.test(u = 3, f2 = 0.15, power = 0.8)", "uniroot",
  list(v = pf1$v, n = pf1$v + 3 + 1, nCeiling = ceiling(pf1$v + 3 + 1)), u = 3, f2 = 0.15, power = 0.8, sigLevel = 0.05, closedValues = arr("nCeiling"))
cases[["regression.power"]] <- case("pwr::pwr.f2.test(u = 3, v = 100, f2 = 0.15); base R formula agrees", "iterative",
  list(power = pf2$power), u = 3, v = 100, f2 = 0.15, sigLevel = 0.05)

rs_emit("power", c("power.anova", "power.tTest", "power.correlation", "power.regression"), cases, packages = "pwr",
  notes = "n and v are uniroot solutions (tol = .Machine$double.eps^0.25): compared at the uniroot tolerance; nCeiling is the n the screen reports (rounded up once at the end). Power at a given n uses the noncentral t (AS 243) or F (AS 226 with Frick's correction): iterative tolerance. pwr 1.3.0; the base-R formulas agree to 1e-12 (stopifnot).")
