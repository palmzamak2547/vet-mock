# Sample size [M1-DESIGN.md 7.22]: the unrounded values of the formulas the course writes out, with
# z = qnorm(0.975) and z(0.8) = qnorm(0.8) exact, and the package answers beside them:
#   one proportion n = z^2 p(1 - p)/d^2; one mean n = z^2 sd^2/d^2;
#   finite population: course form n0/(1 + (n0 - 1)/N), epiR form n0/(1 + n0/N);
#   case-control: p1 = OR p0/(1 + p0 (OR - 1)); course pooled (za + zb)^2 2 pbar qbar/(p1 - p0)^2;
#   Fleiss (za sqrt(2 pbar qbar) + zb sqrt(p1 q1 + p0 q0))^2/(p1 - p0)^2, and with continuity
#   n/4 (1 + sqrt(1 + 4/(n |p1 - p0|)))^2 (Fleiss, Statistical Methods for Rates and Proportions);
#   paired, normal approximation ((za + zb)/d)^2 and t-based pwr::pwr.t.test(type = "paired");
#   two means per group (za + zb)^2 2 sd^2/delta^2 and power.t.test; two proportions power.prop.test.
# packages: epiR, pwr
source("_common.R")
rs_require(c("epiR", "pwr"))

za <- qnorm(0.975); zb <- qnorm(0.8)
cases <- list()
cases[["proportion.p05.d005"]] <- case("qnorm(0.975)^2 * 0.5 * 0.5 / 0.05^2", "closed",
  list(n = za^2 * 0.25 / 0.05^2, nCourseZ = 1.96^2 * 0.25 / 0.05^2), p = 0.5, d = 0.05, zExact = za)
cases[["mean.course107036"]] <- case("z^2 * 0.5^2 / 0.1^2 with z exact and z = 1.96", "closed",
  list(n = za^2 * 0.25 / 0.01, nCourseZ = 1.96^2 * 0.25 / 0.01), sd = 0.5, d = 0.1)
n0 <- 544; N <- 2000
cases[["fpc.course107038"]] <- case("544/(1 + (544 - 1)/2000) and 544/(1 + 544/2000)", "closed",
  list(courseForm = n0 / (1 + (n0 - 1) / N), epiRForm = n0 / (1 + n0 / N)), n0 = n0, N = N)
cases[["deff.course107039"]] <- case("428 * 1.70", "closed", list(n = 428 * 1.70), n = 428, deff = 1.7)
cases[["nonResponse.course107040"]] <- case("200/(1 - 0.4)", "closed", list(n = 200 / 0.6), n = 200, nonResponse = 0.4)

OR <- 3; p0 <- 0.25
p1 <- OR * p0 / (1 + p0 * (OR - 1)); pbar <- (p1 + p0) / 2; qbar <- 1 - pbar
pooled <- (za + zb)^2 * 2 * pbar * qbar / (p1 - p0)^2
fleiss <- (za * sqrt(2 * pbar * qbar) + zb * sqrt(p1 * (1 - p1) + p0 * (1 - p0)))^2 / (p1 - p0)^2
fleissCC <- fleiss / 4 * (1 + sqrt(1 + 4 / (fleiss * abs(p1 - p0))))^2
ep <- epi.sscc(OR = OR, p1 = NA, p0 = p0, n = NA, power = 0.8, r = 1, sided.test = 2, conf.level = 0.95, method = "unmatched", nfractional = TRUE, fleiss = FALSE)
cases[["caseControl.course107029"]] <- case("case-control OR 3, p0 0.25, 1:1, alpha 0.05 two-sided, power 0.8; epiR::epi.sscc(nfractional = TRUE)", "closed",
  list(p1 = p1, coursePooled = pooled, fleiss = fleiss, fleissContinuity = fleissCC, epiRPerGroup = ep$n.case, epiRTotal = ep$n.total),
  OR = OR, p0 = p0, ratio = 1, power = 0.8)

pw <- pwr::pwr.t.test(d = 0.8, power = 0.8, sig.level = 0.05, type = "paired")
cases[["paired.course107035"]] <- case("((qnorm(0.975) + qnorm(0.8))/0.8)^2; pwr::pwr.t.test(d = 0.8, power = 0.8, type = 'paired')", "closed",
  list(normal = ((za + zb) / 0.8)^2, tBased = pw$n), d = 0.8, power = 0.8, tolByValue = list(tBased = "iterative"))

pt2 <- power.t.test(delta = 5, sd = 10, power = 0.8, sig.level = 0.05)
cases[["twoMeans"]] <- case("(za + zb)^2 * 2 * 10^2 / 5^2 per group; power.t.test(delta = 5, sd = 10, power = 0.8)", "closed",
  list(normalPerGroup = (za + zb)^2 * 2 * 100 / 25, tBasedPerGroup = pt2$n), delta = 5, sd = 10, power = 0.8, tolByValue = list(tBasedPerGroup = "iterative"))

pp <- power.prop.test(p1 = 0.3, p2 = 0.15, power = 0.8, sig.level = 0.05)
pb2 <- (0.3 + 0.15) / 2
cases[["twoProportions"]] <- case("p1 0.3, p2 0.15: Fleiss pooled formula; power.prop.test(p1 = 0.3, p2 = 0.15, power = 0.8)", "closed",
  list(fleissPerGroup = (za * sqrt(2 * pb2 * (1 - pb2)) + zb * sqrt(0.3 * 0.7 + 0.15 * 0.85))^2 / 0.15^2,
    pooledPerGroup = (za + zb)^2 * 2 * pb2 * (1 - pb2) / 0.15^2, powerPropTestPerGroup = pp$n),
  p1 = 0.3, p2 = 0.15, power = 0.8, tolByValue = list(powerPropTestPerGroup = "iterative"))

rs_emit("samplesize", c("ss.proportion", "ss.mean", "ss.caseControl", "ss.paired", "ss.twoMeans", "ss.twoProportions"), cases, packages = c("epiR", "pwr"),
  notes = "Unrounded values; the course rounds up once at the end of each shown step. pwr, power.t.test and power.prop.test solve for n with uniroot, so tolByValue marks them iterative.")
