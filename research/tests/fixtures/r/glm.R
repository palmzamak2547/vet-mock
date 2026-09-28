# Logistic and Poisson regression [M2-DESIGN.md 3.2.1]: glm() by IRLS with glm.control() (epsilon 1e-8, 25
# iterations), treatment contrasts, profile-likelihood intervals from confint() (stats 4.6.0) and Wald
# intervals from confint.default(), likelihood-ratio tests from drop1(test = 'LRT'). Estimates, SE, deviance and
# profile bounds are iterative fits: 1e-6 relative. A coefficient that is mathematically zero (R prints about
# 1e-15) is compared with an absolute 1e-10 by the parity test.
# Data: infert (datasets; Trichopoulos et al. 1976), sep (made-up, complete separation), Dobson (1990) p. 93
# (?glm), doctors (Doll and Hill; Breslow and Day 1987; checked against boot::breslow in sources.R).
# packages:
source("_common.R")
source("_data_m2.R")

coefs <- function(fit, ci = TRUE) {
  cf <- summary(fit)$coefficients
  out <- list(terms = arr(rownames(cf)), B = arr(unname(cf[, 1])), SE = arr(unname(cf[, 2])), z = arr(unname(cf[, 3])), p = arr(unname(cf[, 4])),
    deviance = deviance(fit), nullDeviance = fit$null.deviance, dfResidual = fit$df.residual, dfNull = fit$df.null, aic = AIC(fit), iter = fit$iter)
  if (ci) {
    pr <- suppressMessages(confint(fit)); wd <- confint.default(fit)
    out$profileLower <- arr(unname(pr[, 1])); out$profileUpper <- arr(unname(pr[, 2]))
    out$waldLower <- arr(unname(wd[, 1])); out$waldUpper <- arr(unname(wd[, 2]))
  }
  out
}

cases <- list()
fit <- glm(case ~ education + spontaneous + induced, data = infert, family = binomial())
v <- coefs(fit)
d1 <- drop1(fit, test = "LRT")
v$lrtTerms <- arr(rownames(d1)[-1]); v$lrtStatistic <- arr(d1[["LRT"]][-1]); v$lrtDf <- arr(d1[["Df"]][-1]); v$lrtP <- arr(d1[["Pr(>Chi)"]][-1])
v$events <- sum(infert$case); v$oddsRatio <- arr(unname(exp(coef(fit))[-1]))
v$oddsRatioProfileLower <- arr(exp(v$profileLower[[1]][-1])); v$oddsRatioProfileUpper <- arr(exp(v$profileUpper[[1]][-1]))
cases[["logistic.infert"]] <- case("glm(case ~ education + spontaneous + induced, data = infert, family = binomial()); confint; confint.default; drop1(test = 'LRT')", "iterative",
  v, data = "infert", reference = list(education = "0-5yrs"), closedValues = arr(c("iter", "events", "dfResidual", "dfNull")))

fs <- withCallingHandlers(glm(y ~ x, data = sep, family = binomial()), warning = function(w) invokeRestart("muffleWarning"))
warned <- tryCatch({ glm(y ~ x, data = sep, family = binomial()); FALSE }, warning = function(w) grepl("fitted probabilities numerically 0 or 1", conditionMessage(w)))
cases[["logistic.separation"]] <- case("glm(y ~ x, data = sep, family = binomial())", "evidence",
  list(separation = TRUE, rWarned = warned, iter = fs$iter, converged = fs$converged, fittedA = unname(fitted(fs)[1]), fittedB = unname(fitted(fs)[6]),
    B = arr(unname(coef(fs))), SE = arr(unname(summary(fs)$coefficients[, 2]))),
  data = "sep", separatedLevels = arr("b"),
  note = "R's numbers are evidence of separation, not a pin: the engine must report the separation finding (every coefficient null), not these estimates.")

counts <- c(18, 17, 15, 20, 10, 20, 25, 13, 12); outcome <- gl(3, 1, 9); treatment <- gl(3, 3)
fp <- glm(counts ~ outcome + treatment, family = poisson())
cases[["poisson.dobson"]] <- case("glm(counts ~ outcome + treatment, family = poisson()) (Dobson 1990, p. 93, ?glm)", "iterative",
  c(coefs(fp), list(pearsonX2 = sum(residuals(fp, type = "pearson")^2))), data = "dobson",
  counts = arr(counts), outcome = arr(as.integer(outcome)), treatment = arr(as.integer(treatment)), closedValues = arr(c("iter", "dfResidual", "dfNull")),
  absoluteZero = arr(c("B.4", "B.5", "z.4", "z.5")))

fb <- glm(deaths ~ smoke + age + offset(log(py)), family = poisson(), data = doctors)
vb <- coefs(fb)
vb$pearsonX2 <- sum(residuals(fb, type = "pearson")^2); vb$dispersion <- vb$pearsonX2 / fb$df.residual
vb$irrSmoke <- unname(exp(coef(fb)["smokeyes"]))
vb$irrSmokeProfile <- arr(exp(c(vb$profileLower[[1]][2], vb$profileUpper[[1]][2])))
vb$irrSmokeWald <- arr(exp(c(vb$waldLower[[1]][2], vb$waldUpper[[1]][2])))
d2 <- drop1(fb, test = "LRT")
vb$lrtTerms <- arr(rownames(d2)[-1]); vb$lrtStatistic <- arr(d2[["LRT"]][-1]); vb$lrtDf <- arr(d2[["Df"]][-1]); vb$lrtP <- arr(d2[["Pr(>Chi)"]][-1])
cases[["poisson.doctors"]] <- case("glm(deaths ~ smoke + age + offset(log(py)), family = poisson(), data = doctors)", "iterative",
  vb, data = "doctors", reference = list(smoke = "no", age = "35-44"), closedValues = arr(c("iter", "dfResidual", "dfNull")))

rs_emit("glm", c("reg.logistic", "reg.poisson"), cases,
  datasets = list(
    infert = list(case = arr(infert$case), education = arr(as.character(infert$education)), educationLevels = arr(levels(infert$education)),
      spontaneous = arr(infert$spontaneous), induced = arr(infert$induced)),
    sep = list(y = arr(sep$y), x = arr(as.character(sep$x))),
    doctors = list(deaths = arr(doctors$deaths), py = arr(doctors$py), smoke = arr(as.character(doctors$smoke)), age = arr(as.character(doctors$age)))),
  notes = paste("infert: the 248 rows R used are in datasets.infert. doctors: counts typed from memory by the architect; sources.R checks them against boot::breslow (Breslow and Day 1987).",
    "Profile intervals are R 4.6.0 confint() on a glm (stats:::profile.glm and its spline interpolation). absoluteZero lists values that are zero in exact arithmetic (Dobson's treatment effects).",
    "tol 'evidence' marks R output kept for the record only (the separation case)."))
