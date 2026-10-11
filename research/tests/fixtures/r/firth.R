# Firth's penalised logistic regression [M3-DESIGN.md 3.2.1]: logistf 1.26.1 with tightened convergence (1e-12) so
# the pin reflects the estimator, not a stopping rule. Intervals by profile penalised likelihood (logistf default),
# p-values by penalised likelihood ratio tests; the Wald variants with pl = FALSE. Data: sex2 (logistf; Heinze and
# Schemper 2002, a urinary tract infection study) and sep (M2's made-up separation data), where ordinary maximum
# likelihood has no finite estimate.
# packages: logistf
source("_common.R")
source("_data_m2.R")
rs_require("logistf")

ctl <- logistf.control(maxit = 200, maxstep = 5, lconv = 1e-12, gconv = 1e-12, xconv = 1e-12)
plc <- logistpl.control(maxit = 200, xconv = 1e-12, lconv = 1e-12)
fit <- function(formula, data, pl = TRUE) logistf(formula, data = data, pl = pl, control = ctl, plcontrol = plc)
pack <- function(f, fw) list(coef = arr(unname(coef(f))), names = arr(names(coef(f))), se = arr(unname(sqrt(diag(f$var)))),
  lower = arr(unname(f$ci.lower)), upper = arr(unname(f$ci.upper)), p = arr(unname(f$prob)),
  loglik = arr(unname(f$loglik)), waldLower = arr(unname(fw$ci.lower)), waldUpper = arr(unname(fw$ci.upper)), waldP = arr(unname(fw$prob)))
data(sex2)
fs <- fit(case ~ age + oc + vic + vicl + vis + dia, sex2); fsw <- fit(case ~ age + oc + vic + vicl + vis + dia, sex2, FALSE)
sp <- sep; sp$x <- factor(sp$x, levels = c("a", "b", "c"))
fp <- fit(y ~ x, sp); fpw <- fit(y ~ x, sp, FALSE)
dp <- drop1(fp)
cases <- list()
cases[["sex2"]] <- case("logistf(case ~ age + oc + vic + vicl + vis + dia, sex2), profile and Wald", "iterative", pack(fs, fsw), data = "sex2")
cases[["separation"]] <- case("logistf(y ~ x, sep); drop1 (penalised likelihood ratio test of the term)", "iterative",
  c(pack(fp, fpw), list(termChisq = unname(dp[1, "ChiSq"]), termDf = unname(dp[1, "df"]), termP = unname(dp[1, "P-value"]))), data = "sep")

# Three made-up six-row sets with a continuous separator (ข้อมูลสมมุติ / made-up data), where the fitter before 0.2.0
# stopped short of the maximum (fix-stats finding 6): `tiny` (y on x alone), `pair` and `pairTest` (y on x and z).
# logistpl's profile limits are taken as printed, except pair's upper limit of the intercept: there logistpl stops
# at 7.907 on a lower local maximum of the restricted fit, where the profile itself (the maximum over the other
# coefficients) is still 0.31 above the cut-off. That limit is computed here from the definition instead: the
# restricted l* maximised by optim from a grid of starts, its crossing found by uniroot.
plc6 <- logistpl.control(maxit = 1000, xconv = 1e-12, lconv = 1e-12)
fit6 <- function(formula, data) logistf(formula, data = data, control = ctl, plcontrol = plc6)
pack6 <- function(f) list(coef = arr(unname(coef(f))), names = arr(names(coef(f))), lower = arr(unname(f$ci.lower)),
  upper = arr(unname(f$ci.upper)), p = arr(unname(f$prob)), loglik = arr(unname(f$loglik)), iter = unname(f$iter[1]))
six <- list(
  tiny = data.frame(x = c(1, 2, 3, 4, 2.5, 3.5), y = c(0, 0, 1, 1, 0, 1)),
  pair = data.frame(x = c(0.4, 3.4, 1.5, 6.6, 3.8, 3), z = c(3.2, 1.3, 3.5, 2.2, 0.8, 1.8), y = c(0, 1, 0, 1, 1, 0)),
  pairTest = data.frame(x = c(1.8, 2.5, 3.4, 0.5, 1.4, 6.6), z = c(3.3, 0.9, 2.2, 1.1, 0.7, 2.4), y = c(0, 1, 1, 0, 0, 1)))
ft <- fit6(y ~ x, six$tiny)
fq <- fit6(y ~ x + z, six$pair)
fr <- fit6(y ~ x + z, six$pairTest)
profileRoot <- function(d, j, lo, hi, cut) {
  X <- cbind(1, d$x, d$z)
  pll <- function(b) { eta <- drop(X %*% b); p <- plogis(eta); w <- p * (1 - p)
    sum(ifelse(d$y == 1, plogis(eta, log.p = TRUE), plogis(-eta, log.p = TRUE))) + 0.5 * as.numeric(determinant(t(X) %*% (w * X))$modulus) }
  starts <- as.matrix(expand.grid(seq(-4, 4, 2), seq(-12, 4, 2)))
  prof <- function(b) max(apply(starts, 1, function(st) {
    o <- try(optim(st, function(v) { bb <- numeric(3); bb[j] <- b; bb[-j] <- v; -pll(bb) }, method = "BFGS", control = list(reltol = 1e-15, maxit = 10000)), silent = TRUE)
    if (inherits(o, "try-error") || !is.finite(o$value)) -Inf else -o$value })) - cut
  uniroot(prof, c(lo, hi), tol = 1e-12)$root
}
pairPack <- pack6(fq)
pairPack$logistplUpper <- pairPack$upper
pairPack$upper[[1]][1] <- profileRoot(six$pair, 1, 8.5, 11, fq$loglik[1] - qchisq(0.95, 1) / 2)
cases[["tiny"]] <- case("logistf(y ~ x, tiny), profile limits and penalised likelihood ratio p", "iterative", pack6(ft), data = "tiny")
cases[["pair"]] <- case("logistf(y ~ x + z, pair); upper limit of the intercept by optim + uniroot on the profile (logistplUpper keeps logistpl's)", "iterative", pairPack, data = "pair")
cases[["pairTest"]] <- case("logistf(y ~ x + z, pairTest), profile limits and penalised likelihood ratio p", "iterative", pack6(fr), data = "pairTest")

rs_emit("firth", c("reg.logistic"), cases, packages = "logistf",
  datasets = list(sex2 = lapply(as.list(sex2[, c("case", "age", "oc", "vic", "vicl", "vis", "dia")]), function(v) arr(as.numeric(v))),
                  sep = list(y = arr(sep$y), x = arr(as.character(sep$x))),
                  tiny = lapply(as.list(six$tiny), arr), pair = lapply(as.list(six$pair), arr), pairTest = lapply(as.list(six$pairTest), arr)),
  notes = "Convergence tightened to 1e-12 (logistf.control, logistpl.control). sep is made-up (ข้อมูลสมมุติ / made-up data); ordinary logistic regression stops there with separation (M2), Firth's estimates are finite. tiny, pair and pairTest are made-up six-row sets with a continuous separator (logistpl.control maxit 1000); pair's upper limit of the intercept is the profile's own crossing (optim from a grid of starts, uniroot), where logistpl stops at a lower local maximum (logistplUpper).")
