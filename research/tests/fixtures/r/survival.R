# Kaplan-Meier and the log-rank test [M2-DESIGN.md 3.2.3]: survival 3.8-6 survfit (conf.type 'log', the
# default; 'log-log'; 'plain'), the median with R's interval rule (summary(fit)$table), and survdiff (rho = 0).
# Data: aml (survival package; Miller 1981), literal here and checked against survival::aml (stopifnot).
# Product-limit estimates, Greenwood SE and the bounds are closed forms. Where the survival reaches 0 R
# returns NaN for the SE and NA or NaN for the bounds; the design shows them as undefined, so they are written
# as null here.
# packages: survival
source("_common.R")
source("_data_m2.R")
rs_require("survival")

stopifnot(isTRUE(all.equal(aml_lit$time, survival::aml$time)), isTRUE(all.equal(aml_lit$status, survival::aml$status)),
  isTRUE(all.equal(as.character(aml_lit$x), as.character(survival::aml$x))))
undef <- function(v) { v <- as.numeric(v); v[is.nan(v)] <- NA; v }

km <- function(fit, label, conf) {
  s <- summary(fit)
  st <- if (is.null(s$strata)) rep("all", length(s$time)) else as.character(s$strata)
  tab <- summary(fit)$table
  if (is.null(dim(tab))) tab <- t(as.matrix(tab))
  case(label, "closed",
    list(stratum = arr(sub("^x=", "", st)), time = arr(s$time), nRisk = arr(s$n.risk), nEvent = arr(s$n.event), nCensor = arr(s$n.censor),
      surv = arr(s$surv), se = arr(undef(s$std.err)), lower = arr(undef(s$lower)), upper = arr(undef(s$upper)),
      medianStrata = arr(sub("^x=", "", rownames(tab) %||% "all")), median = arr(undef(tab[, "median"])),
      medianLower = arr(undef(tab[, "0.95LCL"])), medianUpper = arr(undef(tab[, "0.95UCL"]))),
    data = "aml", confType = conf, confLevel = 0.95)
}
`%||%` <- function(a, b) if (is.null(a)) b else a
cases <- list()
for (conf in c("log", "log-log", "plain")) {
  f <- survfit(Surv(time, status) ~ x, data = aml_lit, conf.type = conf)
  cases[[paste0("km.byGroup.", conf)]] <- km(f, sprintf("summary(survfit(Surv(time, status) ~ x, data = aml, conf.type = '%s'))", conf), conf)
}
f0 <- survfit(Surv(time, status) ~ 1, data = aml_lit)
cases[["km.all.log"]] <- km(f0, "summary(survfit(Surv(time, status) ~ 1, data = aml))", "log")

sd <- survdiff(Surv(time, status) ~ x, data = aml_lit)
cases[["logrank"]] <- case("survdiff(Surv(time, status) ~ x, data = aml)", "closed",
  list(statistic = sd$chisq, df = length(sd$n) - 1, p = pchisq(sd$chisq, length(sd$n) - 1, lower.tail = FALSE),
    observed = arr(unname(sd$obs)), expected = arr(unname(sd$exp)), variance = unname(sd$var[1, 1])), data = "aml")

rs_emit("survival", c("surv.kaplanMeier"), cases, packages = "survival",
  datasets = list(aml = list(time = arr(aml_lit$time), status = arr(aml_lit$status), x = arr(as.character(aml_lit$x)))),
  notes = "survival 3.8.6. summary() lists event times only. A median bound that does not exist is null (NA in R): the screen prints it as 'no upper limit'. SE and bounds where the survival is 0 are null (R: NaN or NA).")
