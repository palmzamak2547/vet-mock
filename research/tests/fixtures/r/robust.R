# Farm route 'robust' [M2-DESIGN.md 3.2.2]: cluster-robust covariance as sandwich::vcovCL(fit, cluster =
# ~farm, type = 'HC0') with its default cadjust (G / (G - 1)); also without cadjust and HC1, for the record.
# Data: the made-up serosurvey, 670 cows with a known age and vaccine answer, 49 farms:
# pos ~ age24 + vacNo + herd (age24 = age in months >= 24; vacNo = not vaccinated in the last 6 months;
# herd = herd size). The rows are _serosurvey_rows.R (derive-serosurvey-rows.mjs); the same rows are written
# into datasets.sero so the JavaScript test fits exactly this data.
# packages: sandwich
source("_common.R")
source("_serosurvey_rows.R")
rs_require("sandwich")

d <- sero_rows[!is.na(sero_rows$age) & !is.na(sero_rows$vacNo), ]
d$age24 <- as.numeric(d$age >= 24)
stopifnot(nrow(d) == 670, length(unique(d$farm)) == 49)
fl <- glm(pos ~ age24 + vacNo + herd, data = d, family = binomial())
cf <- summary(fl)$coefficients
hc0 <- sqrt(diag(sandwich::vcovCL(fl, cluster = ~farm, type = "HC0")))
hc0n <- sqrt(diag(sandwich::vcovCL(fl, cluster = ~farm, type = "HC0", cadjust = FALSE)))
hc1 <- sqrt(diag(sandwich::vcovCL(fl, cluster = ~farm, type = "HC1")))
zr <- coef(fl) / hc0
cases <- list()
cases[["logistic.serosurvey"]] <- case("sandwich::vcovCL(glm(pos ~ age24 + vacNo + herd, binomial), cluster = ~farm, type = 'HC0')", "iterative",
  list(terms = arr(rownames(cf)), B = arr(unname(cf[, 1])), modelSE = arr(unname(cf[, 2])), deviance = deviance(fl), n = nrow(d), clusters = length(unique(d$farm)),
    robustSE = arr(unname(hc0)), robustSENoAdjust = arr(unname(hc0n)), robustSEHC1 = arr(unname(hc1)),
    robustZ = arr(unname(zr)), robustP = arr(unname(2 * pnorm(-abs(zr)))),
    robustWaldLower = arr(unname(coef(fl) - qnorm(0.975) * hc0)), robustWaldUpper = arr(unname(coef(fl) + qnorm(0.975) * hc0)),
    oddsRatio = arr(unname(exp(coef(fl))[-1])), oddsRatioRobustLower = arr(unname(exp(coef(fl) - qnorm(0.975) * hc0)[-1])),
    oddsRatioRobustUpper = arr(unname(exp(coef(fl) + qnorm(0.975) * hc0)[-1]))),
  data = "sero", closedValues = arr(c("n", "clusters")))

rs_emit("robust", c("reg.logistic"), cases, packages = "sandwich",
  datasets = list(sero = list(farm = arr(d$farm), pos = arr(d$pos), age24 = arr(d$age24), vacNo = arr(d$vacNo), herd = arr(d$herd))),
  notes = "Made-up serosurvey (ข้อมูลสมมุติ / made-up data), five numbers per cow and no identifiers. sandwich 3.1.1 vcovCL: HC0 with the default cadjust G/(G - 1) is the route's pin; the other two columns are for the record. Intervals and tests are Wald only (the route has no likelihood).")
