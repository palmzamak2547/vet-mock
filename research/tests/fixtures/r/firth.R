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

rs_emit("firth", c("reg.logistic"), cases, packages = "logistf",
  datasets = list(sex2 = lapply(as.list(sex2[, c("case", "age", "oc", "vic", "vicl", "vis", "dia")]), function(v) arr(as.numeric(v))),
                  sep = list(y = arr(sep$y), x = arr(as.character(sep$x)))),
  notes = "Convergence tightened to 1e-12 (logistf.control, logistpl.control). sep is made-up (ข้อมูลสมมุติ / made-up data); ordinary logistic regression stops there with separation (M2), Firth's estimates are finite.")
