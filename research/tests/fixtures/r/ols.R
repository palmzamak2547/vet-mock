# Ordinary least squares [M1-DESIGN.md 7.11] by lm (QR): simple regression on `corr`, a one-way
# model on `three` with treatment contrasts against level A, and a slope on a large-scale x (review
# round 3). NIST StRD certified values are the other pin (research/tests/fixtures/published/nist/).
# packages:
source("_common.R")
source("_data.R")

cases <- list()
lmcase <- function(id, call, fit, extra, withCi = FALSE) {
  s <- summary(fit)
  co <- coef(s)
  f <- s$fstatistic
  vals <- list(terms = arr(rownames(co)), coef = arr(unname(co[, 1])), se = arr(unname(co[, 2])), t = arr(unname(co[, 3])), p = arr(unname(co[, 4])),
    df = fit$df.residual, sigma = s$sigma, r2 = s$r.squared, adjR2 = s$adj.r.squared,
    F = unname(f[1]), pF = unname(pf(f[1], f[2], f[3], lower.tail = FALSE)))
  if (withCi) { ci <- confint(fit, level = 0.95); vals$lower <- arr(unname(ci[, 1])); vals$upper <- arr(unname(ci[, 2])) }
  cases[[id]] <<- do.call(case, c(list(call, "closed", vals), extra))
}
lmcase("simple.corr", "summary(lm(y ~ x, data = corr))", lm(y ~ x, data = as.data.frame(corr)), list(data = "corr"))
lmcase("oneway.three", "summary(lm(y ~ g, data = three_long))  (treatment contrasts, reference A)", lm(y ~ g, data = three_long), list(data = "three", reference = "A"))
lmcase("noIntercept.corr", "summary(lm(y ~ x - 1, data = corr))", lm(y ~ x - 1, data = as.data.frame(corr)), list(data = "corr", intercept = FALSE))

# Review round 3: a slope that is small only because x is large. x runs from 1e10 to 1e12 (copies per
# mL, 1e10 + 3.4e10 i for i = 0..29) and y sits near 300,000 g, so the slope per copy is about 1e-7 with
# t = 232: a real estimate that the engine's old rounding rule printed as 0. The y values are the review's
# fixed pseudo-random draw, written literally; the case carries x and y as R read them (sprintf %.17g),
# so the engine fits the same doubles. confint() gives the interval the coefficient table prints.
x_big <- 1e10 + (0:29) * 3.4e10
y_big <- c(
  301194.112110883, 303998.52957725525, 307884.58399772644, 312174.1837978363, 314944.37084198,
  318058.40587615967, 322139.7871017456, 325630.6531906128, 327349.11937713623, 332594.74626779556,
  334419.26765441895, 337786.7092728615, 342785.5202436447, 344318.0682182312, 348368.12893152237,
  351060.5070590973, 354543.986992538, 359147.36850857735, 363048.0269908905, 366219.1575527191,
  369482.44738578796, 371527.42590904236, 376036.237347126, 379191.9171333313, 382007.79733657837,
  386784.6379876137, 388537.8262042999, 393405.46523332596, 395492.688369751, 398654.4109940529)
lmcase("largeScaleX", "summary(lm(y ~ x)) and confint(), x from 1e10 to 1e12, y near 300000 (review round 3)",
  lm(y_big ~ x_big), list(x = arr(x_big), y = arr(y_big)), withCi = TRUE)

rs_emit("ols", c("reg.ols"), cases,
  notes = "R's R^2 without an intercept is computed against 0 (uncentred), as summary.lm does.")
