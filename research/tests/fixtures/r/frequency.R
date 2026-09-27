# Frequency [M1-DESIGN.md 7.17]: apparent prevalence and incidence risk with Wilson and exact
# intervals, the incidence rate with the exact Poisson interval, and true prevalence by Rogan-Gladen
# ((AP + Sp - 1)/(Se + Sp - 1); Rogan and Gladen 1978, Am J Epidemiol 107:71) with the apparent
# interval's bounds transformed and clipped to 0..1. Serosurvey: the DEFF-widened Wald bounds.
# packages:
source("_common.R")
source("_serosurvey.R")

rg <- function(ap, se, sp) if (se + sp <= 1) NA_real_ else (ap + sp - 1) / (se + sp - 1)
clip <- function(v) pmin(1, pmax(0, v))
wilson <- function(x, n, conf = 0.95) unname(suppressWarnings(prop.test(x, n, correct = FALSE, conf.level = conf))$conf.int[1:2])
exact <- function(x, n, conf = 0.95) unname(binom.test(x, n, conf.level = conf)$conf.int[1:2])

cases <- list()
pr <- function(id, call, x, n, what) {
  cases[[id]] <<- case(call, "closed", list(estimate = x / n, wilson = ci_of(wilson(x, n)), exact = ci_of(exact(x, n))), x = x, n = n, measure = what)
}
pr("prevalence.course107002", "17/179; prop.test(17, 179, correct = FALSE); binom.test(17, 179)", 17, 179, "freq.proportion")
pr("periodPrevalence.course107003", "10/20 with Wilson and exact", 10, 20, "freq.proportion")
pr("pointPrevalence.course107003", "7/18 with Wilson and exact", 7, 18, "freq.proportion")
pr("incidenceRisk.course107004", "20/(200 - 5) with Wilson and exact", 20, 195, "freq.incidenceRisk")

for (ct in list(c(7, 1089), c(12, 3650))) {
  p <- poisson.test(ct[1], ct[2])
  cases[[sprintf("incidenceRate.%s.%s", format(ct[1]), format(ct[2]))]] <- case(sprintf("poisson.test(%s, %s)", format(ct[1]), format(ct[2])), "closed",
    list(rate = unname(p$estimate), ci = ci_of(p$conf.int[1:2]), per1000 = unname(p$estimate) * 1000, ci1000 = ci_of(p$conf.int[1:2] * 1000)),
    cases = ct[1], time = ct[2])
}

cases[["truePrevalence.closedForm"]] <- case("(0.2 + 0.98 - 1)/(0.95 + 0.98 - 1)", "closed", list(tp = rg(0.2, 0.95, 0.98)), ap = 0.2, se = 0.95, sp = 0.98)
cases[["truePrevalence.undefined"]] <- case("Se + Sp <= 1: undefined", "closed", list(tp = rg(0.2, 0.5, 0.4)), ap = 0.2, se = 0.5, sp = 0.4)
w <- wilson(3, 200)
cases[["truePrevalence.clipped"]] <- case("3/200 with Se 0.9, Sp 0.97: the transformed lower bound falls below 0 and is clipped", "closed",
  list(tp = rg(3 / 200, 0.9, 0.97), tpClipped = clip(rg(3 / 200, 0.9, 0.97)), wilson = ci_of(w),
    transformed = ci_of(c(rg(w[1], 0.9, 0.97), rg(w[2], 0.9, 0.97))),
    clipped = ci_of(clip(c(rg(w[1], 0.9, 0.97), rg(w[2], 0.9, 0.97))))),
  x = 3, n = 200, se = 0.9, sp = 0.97)

# serosurvey: ICC by one-way ANOVA over farms, DEFF with the mean cluster size, Wald widened by sqrt(DEFF)
n <- sum(sero_n); x <- sum(sero_pos); k <- length(sero_n); p <- x / n
pf <- sero_pos / sero_n
msb <- sum(sero_n * (pf - p)^2) / (k - 1)
msw <- sum(sero_n * pf * (1 - pf)) / (n - k)
n0 <- (n - sum(sero_n^2) / n) / (k - 1)
icc <- (msb - msw) / (msb + (n0 - 1) * msw)
deff <- 1 + (n / k - 1) * icc
se <- sqrt(p * (1 - p) / n)
z <- qnorm(0.975)
wd <- p + c(-1, 1) * z * se * sqrt(deff)
cases[["truePrevalence.serosurvey"]] <- case("Rogan-Gladen on 146/728 with Se 0.95, Sp 0.98, bounds from the DEFF-widened Wald interval", "closed",
  list(ap = p, tp = rg(p, 0.95, 0.98), waldDeff = ci_of(wd), tpCi = ci_of(clip(rg(wd, 0.95, 0.98)))),
  x = x, n = n, se = 0.95, sp = 0.98, deff = deff)

rs_emit("frequency", c("freq.proportion", "freq.incidenceRisk", "freq.incidenceRate", "freq.truePrevalence"), cases,
  notes = "An undefined true prevalence (Se + Sp <= 1) is null. Per 1,000 values are the rate times 1,000.")
